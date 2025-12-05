import axiosClient from "./axiosClient";

const chamCongApi = {
  // Lấy tất cả (summary)
  getThongKeBieuDo: async (thang, nam) => {
    const res = await axiosClient.get(`/chamcong/summary`, { params: { thang, nam } });
    return res?.data?.data ?? res?.data ?? [];
  },

  // Lịch sử theo nhân viên
  getByNhanVien: async (maNhanVien, thang, nam) => {
    const res = await axiosClient.get(`/chamcong/${maNhanVien}`, { params: { thang, nam } });
    return res?.data?.data ?? res?.data ?? [];
  },

  // Check-in nhanh
  checkIn: async (payload) => {
    const res = await axiosClient.post(`/chamcong/check-in`, payload);
    return res?.data;
  },

  // Check-out nhanh
  checkOut: async (payload) => {
    const res = await axiosClient.put(`/chamcong/check-out`, payload);
    return res?.data;
  },

  // Full chấm công (HR/Admin)
  createFull: async (payload) => {
    const res = await axiosClient.post(`/chamcong/full`, payload);
    return res?.data;
  },
};

export default chamCongApi;
