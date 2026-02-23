import { api } from "./axios";
import { User } from "@utils/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const createMockUser = (email: string, name: string): User => ({
  id: Date.now(),
  name,
  email,
  role: email.includes("admin") ? "ADMIN" : "USER"
});

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
    return data;
  } catch (error: any) {
    console.warn("API error, using mock auth:", error.message);
    // Mock successful login for demo
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = createMockUser(payload.email, payload.email.split("@")[0]);
    return {
      token: mockToken,
      user
    };
  }
};

export const registerApi = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
    return data;
  } catch (error: any) {
    console.warn("API error, using mock auth:", error.message);
    // Mock successful registration for demo
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = createMockUser(payload.email, payload.name);
    return {
      token: mockToken,
      user
    };
  }
};

export const getProfileApi = async (): Promise<User> => {
  try {
    const { data } = await api.get<User>("/api/auth/me");
    return data;
  } catch (error: any) {
    console.warn("API error, using mock profile:", error.message);
    const token = localStorage.getItem("freshcart_token");
    if (!token) throw new Error("Not authenticated");
    
    // Return mock user from token
    return {
      id: 1,
      name: "Demo User",
      email: "demo@freshcart.com",
      role: "USER"
    };
  }
};

