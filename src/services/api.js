import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000/api";

// Every API request automatically includes authentication details, eliminating the need to manually attach tokens for each request.
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Fetches the authentication token from the browser's localStorage.
    const token = localStorage.getItem("token");

    // If a token exists, it is added to the Authorization header with the Bearer scheme,
    // a common convention for JWT (JSON Web Token) authentication.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
