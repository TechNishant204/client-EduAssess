import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { resultService } from "../../services/resultService";

const Result = () => {
  console.log("Result component rendered");
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await resultService.getResultById(resultId);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  const timeTaken = Math.round(
    (new Date(result.submittedAt) - new Date(result.startTime)) / 60000
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Exam Result</h1>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">
                {result.student.name}
              </span>
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
            <div className="flex justify-between items-center text-gray-600">
              <span>Exam: {result.exam.title}</span>
              <span>
                Score: {result.totalScore}/{result.exam.totalMarks}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Percentage: {result.percentage}%</span>
              <span>Time Taken: {timeTaken} mins</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>
                Start Time: {new Date(result.startTime).toLocaleString()}
              </span>
              <span>
                Submitted: {new Date(result.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              Questions: {result.answers.length}
            </span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b font-semibold text-gray-700">
                  Question
                </th>
                <th className="p-3 border-b font-semibold text-gray-700">
                  Difficulty
                </th>
                <th className="p-3 border-b font-semibold text-gray-700">
                  Result
                </th>
                <th className="p-3 border-b font-semibold text-gray-700">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {result.answers.map((answer) => (
                <tr key={answer._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{answer.question.text}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        answer.question.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : answer.question.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {answer.question.difficulty}
                    </span>
                  </td>
                  <td className="p-3">
                    {answer.isCorrect ? (
                      <span className="text-green-600">✔</span>
                    ) : (
                      <span className="text-red-600">✘</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">
                    {answer.isCorrect
                      ? `${answer.question.marks}/${answer.question.marks}`
                      : `0/${answer.question.marks}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default Result;
