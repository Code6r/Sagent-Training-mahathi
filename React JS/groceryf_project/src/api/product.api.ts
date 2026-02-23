import { api } from "./axios";
import { Product } from "@utils/types";
import { MOCK_PRODUCTS } from "@utils/mockData";

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "popular";
}

export const getProductsApi = async (
  filters?: ProductFilters
): Promise<Product[]> => {
  try {
    const { data } = await api.get<Product[]>("/api/products", {
      params: filters
    });
    return data;
  } catch (error: any) {
    console.warn("API error, using mock data:", error.message);
    let products = [...MOCK_PRODUCTS];
    
    // Apply filters
    if (filters?.category && filters.category !== "All") {
      products = products.filter(p => 
        p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (filters?.sort) {
      switch (filters.sort) {
        case "price_asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          products.sort((a, b) => b.id - a.id);
          break;
        case "popular":
          products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }
    
    return products;
  }
};

export const getProductByIdApi = async (id: string): Promise<Product> => {
  try {
    const { data } = await api.get<Product>(`/api/products/${id}`);
    return data;
  } catch (error: any) {
    console.warn("API error, using mock data:", error.message);
    const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
    if (product) return product;
    throw new Error("Product not found");
  }
};

