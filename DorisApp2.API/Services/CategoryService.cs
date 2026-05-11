using DorisApp2.API.Data;
using DorisApp2.API.Dtos;
using DorisApp2.API.Models;
using DorisApp2.API.Utilities;
using Microsoft.EntityFrameworkCore;

namespace DorisApp2.API.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryResponse>> GetCategoriesAsync();
        Task<CategoryResponse?> GetCategoryAsync(int id);
        Task<ServiceResult<CategoryResponse>> CreateCategoryAsync(CategoryRequest request);
        Task<ServiceResult<CategoryResponse>> UpdateCategoryAsync(int id, CategoryRequest request);
        Task<ServiceResult> DeleteCategoryAsync(int id);
        Task<ServiceResult<SubCategoryResponse>> CreateSubCategoryAsync(int categoryId, SubCategoryRequest request);
        Task<ServiceResult<SubCategoryResponse>> UpdateSubCategoryAsync(int categoryId, int subCategoryId, SubCategoryRequest request);
        Task<ServiceResult> DeleteSubCategoryAsync(int categoryId, int subCategoryId);
    }

    public class CategoryService(AppDbContext context) : ICategoryService
    {
        public async Task<List<CategoryResponse>> GetCategoriesAsync()
        {
            var categories = await context.Categories
                .AsNoTracking()
                .Include(category => category.SubCategories)
                .ToListAsync();

            return [.. categories.Select(ToCategoryResponse)];
        }

        public async Task<CategoryResponse?> GetCategoryAsync(int id)
        {
            var category = await context.Categories
                .AsNoTracking()
                .Include(category => category.SubCategories)
                .FirstOrDefaultAsync(category => category.Id == id);

            return category is null ? null : ToCategoryResponse(category);
        }

        public async Task<ServiceResult<CategoryResponse>> CreateCategoryAsync(CategoryRequest request)
        {
            var normalizedName = TextNormalizer.Required(request.Name);
            var normalizedSlug = TextNormalizer.Slug(request.Slug);

            if (normalizedName is null || normalizedSlug is null)
            {
                return ServiceResult<CategoryResponse>.BadRequest("Category name and slug are required.");
            }

            var slugExists = await context.Categories.AnyAsync(category => category.Slug == normalizedSlug);

            if (slugExists)
            {
                return ServiceResult<CategoryResponse>.Conflict("A category with this slug already exists.");
            }

            var category = new Category
            {
                Name = normalizedName,
                Slug = normalizedSlug,
                Description = TextNormalizer.Optional(request.Description),
                IconName = TextNormalizer.Optional(request.IconName),
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            context.Categories.Add(category);
            await context.SaveChangesAsync();

            return ServiceResult<CategoryResponse>.Ok(ToCategoryResponse(category));
        }

        public async Task<ServiceResult<CategoryResponse>> UpdateCategoryAsync(int id, CategoryRequest request)
        {
            var category = await context.Categories
                .Include(category => category.SubCategories)
                .FirstOrDefaultAsync(category => category.Id == id);

            if (category is null)
            {
                return ServiceResult<CategoryResponse>.NotFound("Category was not found.");
            }

            var normalizedName = TextNormalizer.Required(request.Name);
            var normalizedSlug = TextNormalizer.Slug(request.Slug);

            if (normalizedName is null || normalizedSlug is null)
            {
                return ServiceResult<CategoryResponse>.BadRequest("Category name and slug are required.");
            }

            var slugExists = await context.Categories
                .AnyAsync(existing => existing.Id != id && existing.Slug == normalizedSlug);

            if (slugExists)
            {
                return ServiceResult<CategoryResponse>.Conflict("A category with this slug already exists.");
            }

            category.Name = normalizedName;
            category.Slug = normalizedSlug;
            category.Description = TextNormalizer.Optional(request.Description);
            category.IconName = TextNormalizer.Optional(request.IconName);
            category.IsActive = request.IsActive;
            category.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();

            return ServiceResult<CategoryResponse>.Ok(ToCategoryResponse(category));
        }

        public async Task<ServiceResult> DeleteCategoryAsync(int id)
        {
            var category = await context.Categories
                .Include(category => category.SubCategories)
                .FirstOrDefaultAsync(category => category.Id == id);

            if (category is null)
            {
                return ServiceResult.NotFound("Category was not found.");
            }

            if (category.SubCategories.Count > 0)
            {
                return ServiceResult.Conflict("Delete subcategories before deleting this category.");
            }

            context.Categories.Remove(category);
            await context.SaveChangesAsync();

            return ServiceResult.Ok();
        }

        public async Task<ServiceResult<SubCategoryResponse>> CreateSubCategoryAsync(int categoryId, SubCategoryRequest request)
        {
            var categoryExists = await context.Categories.AnyAsync(category => category.Id == categoryId);

            if (!categoryExists)
            {
                return ServiceResult<SubCategoryResponse>.NotFound("Category was not found.");
            }

            var normalizedName = TextNormalizer.Required(request.Name);
            var normalizedSlug = TextNormalizer.Slug(request.Slug);

            if (normalizedName is null || normalizedSlug is null)
            {
                return ServiceResult<SubCategoryResponse>.BadRequest("Subcategory name and slug are required.");
            }

            var slugExists = await context.SubCategories
                .AnyAsync(subCategory => subCategory.CategoryId == categoryId && subCategory.Slug == normalizedSlug);

            if (slugExists)
            {
                return ServiceResult<SubCategoryResponse>.Conflict("A subcategory with this slug already exists in this category.");
            }

            var subCategory = new SubCategory
            {
                CategoryId = categoryId,
                Name = normalizedName,
                Slug = normalizedSlug,
                Description = TextNormalizer.Optional(request.Description),
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            context.SubCategories.Add(subCategory);
            await context.SaveChangesAsync();

            return ServiceResult<SubCategoryResponse>.Ok(ToSubCategoryResponse(subCategory));
        }

        public async Task<ServiceResult<SubCategoryResponse>> UpdateSubCategoryAsync(
            int categoryId,
            int subCategoryId,
            SubCategoryRequest request)
        {
            var subCategory = await context.SubCategories
                .FirstOrDefaultAsync(subCategory =>
                    subCategory.Id == subCategoryId &&
                    subCategory.CategoryId == categoryId);

            if (subCategory is null)
            {
                return ServiceResult<SubCategoryResponse>.NotFound("Subcategory was not found.");
            }

            var normalizedName = TextNormalizer.Required(request.Name);
            var normalizedSlug = TextNormalizer.Slug(request.Slug);

            if (normalizedName is null || normalizedSlug is null)
            {
                return ServiceResult<SubCategoryResponse>.BadRequest("Subcategory name and slug are required.");
            }

            var slugExists = await context.SubCategories.AnyAsync(existing =>
                existing.Id != subCategoryId &&
                existing.CategoryId == categoryId &&
                existing.Slug == normalizedSlug);

            if (slugExists)
            {
                return ServiceResult<SubCategoryResponse>.Conflict("A subcategory with this slug already exists in this category.");
            }

            subCategory.Name = normalizedName;
            subCategory.Slug = normalizedSlug;
            subCategory.Description = TextNormalizer.Optional(request.Description);
            subCategory.IsActive = request.IsActive;
            subCategory.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();

            return ServiceResult<SubCategoryResponse>.Ok(ToSubCategoryResponse(subCategory));
        }

        public async Task<ServiceResult> DeleteSubCategoryAsync(int categoryId, int subCategoryId)
        {
            var subCategory = await context.SubCategories.FirstOrDefaultAsync(subCategory =>
                subCategory.Id == subCategoryId &&
                subCategory.CategoryId == categoryId);

            if (subCategory is null)
            {
                return ServiceResult.NotFound("Subcategory was not found.");
            }

            context.SubCategories.Remove(subCategory);
            await context.SaveChangesAsync();

            return ServiceResult.Ok();
        }

        private static CategoryResponse ToCategoryResponse(Category category)
        {
            return new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                IconName = category.IconName,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt,
                SubCategories = 
                [.. category.SubCategories.Select(ToSubCategoryResponse)]
            };
        }

        private static SubCategoryResponse ToSubCategoryResponse(SubCategory subCategory)
        {
            return new SubCategoryResponse
            {
                Id = subCategory.Id,
                CategoryId = subCategory.CategoryId,
                Name = subCategory.Name,
                Slug = subCategory.Slug,
                Description = subCategory.Description,
                IsActive = subCategory.IsActive,
                CreatedAt = subCategory.CreatedAt,
                UpdatedAt = subCategory.UpdatedAt
            };
        }

    }
}
