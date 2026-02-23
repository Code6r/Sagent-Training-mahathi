import { Heart, Plus } from "lucide-react";
import { Product } from "@utils/types";
import { formatCurrency } from "@utils/currency";
import { useCart } from "@hooks/useCart";
import Button from "@components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DEFAULT_PRODUCT_IMAGE } from "@utils/constants";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    addItem(product, 1);
    openCart();
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass-panel flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {discount && (
          <span className="badge-pill absolute left-3 top-3 bg-emerald-500 text-xs font-semibold text-white shadow-soft">
            {discount}% OFF
          </span>
        )}
        {!product.inStock && (
          <span className="badge-pill absolute right-3 top-3 bg-slate-900/80 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
        <button className="absolute right-3 bottom-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-rose-500">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link
          to={`/products/${product.id}`}
          className="line-clamp-2 text-sm font-semibold tracking-tight text-slate-900 hover:text-primary-600"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-slate-500">{product.category}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500">
            {product.inStock ? "In stock • Delivered in minutes" : "Check back soon"}
          </p>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="gap-1 whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;

