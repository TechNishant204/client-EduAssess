// src/pages/DashboardPage.jsx
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

const DashboardPage = () => {
  const { currentUser } = useContext(AuthContext);
  // console.log("Current User:", currentUser); // Debugging line
  // console.log("Dashboard Page Rendered"); // Debugging line
  return currentUser?.role === "admin" ? (
    <AdminDashboard />
  ) : (
    <StudentDashboard />
  );
};

export default DashboardPage;
