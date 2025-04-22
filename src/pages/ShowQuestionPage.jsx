import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "../services/exam";
import { toast } from "react-toastify";

const ShowQuestionPage = () => {
  const { examId } = useParams(); // Get examId from the URL
  const navigate = useNavigate(); // for navigation
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Questions | EduAssess";
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await examService.getQuestionsByExamId(examId);
      setQuestions(questionsData);
    } catch (err) {
      setError("Failed to load questions for this exam.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mx-auto max-w-2xl mt-6">
        <p>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center mx-auto max-w-2xl mt-6">
        <p>No questions found for this exam.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
            <button
              onClick={() => navigate(-1)}
              className="ml-4 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>

          <div className="divide-y">
            {questions.map((question, index) => (
              <div key={question._id} className="py-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {index + 1}. {question.text}
                </h2>
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700">Options:</h4>
                  <ul className="list-disc list-inside mt-2">
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`${
                          option === question.correctAnswer
                            ? "text-green-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShowQuestionPage;
