// src/components/dashboard/ExamDetailsModal.jsx
import React from "react";

const ExamDetailsModal = ({ isOpen, onClose, exam }) => {
  if (!isOpen || !exam) return null;

  // Render a modal dialog that shows exam details
  return (
    // Modal backdrop - covers the entire screen with a semi-transparent background
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      {/* Modal content container */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Exam title */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {exam.title
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </h2>

        {/* Main content area */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Description section */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">About this exam</h3>
            <p>{exam.description}</p>
          </div>

          {/* Basic exam information */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration info */}
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-medium">Duration</h3>
              <p>{exam.duration} minutes</p>
            </div>

            {/* Total marks info */}
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-medium">Total Marks</h3>
              <p>{exam.totalMarks} Marks</p>
            </div>
          </div>

          {/* Exam schedule section */}
          <div className="bg-purple-100 p-4 rounded">
            <h3 className="font-medium mb-2">Exam Schedule</h3>
            {/* Start time */}
            <div className="mb-2">
              <p className="font-medium">Starts:</p>
              <p>{new Date(exam.startTime).toLocaleString()}</p>
            </div>
            {/* End time */}
            <div>
              <p className="font-medium">Ends:</p>
              <p>{new Date(exam.endTime).toLocaleString()}</p>
            </div>
          </div>

          {/* Passing score section */}
          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="font-medium ">Passing Score</h3>
            <p className="text-red-500">*{exam.passingMarks} marks required</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ExamDetailsModal;
