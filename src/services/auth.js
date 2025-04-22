// src/services/auth.js
import api from "./api";

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      // console.log("Registration response from auth.js:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      // console.log("Login response from auth.js:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // console.log("Logging out...");
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      // console.log("Forgot password response from auth.js:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to send reset email" };
    }
  },

  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/auth/reset-password/${token}`);
      // console.log("Verify reset token response from auth.js:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Invalid or expired token" };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/`, {
        password,
      });
      // console.log("Reset password response from auth.js:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error resetting password inside auth.js:", error);
      throw error.response?.data || { message: "Failed to reset password" };
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    // console.log("current User from auth.js", user);
    return user ? JSON.parse(user) : null;
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put("/auth/update-profile", userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const currentUser = authService.getCurrentUser();
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, ...response.data })
      );
      // console.log("current User from auth.js", currentUser);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update profile" };
    }
  },
};
