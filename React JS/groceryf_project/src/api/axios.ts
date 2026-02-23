import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("freshcart_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on 401
      localStorage.removeItem("freshcart_token");
      const authStore = require("@store/auth.store").useAuthStore;
      authStore.getState().clearAuth();
    }
    // Don't reject - let individual APIs handle fallbacks
    return Promise.reject(error);
  }
);

