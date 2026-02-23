import { api } from "./axios";
import { CartItem } from "@utils/types";

export const getCartApi = async (): Promise<CartItem[]> => {
  try {
    const { data } = await api.get<CartItem[]>("/api/cart");
    return data;
  } catch (error: any) {
    console.warn("API error, cart managed locally:", error.message);
    // Cart is managed locally via Zustand, so return empty array
    return [];
  }
};

export const syncCartApi = async (items: CartItem[]): Promise<CartItem[]> => {
  try {
    const { data } = await api.post<CartItem[]>("/api/cart", { items });
    return data;
  } catch (error: any) {
    console.warn("API error, cart managed locally:", error.message);
    // Return items as-is since cart is managed locally
    return items;
  }
};

