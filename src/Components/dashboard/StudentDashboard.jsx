// src/components/dashboard/StudentDashboard.jsx
import React, { useEffect } from "react";
import AvailableExams from "./AvailableExams";
import EnrolledExams from "./EnrolledExams";
import CompletedExams from "./CompletedExams";
import { useAuth } from "../../hooks/useAuth";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  console.log("Student Dashboard Page Rendered");
  console.log("Current User:", currentUser);
  useEffect(() => {
    document.title = "Student Dashboard | EduAssess";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          <span className="text-orange-600">My Tests</span>
          <span className="text-sm text-gray-600 ml-4 font-normal">
            Welcome back, {currentUser?.name || "Student"}
          </span>
        </h1>
        {currentUser && (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <AvailableExams />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <EnrolledExams />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <CompletedExams />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
