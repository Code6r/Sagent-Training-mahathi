export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  rating?: number;
  tags?: string[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export type OrderStatus = "PLACED" | "PAID" | "SHIPPED" | "DELIVERED";

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export type PaymentMethod = "CARD" | "UPI" | "COD";

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: Address;
  paymentMethod: PaymentMethod;
}

