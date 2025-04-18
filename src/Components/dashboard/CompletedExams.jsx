import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const CompletedExams = () => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      if (currentUser?.id) {
        try {
          setLoading(true);
          const response = await examService.getCompletedExams(currentUser.id);
          setExams(response.data || []);
        } catch (err) {
          setError("Failed to load completed exams.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExams();
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Completed Exams</h2>
      {exams.length === 0 ? (
        <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
          <p className="text-lg">No completed exams yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {exams.map(({ exam, result }) => (
            <div
              key={result._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {exam.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.isPassed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.isPassed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <p>
                    <span className="font-medium">Score:</span>{" "}
                    {result.totalScore}/{exam.totalMarks}
                  </p>
                  <p>
                    <span className="font-medium">Percentage:</span>{" "}
                    {result.percentage}%
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {exam.duration} mins
                  </p>
                  <p>
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Link
                to={`/student/results/${result._id}`}
                className="inline-block px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
              >
                View Report
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedExams;
