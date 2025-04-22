import React, { useState } from "react";
import { examService } from "../../services/exam";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ExamTable = ({
  exams,
  loading,
  onCreateExam,
  onEditExam,
  onDeleteExam,
  onViewDetails,
  onRowClick,
}) => {
  const [questions, setQuestions] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  // Fetch questions for a specific exam
  const handleViewQuestions = async (examId) => {
    try {
      setSelectedExamId(examId);
      const questionsData = await examService.getQuestionsByExamId(examId);
      setQuestions(questionsData);
      toast.success(`Fetched ${questionsData.length} questions for the exam.`);
      navigate(`/admin/exams/${examId}/questions`);
    } catch (error) {
      toast.error("Failed to fetch questions for the exam.");
      console.error("Error fetching questions in the exam table:", error);
    }
  };

  // Format date string for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
      <div className="px-6 py-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold text-gray-800">Exams</h2>
        <button
          onClick={onCreateExam}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Exam
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : exams.length === 0 ? (
        <div className="p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
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
          <p className="mt-4 text-gray-600">No exams created yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Create your first exam to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr
                  key={exam._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRowClick(exam)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {exam.title
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ") || "Untitled"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {exam.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {exam.duration ? `${exam.duration} mins` : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(exam.startTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div
                      className="flex space-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onViewDetails(exam._id)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={loading}
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => onEditExam(exam)}
                        className="text-yellow-600 hover:text-yellow-800"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteExam(exam._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewQuestions(exam._id)}
                        className="text-green-600 hover:text-green-900"
                        disabled={loading}
                      >
                        Questions
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ExamTable;
