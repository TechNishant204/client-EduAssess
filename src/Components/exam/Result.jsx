import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { resultService } from "../../services/resultService";
import { FiUser } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";

const Result = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await resultService.getResultById(resultId);
        // console.log("Result.jsx  getResultById data:", response.data);
        setResult(response.data);
      } catch (err) {
        setError("Failed to load result.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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

  if (!result) {
    return (
      <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center mx-auto max-w-2xl mt-6">
        <p>Result not found.</p>
      </div>
    );
  }

  // const timeTaken = Math.round(
  //   (new Date(result.submittedAt) - new Date(result.startTime)) / 60000
  // );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Report</h1>
            <button
              onClick={() => window.history.back()}
              className="ml-4 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>

          {/* User Info & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {" "}
            {/* Adjusted grid columns */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center">
              <div className="bg-orange-100 p-2 rounded-full mr-2">
                <FiUser className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm sm:text-base">
                  {result.student.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {result.student.email}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <FiCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm sm:text-base">
                  {result.totalScore} / {result.exam.totalMarks}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Score</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b mb-6">
            <div className="flex">
              <button className="px-4 py-2 border-b-2 border-orange-500 text-orange-600 font-medium">
                Objective{" "}
                <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {result.answers.length}
                </span>
              </button>
            </div>
          </div>

          {/* Questions Table Header */}
          <div className="grid grid-cols-12 bg-gray-50 py-2 sm:py-3 px-2 sm:px-4 rounded-t-lg font-medium text-gray-700 text-xs sm:text-sm">
            {" "}
            <div className="col-span-6">Questions</div>
            <div className="col-span-2 hidden sm:block">Difficulty</div>{" "}
            {/* Hide on mobile */}
            <div className="col-span-3 sm:col-span-2">Result</div>
            <div className="col-span-3 sm:col-span-2">Score</div>
          </div>

          {/* Questions List */}
          <div className="divide-y">
            {result.answers.map((answer, index) => (
              <div key={answer._id} className="hover:bg-gray-50">
                <div className="grid grid-cols-12 py-2 sm:py-4 px-2 sm:px-4 items-center text-xs sm:text-sm">
                  {" "}
                  {/* Adjusted text size and spacing */}
                  <div className="col-span-6">
                    <button className="flex items-center text-left">
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                      <span className="line-clamp-2 sm:line-clamp-1">
                        {answer.question.text}
                      </span>{" "}
                      {/* Added text truncation */}
                    </button>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    {" "}
                    {/* Hide on mobile */}
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        answer.question.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : answer.question.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {answer.question.difficulty.charAt(0).toUpperCase() +
                        answer.question.difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    {answer.isCorrect ? (
                      <span className="flex items-center text-green-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 hidden md:block">
                    {answer.isCorrect ? (
                      <span className="text-green-600">
                        {answer.question.marks}/{answer.question.marks}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        0/{answer.question.marks}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Answer Details */}
                <div className="bg-gray-50 px-3 sm:px-10 py-3 sm:py-4 border-t border-gray-100">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      Options:
                    </h4>
                    <div className="space-y-2">
                      {answer.question.options.map((option, idx) => {
                        const isCorrectOption =
                          option === answer.selectedOption && answer.isCorrect;
                        const isWrongSelection =
                          option === answer.selectedOption && !answer.isCorrect;
                        const isCorrectAnswer =
                          !answer.isCorrect &&
                          answer.question.options.indexOf(option) ===
                            answer.question.options.indexOf(
                              answer.selectedOption
                            ); // This is just a placeholder - you would need the actual correct answer

                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-md flex items-center ${
                              isCorrectOption
                                ? "bg-green-100 border border-green-300"
                                : isWrongSelection
                                ? "bg-red-100 border border-red-300"
                                : isCorrectAnswer
                                ? "bg-green-100 border border-green-300"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <div className="mr-3">
                              {isCorrectOption && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-green-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              {isWrongSelection && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-red-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              {!isCorrectOption && !isWrongSelection && (
                                <span className="h-5 w-5 block"></span>
                              )}
                            </div>
                            <div className="flex-1">{option}</div>
                            {option === answer.selectedOption && (
                              <div className="text-sm text-gray-500">
                                Selected
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {!answer.isCorrect && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Correct Answer:
                      </h4>
                      <div className="p-2 bg-green-100 border border-green-300 rounded-md text-green-800">
                        {answer.question.options.find((opt, idx) => idx === 1)}{" "}
                        {/* This is just a placeholder */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;
