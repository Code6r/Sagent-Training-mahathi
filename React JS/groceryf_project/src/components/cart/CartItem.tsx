import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@utils/types";
import { useCart } from "@hooks/useCart";
import { formatCurrency } from "@utils/currency";

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="line-clamp-2 text-xs font-semibold text-slate-900">
              {item.product.name}
            </p>
            <p className="text-[11px] text-slate-500">
              {item.product.category}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="rounded-full p-1 text-slate-300 hover:bg-slate-100 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-white"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-slate-900">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-white"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {formatCurrency(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;

