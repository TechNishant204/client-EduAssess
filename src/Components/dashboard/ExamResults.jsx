import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi";
export default function ExamResultsPage({ results, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="ml-2">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Exam Results</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mt-2 sm:mt-0">
            {results?.length || 0} submissions
          </span>
        </div>
      </div>

      {!results || results.length === 0 ? (
        <div className="text-center py-12">
          <HiOutlineDocumentText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No exam results available yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {results.map((result) => (
            <div
              key={result._id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-medium mr-2">
                    {result.student?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {result.student?.name}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {result.student?.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-gray-500 text-xs mb-1">Submitted</p>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {formatDateShort(result.submittedAt)}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {formatTime(result.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge isPassed={result.isPassed} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ScoreCard
                  label="Total Score"
                  value={`${result.totalScore} points`}
                />
                <ScoreCard
                  label="Percentage"
                  value={`${Math.round(result.percentage)}%`}
                  bgColor={getPercentageColor(result.percentage)}
                />
                <ScoreCard
                  label="Result"
                  value={result.isPassed ? "Passed" : "Failed"}
                  textColor={
                    result.isPassed ? "text-green-600" : "text-red-600"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ isPassed }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        isPassed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isPassed ? "PASSED" : "FAILED"}
    </span>
  );
};

const ScoreCard = ({
  label,
  value,
  bgColor = "bg-gray-100",
  textColor = "text-gray-800",
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-3 text-center`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`font-semibold ${textColor}`}>{value}</p>
    </div>
  );
};

// Helper function to get color based on percentage
const getPercentageColor = (percentage) => {
  if (percentage >= 80) return "bg-green-100";
  if (percentage >= 60) return "bg-blue-100";
  if (percentage >= 40) return "bg-yellow-100";
  return "bg-red-100";
};

// Helper function to format date in "Apr 22, 2025" format
const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper function to format time in "12:34 AM" format
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
