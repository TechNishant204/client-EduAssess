// useExam.js
import { useState, useEffect, useCallback } from "react";
import { examService, handleApiError } from "../services/exam";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useExam = () => {
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  // State for exam lists
  const [availableExams, setAvailableExams] = useState([]);
  const [enrolledExams, setEnrolledExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState({
    available: false,
    enrolled: false,
    completed: false,
  });

  // Clear all exam state
  const resetExamState = useCallback(() => {
    setExam(null);
    setQuestions([]);
    setAnswers({});
    setTimeLeft(0);
  }, []);

  // Fetch available exams
  const fetchAvailableExams = useCallback(async () => {
    setLoadingExams((prev) => ({ ...prev, available: true }));
    try {
      const response = await examService.getAvailableExams();
      setAvailableExams(response.data || []);
      return response;
    } catch (error) {
      toast.error(handleApiError(error, "Failed to fetch available exams"));
    } finally {
      setLoadingExams((prev) => ({ ...prev, available: false }));
    }
  }, []);

  // Fetch enrolled exams
  const fetchEnrolledExams = useCallback(async () => {
    setLoadingExams((prev) => ({ ...prev, enrolled: true }));
    try {
      const response = await examService.getEnrolledExams();
      setEnrolledExams(response.data || []);
      return response;
    } catch (error) {
      toast.error(handleApiError(error, "Failed to fetch enrolled exams"));
    } finally {
      setLoadingExams((prev) => ({ ...prev, enrolled: false }));
    }
  }, []);

  // Fetch completed exams
  const fetchCompletedExams = useCallback(async () => {
    setLoadingExams((prev) => ({ ...prev, completed: true }));
    try {
      const response = await examService.getCompletedExams();
      setCompletedExams(response.data || []);
      return response;
    } catch (error) {
      toast.error(handleApiError(error, "Failed to fetch completed exams"));
    } finally {
      setLoadingExams((prev) => ({ ...prev, completed: false }));
    }
  }, []);

  // Refresh all exam lists
  const refreshExamLists = useCallback(async () => {
    await Promise.all([
      fetchAvailableExams(),
      fetchEnrolledExams(),
      fetchCompletedExams(),
    ]);
  }, [fetchAvailableExams, fetchEnrolledExams, fetchCompletedExams]);

  // Enroll in an exam
  const enrollExam = useCallback(
    async (examId) => {
      setLoading(true);
      try {
        const response = await examService.enrollInExam(examId);
        toast.success("Successfully enrolled in exam!");

        // Update exam lists after enrollment
        await refreshExamLists();

        return response;
      } catch (error) {
        const errorMsg = handleApiError(error, "Failed to enroll in exam");
        setError(errorMsg);
        toast.error(errorMsg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refreshExamLists]
  );

  // Start an exam
  const startExam = useCallback(async (examId) => {
    setLoading(true);
    setError(null);

    try {
      // Get exam data
      const examResponse = await examService.startExam(examId);

      // Check if exam data exists
      if (!examResponse.data) {
        throw new Error("Invalid exam data received");
      }

      setExam(examResponse.data);

      // Get questions if they're not included in the exam data
      if (
        !examResponse.data.questions ||
        examResponse.data.questions.length === 0
      ) {
        const questionsData = await examService.getQuestionsByExamId(examId);
        setQuestions(questionsData.data || []);
      } else {
        setQuestions(examResponse.data.questions);
      }

      // Set time left (convert minutes to seconds)
      const durationInSeconds = (examResponse.data.duration || 60) * 60;
      setTimeLeft(durationInSeconds);

      return examResponse;
    } catch (error) {
      const errorMsg = handleApiError(error, "Failed to start exam");
      setError(errorMsg);
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle answer changes
  const updateAnswer = useCallback((questionIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  }, []);

  // Submit an exam
  const submitExam = useCallback(
    async (examId, formattedAnswers = null, flags = null, startTime = null) => {
      setLoading(true);
      setError(null);

      try {
        // Use provided answers or format from state
        const answersToSubmit =
          formattedAnswers ||
          Object.keys(answers).map((index) => {
            return {
              question: questions[parseInt(index)]._id,
              selectedOption: answers[index],
            };
          });

        // Use provided startTime or from exam
        const startTimeToSubmit =
          startTime || exam?.startTime || new Date().toISOString();

        const result = await examService.submitExam(
          examId,
          answersToSubmit,
          startTimeToSubmit
        );

        // Refresh exam lists after submission to update enrolled and completed lists
        await refreshExamLists();

        // Reset exam state after successful submission
        resetExamState();

        return result;
      } catch (error) {
        const errorMsg = handleApiError(error, "Failed to submit exam");
        setError(errorMsg);
        toast.error(errorMsg);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [answers, questions, exam, resetExamState, refreshExamLists]
  );

  // Check exam status
  const checkExamStatus = useCallback(async (examId) => {
    try {
      const response = await examService.getExamStatus(examId);
      return response.data;
    } catch (error) {
      console.error(`Error checking exam status: ${examId}`, error);
      return { status: "unknown" };
    }
  }, []);

  return {
    // State
    loading,
    error,
    exam,
    questions,
    answers,
    timeLeft,
    availableExams,
    enrolledExams,
    completedExams,
    loadingExams,

    // Setters
    setAnswers,
    setTimeLeft,

    // Actions
    startExam,
    submitExam,
    updateAnswer,

    resetExamState,
    fetchAvailableExams,
    fetchEnrolledExams,
    fetchCompletedExams,
    refreshExamLists,
    enrollExam,
    checkExamStatus,
  };
};
