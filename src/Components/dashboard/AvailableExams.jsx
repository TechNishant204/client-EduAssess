import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";
import { useAuth } from "../../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailableExams = () => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Available Exams Rendered");
  console.log("currentUser", currentUser);
  useEffect(() => {
    const fetchExams = async () => {
      if (currentUser?.id) {
        console.log("Fetching available exams for user:", currentUser._id);
        try {
          setLoading(true);
          const response = await examService.getAvailableExams(currentUser._id);
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
  }, []);

  const handleEnroll = async (examId) => {
    try {
      const result = await examService.enrollInExam(examId);
      if (result.enrolled) {
        toast.info("You are already enrolled in this exam.");
      } else {
        setExams(exams.filter((exam) => exam._id !== examId));
        toast.success("You are enrolled in the exam!");
      }
    } catch (err) {
      console.error("Error enrolling in exam:", err);
      setError("Failed to enroll in exam.");
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setError(null);
    }
  };

  if (loading) return <p>Loading available exams...</p>;
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
