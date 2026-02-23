import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@utils/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          });
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            product,
            quantity
          };
          set({ items: [...get().items, newItem] });
        }
      },
      removeItem: (id) =>
        set({
          items: get().items.filter((item) => item.id !== id)
        }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items
            .map((item) =>
              item.id === id ? { ...item, quantity } : item
            )
            .filter((item) => item.quantity > 0)
        }),
      clearCart: () => set({ items: [] })
    }),
    {
      name: "freshcart_cart"
    }
  )
);

