import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@components/layout/PageTransition";
import ProductGallery from "@components/product/ProductGallery";
import Button from "@components/ui/button";
import { getProductByIdApi, getProductsApi } from "@api/product.api";
import { Product } from "@utils/types";
import { useCart } from "@hooks/useCart";
import { formatCurrency } from "@utils/currency";
import ProductCard from "@components/product/ProductCard";
import Skeleton from "@components/ui/skeleton";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, openCart } = useCart();

  const {
    data: product,
    isLoading,
    isError
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductByIdApi(id!),
    enabled: !!id
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["products", "related", product?.category],
    queryFn: () =>
      getProductsApi({
        category: product?.category
      }),
    enabled: !!product?.category
  });

  const handleAdd = () => {
    if (!product) return;
    addItem(product);
    openCart();
  };

  if (isLoading || !product) {
    return (
      <PageTransition>
        <section className="section">
          <div className="container-wide grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <Skeleton className="h-80" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  if (isError) {
    return (
      <PageTransition>
        <section className="section">
          <div className="container-wide">
            <div className="glass-panel px-6 py-10 text-center">
              <p className="text-sm font-semibold text-slate-900">
                We couldn't load this product.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Please refresh the page or try again later.
              </p>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <ProductGallery product={product} />
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="text-sm text-slate-500">{product.category}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discount && (
                <span className="badge-pill bg-emerald-50 text-xs font-semibold text-emerald-700">
                  Save {discount}%
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
            <div className="rounded-3xl bg-gradient-to-r from-primary-50 via-white to-emerald-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">
                Sourced fresh every morning.
              </p>
              <p className="mt-1">
                Temperature-controlled storage and last-mile delivery to lock
                in the ideal texture, crunch, and aroma.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="lg" onClick={handleAdd} disabled={!product.inStock}>
                Add to cart
              </Button>
              <p className="text-xs text-slate-500">
                {product.inStock
                  ? "Delivered in 10–20 minutes."
                  : "Temporarily unavailable in your area."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="section pt-0">
          <div className="container-wide space-y-4">
            <h2 className="section-title text-lg">You may also like</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
};

export default ProductDetails;

