import api from "./api";

export const resultService = {
  getResultById: async (id) => {
    const response = await api.get(`/result/${id}`);
    // console.log("Result by ID response:", response.data);
    return response.data;
  },
  // Get results by exam ID
  getAllResultsByExamId: async (examId) => {
    if (!examId) {
      console.error("getAllResultsByExamId called with undefined examId");
      throw new Error("Exam ID is required");
    }
    // console.log("Making request with examId:", examId);
    const response = await api.get(`/result/exam/${examId}`);
    // console.log("Exam results response:", response.data);
    return response.data;
  },

  getStudentResults: async () => {
    const response = await api.get("/result/student");
    // console.log("Student results response:", response.data);
    return response.data;
  },

  deleteResult: async (id) => {
    const response = await api.delete(`/results/${id}`);
    // console.log("Delete result response:", response.data);
    return response.data;
  },  
};


