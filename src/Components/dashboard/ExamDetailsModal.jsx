// src/components/dashboard/ExamDetailsModal.jsx
import React from "react";

const ExamDetailsModal = ({ isOpen, onClose, exam }) => {
  if (!isOpen || !exam) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          {exam.title}
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Description</span>
            <span className="text-gray-800">{exam.description}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Duration</span>
              <span className="text-gray-800 font-medium">
                {exam.duration} mins
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Marks</span>
              <span className="text-gray-800 font-medium">
                {exam.totalMarks}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Start Time</span>
              <span className="text-gray-800">
                {new Date(exam.startTime).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">End Time</span>
              <span className="text-gray-800">
                {new Date(exam.endTime).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Passing Marks</span>
              <span className="text-gray-800 font-medium">
                {exam.passingMarks}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 active:bg-gray-900 transition-colors duration-200 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ExamDetailsModal;
