import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ExamProvider } from "./contexts/ExamContext";
import Navbar from "./Components/common/Navbar";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

// Lazy load components
const Home = React.lazy(() => import("./pages/HomePage"));
const Login = React.lazy(() => import("./Components/auth/Login"));
const Signup = React.lazy(() => import("./Components/auth/Signup"));
import NotFound from "./Components/common/NotFound";
const ForgotPassword = React.lazy(() =>
  import("./Components/auth/ForgotPassword")
);
const ResetPassword = React.lazy(() =>
  import("./Components/auth/ResetPassword")
);
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ResultPage = React.lazy(() => import("./pages/ResultPage"));
const ExamPage = React.lazy(() => import("./pages/ExamPage"));
const StartExamPage = React.lazy(() =>
  import("./Components/exam/StartExamPage")
);
const Result = React.lazy(() => import("./Components/exam/Result"));
const AdminDashboard = React.lazy(() =>
  import("./components/dashboard/AdminDashboard")
);
const StudentDashboard = React.lazy(() =>
  import("./components/dashboard/StudentDashboard")
);
const ExamQuestionsPage = React.lazy(() => import("./pages/ExamQuestionPage"));
const ShowQuestionPage = React.lazy(() => import("./pages/ShowQuestionPage"));

// Loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mr-2"></div>
    <p className="text-lg font-medium">Loading...</p>
  </div>
);

// Public Layout with Navbar
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </>
  );
};

// Public routes definition
const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
    authCheck: true, // Will be checked for auth redirection
  },
  {
    path: "/signup",
    element: <Signup />,
    authCheck: true, // Will be checked for auth redirection
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
];

// Student routes definition
const studentRoutes = [
  {
    path: "/student/dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "/student/start-exam/:examId",
    element: <StartExamPage />,
  },
  {
    path: "/student/exam/:examId",
    element: <ExamPage />,
  },
  {
    path: "/student/results",
    element: <ResultPage />,
    children: [
      {
        path: ":resultId",
        element: <Result />,
      },
    ],
  },
];

// Admin routes definition
const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/exams/:examId/questions",
    element: <ExamQuestionsPage />,
  },
  {
    path: "/admin/exams/:examId/show-questions",
    element: <ShowQuestionPage />,
  },
];

// Shared routes accessible by both admin and student
const sharedRoutes = [
  {
    path: "/profile",
    element: <ProfilePage />,
  },
];

// Custom component to handle initial auth check and role-based redirection
const AppContent = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  // Function to render public routes
  const renderPublicRoutes = () => {
    return publicRoutes.map((route) => {
      // For routes that need auth checking
      if (route.authCheck) {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              !currentUser ? (
                <PublicLayout>{route.element}</PublicLayout>
              ) : currentUser.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            }
          />
        );
      }

      // For standard public routes
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicLayout>{route.element}</PublicLayout>}
        />
      );
    });
  };

  // Function to render student routes
  const renderStudentRoutes = () => {
    return studentRoutes.map((route) => {
      if (route.children) {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute roles={["student"]}>
                <Suspense fallback={<LoadingFallback />}>
                  {route.element}
                </Suspense>
              </ProtectedRoute>
            }
          >
            {route.children.map((childRoute) => (
              <Route
                key={childRoute.path}
                path={childRoute.path}
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    {childRoute.element}
                  </Suspense>
                }
              />
            ))}
          </Route>
        );
      }

      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute roles={["student"]}>
              <Suspense fallback={<LoadingFallback />}>
                {route.element}
              </Suspense>
            </ProtectedRoute>
          }
        />
      );
    });
  };

  // Function to render admin routes
  const renderAdminRoutes = () => {
    return adminRoutes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedRoute roles={["admin"]}>
            <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
          </ProtectedRoute>
        }
      />
    ));
  };

  // Function to render shared routes
  const renderSharedRoutes = () => {
    return sharedRoutes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedRoute roles={["student", "admin"]}>
            <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
          </ProtectedRoute>
        }
      />
    ));
  };

  return (
    <Routes>
      {/* Public Routes */}
      {renderPublicRoutes()}

      {/* Protected Routes inside MainLayout */}
      <Route element={<MainLayout />}>
        {/* Student Routes */}
        {renderStudentRoutes()}

        {/* Admin Routes */}
        {renderAdminRoutes()}

        {/* Shared Routes */}
        {renderSharedRoutes()}
      </Route>

      {/* Catch-all route for 404 - Updated to use NotFound component */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />
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
