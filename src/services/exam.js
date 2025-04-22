import api from "./api";

export const examService = {
  // ============= ADMIN EXAM FUNCTIONS =============

  // Create a new exam (admin only)
  createExam: async (examData) => {
    try {
      const response = await api.post("/exam/admin/exams", examData);
      return response.data;
    } catch (error) {
      console.error("Error creating exam:", error);
      throw error.response?.data || { message: "Failed to create exam" };
    }
  },

  // Get all exams (admin only)
  getAllExams: async (showAll = false) => {
    try {
      const response = await api.get(
        `/exam/admin/exams${showAll ? "?showAll=true" : ""}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all exams:", error);
      throw error.response?.data || { message: "Failed to fetch exams" };
    }
  },

  // Get exams created by current admin (admin only)
  getMyExams: async () => {
    try {
      const response = await api.get("/exam/admin/my-exams");
      return response.data;
    } catch (error) {
      console.error("Error fetching my exams:", error);
      throw error.response?.data || { message: "Failed to fetch your exams" };
    }
  },

  // Delete an exam (admin only)
  deleteExam: async (examId) => {
    try {
      const response = await api.delete(`/exam/admin/exams/${examId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting exam ${examId}:`, error);
      throw error.response?.data || { message: "Failed to delete exam" };
    }
  },

  // Update an exam (admin only)
  updateExam: async (examId, examData) => {
    try {
      const response = await api.put(`/exam/admin/exams/${examId}`, examData);
      return response.data;
    } catch (error) {
      console.error(`Error updating exam ${examId}:`, error);
      throw error.response?.data || { message: "Failed to update exam" };
    }
  },

  // Get exam analytics (admin only)
  getExamAnalytics: async (examId) => {
    try {
      const response = await api.get(`/exam/admin/analytics/${examId}`); // Include examId in the URL
      // console.log("examId of analytics", typeof examId); // Debugging line
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw (
        error.response?.data || { message: "Failed to fetch exam analytics" }
      );
    }
  },

  // ============= STUDENT EXAM FUNCTIONS =============

  // Get available exams (student only)
  getAvailableExams: async () => {
    try {
      const response = await api.get("/exam/available");
      return response.data;
    } catch (error) {
      console.error("Error fetching available exams:", error);
      throw (
        error.response?.data || { message: "Failed to fetch available exams" }
      );
    }
  },

  // Get enrolled exams (student only)
  getEnrolledExams: async () => {
    try {
      const response = await api.get("/exam/enrolled");
      return response.data;
    } catch (error) {
      console.error("Error fetching enrolled exams:", error);
      throw (
        error.response?.data || { message: "Failed to fetch enrolled exams" }
      );
    }
  },

  // Get completed exams (student only)
  getCompletedExams: async () => {
    try {
      const response = await api.get("/exam/completed");
      return response.data;
    } catch (error) {
      console.error("Error fetching completed exams:", error);
      throw (
        error.response?.data || { message: "Failed to fetch completed exams" }
      );
    }
  },

  // Enroll in an exam (student only)
  enrollInExam: async (examId) => {
    try {
      const response = await api.post(`/exam/enroll/${examId}`);
      return response.data;
    } catch (error) {
      console.error(`Error enrolling in exam ${examId}:`, error);
      throw error.response?.data || { message: "Failed to enroll in exam" };
    }
  },

  // Start an exam (student only)
  startExam: async (examId) => {
    try {
      // console.log("Starting exam with ID:", typeof examId); // Debugging line
      const response = await api.get(`/exam/start/${examId}`);
      return response.data;
    } catch (error) {
      console.error(`Error starting exam ${examId}:`, error);
      throw error.response?.data || { message: "Failed to start exam" };
    }
  },

  // ============= COMMON EXAM FUNCTIONS =============

  // Get exam by ID (admin specific route)
  getExamById: async (examId) => {
    try {
      const response = await api.get(`/exam/admin/exams/${examId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exam ${examId}:`, error);
      throw error.response?.data || { message: "Failed to fetch exam details" };
    }
  },

  // ============= QUESTION ROUTES =============
  // Note: These remain unchanged as question routes weren't provided in the router file

  // Get all questions for an exam
  getQuestionsByExamId: async (examId) => {
    try {
      const response = await api.get(`/question/exam/${examId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching questions for exam ${examId}:`, error);
      throw (
        error.response?.data || { message: "Failed to fetch exam questions" }
      );
    }
  },

  // Get question by ID
  getQuestionById: async (questionId) => {
    try {
      const response = await api.get(`/question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching question ${questionId}:`, error);
      throw (
        error.response?.data || { message: "Failed to fetch question details" }
      );
    }
  },

  // Delete a question (admin only)
  deleteQuestion: async (questionId) => {
    try {
      const response = await api.delete(`/question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting question ${questionId}:`, error);
      throw error.response?.data || { message: "Failed to delete question" };
    }
  },

  // Create a new question (admin only)
  createQuestion: async (questionData) => {
    try {
      const response = await api.post("/question", questionData);
      return response.data;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error.response?.data || { message: "Failed to create question" };
    }
  },

  // Add multiple questions to an exam (admin only)
  addQuestionsToExam: async (examId, questionData) => {
    try {
      const response = await api.post(`/question/exam/${examId}`, questionData);
      return response.data;
    } catch (error) {
      console.error(`Error adding questions to exam ${examId}:`, error);
      throw (
        error.response?.data || { message: "Failed to add questions to exam" }
      );
    }
  },

  // Update a question (admin only)
  updateQuestion: async (questionId, questionData) => {
    try {
      const response = await api.put(`/question/${questionId}`, questionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating question ${questionId}:`, error);
      throw error.response?.data || { message: "Failed to update question" };
    }
  },

  // ============= RESULT ROUTES =============

  // Submit an exam (student only)
  submitExam: async (examId, answers, proctorFlags, startTime) => {
    try {
      // Format the request data according to the backend
      const requestData = {
        examId,
        answers: answers.map((answer) => ({
          question: answer.question,
          selectedOption: answer.selectedOption,
        })),
        startTime: startTime || new Date().toISOString(),
        proctorFlags: proctorFlags || [],
      };

      const response = await api.post("/result", requestData);
      return response.data;
    } catch (error) {
      console.error(`Error submitting exam ${examId}:`, error);
      throw error.response?.data || { message: "Failed to submit exam" };
    }
  },
};

// Export utility function to handle API errors in components
export const handleApiError = (
  error,
  fallbackMessage = "An error occurred"
) => {
  if (error.response) {
    // request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data?.message || fallbackMessage;
  } else if (error.request) {
    // The request was made but no response was received
    return "No response from server. Please check your internet connection.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || fallbackMessage;
  }
};
