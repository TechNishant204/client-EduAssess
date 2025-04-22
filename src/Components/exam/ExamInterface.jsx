import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useExam } from "../../hooks/useExam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading } from "react-icons/ai";

const ExamInterface = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  // Get exam functions and state from custom hook
  const {
    loading,
    exam,
    questions,
    answers,
    timeLeft,
    setAnswers,
    setTimeLeft,
    startExam,
    submitExam,
  } = useExam();

  // Local state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Initialize exam
  useEffect(() => {
    const initExam = async () => {
      try {
        console.log("from exam interface", examId);
        await startExam(examId);
        setExamStarted(true);
      } catch (error) {
        // Error is handled in useExam hook
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 3000);
      }
    };

    initExam();
  }, [examId, startExam, navigate]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || isSubmitting || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isSubmitting, timeLeft, setTimeLeft]);

  // Handle question navigation
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  // Handle exam submission
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Format answers for submission
      const formattedAnswers = Object.keys(answers).map((index) => ({
        question: questions[parseInt(index)]._id,
        selectedOption: answers[index],
      }));

      // Submit the exam
      await submitExam(examId, formattedAnswers);

      toast.success("Exam submitted successfully!");

      // Navigate after toast shows
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 1500);
    } catch (error) {
      // Error is handled in useExam hook
      setIsSubmitting(false);
    }
  }, [isSubmitting, answers, questions, submitExam, examId, navigate]);

  // Show loading state
  if (loading || !exam || !questions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="animate-spin h-10 w-10 text-orange-500 mx-auto mb-4">
            <AiOutlineLoading className="animate-spin w-full h-full text-current" />
          </div>
          <p className="text-lg font-medium text-gray-700">
            Preparing your exam...
          </p>
        </div>
      </div>
    );
  }

  // Format time display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Get current question
  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer position="top-right" />

      <div className="max-w-4xl mx-auto">
        {/* Header with timer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-3 md:mb-0">
            {exam?.title || "Exam"}
          </h1>
          <div className="bg-white px-4 py-2 rounded-full shadow-md">
            <span className="text-lg font-semibold text-gray-700">
              Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Question header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <span className="text-orange-500 font-medium">
                ({currentQuestionData?.marks || 0} marks)
              </span>
            </div>
            <p className="text-lg text-gray-700">{currentQuestionData?.text}</p>
          </div>

          {/* Answer options */}
          {currentQuestionData?.type === "multiple-choice" && (
            <div className="space-y-3 mb-8">
              {currentQuestionData.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    answers[currentQuestion] === option
                      ? "bg-orange-50 border border-orange-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleAnswerChange(option)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className="ml-3 flex-grow text-gray-700 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || isSubmitting}
              className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <AiOutlineLoading className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Submitting...
                </>
              ) : (
                "Submit Exam"
              )}
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentQuestion === questions.length - 1 || isSubmitting
              }
              className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Question navigator */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Question Navigator
          </h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                disabled={isSubmitting}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentQuestion === index
                    ? "bg-orange-500 text-white"
                    : answers[index]
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
