using DorisApp2.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DorisApp2.API.Data
{
    public static class ProductSeeder
    {
        public static async Task SeedProductsAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var categories = await context.Categories
                .Include(category => category.SubCategories)
                .ToListAsync();
            var categoriesBySlug = categories.ToDictionary(
                category => category.Slug,
                StringComparer.OrdinalIgnoreCase);
            var existingProductSlugs = await context.Products
                .Select(product => product.Slug)
                .ToHashSetAsync(StringComparer.OrdinalIgnoreCase);
            var createdAt = DateTime.UtcNow;
            var hasChanges = false;

            foreach (var seedProduct in GetDefaultProducts())
            {
                if (existingProductSlugs.Contains(seedProduct.Slug))
                {
                    continue;
                }

                if (!categoriesBySlug.TryGetValue(seedProduct.CategorySlug, out var category))
                {
                    continue;
                }

                var subCategory = seedProduct.SubCategorySlug is null
                    ? null
                    : category.SubCategories.FirstOrDefault(subCategory =>
                        string.Equals(
                            subCategory.Slug,
                            seedProduct.SubCategorySlug,
                            StringComparison.OrdinalIgnoreCase));

                context.Products.Add(new Product
                {
                    CategoryId = category.Id,
                    SubCategoryId = subCategory?.Id,
                    Name = seedProduct.Name,
                    Slug = seedProduct.Slug,
                    Description = seedProduct.Description,
                    Price = seedProduct.Price,
                    ImageUrl = seedProduct.ImageUrl,
                    IsActive = seedProduct.IsActive,
                    CreatedAt = createdAt
                });
                hasChanges = true;
            }

            if (hasChanges)
            {
                await context.SaveChangesAsync();
            }
        }

        private static List<SeedProduct> GetDefaultProducts()
        {
            return
            [
                new(
                    Name: "Organic Romaine Lettuce",
                    Slug: "organic-romaine-lettuce",
                    Description: "Crisp organic romaine heads for salads, wraps, and meal prep.",
                    Price: 129.00m,
                    CategorySlug: "fresh-produce",
                    SubCategorySlug: "organic-vegetables",
                    ImageUrl: "https://images.unsplash.com/photo-1622205313162-be1d5712a43d?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Cherry Tomatoes",
                    Slug: "cherry-tomatoes",
                    Description: "Sweet bite-size tomatoes packed for snacking and fresh cooking.",
                    Price: 155.00m,
                    CategorySlug: "fresh-produce",
                    SubCategorySlug: "organic-vegetables",
                    ImageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Seasonal Mangoes",
                    Slug: "seasonal-mangoes",
                    Description: "Golden ripe mangoes selected at peak sweetness.",
                    Price: 220.00m,
                    CategorySlug: "fresh-produce",
                    SubCategorySlug: "seasonal-fruit",
                    ImageUrl: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Fresh Basil Bunch",
                    Slug: "fresh-basil-bunch",
                    Description: "Aromatic basil for sauces, pasta, salads, and garnish.",
                    Price: 75.00m,
                    CategorySlug: "fresh-produce",
                    SubCategorySlug: "fresh-herbs",
                    ImageUrl: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Premium Ribeye Steak",
                    Slug: "premium-ribeye-steak",
                    Description: "Well-marbled ribeye cut for grilling, searing, or pan roasting.",
                    Price: 680.00m,
                    CategorySlug: "meat-seafood",
                    SubCategorySlug: "butcher-cuts",
                    ImageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Chicken Breast Fillet",
                    Slug: "chicken-breast-fillet",
                    Description: "Lean boneless chicken breast fillets for everyday cooking.",
                    Price: 245.00m,
                    CategorySlug: "meat-seafood",
                    SubCategorySlug: "butcher-cuts",
                    ImageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Fresh Salmon Fillet",
                    Slug: "fresh-salmon-fillet",
                    Description: "Chilled salmon fillet with rich flavor and firm texture.",
                    Price: 540.00m,
                    CategorySlug: "meat-seafood",
                    SubCategorySlug: "fresh-fish",
                    ImageUrl: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Marinated Pork Barbecue",
                    Slug: "marinated-pork-barbecue",
                    Description: "Ready-to-cook pork skewers in a sweet savory barbecue marinade.",
                    Price: 315.00m,
                    CategorySlug: "meat-seafood",
                    SubCategorySlug: "marinated-picks",
                    ImageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Whole Fresh Milk",
                    Slug: "whole-fresh-milk",
                    Description: "Creamy whole milk for coffee, cereal, baking, and cooking.",
                    Price: 98.00m,
                    CategorySlug: "dairy-eggs",
                    SubCategorySlug: "milk-and-cream",
                    ImageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Greek Yogurt",
                    Slug: "greek-yogurt",
                    Description: "Thick plain Greek yogurt with a clean, tangy finish.",
                    Price: 185.00m,
                    CategorySlug: "dairy-eggs",
                    SubCategorySlug: "milk-and-cream",
                    ImageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Aged Cheddar Block",
                    Slug: "aged-cheddar-block",
                    Description: "Sharp aged cheddar for sandwiches, boards, and melting.",
                    Price: 260.00m,
                    CategorySlug: "dairy-eggs",
                    SubCategorySlug: "cheese-counter",
                    ImageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Free-Range Brown Eggs",
                    Slug: "free-range-brown-eggs",
                    Description: "A dozen free-range brown eggs for breakfast and baking.",
                    Price: 165.00m,
                    CategorySlug: "dairy-eggs",
                    SubCategorySlug: "free-range-eggs",
                    ImageUrl: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Sourdough Loaf",
                    Slug: "sourdough-loaf",
                    Description: "Naturally leavened sourdough with a crisp crust and chewy crumb.",
                    Price: 210.00m,
                    CategorySlug: "bakery",
                    SubCategorySlug: "artisan-bread",
                    ImageUrl: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Butter Croissant",
                    Slug: "butter-croissant",
                    Description: "Flaky butter croissant baked fresh for breakfast or coffee.",
                    Price: 95.00m,
                    CategorySlug: "bakery",
                    SubCategorySlug: "breakfast-pastries",
                    ImageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Cold Brew Coffee",
                    Slug: "cold-brew-coffee",
                    Description: "Smooth bottled cold brew coffee, ready to drink over ice.",
                    Price: 145.00m,
                    CategorySlug: "beverages",
                    SubCategorySlug: "coffee-and-tea",
                    ImageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Orange Juice",
                    Slug: "orange-juice",
                    Description: "Fresh orange juice with bright citrus flavor.",
                    Price: 135.00m,
                    CategorySlug: "beverages",
                    SubCategorySlug: "juices",
                    ImageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Sparkling Lemon Water",
                    Slug: "sparkling-lemon-water",
                    Description: "Lightly flavored sparkling water with lemon.",
                    Price: 69.00m,
                    CategorySlug: "beverages",
                    SubCategorySlug: "sparkling-drinks",
                    ImageUrl: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=900&q=80",
                    IsActive: true),
                new(
                    Name: "Plant-Based Dish Soap",
                    Slug: "plant-based-dish-soap",
                    Description: "Gentle plant-based dish soap for everyday kitchen cleanup.",
                    Price: 125.00m,
                    CategorySlug: "baby-household",
                    SubCategorySlug: "cleaning",
                    ImageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=900&q=80",
                    IsActive: true)
            ];
        }

        private sealed record SeedProduct(
            string Name,
            string Slug,
            string Description,
            decimal Price,
            string CategorySlug,
            string? SubCategorySlug,
            string ImageUrl,
            bool IsActive);
    }
}
