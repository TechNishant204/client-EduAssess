// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Set auth token header
          api.defaults.headers.Authorization = `Bearer ${token}`; // Ensure token is set

          // Fetch current user from the /api/auth/me endpoint
          const response = await api.get("/auth/me");
          if (response.data.status === "success") {
            setCurrentUser(response.data.data.user);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Authentication error:", err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.status !== "success") {
        throw new Error("Login failed: " + response.data.message);
      }

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
    } catch (err) {
      throw new Error("Login failed: " + err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Remove auth header
    delete api.defaults.headers.Authorization;
    setCurrentUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.status === "success") {
        // Note: Your register endpoint doesn't return a token,
        // so the user would need to log in after registration

        return response.data.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, error, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
