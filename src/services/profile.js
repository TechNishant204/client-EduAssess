import api from "./api";

export const profileService = {
  getCurrentProfile: async () => {
    const response = await api.get("/profile/me");
    // console.log("Current profile response:", response.data);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/profile/update", data);
    // console.log("Update profile response:", response.data);
    return response.data;
  },
};
