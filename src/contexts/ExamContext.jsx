import React, { createContext, useState } from "react";
import { examService } from "../services/exam";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [exam, setExam] = useState(null); // Change exams to exam (singular)
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const startExam = async (examId) => {
    console.log("startExam called with examId:", examId);
    try {
      const response = await examService.startExam(examId);
      console.log("Exam data:", response.data);

      // Properly set the exam data
      setExam(response.data);

      // Check where questions are in the response structure
      if (response.data.questions && Array.isArray(response.data.questions)) {
        setQuestions(response.data.questions);
        console.log("Questions set:", response.data.questions);
      } else {
        // If questions aren't directly in the response, fetch them separately
        const questionsData = await examService.getQuestionsByExamId(examId);
        setQuestions(questionsData.questions || []);
        console.log("Questions fetched separately:", questionsData.questions);
      }

      // Set time limit from the response or use default
      const examDuration = response.data.duration || 20 * 60; // Duration in seconds
      setTimeLeft(examDuration);
      console.log("Time left set to:", examDuration);

      // Return the data so we can check it in ExamInterface
      return response.data;
    } catch (error) {
      console.error("Error in startExam:", error);
      throw error;
    }
  };

  const submitExam = async (examId) => {
    await examService.submitExam(examId, Object.values(answers), []);
    setExam(null);
    setQuestions([]);
    setAnswers({});
    setTimeLeft(0);
  };

  return (
    <ExamContext.Provider
      value={{
        exam, // Changed from exams to exam
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
