import axiosClient from "./axiosClient";

const chamCongApi = {
  // Lấy tất cả chấm công
  getAll: async () => {
    const res = await axiosClient.get(`/chamcong`);
    return res.data.data || [];
  },

  // Tạo chấm công mới
  create: async (payload) => {
    const res = await axiosClient.post(`/chamcong`, payload);
    return res.data;
  },

  // Cập nhật chấm công (nếu cần)
  update: async (id, payload) => {
    const res = await axiosClient.put(`/chamcong/${id}`, payload);
    return res.data;
  },

  // Xóa chấm công
  delete: async (id) => {
    const res = await axiosClient.delete(`/chamcong/${id}`);
    return res.data;
  },
};

export default chamCongApi;
