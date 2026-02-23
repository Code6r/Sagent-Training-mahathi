import Modal from "@components/ui/modal";
import { Order, OrderStatus } from "@utils/types";
import { formatCurrency } from "@utils/currency";
import OrderStatusBadge from "./OrderStatusBadge";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrderByIdApi } from "@api/order.api";

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const getStatusProgress = (status: OrderStatus): number => {
  const statusMap: Record<OrderStatus, number> = {
    PLACED: 25,
    PAID: 50,
    SHIPPED: 75,
    DELIVERED: 100
  };
  return statusMap[status] || 0;
};

const getStatusSteps = (status: OrderStatus) => {
  const steps = [
    { key: "PLACED", label: "Order Placed", icon: Package },
    { key: "PAID", label: "Payment Confirmed", icon: CheckCircle },
    { key: "SHIPPED", label: "Out for Delivery", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle }
  ];
  
  const currentIndex = steps.findIndex(s => s.key === status);
  
  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    current: index === currentIndex
  }));
};

const OrderDetailsModal = ({ open, onClose, order: initialOrder }: Props) => {
  // Real-time order updates
  const { data: order } = useQuery({
    queryKey: ["order", initialOrder?.id],
    queryFn: () => getOrderByIdApi(initialOrder!.id),
    enabled: !!initialOrder && open,
    refetchInterval: 2000 // Poll every 2 seconds
  });

  const currentOrder = order || initialOrder;
  if (!currentOrder) return null;

  const progress = getStatusProgress(currentOrder.status);
  const steps = getStatusSteps(currentOrder.status);

  return (
    <Modal open={open} onClose={onClose} title={`Order #${currentOrder.id}`}>
      <div className="space-y-4 text-sm text-slate-700">
        {/* Real-time Tracking */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Delivery Status
              </p>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            </div>
            <OrderStatusBadge status={currentOrder.status} />
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Status Steps */}
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center gap-1 text-center ${
                    step.completed ? "text-primary-600" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                      step.completed
                        ? "bg-primary-500 text-white shadow-soft"
                        : "bg-slate-100"
                    } ${step.current ? "ring-2 ring-primary-300 ring-offset-2" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-medium">{step.label}</p>
                </div>
              );
            })}
          </div>
          
          {currentOrder.status === "DELIVERED" && (
            <p className="mt-3 text-center text-xs font-semibold text-emerald-600">
              ✅ Your order has been delivered!
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Items
          </p>
          <div className="mt-2 space-y-2">
            {currentOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="flex-1">
                  {item.quantity} × {item.product.name}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Delivery address
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {currentOrder.address.fullName}
            <br />
            {currentOrder.address.street}
            <br />
            {currentOrder.address.city}, {currentOrder.address.state}{" "}
            {currentOrder.address.postalCode}
            <br />
            {currentOrder.address.phone}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(currentOrder.total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery</span>
            <span className="text-emerald-600">Free</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm font-semibold text-slate-900">
            <span>Total paid</span>
            <span>{formatCurrency(currentOrder.total)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;

