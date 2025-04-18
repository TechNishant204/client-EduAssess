import { ExamContext } from "../contexts/ExamContext"; // Updated to named import
import { useContext } from "react";
export const useExam = () => {
  console.log("useExam called ho gyaaaa........");
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};
