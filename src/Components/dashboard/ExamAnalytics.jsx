import React, { useState } from "react";
import { Bar } from "recharts";

const ExamAnalyticsDashboard = ({ loading, analytics }) => {
  const [selectedExam, setSelectedExam] = useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
        <p className="text-center mt-4 text-gray-500">
          Loading analytics data...
        </p>
      </div>
    );
  }

  if (!analytics || analytics.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mt-4">
            No Analytics Available
          </h3>
          <p className="text-gray-500 mt-2">
            No exam data has been found or recorded.
          </p>
        </div>
      </div>
    );
  }

  // Choose the first exam by default if none is selected
  const examToShow = selectedExam || analytics[0];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="space-y-6">
      {/* Exam Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Select Exam
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.map((exam) => (
            <div
              key={exam.examId}
              onClick={() => setSelectedExam(exam)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                examToShow.examId === exam.examId
                  ? "bg-indigo-50 border-2 border-indigo-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <h3 className="font-medium text-gray-800">{exam.examTitle}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {exam.totalStudents}{" "}
                {exam.totalStudents === 1 ? "student" : "students"} •{" "}
                {exam.totalMarks} marks
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Exam Overview */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {examToShow.examTitle} - Overview
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {examToShow.totalStudents || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Pass Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {examToShow.passRate || 0}%
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-800">
                {examToShow.averageScore || 0}/{examToShow.totalMarks || "?"}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Passed Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {examToShow.passedStudents || 0}
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600">Highest Score</p>
              <p className="text-2xl font-bold text-gray-800">
                {examToShow.highScore || 0}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Lowest Score</p>
              <p className="text-2xl font-bold text-gray-800">
                {examToShow.lowScore || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Details */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Exam Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-lg font-medium text-gray-800">
                {examToShow.duration} minutes
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Marks</p>
              <p className="text-lg font-medium text-gray-800">
                {examToShow.totalMarks || "N/A"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="text-lg font-medium text-gray-800">
                {formatDate(examToShow.startTime)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">End Time</p>
              <p className="text-lg font-medium text-gray-800">
                {formatDate(examToShow.endTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Results */}
      {examToShow.detailedResults && examToShow.detailedResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Student Results
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Student Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Score
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Percentage
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {examToShow.detailedResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {result.studentName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {result.studentEmail}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                        {result.score}/{examToShow.totalMarks}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {result.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.isPassed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.isPassed ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(result.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* No Students Message */}
      {(!examToShow.detailedResults ||
        examToShow.detailedResults.length === 0) &&
        examToShow.totalStudents === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mt-4">
                No Students Yet
              </h3>
              <p className="text-gray-500 mt-2">
                No students have taken this exam yet.
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default ExamAnalyticsDashboard;
