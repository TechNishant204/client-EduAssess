import React from "react";
import { HiOutlineChartBar } from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ExamAnalytics = ({ loading, analytics }) => {
  if (loading) {
    return (
      <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
        </div>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="border-t-4 border-orange-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics[0]) {
    return (
      <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
        </div>
        <div className="p-6 text-center h-64 flex flex-col justify-center">
          <HiOutlineChartBar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            No analytics data available for this exam.
          </p>
        </div>
      </div>
    );
  }

  const COLORS = ["#4CAF50", "#FF5722"]; // Green for passed, orange for failed
  const exam = analytics[0];

  // Extract data for charts (limit to top 5 scores for better readability)
  const barChartData = exam.detailedResults
    ? exam.detailedResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((result) => ({
          name: result.studentName.split(" ")[0], // Only first name for better display
          score: result.score,
        }))
    : [];

  const pieChartData = [
    { name: "Passed", value: exam.passedStudents || 0 },
    {
      name: "Failed",
      value: (exam.totalStudents || 0) - (exam.passedStudents || 0),
    },
  ];

  return (
    <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Exam Analytics</h2>
      </div>
      <div className="p-6">
        {/* Exam Stats Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-blue-800 uppercase">
              Students
            </h3>
            <p className="text-2xl font-bold text-blue-700">
              {exam.totalStudents || 0}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-green-800 uppercase">
              Pass Rate
            </h3>
            <p className="text-2xl font-bold text-green-700">
              {exam.passRate || 0}%
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-purple-800 uppercase">
              Avg Score
            </h3>
            <p className="text-2xl font-bold text-purple-700">
              {exam.averageScore || 0}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-amber-800 uppercase">
              Total Marks
            </h3>
            <p className="text-2xl font-bold text-amber-700">
              {exam.totalMarks || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pass/Fail Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Pass/Fail Distribution
            </h3>
            {exam.totalStudents > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} students`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-56">
                <p className="text-gray-500">
                  No students have taken this exam yet.
                </p>
              </div>
            )}
          </div>

          {/* Top Scores Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Top 5 Student Scores
            </h3>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, exam.totalMarks || 100]} />
                  <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                  <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-56">
                <p className="text-gray-500">No score data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamAnalytics;
