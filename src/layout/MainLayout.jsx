// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Components/common/Navbar";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  // console.log("MainLayout Rendered"); // Debugging line
  // console.log("Current User from main layout:", currentUser); // Debugging line
  const handleLogout = () => {
    logout();
    toast("Logged out successfully", {
      type: "success",
    });
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <Outlet /> {/* Renders the child route component */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
