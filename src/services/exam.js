import api from "./api";

export const examService = {
  createExam: async (examData) => {
    const response = await api.post("/exam/createExam", examData);
    console.log("Create exam response:", response.data);
    return response.data;
  },
  deleteExam: async (examId) => {
    const response = await api.delete(`/exam/${examId}`);
    console.log("Create exam response:", response.data);
    return response.data;
  },
  updateExam: async (id, data) => {
    const response = await api.put(`/exam/${id}`, examData);
    console.log("Update exam response:", response.data);
    return response.data;
  },
  updateExam: async (id, data) => {
    const response = await api.put(`/exam/${id}`, data);
    return response.data;
  },

  getAvailableExams: async () => {
    const response = await api.get("/exam/available");
    console.log("Available exams response:", response.data);
    return response.data;
  },

  getEnrolledExams: async () => {
    const response = await api.get("/exam/enrolled");
    console.log("Enrolled exams response:", response.data);
    return response.data;
  },

  getCompletedExams: async () => {
    const response = await api.get("/exam/completed");
    console.log("Completed exams response:", response);
    return response.data;
  },

  enrollInExam: async (examId) => {
    const response = await api.post(`/exam/${examId}/enroll`);
    console.log("Enroll in exam response:", response.data);
    return response.data;
  },

  startExam: async (examId) => {
    try {
      const response = await api.post(`/exam/${examId}/start`);
      console.log("Start exam raw response:", response);
      console.log("Start exam data:", response.data);
      return response;
    } catch (error) {
      console.error("Error starting exam:", error);
      throw error;
    }
  },
  getExamAnalytics: async (examId) => {
    const response = await api.get(`/exam/analytics/${examId}`);
    console.log("Exam analytics response:", response.data);
    return response.data;
  },
  // fetch result
  submitExam: async (examId, answers, proctorFlags) => {
    const response = await api.post(`/result/`, {
      examId,
      answers,
      proctorFlags,
    });
    console.log("Submit exam response:", response.data);
    return response.data;
  },
  // fetch result
  getExamResult: async (examId) => {
    const response = await api.get(`/exam/${examId}/result`);
    console.log("Exam result response:", response.data);
    return response.data;
  },
  getAllExams: async () => {
    const response = await api.get(`/exam/all`);
    console.log("All exams response:", response.data);
    return response.data;
  },
  getQuestionsByExamId: async (examId) => {
    const response = await api.get(`/question/${examId}`);
    console.log("Questions by exam ID response:", response.data);
    return response.data;
  },
  getQuestionByQuestionId: async (quesId) => {
    const response = await api.get(`/question/${quesId}`);
    console.log("Questions by question ID response:", response.data);
    return response.data;
  },
  deleteQuestion: async (quesId) => {
    const response = await api.delete(`/question/${quesId}`);
    console.log("delete exam response:", response.data);
    return response.data;
  },
  createQuestion: async (examData) => {
    const response = await api.post("api/question/", examData);
    console.log("Create question response:", response.data);
    return response.data;
  },
};
