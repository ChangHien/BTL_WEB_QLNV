import axiosClient from "./axiosClient";

const authApi = {
  login: async (payload) => {
    try {
      const response = await axiosClient.post("/auth/login", payload);
      return response.data; // { token: "...", user: { ... } }
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosClient.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosClient.post("/auth/refresh-token");
      return response.data; // { token, user }
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;