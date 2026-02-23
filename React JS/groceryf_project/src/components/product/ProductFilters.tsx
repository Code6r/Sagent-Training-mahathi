import Select from "@components/ui/select";
import { cn } from "@utils/cn";
import { CATEGORY_IMAGES } from "@utils/constants";

interface ProductFiltersProps {
  category?: string;
  onCategoryChange: (category?: string) => void;
  sort?: string;
  onSortChange: (sort: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const CATEGORIES = ["All", "Fruits", "Vegetables", "Dairy", "Bakery"];

const ProductFilters = ({
  category,
  onCategoryChange,
  sort,
  onSortChange,
  search,
  onSearchChange
}: ProductFiltersProps) => {
  const activeCategory = category || "All";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      <aside className="w-full lg:w-60">
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Categories
          </div>
          <div className="space-y-1.5 p-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  onCategoryChange(cat === "All" ? undefined : cat)
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-xs font-medium transition",
                  activeCategory === cat
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <div className="h-8 w-8 overflow-hidden rounded-xl">
                  {cat === "All" ? (
                    <div className="h-full w-full bg-gradient-to-br from-primary-100 to-emerald-200" />
                  ) : (
                    <img
                      src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Fruits}
                      alt={cat}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex-1 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search organic apples, cold-pressed juices, snacks..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 sm:max-w-md"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort by</span>
            <Select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-10 text-xs"
            >
              <option value="popular">Most popular</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to high</option>
              <option value="price_desc">Price: High to low</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

