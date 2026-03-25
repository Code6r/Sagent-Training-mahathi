import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Provided backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optionally attach interceptors for auth tokens here in the future
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
