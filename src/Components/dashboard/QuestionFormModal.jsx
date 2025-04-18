import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";

const QuestionFormModal = ({ isOpen, onClose, onFinish, examId }) => {
  const [questions, setQuestions] = useState([
    {
      text: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: "",
      difficulty: "easy",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState(null);
  const [existingQuestions, setExistingQuestions] = useState([]);

  // Fetch existing questions when examId changes or modal opens
  useEffect(() => {
    if (isOpen && examId) {
      fetchExistingQuestions();
    }
  }, [isOpen, examId]);

  const fetchExistingQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const response = await examService.getQuestionsByExamId(examId);

      if (response && response.data) {
        setExistingQuestions(response.data);

        // If there are existing questions, and no new questions added yet,
        // initialize questions state with the first existing question
        if (
          response.data.length > 0 &&
          questions.length === 1 &&
          !questions[0].text
        ) {
          setQuestions([]);
        }
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: "",
        difficulty: "easy",
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text) return "Question text cannot be empty";
      if (!q.marks) return "Marks cannot be empty";
      if (q.type === "multiple-choice") {
        if (q.options.some((opt) => !opt))
          return "All options must have content";
        if (!q.correctAnswer) return "Please select a correct answer";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateQuestions();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Submit all questions for this exam
      await examService.addQuestionsToExam(examId, questions);

      // Clear form and close modal
      setQuestions([
        {
          text: "",
          type: "multiple-choice",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: "",
          difficulty: "easy",
        },
      ]);

      onFinish && onFinish();
      onClose();
    } catch (err) {
      console.error("Error submitting questions:", err);
      setError("Failed to save questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Questions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loadingQuestions ? (
          <div className="flex justify-center my-4">
            <div className="loader">Loading existing questions...</div>
          </div>
        ) : (
          <>
            {existingQuestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Existing Questions
                </h3>
                <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
                  {existingQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="mb-2 p-2 border-b last:border-b-0"
                    >
                      <p className="font-medium">{q.text}</p>
                      <p className="text-sm text-gray-500">
                        {q.type === "multiple-choice"
                          ? "Multiple Choice"
                          : q.type}{" "}
                        • {q.marks} marks • {q.difficulty}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="mb-6 p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Question {questionIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Question
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      required
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "text",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "type",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="short-answer">Short Answer</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Marks</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={question.marks}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "marks",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={question.difficulty}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "difficulty",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {question.type === "multiple-choice" && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700">Options</label>
                        <button
                          type="button"
                          onClick={() => handleAddOption(questionIndex)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          + Add Option
                        </button>
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-2"
                        >
                          <input
                            type="radio"
                            name={`correctAnswer-${questionIndex}`}
                            checked={
                              question.correctAnswer === option ||
                              (question.correctAnswer === "" &&
                                optionIndex === 0)
                            }
                            onChange={() =>
                              handleQuestionChange(
                                questionIndex,
                                "correctAnswer",
                                option
                              )
                            }
                            className="mr-2"
                          />
                          <input
                            type="text"
                            required
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            className="flex-grow p-2 border rounded-md"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveOption(questionIndex, optionIndex)
                              }
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <div className="flex items-center">
                        <label className="mr-4">
                          <input
                            type="radio"
                            name={`tf-${questionIndex}`}
                            value="true"
                            checked={question.correctAnswer === "true"}
                            onChange={() =>
                              handleQuestionChange(
                                questionIndex,
                                "correctAnswer",
                                "true"
                              )
                            }
                            className="mr-2"
                          />
                          True
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`tf-${questionIndex}`}
                            value="false"
                            checked={question.correctAnswer === "false"}
                            onChange={() =>
                              handleQuestionChange(
                                questionIndex,
                                "correctAnswer",
                                "false"
                              )
                            }
                            className="mr-2"
                          />
                          False
                        </label>
                      </div>
                    </div>
                  )}

                  {question.type === "short-answer" && (
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter the correct answer"
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Add Another Question
                </button>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || questions.length === 0}
                    className={`bg-blue-500 text-white py-2 px-4 rounded-md ${
                      loading || questions.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                  >
                    {loading ? "Saving..." : "Save Questions"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionFormModal;
