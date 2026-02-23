import { useState } from "react";
import PageTransition from "@components/layout/PageTransition";
import Label from "@components/ui/label";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Product } from "@utils/types";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "@api/product.api";
import Skeleton from "@components/ui/skeleton";
import { Trash2, Pencil } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(4),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().min(2)
});

type ProductFormValues = z.infer<typeof productSchema>;

const Admin = () => {
  const [editing, setEditing] = useState<Product | null>(null);
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products", "admin"],
    queryFn: () => getProductsApi()
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema)
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Placeholder: integrate with real backend endpoints for admin CRUD
      console.log("Admin product payload", values);
      toast.success(
        editing ? "Product updated (mocked)." : "Product created (mocked)."
      );
      reset();
      setEditing(null);
    } catch {
      toast.error("Unable to save product. Check your API integration.");
    }
  };

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1.1fr)]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-3xl bg-white/80 p-5 shadow-soft"
          >
            <h1 className="section-title text-xl">Admin • Products</h1>
            <p className="section-subtitle">
              Add, edit, and curate your high-converting grocery catalog.
            </p>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.price.message?.toString()}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="originalPrice">Original price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  {...register("originalPrice")}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register("category")} />
                {errors.category && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} />
              {errors.imageUrl && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" size="lg" loading={isSubmitting}>
                {editing ? "Update product" : "Add product"}
              </Button>
              {editing && (
                <Button
                  type="button"
                  size="md"
                  variant="ghost"
                  onClick={() => {
                    reset();
                    setEditing(null);
                  }}
                >
                  Cancel edit
                </Button>
              )}
            </div>
          </form>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Live catalog (read-only mock)
            </h2>
            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            )}
            {isError && (
              <div className="glass-panel px-5 py-8 text-sm text-slate-600">
                Unable to fetch products. Wire this to your admin product
                endpoint.
              </div>
            )}
            {data && (
              <div className="space-y-3">
                {data.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {product.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
                        onClick={() => {
                          setEditing(product);
                          reset({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            imageUrl: product.imageUrl,
                            category: product.category
                          });
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                        onClick={() =>
                          toast.info(
                            "Wire this delete action to your backend."
                          )
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Admin;

