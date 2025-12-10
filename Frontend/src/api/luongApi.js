import axiosClient from './axiosClient';

const luongApi = {
  tinhLuong: (data) => {
    return axiosClient.post('/luong/tinh-luong', data);
  },

  getThongKeNam: (ma_nv, nam) => {
    return axiosClient.get(`/luong/thong-ke/${ma_nv}/${nam}`);
  },

  getThongKeLuongTheoPhongBan: (thang, nam) => {
    return axiosClient.get(`/luong/thong-ke-theo-phong/${thang}/${nam}`);
  },

  tinhTuDongLuongTheoPhong: (thang, nam) => {
    return axiosClient.get(`/luong/tinh-tu-dong/${thang}/${nam}`);
  },

  debugTinhLuong: (thang, nam) => {
    return axiosClient.get(`/luong/debug/${thang}/${nam}`);
  }
};

export default luongApi;