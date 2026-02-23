import { Product } from "@utils/types";
import ProductCard from "./ProductCard";
import Skeleton from "@components/ui/skeleton";

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
  isError: boolean;
}

const ProductGrid = ({ products, isLoading, isError }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-sm font-semibold text-slate-900">
          We couldn't fetch your groceries right now.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Please check your connection or try again in a moment.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="glass-panel px-6 py-10 text-center text-sm text-slate-500">
        No products match your filters. Try adjusting your search or category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

