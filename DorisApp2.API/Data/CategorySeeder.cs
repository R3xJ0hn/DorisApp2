using DorisApp2.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DorisApp2.API.Data
{
    public static class CategorySeeder
    {
        public static async Task SeedCategoriesAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var existingCategories = await context.Categories
                .Include(category => category.SubCategories)
                .ToListAsync();
            var categoriesBySlug = existingCategories.ToDictionary(
                category => category.Slug,
                StringComparer.OrdinalIgnoreCase);
            var hasChanges = false;

            foreach (var seedCategory in GetDefaultCategories())
            {
                if (!categoriesBySlug.TryGetValue(seedCategory.Slug, out var existingCategory))
                {
                    context.Categories.Add(seedCategory);
                    hasChanges = true;
                    continue;
                }

                var existingSubCategorySlugs = existingCategory.SubCategories
                    .Select(subCategory => subCategory.Slug)
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                foreach (var seedSubCategory in seedCategory.SubCategories)
                {
                    if (existingSubCategorySlugs.Contains(seedSubCategory.Slug))
                    {
                        continue;
                    }

                    existingCategory.SubCategories.Add(seedSubCategory);
                    hasChanges = true;
                }
            }

            if (hasChanges)
            {
                await context.SaveChangesAsync();
            }
        }

        private static List<Category> GetDefaultCategories()
        {
            var createdAt = DateTime.UtcNow;

            return
            [
                CreateCategory(
                    name: "Fresh Produce",
                    slug: "fresh-produce",
                    description: "Seasonal fruit, vegetables, herbs, and organic produce.",
                    iconName: "apple",
                    isActive: true,
                    createdAt,
                    subCategories:
                    [
                        ("Organic vegetables", "organic-vegetables"),
                        ("Seasonal fruit", "seasonal-fruit"),
                        ("Fresh herbs", "fresh-herbs")
                    ]),
                CreateCategory(
                    name: "Meat & Seafood",
                    slug: "meat-seafood",
                    description: "Fresh butcher cuts, seafood, and ready-to-cook proteins.",
                    iconName: "beef",
                    isActive: true,
                    createdAt,
                    subCategories:
                    [
                        ("Butcher cuts", "butcher-cuts"),
                        ("Fresh fish", "fresh-fish"),
                        ("Marinated picks", "marinated-picks")
                    ]),
                CreateCategory(
                    name: "Dairy & Eggs",
                    slug: "dairy-eggs",
                    description: "Milk, cheese, butter, cream, eggs, and chilled basics.",
                    iconName: "milk",
                    isActive: true,
                    createdAt,
                    subCategories:
                    [
                        ("Milk & cream", "milk-and-cream"),
                        ("Cheese counter", "cheese-counter"),
                        ("Free-range eggs", "free-range-eggs")
                    ]),
                CreateCategory(
                    name: "Bakery",
                    slug: "bakery",
                    description: "Fresh bread, pastries, breakfast bakes, and gluten-free goods.",
                    iconName: "wheat",
                    isActive: false,
                    createdAt,
                    subCategories:
                    [
                        ("Artisan bread", "artisan-bread"),
                        ("Breakfast pastries", "breakfast-pastries"),
                        ("Gluten-free", "gluten-free")
                    ]),
                CreateCategory(
                    name: "Beverages",
                    slug: "beverages",
                    description: "Juices, coffee, tea, sparkling drinks, and pantry beverages.",
                    iconName: "cup-soda",
                    isActive: true,
                    createdAt,
                    subCategories:
                    [
                        ("Juices", "juices"),
                        ("Coffee & tea", "coffee-and-tea"),
                        ("Sparkling drinks", "sparkling-drinks")
                    ]),
                CreateCategory(
                    name: "Baby & Household",
                    slug: "baby-household",
                    description: "Baby care, cleaning supplies, paper goods, and home basics.",
                    iconName: "baby",
                    isActive: true,
                    createdAt,
                    subCategories:
                    [
                        ("Baby care", "baby-care"),
                        ("Cleaning", "cleaning"),
                        ("Paper goods", "paper-goods")
                    ])
            ];
        }

        private static Category CreateCategory(
            string name,
            string slug,
            string description,
            string iconName,
            bool isActive,
            DateTime createdAt,
            List<(string Name, string Slug)> subCategories)
        {
            return new Category
            {
                Name = name,
                Slug = slug,
                Description = description,
                IconName = iconName,
                IsActive = isActive,
                CreatedAt = createdAt,
                SubCategories = subCategories
                    .Select(subCategory => new SubCategory
                    {
                        Name = subCategory.Name,
                        Slug = subCategory.Slug,
                        IsActive = isActive,
                        CreatedAt = createdAt
                    })
                    .ToList()
            };
        }
    }
}
