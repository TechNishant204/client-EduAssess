import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";

const ExamFormModal = ({ isOpen, onClose, onNext, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    startTime: "",
    endTime: "",
    totalMarks: "",
    passingMarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        duration: initialData.duration || "",
        startTime: initialData.startTime
          ? new Date(initialData.startTime).toISOString().slice(0, 16)
          : "",
        endTime: initialData.endTime
          ? new Date(initialData.endTime).toISOString().slice(0, 16)
          : "",
        totalMarks: initialData.totalMarks || "",
        passingMarks: initialData.passingMarks || "",
      });
    } else {
      // Reset form when creating a new exam
      setFormData({
        title: "",
        description: "",
        duration: "",
        startTime: "",
        endTime: "",
        totalMarks: "",
        passingMarks: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (initialData) {
        // Update existing exam
        response = await examService.updateExam(initialData._id, formData);
        onNext(initialData._id, formData);
      } else {
        // Create new exam
        response = await examService.createExam(formData);
        if (response.data && response.data._id) {
          // Ensure we're passing the new exam ID to the parent component
          onNext(response.data._id);
        } else {
          throw new Error("Failed to get exam ID from response");
        }
      }
    } catch (err) {
      console.error("Error submitting exam form:", err);
      setError(
        initialData
          ? "Failed to update exam. Please try again."
          : "Failed to create exam. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {initialData ? "Update Exam" : "Create Exam"}
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 text-sm sm:text-base border rounded-lg mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 text-sm sm:text-base border rounded-lg mt-1"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 text-sm sm:text-base border rounded-lg mt-1"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                className="w-full p-2 text-sm sm:text-base border rounded-lg mt-1"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 text-sm sm:text-base border rounded-lg mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 text-sm sm:text-base border rounded-lg mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Passing Marks
            </label>
            <input
              type="number"
              name="passingMarks"
              value={formData.passingMarks}
              onChange={handleChange}
              className="w-full p-2 text-sm sm:text-base border rounded-lg mt-1"
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFormModal;
