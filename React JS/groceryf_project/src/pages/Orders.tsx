import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import PageTransition from "@components/layout/PageTransition";
import OrderCard from "@components/order/OrderCard";
import OrderDetailsModal from "@components/order/OrderDetailsModal";
import Spinner from "@components/ui/spinner";
import { getOrdersApi } from "@api/order.api";
import { Order } from "@utils/types";
import { toast } from "sonner";

const Orders = () => {
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrdersApi,
    refetchInterval: 2000 // Poll every 2 seconds for real-time updates
  });

  const [openOrder, setOpenOrder] = useState<Order | null>(null);

  // Auto-open order details if orderId in URL
  useEffect(() => {
    if (orderIdParam && data) {
      const order = data.find(o => o.id === parseInt(orderIdParam));
      if (order) {
        setOpenOrder(order);
      }
    }
  }, [orderIdParam, data]);

  // Real-time status updates
  useEffect(() => {
    if (!data) return;

    const statusMessages: Record<string, string> = {
      PAID: "💰 Payment confirmed! Your order is being prepared.",
      SHIPPED: "🚚 Order shipped! Your groceries are on the way.",
      DELIVERED: "✅ Order delivered! Enjoy your fresh groceries!"
    };

    data.forEach(order => {
      const status = order.status;
      if (status !== "PLACED" && statusMessages[status]) {
        // Show toast for status changes (only once per status)
        const statusKey = `order_${order.id}_${status}`;
        if (!sessionStorage.getItem(statusKey)) {
          toast.success(`Order #${order.id}: ${statusMessages[status]}`);
          sessionStorage.setItem(statusKey, "true");
        }
      }
    });
  }, [data]);

  // Refetch orders periodically for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }, 2000);

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <PageTransition>
      <section className="section">
        <div className="container-wide space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="section-title text-xl">Your orders</h1>
                <p className="section-subtitle">
                  Track your grocery journeys from warehouse to doorstep.
                </p>
              </div>
              {data && data.length > 0 && (
                <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Live tracking
                </div>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Spinner />
            </div>
          )}

          {isError && (
            <div className="glass-panel px-6 py-10 text-center text-sm text-slate-600">
              We couldn't load your orders right now. Please refresh in a bit.
            </div>
          )}

          {!isLoading && !isError && (!data || data.length === 0) && (
            <div className="glass-panel px-6 py-10 text-center text-sm text-slate-600">
              No orders yet. Your first ultra-fast delivery is just a few taps
              away.
            </div>
          )}

          {data && data.length > 0 && (
            <div className="space-y-3">
              {data.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onOpenDetails={() => setOpenOrder(order)}
                />
              ))}
            </div>
          )}

          <OrderDetailsModal
            open={!!openOrder}
            onClose={() => setOpenOrder(null)}
            order={openOrder}
          />
        </div>
      </section>
    </PageTransition>
  );
};

export default Orders;

