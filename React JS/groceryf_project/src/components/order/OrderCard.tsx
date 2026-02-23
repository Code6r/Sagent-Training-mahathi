import { Order } from "@utils/types";
import { formatCurrency } from "@utils/currency";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
  order: Order;
  onOpenDetails: () => void;
}

const OrderCard = ({ order, onOpenDetails }: OrderCardProps) => {
  const firstItem = order.items[0];

  return (
    <button
      onClick={onOpenDetails}
      className="glass-panel flex w-full items-center gap-4 p-4 text-left transition hover:-translate-y-1"
    >
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl">
        <img
          src={firstItem.product.imageUrl}
          alt={firstItem.product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-900">
            Order #{order.id}
          </p>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="line-clamp-1 text-xs text-slate-500">
          {firstItem.product.name}
          {order.items.length > 1 && ` + ${order.items.length - 1} more`}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{new Date(order.createdAt).toLocaleString()}</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>
    </button>
  );
};

export default OrderCard;

