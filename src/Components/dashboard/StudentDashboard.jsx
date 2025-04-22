// src/components/dashboard/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import AvailableExams from "./AvailableExams";
import EnrolledExams from "./EnrolledExams";
import CompletedExams from "./CompletedExams";
import { useAuth } from "../../hooks/useAuth";

const StudentDashboard = () => {
  const [refreshEnrolledExams, setRefreshEnrolledExams] = useState(false);
  const { currentUser } = useAuth();
  // console.log("Student Dashboard Page Rendered");

  // console.log("Current User:", currentUser);
  useEffect(() => {
    document.title = "Student Dashboard | EduAssess";
  }, []);

  const handleRefreshEnrolledExams = () => {
    setRefreshEnrolledExams((prev) => !prev); // Toggle state to trigger refresh
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg-text-5xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2 sm:pb-4 flex flex-col sm:flex-row sm:items-center">
          <span className="text-orange-600 mb-2 sm:mb-0">My Tests</span>
          <span className="text-xs sm:text-sm text-gray-600 sm:ml-4 sm:mt-4 font-normal">
            Welcome back, {currentUser?.name || "Student"}
          </span>
        </h1>
        {currentUser && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
              <AvailableExams onEnrollSuccess={handleRefreshEnrolledExams} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
              <EnrolledExams refreshTrigger={refreshEnrolledExams} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
              <CompletedExams />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
