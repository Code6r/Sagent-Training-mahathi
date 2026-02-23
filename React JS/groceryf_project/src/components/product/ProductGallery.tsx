import { Product } from "@utils/types";
import { DEFAULT_PRODUCT_IMAGE } from "@utils/constants";
import { motion } from "framer-motion";

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const mainImage = product.imageUrl || DEFAULT_PRODUCT_IMAGE;

  return (
    <div className="space-y-3">
      <motion.div
        className="glass-panel overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={mainImage}
          alt={product.name}
          className="h-72 w-full object-cover sm:h-80 lg:h-96"
        />
      </motion.div>
      <div className="flex gap-2 overflow-x-auto">
        {[mainImage, mainImage, mainImage].map((img, idx) => (
          <button
            key={idx}
            className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100"
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

