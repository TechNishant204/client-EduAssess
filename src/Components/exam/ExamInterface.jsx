import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useExam } from "../../hooks/useExam"; // We'll still use this for the startExam function
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProctorManager from "./ProctorManager";

const ExamInterface = () => {
  console.log("Interface page loaded");
  const { examId } = useParams();
  const navigate = useNavigate();
  const { startExam, submitExam } = useExam(); // We only need these functions from useExam

  // Local state management
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("useEffect triggered");
    const initializeExam = async () => {
      console.log("Starting exam with examId:", examId);
      try {
        setLoading(true);
        const examData = await startExam(examId);
        console.log("Exam data received:", examData);

        // Extract the data from the response
        const { data } = examData;

        // Set all the local state from the API response
        setExam({
          title: data.title,
          totalMarks: data.totalMarks,
          startTime: data.startTime,
          examId: data.examId,
        });

        setQuestions(data.questions || []);
        setTimeLeft(data.duration || 60); // Default to 60 seconds if not provided
        setIsExamStarted(true);

        // console.log("Questions set:", data.questions);
        // console.log("Time left set to:", data.duration);
      } catch (error) {
        console.error("Error starting exam:", error);
        toast.error("Failed to start exam", { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    if (!isExamStarted) initializeExam();
  }, [examId, startExam, isExamStarted]);

  // Timer effect to handle countdown
  useEffect(() => {
    // console.log("Timer useEffect triggered, timeLeft:", timeLeft);
    let timer;
    if (isExamStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            toast.info("Exam ended due to time limit!", { autoClose: 3000 });
            navigate("/student/dashboard");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (isExamStarted && timeLeft === 0) {
      handleSubmit();
      toast.info("Exam ended due to time limit!", { autoClose: 3000 });
      navigate("/student/dashboard");
    }
    return () => clearInterval(timer); // Cleanup on unmount or dependency change
  }, [isExamStarted, timeLeft, navigate]);

  // Debug logging effect
  useEffect(() => {
    console.log("Current questions:", questions);
    console.log("Current exam:", exam);
  }, [questions, exam]);

  const handleAnswerChange = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // const handleSubmit = async () => {
  //   try {
  //     await submitExam(examId, Object.values(answers), []);
  //     toast.success("Exam submitted successfully!", { autoClose: 3000 });
  //     navigate("/student/dashboard");
  //   } catch (error) {
  //     console.error("Error submitting exam:", error);
  //     toast.error("Error submitting exam", { autoClose: 3000 });
  //   }
  // };
  const handleSubmit = async () => {
    console.log("submit button clicked");
    console.log("user answers", answers);
    try {
      //   // Wait for successful submission
      setTimeLeft(0); // Stop the timer
      setIsExamStarted(false); // Mark the exam as not started anymore
      const response = await submitExam(examId, Object.values(answers), []);
      console.log("Submission response:", response); //   // Show success message
      toast.success("Exam submitted successfully!", { autoClose: 3000 });

      //   // Ensure navigation happens after toast appears
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 500);
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error(`Error submitting exam: ${error.message}`, {
        autoClose: 3000,
      });
    }
    // navigate("/student/dashboard");
  };

  if (loading || !exam || !questions.length || !isExamStarted)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 flex items-center space-x-4 bg-white rounded-lg shadow-lg">
          <div className="animate-spin h-8 w-8 text-orange-500">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <span className="text-lg font-medium text-gray-700">
            Preparing your exam...
          </span>
        </div>
      </div>
    );

  const question = questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600">{exam.title}</h1>
          <div className="bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-lg font-semibold text-gray-700">
              Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <div className="mt-2 text-lg text-gray-700">
              {question.text}{" "}
              <span className="text-orange-500 font-medium">
                ({question.marks} marks)
              </span>
            </div>
          </div>

          {question.type === "multiple-choice" && (
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleAnswerChange(option)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <label className="ml-3 text-gray-700 cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transform hover:scale-105 transition-all duration-200"
            >
              Submit Exam
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-6">
          <ProctorManager examId={examId} />
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
