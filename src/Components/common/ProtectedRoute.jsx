// src/Components/common/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
