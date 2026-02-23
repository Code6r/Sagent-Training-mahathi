import Badge from "@components/ui/badge";
import { OrderStatus } from "@utils/types";

interface Props {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: Props) => {
  const map: Record<OrderStatus, { label: string; variant: any }> = {
    PLACED: { label: "Placed", variant: "info" },
    PAID: { label: "Paid", variant: "success" },
    SHIPPED: { label: "On the way", variant: "warning" },
    DELIVERED: { label: "Delivered", variant: "success" }
  };

  const meta = map[status];

  return (
    <Badge variant={meta.variant} className="text-[11px]">
      {meta.label}
    </Badge>
  );
};

export default OrderStatusBadge;

