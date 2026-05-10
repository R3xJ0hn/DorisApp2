import { Search } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";

import type { iconOptions } from "@/lib/lucide-icon-tags";
import { cn } from "@/lib/utils";

type IconOption = (typeof iconOptions)[number];

const quickIconTags = [
  "produce",
  "meat",
  "bakery",
  "drink",
  "care",
  "house",
  "cleaning",
  "delivery",
  "sale",
];

type IconPickerProps = {
  iconOptions: IconOption[];
  iconQuery: string;
  selectedIconName: IconName;
  onIconQueryChange: (query: string) => void;
  onIconSelect: (iconName: IconName) => void;
};

function IconPicker({
  iconOptions,
  iconQuery,
  selectedIconName,
  onIconQueryChange,
  onIconSelect,
}: IconPickerProps) {
  return (
    <div className="grid gap-2">
      <div>
        <h4 className="text-sm font-medium">Icon</h4>
        <p className="text-sm text-muted-foreground">
          Search by icon name or tags like produce, meat, delivery, payment, or sale.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickIconTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => onIconQueryChange(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <SearchInput
        label="Search Lucide icons"
        placeholder="Search Lucide icons"
        value={iconQuery}
        onChange={onIconQueryChange}
      />
      <div className="admin-scrollbar grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-6">
        {iconOptions.map((option) => (
          <button
            key={option.name}
            type="button"
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-xs transition-colors",
              selectedIconName === option.name
                ? "border-[#a764f5] bg-[#a764f5]/10 text-[#a764f5]"
                : "bg-background text-muted-foreground hover:bg-muted",
            )}
            onClick={() => onIconSelect(option.name)}
          >
            <DynamicIcon name={option.name} className="size-5" />
            <span className="max-w-full truncate px-1">{option.label}</span>
            {option.tags.length > 0 && (
              <span className="max-w-full truncate px-1 text-[10px] text-muted-foreground">
                {option.tags.slice(0, 2).join(", ")}
              </span>
            )}
          </button>
        ))}
        {iconOptions.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No matching icons.
          </div>
        )}
      </div>
    </div>
  );
}

function SearchInput({
  value,
  placeholder,
  label,
  onChange,
}: {
  value: string;
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
      <Search className="size-4" />
      <span className="sr-only">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
      />
    </label>
  );
}

export { IconPicker };
export type { IconOption };
