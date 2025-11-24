import axiosClient from './axiosClient';

const luongApi = {
  // Gửi yêu cầu tính lương: POST /api/luong/tinh-luong
  tinhLuong: (data) => {
    // data gồm: { ma_nhan_vien, thang, nam }
    return axiosClient.post('/luong/tinh-luong', data);
  },

  // Lấy báo cáo thu nhập: GET /api/luong/thong-ke/:ma_nv/:nam
  getThongKeNam: (ma_nv, nam) => {
    return axiosClient.get(`/luong/thong-ke/${ma_nv}/${nam}`);
  }
};

export default luongApi;