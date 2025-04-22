import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";
import { useAuth } from "../../hooks/useAuth";
import ExamDetailsModal from "../../Components/dashboard/ExamDetailsModal";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineClock } from "react-icons/hi";

const EnrolledExams = ({ refreshTrigger }) => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledExams = async () => {
      if (currentUser?.id) {
        try {
          setLoading(true);
          const response = await examService.getEnrolledExams(currentUser._id);
          setExams(response.data || []);
        } catch (err) {
          setError("Failed to load enrolled exams.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEnrolledExams();
  }, [currentUser, refreshTrigger]);

  const handleStartExam = async (examId) => {
    try {
      console.log("Starting exam with ID:", examId); // Add this log to verify the examId
      const response = await examService.startExam(examId); // Call the start exam API
      const { alreadyGiven } = response.data;

      if (alreadyGiven) {
        toast.info("You Have Already Taken The Assessment.");
      } else {
        navigate(`/student/start-exam/${examId}`);
      }
    } catch (error) {
      console.error("Error starting exam:", error); // Log the error for debugging
      toast.error("Failed to start the exam. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3">Loading enrolled exams...</p>
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-1 md:p-6 lg:p-8 bg-white rounded-lg shadow-md">
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
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                  <p className="flex items-center">
                    <HiOutlineClock className="w-4 h-4 mr-2" />
                    <span className="font-medium">Date : </span>{" "}
                    {new Date(exam.startTime).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="flex items-center ml-6">
                    <span className="font-medium">Time : </span>{" "}
                    {new Date(exam.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="flex-1 px-4 py-2  bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleStartExam(exam._id)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Start Exam
                  </button>
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
