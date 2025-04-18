import React from "react";
import { ExamProvider } from "../contexts/ExamContext";
import ExamInterface from "../Components/exam/ExamInterface";

const ExamPage = () => {
  console.log("Exam page pe aa gaya");
  return (
    <ExamProvider>
      <ExamInterface />
    </ExamProvider>
  );
};

export default ExamPage;
