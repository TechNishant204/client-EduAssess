// src/pages/ResultPage.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const ResultPage = () => {
  // console.log("ResultPage component rendered");
  return (
    <div className="result-page-container">
      <h1 className="text-3xl font-bold mb-4">Exam Results</h1>
      <Outlet />
      {/* This will render the nested routes defined in the router */}
    </div>
  );
};

export default ResultPage;
