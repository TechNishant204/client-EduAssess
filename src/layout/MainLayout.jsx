// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Components/common/Navbar";
import Footer from "../Components/common/Footer";
import { useAuth } from "../hooks/useAuth";

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  console.log("MainLayout Rendered"); // Debugging line
  console.log("Current User:", currentUser); // Debugging line
  const handleLogout = () => {
    logout();
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
