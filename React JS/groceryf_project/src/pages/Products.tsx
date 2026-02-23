import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@components/layout/PageTransition";
import ProductFilters from "@components/product/ProductFilters";
import ProductGrid from "@components/product/ProductGrid";
import { getProductsApi } from "@api/product.api";
import { Product } from "@utils/types";

const Products = () => {
  const [category, setCategory] = useState<string | undefined>();
  const [sort, setSort] = useState<string>("popular");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products", { category, sort, search }],
    queryFn: () =>
      getProductsApi({
        category,
        sort: sort as any,
        search: search || undefined
      })
  });

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide space-y-5">
          <div className="flex flex-col gap-1">
            <h1 className="section-title">Shop everything in one place</h1>
            <p className="section-subtitle">
              Ultra-fast grocery delivery with a premium, cinematic browsing
              experience.
            </p>
          </div>

          <ProductFilters
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            search={search}
            onSearchChange={setSearch}
          />

          <ProductGrid products={data} isLoading={isLoading} isError={isError} />
        </div>
      </section>
    </PageTransition>
  );
};

export default Products;

