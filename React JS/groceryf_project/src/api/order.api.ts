import { api } from "./axios";
import { Address, Order, PaymentMethod } from "@utils/types";
import { createMockOrder, getMockOrders, updateOrderStatus } from "@utils/mockData";
import { useCartStore } from "@store/cart.store";

export interface CreateOrderPayload {
  address: Address;
  paymentMethod: PaymentMethod;
}

export const getOrdersApi = async (): Promise<Order[]> => {
  try {
    const { data } = await api.get<Order[]>("/api/orders");
    return data;
  } catch (error: any) {
    console.warn("API error, using mock orders:", error.message);
    return getMockOrders();
  }
};

export const getOrderByIdApi = async (id: number): Promise<Order> => {
  try {
    const { data } = await api.get<Order>(`/api/orders/${id}`);
    return data;
  } catch (error: any) {
    console.warn("API error, using mock order:", error.message);
    const orders = getMockOrders();
    const order = orders.find(o => o.id === id);
    if (order) return order;
    throw new Error("Order not found");
  }
};

export const createOrderApi = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  try {
    const { data } = await api.post<Order>("/api/orders", payload);
    return data;
  } catch (error: any) {
    console.warn("API error, using mock order creation:", error.message);
    // Get cart items from store
    const cartItems = useCartStore.getState().items;
    
    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    
    // Create mock order
    const order = createMockOrder(cartItems, payload.address, payload.paymentMethod);
    
    // Simulate payment processing
    setTimeout(() => {
      updateOrderStatus(order.id, "PAID");
    }, 1000);
    
    // Simulate shipping after payment
    setTimeout(() => {
      updateOrderStatus(order.id, "SHIPPED");
    }, 3000);
    
    // Simulate delivery
    setTimeout(() => {
      updateOrderStatus(order.id, "DELIVERED");
    }, 8000);
    
    return order;
  }
};

export const simulateOrderStatusUpdate = (
  orderId: number,
  onUpdate: (status: string) => void
) => {
  const statuses: Array<{ status: string; delay: number }> = [
    { status: "PAID", delay: 1000 },
    { status: "SHIPPED", delay: 3000 },
    { status: "DELIVERED", delay: 8000 }
  ];
  
  statuses.forEach(({ status, delay }) => {
    setTimeout(() => {
      updateOrderStatus(orderId, status as any);
      onUpdate(status);
    }, delay);
  });
};

