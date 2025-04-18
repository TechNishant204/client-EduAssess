// src/components/dashboard/EnrolledExams.jsx
import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";
import { useAuth } from "../../hooks/useAuth";
import ExamDetailsModal from "./ExamDetailsModal";
import { Link } from "react-router-dom";

const EnrolledExams = () => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  console.log("Enrolled Exams Rendered");
  console.log("currentUser", currentUser);

  useEffect(() => {
    const fetchExams = async () => {
      if (currentUser?.id) {
        console.log("Fetching enrolled exams for user:", currentUser._id);
        try {
          setLoading(true);
          const response = await examService.getEnrolledExams(currentUser._id);
          console.log("Enrolled exams response:", response);
          setExams(response.data || []);
        } catch (err) {
          console.error("Error fetching enrolled exams:", err);
          setError("Failed to load enrolled exams.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExams();
  }, []);

  if (loading) return <p>Loading enrolled exams...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Enrolled Exams
      </h2>
      {exams.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No enrolled exams available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {exam.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {new Date(exam.startTime).toLocaleString()}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <Link
                    to={`/student/start-exam/${exam._id}`}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium text-center"
                  >
                    Start Exam
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ExamDetailsModal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        exam={selectedExam}
      />
    </div>
  );
};

export default EnrolledExams;
