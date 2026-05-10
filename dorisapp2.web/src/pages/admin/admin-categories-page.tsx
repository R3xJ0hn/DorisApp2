import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { AxiosError } from "axios";
import { ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import { toast } from "sonner";

import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  updateCategory,
} from "@/api/categories";
import type { ApiCategory } from "@/api/categories";
import { IconPicker } from "@/components/admin/icon-picker";
import type { IconOption } from "@/components/admin/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { iconOptions } from "@/lib/lucide-icon-tags";
import type { ShopCategory, ShopSubcategory } from "@/lib/shop-category-types";
import { cn, toSlug } from "@/lib/utils";

const defaultIconName: IconName = "package-check";
const newCategoryDraftId = "__new-category__";

type Draft = { name: string; slug: string; description: string; iconName: IconName };
type SetDraft = Dispatch<SetStateAction<Draft>>;

const emptyDraft: Draft = { name: "", slug: "", description: "", iconName: defaultIconName };

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [iconQuery, setIconQuery] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedCategory = categories.find((category) => category.id === selectedId) ?? categories[0];
  const isNewCategoryDraft = selectedCategory?.id === newCategoryDraftId;
  const filteredCategories = useMemo(() => filterCategories(categories, query), [categories, query]);
  const filteredIconOptions = useMemo(() => filterIconOptions(iconQuery), [iconQuery]);
  const selectedIconName = isEditing ? draft.iconName : selectedCategory?.iconName ?? defaultIconName;

  const resetTransientInputs = () => {
    setIconQuery("");
    setNewSubcategory("");
  };

  const clearSelection = () => {
    setSelectedId("");
    setDraft(emptyDraft);
    resetTransientInputs();
    setIsEditing(false);
  };

  const syncDraft = (category: ShopCategory, editing = false) => {
    setSelectedId(category.id);
    setDraft(toDraft(category));
    resetTransientInputs();
    setIsEditing(editing);
  };

  const showCategoryError = (error: unknown) => {
    toast.error("Category update failed", { description: getCategoryErrorMessage(error) });
  };

  const runCategoryMutation = async (
    loadingMessage: string,
    successMessage: string,
    mutation: () => Promise<void>,
    options: { successVariant?: "success" | "warning" } = {},
  ) => {
    const toastId = toast.loading(loadingMessage);
    setIsSaving(true);

    try {
      await mutation();
      if (options.successVariant === "warning") {
        toast.warning(successMessage, { id: toastId });
      } else {
        toast.success(successMessage, { id: toastId });
      }
    } catch (error) {
      toast.error("Category update failed", { id: toastId, description: getCategoryErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const updateLocalCategory = (id: string, updater: (category: ShopCategory) => ShopCategory) => {
    setCategories((current) => current.map((category) => (category.id === id ? updater(category) : category)));
  };

  const refreshCategories = async (preferredId = selectedId, options: { syncDraft?: boolean } = {}) => {
    const nextCategories = toShopCategories(await getCategories());
    const nextSelected = nextCategories.find((category) => category.id === preferredId) ?? nextCategories[0];

    setCategories(nextCategories);

    if (!nextSelected) {
      clearSelection();
    } else if (options.syncDraft === false) {
      setSelectedId(nextSelected.id);
    } else {
      syncDraft(nextSelected);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getCategories()
      .then((apiCategories) => {
        if (!isMounted) return;
        const nextCategories = toShopCategories(apiCategories);
        setCategories(nextCategories);
        if (nextCategories[0]) syncDraft(nextCategories[0]);
      })
      .catch((error) => {
        if (isMounted) showCategoryError(error);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateCategory = () => {
    const draftCategory = createLocalCategoryDraft(categories);
    setCategories((current) => [...current.filter((category) => category.id !== newCategoryDraftId), draftCategory]);
    syncDraft(draftCategory, true);
  };

  const handleSaveDraft = async () => {
    if (!selectedCategory) return;

    await runCategoryMutation("Saving category changes...", "Category saved.", async () => {
      if (isNewCategoryDraft) {
        const createdCategory = await createCategory({ ...draft, iconName: draft.iconName, isActive: selectedCategory.isActive });
        await Promise.all(selectedCategory.subcategories.map((subcategory) =>
          createSubCategory(createdCategory.id, {
            name: subcategory.name,
            slug: subcategory.slug,
            description: null,
            isActive: selectedCategory.isActive,
          }),
        ));
        await refreshCategories(String(createdCategory.id));
      } else {
        await updateCategory(Number(selectedCategory.id), { ...draft, iconName: draft.iconName, isActive: selectedCategory.isActive });
        await refreshCategories(selectedCategory.id);
      }
    });
  };

  const handleToggleCategoryActive = async () => {
    if (!selectedCategory) return;
    const nextIsActive = !selectedCategory.isActive;

    if (isNewCategoryDraft) {
      updateLocalCategory(newCategoryDraftId, (category) => ({ ...category, isActive: nextIsActive }));
      if (nextIsActive) {
        toast.success("Category set active.");
      } else {
        toast.warning("Category set inactive.");
      }
      return;
    }

    await runCategoryMutation(
      "Updating category status...",
      nextIsActive ? "Category activated." : "Category inactivated.",
      async () => {
        await updateCategory(Number(selectedCategory.id), {
          name: selectedCategory.name,
          slug: selectedCategory.slug,
          description: selectedCategory.description,
          iconName: selectedCategory.iconName,
          isActive: nextIsActive,
        });
        await refreshCategories(selectedCategory.id);
      },
      { successVariant: nextIsActive ? "success" : "warning" },
    );
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    if (isNewCategoryDraft) {
      const remainingCategories = categories.filter((category) => category.id !== newCategoryDraftId);
      setCategories(remainingCategories);
      if (remainingCategories[0]) syncDraft(remainingCategories[0]);
      else clearSelection();
      return;
    }

    if (categories.length === 1) return;

    await runCategoryMutation("Deleting category...", "Category deleted.", async () => {
      await deleteCategory(Number(selectedCategory.id));
      await refreshCategories(categories.find((category) => category.id !== selectedCategory.id)?.id);
    });
  };

  const handleAddSubcategory = async () => {
    if (!selectedCategory) return;
    const subcategory = toDraftSubcategory(newSubcategory);

    if (!subcategory || hasDuplicateSubcategory(selectedCategory.subcategories, subcategory)) return;

    if (isNewCategoryDraft) {
      updateLocalCategory(newCategoryDraftId, (category) => ({
        ...category,
        subcategories: [...category.subcategories, subcategory],
      }));
      setNewSubcategory("");
      return;
    }

    await runCategoryMutation("Saving subcategory...", "Subcategory saved.", async () => {
      await createSubCategory(Number(selectedCategory.id), {
        name: subcategory.name,
        slug: subcategory.slug,
        description: null,
        isActive: selectedCategory.isActive,
      });
      await refreshCategories(selectedCategory.id, { syncDraft: false });
      setNewSubcategory("");
    });
  };

  const handleRemoveSubcategory = async (id: string) => {
    if (!selectedCategory) return;

    if (isNewCategoryDraft) {
      updateLocalCategory(newCategoryDraftId, (category) => ({
        ...category,
        subcategories: category.subcategories.filter((subcategory) => subcategory.id !== id),
      }));
      return;
    }

    await runCategoryMutation("Removing subcategory...", "Subcategory removed.", async () => {
      await deleteSubCategory(Number(selectedCategory.id), Number(id));
      await refreshCategories(selectedCategory.id, { syncDraft: false });
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
      <PageHeader isLoading={isLoading} isSaving={isSaving} onCreate={handleCreateCategory} />

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {isLoading ? (
          <>
            <CategoryListSkeleton />
            <CategoryPanelSkeleton />
          </>
        ) : (
          <>
            <CategoryList
              categories={filteredCategories}
              isSaving={isSaving}
              query={query}
              selectedId={selectedCategory?.id}
              onQueryChange={setQuery}
              onSelect={syncDraft}
            />

            {selectedCategory ? (
              <CategoryPanel
                category={selectedCategory}
                categoriesCount={categories.length}
                draft={draft}
                iconOptions={filteredIconOptions}
                iconQuery={iconQuery}
                isEditing={isEditing}
                isNewDraft={isNewCategoryDraft}
                isSaving={isSaving}
                newSubcategory={newSubcategory}
                selectedIconName={selectedIconName}
                setDraft={setDraft}
                setIconQuery={setIconQuery}
                setIsEditing={setIsEditing}
                setNewSubcategory={setNewSubcategory}
                onAddSubcategory={handleAddSubcategory}
                onDelete={handleDeleteCategory}
                onRemoveSubcategory={handleRemoveSubcategory}
                onSave={handleSaveDraft}
                onToggleActive={handleToggleCategoryActive}
              />
            ) : (
              <EmptyCategoryPanel isSaving={isSaving} onCreate={handleCreateCategory} />
            )}
          </>
        )}
      </section>
    </main>
  );
}

function PageHeader({ isLoading, isSaving, onCreate }: { isLoading: boolean; isSaving: boolean; onCreate: () => void }) {
  return (
    <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage shop categories and subcategories from the API.</p>
      </div>
      <Button className="gap-2" disabled={isLoading || isSaving} onClick={onCreate}>
        <Plus className="size-4" />
        New category
      </Button>
    </section>
  );
}

function CategoryList({
  categories,
  isSaving,
  query,
  selectedId,
  onQueryChange,
  onSelect,
}: {
  categories: ShopCategory[];
  isSaving: boolean;
  query: string;
  selectedId?: string;
  onQueryChange: (query: string) => void;
  onSelect: (category: ShopCategory) => void;
}) {
  return (
    <aside className="rounded-lg border bg-card text-card-foreground">
      <div className="border-b p-4">
        <h3 className="mb-3 font-medium">Select category</h3>
        <SearchInput label="Search categories" placeholder="Search categories" value={query} onChange={onQueryChange} />
      </div>

      <div className="max-h-136 overflow-y-auto p-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={cn("flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted", category.id === selectedId && "bg-muted")}
            disabled={isSaving}
            onClick={() => onSelect(category)}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#a764f5]/10 text-[#a764f5]">
              <DynamicIcon name={category.iconName} className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{category.name}</span>
              <span className="block text-xs text-muted-foreground">{category.subcategories.length} subcategories</span>
            </span>
            <StatusPill isActive={category.isActive} />
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </aside>
  );
}

function CategoryListSkeleton() {
  return (
    <aside className="rounded-lg border bg-card text-card-foreground">
      <div className="border-b p-4">
        <Skeleton className="mb-3 h-5 w-32" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <div className="space-y-2 p-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg p-3">
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </aside>
  );
}

function CategoryPanel(props: {
  category: ShopCategory;
  categoriesCount: number;
  draft: Draft;
  iconOptions: IconOption[];
  iconQuery: string;
  isEditing: boolean;
  isNewDraft: boolean;
  isSaving: boolean;
  newSubcategory: string;
  selectedIconName: IconName;
  setDraft: SetDraft;
  setIconQuery: (query: string) => void;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setNewSubcategory: (name: string) => void;
  onAddSubcategory: () => void;
  onDelete: () => void;
  onRemoveSubcategory: (id: string) => void;
  onSave: () => void;
  onToggleActive: () => void;
}) {
  const { category, isEditing } = props;

  return (
    <section className={cn("rounded-lg border bg-card text-card-foreground transition-colors", !category.isActive && "border-slate-200 bg-slate-50/80 text-muted-foreground")}>
      <CategoryPanelHeader {...props} />
      {isEditing ? <CategoryEditForm {...props} /> : <CategoryPreview category={category} />}
    </section>
  );
}

function CategoryPanelSkeleton() {
  return (
    <section className="rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-3 border-b p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
      <div className="grid gap-5 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="rounded-lg border p-4">
          <Skeleton className="h-5 w-28" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryPanelHeader({
  category,
  draft,
  isEditing,
  isSaving,
  selectedIconName,
  setIsEditing,
  onToggleActive,
}: {
  category: ShopCategory;
  draft: Draft;
  isEditing: boolean;
  isSaving: boolean;
  selectedIconName: IconName;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onToggleActive: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-[#db8d48]/10 text-[#db8d48]">
          <DynamicIcon name={selectedIconName} className="size-5" />
        </span>
        <div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-xs text-muted-foreground">/categories/{draft.slug}</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{category.itemCount} products</span>
            <span>{category.subcategories.length} subcategories</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ActiveSwitch isActive={category.isActive} isSaving={isSaving} onClick={onToggleActive} />
        <Button type="button" variant={isEditing ? "secondary" : "outline"} size="sm" className="gap-2" disabled={isSaving} onClick={() => setIsEditing((editing) => !editing)}>
          <Pencil className="size-4" />
          {isEditing ? "Editing" : "Edit"}
        </Button>
      </div>
    </div>
  );
}

function CategoryEditForm({
  category,
  categoriesCount,
  draft,
  iconOptions,
  iconQuery,
  isNewDraft,
  isSaving,
  newSubcategory,
  setDraft,
  setIconQuery,
  setNewSubcategory,
  onAddSubcategory,
  onDelete,
  onRemoveSubcategory,
  onSave,
}: Parameters<typeof CategoryPanel>[0]) {
  const updateDraft = <Key extends keyof Draft>(key: Key, value: Draft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-5 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Category name
          <Input className="font-normal" value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          URL slug
          <Input className="font-normal" value={draft.slug} onChange={(event) => updateDraft("slug", event.target.value)} />
        </label>
      </div>

      <IconPicker
        iconOptions={iconOptions}
        iconQuery={iconQuery}
        selectedIconName={draft.iconName}
        onIconQueryChange={setIconQuery}
        onIconSelect={(iconName) => updateDraft("iconName", iconName)}
      />

      <label className="grid gap-2 text-sm font-medium">
        Description
        <textarea
          value={draft.description}
          onChange={(event) => updateDraft("description", event.target.value)}
          className="font-normal min-h-24 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Short description shown in shop category pages."
        />
      </label>

      <EditableSubcategoryList
        category={category}
        isSaving={isSaving}
        newSubcategory={newSubcategory}
        onAdd={onAddSubcategory}
        onChange={setNewSubcategory}
        onRemove={onRemoveSubcategory}
      />

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
        <Button type="button" variant="destructive" className="gap-2" disabled={(!isNewDraft && categoriesCount === 1) || isSaving} onClick={onDelete}>
          <Trash2 className="size-4" />
          {isNewDraft ? "Discard category" : "Delete category"}
        </Button>
        <Button type="button" disabled={isSaving} onClick={onSave}>Save changes</Button>
      </div>
    </div>
  );
}

function EditableSubcategoryList({
  category,
  isSaving,
  newSubcategory,
  onAdd,
  onChange,
  onRemove,
}: {
  category: ShopCategory;
  isSaving: boolean;
  newSubcategory: string;
  onAdd: () => void;
  onChange: (name: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h4 className="text-sm font-medium">Subcategories</h4>
          <p className="text-sm text-muted-foreground">Add, review, or remove subcategory labels.</p>
        </div>
        <div className="flex gap-2">
          <Input
            value={newSubcategory}
            onChange={(event) => onChange(event.target.value)}
            placeholder="New subcategory"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAdd();
              }
            }}
          />
          <Button type="button" variant="outline" disabled={isSaving} onClick={onAdd}>Add</Button>
        </div>
      </div>

      <div className="mt-3 divide-y rounded-lg border">
        {category.subcategories.map((subcategory) => (
          <div key={subcategory.id} className="flex items-center justify-between gap-3 p-3 text-sm">
            <span>
              <span className="block font-medium">{subcategory.name}</span>
              <span className="block text-xs text-muted-foreground">/{subcategory.slug} - {subcategory.productCount} products</span>
            </span>
            <Button type="button" variant="ghost" size="icon-sm" disabled={isSaving} aria-label={`Remove ${subcategory.name}`} onClick={() => onRemove(subcategory.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        {category.subcategories.length === 0 && <div className="p-3 text-sm text-muted-foreground">No subcategories yet.</div>}
      </div>
    </div>
  );
}

function CategoryPreview({ category }: { category: ShopCategory }) {
  return (
    <div className="grid gap-5 p-4">
      <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>

      <div className="rounded-lg border p-4">
        <h4 className="text-sm font-medium">Subcategories</h4>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {category.subcategories.map((subcategory) => (
            <div key={subcategory.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              <span className="min-w-0">
                <span className="block truncate font-medium text-foreground">{subcategory.name}</span>
                <span className="block truncate">/{subcategory.slug}</span>
              </span>
              <span className="shrink-0 rounded-full bg-background px-2 py-1 font-medium text-foreground">{subcategory.productCount} products</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyCategoryPanel({ isSaving, onCreate }: { isSaving: boolean; onCreate: () => void }) {
  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground">
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
        <DynamicIcon name={defaultIconName} className="size-10 text-muted-foreground" />
        <div>
          <h3 className="font-medium">No categories yet</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">Create a category to start managing shop navigation.</p>
        </div>
        <Button type="button" className="gap-2" disabled={isSaving} onClick={onCreate}>
          <Plus className="size-4" />
          New category
        </Button>
      </div>
    </section>
  );
}

function SearchInput({ value, placeholder, label, onChange }: { value: string; placeholder: string; label: string; onChange: (value: string) => void }) {
  return (
    <label className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
      <Search className="size-4" />
      <span className="sr-only">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-full min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none" />
    </label>
  );
}

function ActiveSwitch({ isActive, isSaving, onClick }: { isActive: boolean; isSaving: boolean; onClick: () => void }) {
  return (
    <div className={cn("flex h-8 items-center gap-2 rounded-full border px-2.5 text-xs font-medium transition-colors", isActive ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-100")}>
      <Switch checked={isActive} disabled={isSaving} onCheckedChange={onClick} aria-label={isActive ? "Deactivate category" : "Activate category"} />
      <span className={cn(isActive ? "text-emerald-700" : "text-slate-600")}>{isActive ? "Active" : "Inactive"}</span>
    </div>
  );
}

function StatusPill({ isActive }: { isActive: boolean }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600")}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function toDraft(category: ShopCategory): Draft {
  return { name: category.name, slug: category.slug, description: category.description, iconName: category.iconName };
}

function createLocalCategoryDraft(categories: ShopCategory[]): ShopCategory {
  const existingSlugs = categories.filter((category) => category.id !== newCategoryDraftId).map((category) => category.slug);

  return {
    id: newCategoryDraftId,
    name: "New Category",
    slug: getUniqueSlug(`new-category-${categories.length + 1}`, existingSlugs),
    description: "New category description.",
    itemCount: 0,
    isActive: true,
    iconName: "apple",
    subcategories: [],
  };
}

function filterCategories(categories: ShopCategory[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return categories;

  return categories.filter((category) =>
    [
      category.name,
      category.slug,
      ...category.subcategories.flatMap((subcategory) => [subcategory.name, subcategory.slug]),
    ].some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
}

function filterIconOptions(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return iconOptions;

  return iconOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(normalizedQuery) ||
      option.name.includes(normalizedQuery) ||
      option.tags.some((tag) => tag.includes(normalizedQuery)),
  );
}

function toDraftSubcategory(name: string): ShopSubcategory | null {
  const trimmedName = name.trim();
  const slug = toSlug(trimmedName);

  if (!trimmedName || !slug) return null;

  return { id: `draft-subcategory-${slug}`, name: trimmedName, slug, productCount: 0 };
}

function hasDuplicateSubcategory(subcategories: ShopSubcategory[], nextSubcategory: ShopSubcategory) {
  const normalizedName = nextSubcategory.name.trim().toLowerCase();

  return subcategories.some(
    (subcategory) =>
      subcategory.slug === nextSubcategory.slug ||
      subcategory.name.trim().toLowerCase() === normalizedName,
  );
}

function toShopCategories(apiCategories: ApiCategory[]): ShopCategory[] {
  return apiCategories.map((category) => ({
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    itemCount: 0,
    isActive: category.isActive,
    iconName: (category.iconName || defaultIconName) as IconName,
    subcategories: (category.subCategories ?? []).map((subcategory) => ({
      id: String(subcategory.id),
      name: subcategory.name,
      slug: subcategory.slug,
      productCount: 0,
    })),
  }));
}

function getUniqueSlug(baseSlug: string, existingSlugs: string[]) {
  const usedSlugs = new Set(existingSlugs);
  let slug = baseSlug;
  let index = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}

function getCategoryErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) return "Your admin session is missing or expired. Sign in again before changing categories.";
    if (error.response?.status === 403) return "Your account does not have permission to change categories.";

    const data = error.response?.data as
      | { message?: string; title?: string; errors?: Record<string, string[]> }
      | undefined;
    const firstValidationError = data?.errors ? Object.values(data.errors).flat()[0] : undefined;

    if (data?.message) return data.message;
    if (firstValidationError) return firstValidationError;
    if (data?.title) return data.title;
  }

  return "Unable to update categories. Please try again.";
}

export { AdminCategoriesPage };
