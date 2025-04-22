import React, { createContext, useState } from "react";
import { examService } from "../services/exam";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  // Start exam function
  const startExam = async (examId) => {
    try {
      const response = await examService.startExam(examId);

      // Set exam data
      setExam(response.data);

      // Set questions if available, otherwise fetch them separately
      if (response.data.questions && Array.isArray(response.data.questions)) {
        setQuestions(response.data.questions);
      } else {
        const questionsData = await examService.getQuestionsByExamId(examId); // API CALL
        setQuestions(questionsData.questions || []);
      }

      // Set time limit
      const examDuration = response.data.duration * 60 || 1200; // Convert to seconds
      setTimeLeft(examDuration);

      return response;
    } catch (error) {
      console.error("Error starting exam:", error);
      throw error;
    }
  };

  // Submit exam function
  const submitExam = async (
    examId,
    formattedAnswers,

    startTime
  ) => {
    try {
      // Call the API with properly formatted data
      const result = await examService.submitExam(
        examId,
        formattedAnswers,

        startTime
      );

      // Reset all exam state
      setExam(null);
      setQuestions([]);
      setAnswers({});
      setTimeLeft(0);

      return result;
    } catch (error) {
      console.error("Error submitting exam:", error);
      throw error;
    }
  };

  return (
    <ExamContext.Provider
      value={{
        exam,
        questions,
        answers,
        setAnswers,
        timeLeft,
        setTimeLeft,
        startExam,
        submitExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export { ExamContext };
