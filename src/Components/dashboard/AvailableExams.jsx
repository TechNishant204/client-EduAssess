import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";
import { useAuth } from "../../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailableExams = ({ onEnrollSuccess }) => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      if (currentUser?.id) {
        console.log("Fetching available exams for user:", currentUser.id);
        try {
          setLoading(true);
          const response = await examService.getAvailableExams(currentUser.id);
          setExams(response.data || []);
        } catch (err) {
          setError("Failed to load available exams.");
          console.error("Error fetching available exams:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExams();
  }, [currentUser]);

  const handleEnroll = async (examId) => {
    try {
      console.log("Enrolling in exam with ID:", typeof examId);
      setLoading(true);
      const response = await examService.enrollInExam(examId);

      // Check the response status from the controller
      if (response.status === "failed") {
        // Check specific error conditions
        if (response.active === false) {
          toast.error(
            response.message ||
              "Enrollment period has ended or exam is not active."
          );
        } else {
          toast.error(response.message || "Failed to enroll in exam.");
        }
      } else if (response.enrolled) {
        toast.info("You are already enrolled in this exam.");
      } else if (response.status === "success") {
        // Remove the enrolled exam from the available exams list
        setExams(exams.filter((exam) => exam._id !== examId));
        if (onEnrollSuccess) {
          onEnrollSuccess();
        }
        toast.success("Successfully enrolled in exam!");
      }
    } catch (err) {
      console.error("Error enrolling in exam:", err);

      // More specific error handling based on status codes
      if (err.response?.status === 404) {
        toast.error("Exam not found.");
      } else if (err.response?.status === 400) {
        toast.error(
          err.response.data?.message || "Invalid enrollment request."
        );
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="ml-2">Loading...</p>
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Available Exams
      </h2>
      {exams.length === 0 ? (
        <p className="text-gray-500">No available exams at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <p className="text-gray-700">{exam.title}</p>
              <p className="text-gray-500 text-sm mb-2">{exam.description}</p>
              <button
                onClick={() => handleEnroll(exam._id)}
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableExams;
