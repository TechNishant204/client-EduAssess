import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "../services/exam";
import { toast } from "react-toastify";
import { HiTrash } from "react-icons/hi";

// Main component for managing questions for an exam
const ExamQuestionsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState(null);

  // Fetch exam details and questions on component mount
  useEffect(() => {
    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      // Get exam details - assuming this endpoint exists or can be added
      const examResponse = await examService.getExamById(examId);
      setExam(examResponse.data);

      // Get questions for this exam
      const questionsResponse = await examService.getQuestionsByExamId(examId);
      setQuestions(questionsResponse.data || []);
    } catch (error) {
      console.error("Error fetching exam data:", error);
      toast.error("Failed to load exam data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    // Create new empty question object
    setNewQuestion({
      text: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: "1",
      difficulty: "easy",
    });

    // Cancel any ongoing editing
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion({ ...question });
    setNewQuestion(null);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      await examService.deleteQuestion(questionId);
      // Update local state
      setQuestions(questions.filter((q) => q._id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
    }
  };

  const handleSaveQuestion = async (questionData) => {
    try {
      if (questionData._id) {
        // Update existing question
        await examService.updateQuestion(questionData._id, questionData);
        setQuestions(
          questions.map((q) => (q._id === questionData._id ? questionData : q))
        );
        setEditingQuestion(null);
        toast.success("Question updated successfully");
      } else {
        // Add new question to the exam
        const response = await examService.addQuestionsToExam(examId, [
          questionData,
        ]);
        // Refresh the questions list to get the updated data with IDs
        const updatedQuestions = await examService.getQuestionsByExamId(examId);
        setQuestions(updatedQuestions.data || []);
        setNewQuestion(null);
        toast.success("Question added successfully");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question");
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setNewQuestion(null);
  };

  const handleFinish = () => {
    navigate("/admin/dashboard"); // Redirect back to dashboard
    toast.success("Exam questions updated successfully");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
        <span>Loading exam data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{exam?.title} - Questions</h1>
          <p className="text-gray-600">Manage questions for this exam</p>
        </div>
        <button
          onClick={handleFinish}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Finish
        </button>
      </div>

      {/* Question List */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Questions ({questions.length})
          </h2>
          <button
            onClick={handleAddQuestion}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
          >
            <span className="mr-1">+</span> Add Question
          </button>
        </div>

        {questions.length === 0 && !newQuestion ? (
          <div className="p-8 text-center text-gray-500">
            No questions added yet. Click "Add Question" to create your first
            question.
          </div>
        ) : (
          <ul className="divide-y">
            {questions.map((question) => (
              <li key={question._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div className="flex-grow">
                    <p className="font-medium">{question.text}</p>
                    <div className="mt-1 text-sm text-gray-600 flex space-x-4">
                      <span>
                        {question.type === "multiple-choice"
                          ? "Multiple Choice"
                          : question.type === "true-false"
                          ? "True/False"
                          : "Short Answer"}
                      </span>
                      <span>• {question.marks} marks</span>
                      <span>• {question.difficulty}</span>
                    </div>

                    {/* Show options for multiple choice */}
                    {question.type === "multiple-choice" && (
                      <div className="mt-2 ml-4">
                        <p className="text-sm text-gray-500 mb-1">Options:</p>
                        <ul className="list-disc pl-5">
                          {question.options.map((option, index) => (
                            <li
                              key={index}
                              className={`text-sm ${
                                option === question.correctAnswer
                                  ? "text-green-600 font-semibold"
                                  : ""
                              }`}
                            >
                              {option}{" "}
                              {option === question.correctAnswer && "(correct)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Show correct answer for other types */}
                    {question.type !== "multiple-choice" && (
                      <div className="mt-2 ml-4">
                        <p className="text-sm text-gray-500">
                          Correct Answer:{" "}
                          <span className="text-green-600">
                            {question.correctAnswer}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Question Form (Edit or New) */}
      {(editingQuestion || newQuestion) && (
        <QuestionForm
          question={editingQuestion || newQuestion}
          onSave={handleSaveQuestion}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

// Component for editing or creating a question
const QuestionForm = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState(question);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;

    // If this was the correct answer, update it
    if (formData.correctAnswer === formData.options[index]) {
      setFormData({
        ...formData,
        options: updatedOptions,
        correctAnswer: value,
      });
    } else {
      setFormData({
        ...formData,
        options: updatedOptions,
      });
    }
  };

  const handleTypeChange = (type) => {
    // Reset options and correct answer based on type
    let updatedQuestion = { ...formData, type };

    if (type === "multiple-choice") {
      updatedQuestion.options = updatedQuestion.options?.length
        ? updatedQuestion.options
        : ["", "", "", ""];
      updatedQuestion.correctAnswer = "";
    } else if (type === "true-false") {
      updatedQuestion.options = [];
      updatedQuestion.correctAnswer = "true";
    } else {
      updatedQuestion.options = [];
      updatedQuestion.correctAnswer = "";
    }

    setFormData(updatedQuestion);
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...formData.options];
    const removedOption = updatedOptions[index];
    updatedOptions.splice(index, 1);

    if (formData.correctAnswer === removedOption) {
      setFormData({
        ...formData,
        options: updatedOptions,
        correctAnswer: "",
      });
    } else {
      setFormData({
        ...formData,
        options: updatedOptions,
      });
    }
  };

  const handleSetCorrectAnswer = (value) => {
    setFormData({
      ...formData,
      correctAnswer: value,
    });
  };
  
  // Validation function for the question form
  const validateQuestion = () => {
    if (!formData.text.trim()) {
      return "Question text cannot be empty";
    }

    if (!formData.marks) {
      return "Marks cannot be empty";
    }

    if (formData.type === "multiple-choice") {
      if (formData.options.length < 2) {
        return "Multiple choice questions need at least 2 options";
      }

      if (formData.options.some((opt) => !opt.trim())) {
        return "All options must have content";
      }

      if (!formData.correctAnswer) {
        return "Please select a correct answer";
      }

      if (!formData.options.includes(formData.correctAnswer)) {
        return "Correct answer must match one of the options";
      }
    } else if (formData.type === "true-false") {
      if (
        formData.correctAnswer !== "true" &&
        formData.correctAnswer !== "false"
      ) {
        return "Please select either True or False as the correct answer";
      }
    } else if (formData.type === "short-answer") {
      if (!formData.correctAnswer.trim()) {
        return "Please provide a correct answer";
      }
    }

    return null;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateQuestion();

    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {question._id ? "Edit Question" : "Add New Question"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Question Text */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Question Text</label>
          <textarea
            value={formData.text}
            onChange={(e) => handleChange("text", e.target.value)}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          />
        </div>

        {/* Question Type, Marks, Difficulty */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Question Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
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
              min="1"
              value={formData.marks}
              onChange={(e) => handleChange("marks", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Multiple Choice Options */}
        {formData.type === "multiple-choice" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700">Options</label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Option
              </button>
            </div>

            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === option}
                  onChange={() => handleSetCorrectAnswer(option)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-grow p-2 border rounded-md"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <HiTrash className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* True/False Options */}
        {formData.type === "true-false" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Correct Answer</label>
            <div className="flex items-center">
              <label className="mr-4 flex items-center">
                <input
                  type="radio"
                  name="tf-correctAnswer"
                  value="true"
                  checked={formData.correctAnswer === "true"}
                  onChange={() => handleSetCorrectAnswer("true")}
                  className="mr-2"
                />
                True
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tf-correctAnswer"
                  value="false"
                  checked={formData.correctAnswer === "false"}
                  onChange={() => handleSetCorrectAnswer("false")}
                  className="mr-2"
                />
                False
              </label>
            </div>
          </div>
        )}

        {/* Short Answer */}
        {formData.type === "short-answer" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Correct Answer</label>
            <input
              type="text"
              value={formData.correctAnswer}
              onChange={(e) => handleSetCorrectAnswer(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter the correct answer"
              required
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamQuestionsPage;
