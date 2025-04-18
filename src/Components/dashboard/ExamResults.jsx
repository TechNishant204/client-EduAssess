import React from "react";

const ExamResults = ({ loading, results }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Results</h2>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No results available for this exam yet.
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {results.map((result) => (
              <div
                key={result._id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {result.student?.name || "Unknown Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.student?.email || ""}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      result.isPassed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.isPassed ? "PASSED" : "FAILED"}
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          result.isPassed ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${result.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {result.totalScore || 0} pts ({result.percentage || 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResults;
