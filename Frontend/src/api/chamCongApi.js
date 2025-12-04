import axiosClient from "./axiosClient";

const chamCongApi = {

  getAll: async () => {
    const res = await axiosClient.get(`/chamcong`);
    return res?.data?.data ?? res?.data ?? [];
  },


  create: async (payload) => {
    const res = await axiosClient.post(`/chamcong`, payload);
    return res?.data;
  },


  update: async (id, payload) => {
    const res = await axiosClient.put(`/chamcong/${id}`, payload);
    return res?.data;
  },


  delete: async (id) => {
    const res = await axiosClient.delete(`/chamcong/${id}`);
    return res?.data;
  },


  getLichSu: async (maNhanVien) => {
    const res = await axiosClient.get(`/chamcong/lich-su/${maNhanVien}`);
    return res?.data?.data ?? res?.data ?? [];
  },


  getThongKeBieuDo: async (thang, nam) => {
    const res = await axiosClient.get(`/chamcong/thong-ke-bieu-do`, {
      params: { thang, nam },
    });
    return res?.data?.data ?? res?.data ?? [];
  },
};

export default chamCongApi;
