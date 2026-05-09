using DorisApp2.API.Data;
using DorisApp2.API.Dtos;
using DorisApp2.API.Models;
using DorisApp2.API.Utilities;
using Microsoft.EntityFrameworkCore;

namespace DorisApp2.API.Services
{
    public interface IProductService
    {
        Task<List<ProductResponse>> GetProductsAsync();
        Task<ProductResponse?> GetProductAsync(int id);
        Task<ServiceResult<ProductResponse>> CreateProductAsync(ProductRequest request);
        Task<ServiceResult<ProductResponse>> UpdateProductAsync(int id, ProductRequest request);
        Task<ServiceResult> DeleteProductAsync(int id);
    }

    public class ProductService(AppDbContext context) : IProductService
    {
        public async Task<List<ProductResponse>> GetProductsAsync()
        {
            var products = await context.Products
                .AsNoTracking()
                .OrderBy(product => product.Name)
                .ToListAsync();

            return [.. products.Select(ToProductResponse)];
        }

        public async Task<ProductResponse?> GetProductAsync(int id)
        {
            var product = await context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(product => product.Id == id);

            return product is null ? null : ToProductResponse(product);
        }

        public async Task<ServiceResult<ProductResponse>> CreateProductAsync(ProductRequest request)
        {
            var validationResult = await ValidateProductRequestAsync(request);

            if (!validationResult.Succeeded)
                return ToTypedResult(validationResult);

            var normalizedName = TextNormalizer.Required(request.Name)!;
            var normalizedSlug = TextNormalizer.Slug(request.Slug)!;

            var slugExists = await context.Products.AnyAsync(product => product.Slug == normalizedSlug);

            if (slugExists)
            {
                return ServiceResult<ProductResponse>.Conflict("A product with this slug already exists.");
            }

            var product = new Product
            {
                CategoryId = request.CategoryId,
                SubCategoryId = request.SubCategoryId,
                Name = normalizedName,
                Slug = normalizedSlug,
                Description = TextNormalizer.Optional(request.Description),
                Price = request.Price,
                ImageUrl = TextNormalizer.Optional(request.ImageUrl),
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            context.Products.Add(product);
            await context.SaveChangesAsync();

            return ServiceResult<ProductResponse>.Ok(ToProductResponse(product));
        }

        public async Task<ServiceResult<ProductResponse>> UpdateProductAsync(int id, ProductRequest request)
        {
            var product = await context.Products.FirstOrDefaultAsync(product => product.Id == id);

            if (product is null)
                return ServiceResult<ProductResponse>.NotFound("Product was not found.");

            var validationResult = await ValidateProductRequestAsync(request);

            if (!validationResult.Succeeded)
                return ToTypedResult(validationResult);

            var normalizedName = TextNormalizer.Required(request.Name)!;
            var normalizedSlug = TextNormalizer.Slug(request.Slug)!;

            var slugExists = await context.Products.AnyAsync(existing =>
                existing.Id != id &&
                existing.Slug == normalizedSlug);

            if (slugExists)
                return ServiceResult<ProductResponse>
                    .Conflict("A product with this slug already exists.");

            product.CategoryId = request.CategoryId;
            product.SubCategoryId = request.SubCategoryId;
            product.Name = normalizedName;
            product.Slug = normalizedSlug;
            product.Description = TextNormalizer.Optional(request.Description);
            product.Price = request.Price;
            product.ImageUrl = TextNormalizer.Optional(request.ImageUrl);
            product.IsActive = request.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();

            return ServiceResult<ProductResponse>.Ok(ToProductResponse(product));
        }

        public async Task<ServiceResult> DeleteProductAsync(int id)
        {
            var product = await context.Products.FirstOrDefaultAsync(product => product.Id == id);

            if (product is null)
                return ServiceResult.NotFound("Product was not found.");

            context.Products.Remove(product);
            await context.SaveChangesAsync();

            return ServiceResult.Ok();
        }

        private async Task<ServiceResult> ValidateProductRequestAsync(ProductRequest request)
        {
            var normalizedName = TextNormalizer.Required(request.Name);
            var normalizedSlug = TextNormalizer.Slug(request.Slug);

            if (normalizedName is null || normalizedSlug is null)
                return ServiceResult.BadRequest("Product name and slug are required.");

            if (request.Price < 0)
                return ServiceResult.BadRequest("Product price cannot be negative.");

            var categoryExists = await context.Categories.AnyAsync(category => category.Id == request.CategoryId);

            if (!categoryExists)
                return ServiceResult.NotFound("Category was not found.");

            if (request.SubCategoryId is null)
                return ServiceResult.Ok();

            var subCategoryBelongsToCategory = await context.SubCategories.AnyAsync(subCategory =>
                subCategory.Id == request.SubCategoryId &&
                subCategory.CategoryId == request.CategoryId);

            return subCategoryBelongsToCategory
                ? ServiceResult.Ok()
                : ServiceResult.BadRequest("Subcategory must belong to the selected category.");
        }

        private static ProductResponse ToProductResponse(Product product)
        {
            return new ProductResponse
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                SubCategoryId = product.SubCategoryId,
                Name = product.Name,
                Slug = product.Slug,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
        }

        private static ServiceResult<ProductResponse> ToTypedResult(ServiceResult result)
        {
            return result.Error switch
            {
                ServiceError.BadRequest => ServiceResult<ProductResponse>.BadRequest(result.Message ?? "Invalid product request."),
                ServiceError.NotFound => ServiceResult<ProductResponse>.NotFound(result.Message ?? "Product dependency was not found."),
                ServiceError.Conflict => ServiceResult<ProductResponse>.Conflict(result.Message ?? "Product request conflicts with existing data."),
                _ => ServiceResult<ProductResponse>.BadRequest(result.Message ?? "Unable to complete product request.")
            };
        }

    }
}
