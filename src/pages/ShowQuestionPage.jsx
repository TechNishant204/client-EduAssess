import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "../services/exam";
import { toast } from "react-toastify";

const ShowQuestionPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mx-4 md:mx-auto max-w-2xl mt-6">
        <p>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-gray-100 text-gray-600 p-4 rounded-lg text-center mx-4 md:mx-auto max-w-2xl mt-6">
        <p>No questions found for this exam.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-3 md:p-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Questions
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 sm:mt-0 sm:ml-4 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>

          <div className="divide-y">
            {questions.map((question, index) => (
              <div key={question._id} className="py-3 md:py-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  {index + 1}. {question.text}
                </h2>
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700 text-sm md:text-base">
                    Options:
                  </h4>
                  <ul className="list-disc list-inside mt-2">
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`text-sm md:text-base ${
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
                  <p className="text-xs md:text-sm text-gray-500">
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
