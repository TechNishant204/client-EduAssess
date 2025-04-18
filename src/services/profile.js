import api from "./api";

export const profileService = {
  getCurrentProfile: async () => {
    const response = await api.get("/profile/me");
    console.log("Current profile response:", response.data);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/profile/update", data);
    console.log("Update profile response:", response.data);
    return response.data;
  },

  updateAccount: async (data) => {
    const response = await api.put("/account", data);
    console.log("Update account response:", response.data);
    return response.data;
  },

  getStudentProfile: async (id) => {
    const response = await api.get(`/profiles/students/${id}`);
    console.log("Student profile response:", response.data);
    return response.data;
  },

  getAllStudentProfiles: async () => {
    const response = await api.get("/profiles/students");
    console.log("All student profiles response:", response.data);
    return response.data;
  },

  // You might want to add error handling similar to startExam in your exam service
  //Future Scopes
  // Example:
  // uploadProfilePicture: async (imageData) => {
  //   try {
  //     const response = await api.post("/profile/picture", imageData);
  //     console.log("Upload profile picture response:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error uploading profile picture:", error);
  //     throw error;
  //   }
  // },
};
