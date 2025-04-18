import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ExamProvider } from "./contexts/ExamContext";
import Home from "./pages/HomePage";
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import ForgotPassword from "./Components/auth/ForgotPassword";
import ResetPassword from "./Components/auth/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import ResultPage from "./pages/ResultPage";
import ExamPage from "./pages/ExamPage";
import StartExamPage from "./Components/exam/StartExamPage";
import Result from "./Components/exam/Result";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import Navbar from "./Components/common/Navbar";

// Public Layout with Navbar
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Custom component to handle initial auth check and role-based redirection
const AppContent = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <p className="text-center align-items-center">Loading...</p>;
  }

  return (
    <Routes>
      {/* Public Routes with Navbar */}
      <Route
        path="/login"
        element={
          !currentUser ? (
            <PublicLayout>
              <Login />
            </PublicLayout>
          ) : currentUser.role === "admin" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/student/dashboard" replace />
          )
        }
      />
      <Route
        path="/signup"
        element={
          !currentUser ? (
            <PublicLayout>
              <Signup />
            </PublicLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicLayout>
            <ForgotPassword />
          </PublicLayout>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicLayout>
            <ResetPassword />
          </PublicLayout>
        }
      />
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      {/* Protected Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["student", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/start-exam/:examId"
          element={
            <ProtectedRoute roles={["student"]}>
              <StartExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exam/:examId"
          element={
            <ProtectedRoute roles={["student"]}>
              <ExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <ProtectedRoute roles={["student"]}>
              <ResultPage />
            </ProtectedRoute>
          }
        >
          <Route path=":resultId" element={<Result />} />
        </Route>
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ExamProvider>
        <AppContent />
      </ExamProvider>
    </AuthProvider>
  );
};

export default App;
