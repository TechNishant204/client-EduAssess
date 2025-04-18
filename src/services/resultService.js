import api from "./api";

export const resultService = {
  getResultById: async (id) => {
    const response = await api.get(`/result/${id}`);
    console.log("Result by ID response:", response.data);
    return response.data;
  },

  getAllResultsByExamId: async (id) => {
    console.log("Making request with examId:", id); // Log before request
    const response = await api.get(`/result/exam/${id}`);
    console.log("Exam results response:", response.data);
    return response.data;
  },

  getStudentResults: async () => {
    const response = await api.get("/result/student");
    console.log("Student results response:", response.data);
    return response.data;
  },

  deleteResult: async (id) => {
    const response = await api.delete(`/results/${id}`);
    console.log("Delete result response:", response.data);
    return response.data;
  },
  createProctoringEvent: async (data) => {
    try {
      const response = await api.post("/proctoring-events", {
        examId: data.examId,
        eventType: data.eventType,
        timestamp: data.timestamp,
        message: data.message,
      });
      console.log("Create proctoring event response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating proctoring event:", error);
      throw error;
    }
  },
};

// getMyResults: async () => {
//   const response = await api.get("/result/my-results");
//   console.log("My results response:", response.data);
//   return response.data;
// },

// getAllResults: async () => {
//   const response = await api.get("/result");
//   console.log("All results response:", response.data);
//   return response.data;
// },
