import { useMemo, useState } from "react";
import { ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { iconOptions } from "@/lib/lucide-icon-tags";
import type { ShopCategory } from "@/lib/shop-category-types";
import { cn, toSlug } from "@/lib/utils";

const initialCategories: ShopCategory[] = [
  {
    id: "fresh-produce",
    name: "Fresh Produce",
    slug: "fresh-produce",
    description: "Seasonal fruit, vegetables, herbs, and organic produce.",
    itemCount: 248,
    isActive: true,
    iconName: "apple",
    subcategories: [
      {
        id: "organic-vegetables",
        name: "Organic vegetables",
        slug: "organic-vegetables",
        productCount: 94,
      },
      {
        id: "seasonal-fruit",
        name: "Seasonal fruit",
        slug: "seasonal-fruit",
        productCount: 118,
      },
      {
        id: "fresh-herbs",
        name: "Fresh herbs",
        slug: "fresh-herbs",
        productCount: 36,
      },
    ],
  },
  {
    id: "meat-seafood",
    name: "Meat & Seafood",
    slug: "meat-seafood",
    description: "Fresh butcher cuts, seafood, and ready-to-cook proteins.",
    itemCount: 126,
    isActive: true,
    iconName: "beef",
    subcategories: [
      { id: "butcher-cuts", name: "Butcher cuts", slug: "butcher-cuts", productCount: 58 },
      { id: "fresh-fish", name: "Fresh fish", slug: "fresh-fish", productCount: 42 },
      {
        id: "marinated-picks",
        name: "Marinated picks",
        slug: "marinated-picks",
        productCount: 26,
      },
    ],
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    description: "Milk, cheese, butter, cream, eggs, and chilled basics.",
    itemCount: 84,
    isActive: true,
    iconName: "milk",
    subcategories: [
      { id: "milk-and-cream", name: "Milk & cream", slug: "milk-and-cream", productCount: 31 },
      {
        id: "cheese-counter",
        name: "Cheese counter",
        slug: "cheese-counter",
        productCount: 34,
      },
      {
        id: "free-range-eggs",
        name: "Free-range eggs",
        slug: "free-range-eggs",
        productCount: 19,
      },
    ],
  },
  {
    id: "bakery",
    name: "Bakery",
    slug: "bakery",
    description:
      "Fresh bread, pastries, breakfast bakes, and gluten-free goods.",
    itemCount: 67,
    isActive: false,
    iconName: "wheat",
    subcategories: [
      { id: "artisan-bread", name: "Artisan bread", slug: "artisan-bread", productCount: 28 },
      {
        id: "breakfast-pastries",
        name: "Breakfast pastries",
        slug: "breakfast-pastries",
        productCount: 24,
      },
      { id: "gluten-free", name: "Gluten-free", slug: "gluten-free", productCount: 15 },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    description: "Juices, coffee, tea, sparkling drinks, and pantry beverages.",
    itemCount: 139,
    isActive: true,
    iconName: "cup-soda",
    subcategories: [
      { id: "juices", name: "Juices", slug: "juices", productCount: 44 },
      { id: "coffee-and-tea", name: "Coffee & tea", slug: "coffee-and-tea", productCount: 51 },
      {
        id: "sparkling-drinks",
        name: "Sparkling drinks",
        slug: "sparkling-drinks",
        productCount: 44,
      },
    ],
  },
  {
    id: "baby-household",
    name: "Baby & Household",
    slug: "baby-household",
    description: "Baby care, cleaning supplies, paper goods, and home basics.",
    itemCount: 92,
    isActive: true,
    iconName: "baby",
    subcategories: [
      { id: "baby-care", name: "Baby care", slug: "baby-care", productCount: 33 },
      { id: "cleaning", name: "Cleaning", slug: "cleaning", productCount: 37 },
      { id: "paper-goods", name: "Paper goods", slug: "paper-goods", productCount: 22 },
    ],
  },
];

function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedId, setSelectedId] = useState(initialCategories[0].id);
  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(initialCategories[0].name);
  const [draftSlug, setDraftSlug] = useState(initialCategories[0].slug);
  const [draftDescription, setDraftDescription] = useState(
    initialCategories[0].description,
  );
  const [draftIconName, setDraftIconName] = useState<IconName>(
    initialCategories[0].iconName,
  );
  const [iconQuery, setIconQuery] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const selectedCategory =
    categories.find((category) => category.id === selectedId) ?? categories[0];

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      [
        category.name,
        category.slug,
        ...category.subcategories.flatMap((subcategory) => [
          subcategory.name,
          subcategory.slug,
        ]),
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [categories, query]);

  const filteredIconOptions = useMemo(() => {
    const normalizedQuery = iconQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return iconOptions;
    }

    return iconOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.name.includes(normalizedQuery) ||
        option.tags.some((tag) => tag.includes(normalizedQuery)),
    );
  }, [iconQuery]);

  const handleSelectCategory = (category: ShopCategory) => {
    setSelectedId(category.id);
    setDraftName(category.name);
    setDraftSlug(category.slug);
    setDraftDescription(category.description);
    setDraftIconName(category.iconName);
    setIconQuery("");
    setNewSubcategory("");
    setIsEditing(false);
  };

  const handleCreateCategory = () => {
    const nextNumber = categories.length + 1;
    const nextCategory = {
      id: `new-category-${nextNumber}`,
      name: "New Category",
      slug: `new-category-${nextNumber}`,
      description: "New category description.",
      itemCount: 0,
      isActive: false,
      iconName: "apple" as IconName,
      subcategories: [],
    } satisfies ShopCategory;

    setCategories((current) => [nextCategory, ...current]);
    handleSelectCategory(nextCategory);
  };

  const handleSaveDraft = () => {
    setCategories((current) =>
      current.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              name: draftName,
              slug: draftSlug,
              description: draftDescription,
              iconName: draftIconName,
            }
          : category,
      ),
    );
    setIsEditing(false);
  };

  const handleToggleCategoryActive = () => {
    setCategories((current) =>
      current.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, isActive: !category.isActive }
          : category,
      ),
    );
  };

  const handleDeleteCategory = () => {
    if (categories.length === 1) {
      return;
    }

    const remainingCategories = categories.filter(
      (category) => category.id !== selectedCategory.id,
    );

    setCategories(remainingCategories);
    handleSelectCategory(remainingCategories[0]);
  };

  const handleAddSubcategory = () => {
    const trimmedName = newSubcategory.trim();
    const nextSlug = toSlug(trimmedName);

    if (!trimmedName || !nextSlug) {
      return;
    }

    const normalizedName = trimmedName.toLowerCase();
    const hasDuplicate = selectedCategory.subcategories.some(
      (subcategory) =>
        subcategory.slug === nextSlug ||
        subcategory.name.trim().toLowerCase() === normalizedName,
    );

    if (hasDuplicate) {
      return;
    }

    setCategories((current) =>
      current.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              subcategories: [
                ...category.subcategories,
                {
                  id: nextSlug,
                  name: trimmedName,
                  slug: nextSlug,
                  productCount: 0,
                },
              ],
            }
          : category,
      ),
    );
    setNewSubcategory("");
  };

  const handleRemoveSubcategory = (id: string) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              subcategories: category.subcategories.filter(
                (subcategory) => subcategory.id !== id,
              ),
            }
          : category,
      ),
    );
  };

  const selectedIconName = isEditing
    ? draftIconName
    : selectedCategory.iconName;

  return (
    <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            UI draft for managing shop categories and subcategories.
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateCategory}>
          <Plus className="size-4" />
          New category
        </Button>
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <aside className="rounded-lg border bg-card text-card-foreground">
          <div className="border-b p-4">
            <h3 className="mb-3 font-medium">Select category</h3>
            <label className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
              <Search className="size-4" />
              <span className="sr-only">Search categories</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search categories"
                className="h-full min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              />
            </label>
          </div>

          <div className="max-h-[34rem] overflow-y-auto p-2">
            {filteredCategories.map((category) => {
              const isSelected = category.id === selectedCategory.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted",
                    isSelected && "bg-muted",
                  )}
                  onClick={() => handleSelectCategory(category)}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#a764f5]/10 text-[#a764f5]">
                    <DynamicIcon name={category.iconName} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {category.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {category.subcategories.length} subcategories
                    </span>
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      category.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </aside>

        <section
          className={cn(
            "rounded-lg border bg-card text-card-foreground transition-colors",
            !selectedCategory.isActive &&
              "border-slate-200 bg-slate-50/80 text-muted-foreground",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#db8d48]/10 text-[#db8d48]">
                <DynamicIcon name={selectedIconName} className="size-5" />
              </span>
              <div>
                <h3 className="font-medium">{selectedCategory.name}</h3>
                <p className="text-xs text-muted-foreground">
                  /categories/{draftSlug}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{selectedCategory.itemCount} products</span>
                  <span>
                    {selectedCategory.subcategories.length} subcategories
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={selectedCategory.isActive}
                onClick={handleToggleCategoryActive}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-full border px-2.5 text-xs font-medium transition-colors",
                  selectedCategory.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-100 text-slate-600",
                )}
              >
                <span
                  className={cn(
                    "size-3 rounded-full transition-colors",
                    selectedCategory.isActive
                      ? "bg-emerald-500"
                      : "bg-slate-400",
                  )}
                />
                {selectedCategory.isActive ? "Active" : "Inactive"}
              </button>
              <Button
                type="button"
                variant={isEditing ? "secondary" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setIsEditing((editing) => !editing)}
              >
                <Pencil className="size-4" />
                {isEditing ? "Editing" : "Edit"}
              </Button>
            </div>
          </div>

          {isEditing ? (
            <div className="grid gap-5 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Category name
                  <Input
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  URL slug
                  <Input
                    value={draftSlug}
                    onChange={(event) => setDraftSlug(event.target.value)}
                  />
                </label>
              </div>

              <div className="grid gap-2">
                <div>
                  <h4 className="text-sm font-medium">Icon</h4>
                  <p className="text-sm text-muted-foreground">
                    Search by icon name or tags like produce, meat, delivery,
                    payment, or sale.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "produce",
                    "meat",
                    "bakery",
                    "drink",
                    "care",
                    "house",
                    "cleaning",
                    "delivery",
                    "sale",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setIconQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <label className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
                  <Search className="size-4" />
                  <span className="sr-only">Search Lucide icons</span>
                  <input
                    value={iconQuery}
                    onChange={(event) => setIconQuery(event.target.value)}
                    placeholder="Search Lucide icons"
                    className="h-full min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </label>
                <div className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-6">
                  {filteredIconOptions.map((option) => {
                    const isSelectedIcon = draftIconName === option.name;

                    return (
                      <button
                        key={option.name}
                        type="button"
                        className={cn(
                          "flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-xs transition-colors",
                          isSelectedIcon
                            ? "border-[#a764f5] bg-[#a764f5]/10 text-[#a764f5]"
                            : "bg-background text-muted-foreground hover:bg-muted",
                        )}
                        onClick={() => setDraftIconName(option.name)}
                      >
                        <DynamicIcon name={option.name} className="size-5" />
                        <span className="max-w-full truncate px-1">
                          {option.label}
                        </span>
                        {option.tags.length > 0 && (
                          <span className="max-w-full truncate px-1 text-[10px] text-muted-foreground">
                            {option.tags.slice(0, 2).join(", ")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {filteredIconOptions.length === 0 && (
                    <div className="col-span-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      No matching icons.
                    </div>
                  )}
                </div>
              </div>

              <label className="grid gap-2 text-sm font-medium">
                Description
                <textarea
                  value={draftDescription}
                  onChange={(event) => setDraftDescription(event.target.value)}
                  className="min-h-24 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="Short description shown in shop category pages."
                />
              </label>

              <div>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <h4 className="text-sm font-medium">Subcategories</h4>
                    <p className="text-sm text-muted-foreground">
                      Add, review, or remove subcategory labels.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSubcategory}
                      onChange={(event) =>
                        setNewSubcategory(event.target.value)
                      }
                      placeholder="New subcategory"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleAddSubcategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSubcategory}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="mt-3 divide-y rounded-lg border">
                  {selectedCategory.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="flex items-center justify-between gap-3 p-3 text-sm"
                    >
                      <span>
                        <span className="block font-medium">
                          {subcategory.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          /{subcategory.slug} - {subcategory.productCount}{" "}
                          products
                        </span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${subcategory.name}`}
                        onClick={() =>
                          handleRemoveSubcategory(subcategory.id)
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  {selectedCategory.subcategories.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">
                      No subcategories yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  className="gap-2"
                  disabled={categories.length === 1}
                  onClick={handleDeleteCategory}
                >
                  <Trash2 className="size-4" />
                  Delete category
                </Button>
                <Button type="button" onClick={handleSaveDraft}>
                  Save changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {selectedCategory.description}
              </p>

              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium">Subcategories</h4>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selectedCategory.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground">
                          {subcategory.name}
                        </span>
                        <span className="block truncate">
                          /{subcategory.slug}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-background px-2 py-1 font-medium text-foreground">
                        {subcategory.productCount} products
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export { AdminCategoriesPage };
