import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@utils/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { user: User; token: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Initialize from localStorage on mount
      const token = localStorage.getItem("freshcart_token");
      const stored = localStorage.getItem("freshcart_auth");
      let initialUser = null;
      let initialAuth = false;
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.state?.user && parsed.state?.token) {
            initialUser = parsed.state.user;
            initialAuth = true;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      return {
        user: initialUser,
        token: token || null,
        isAuthenticated: initialAuth && !!token,
        setAuth: ({ user, token }) => {
          localStorage.setItem("freshcart_token", token);
          set({ user, token, isAuthenticated: true });
        },
        clearAuth: () => {
          localStorage.removeItem("freshcart_token");
          localStorage.removeItem("freshcart_auth");
          set({ user: null, token: null, isAuthenticated: false });
        }
      };
    },
    {
      name: "freshcart_auth"
    }
  )
);

