import axiosClient from './axiosClient';

const chamCongApi = {
  // Gửi yêu cầu ghi nhận công: POST /api/chamcong/ghi-nhan
  ghiNhan: (data) => {
    // data = { ma_nhan_vien, ngay_lam, gio_vao, gio_ra }
    return axiosClient.post('/chamcong/ghi-nhan', data);
  },

  // Lấy lịch sử chấm công: GET /api/chamcong/:ma_nv/:thang/:nam
  getLichSu: (ma_nv, thang, nam) => {
    return axiosClient.get(`/chamcong/${ma_nv}/${thang}/${nam}`);
  }
};

export default chamCongApi;