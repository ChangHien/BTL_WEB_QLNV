import axiosClient from './axiosClient';

const nhanVienApi = {
  getAll: () => {
    return axiosClient.get('/nhanvien');
  },
  get: (id) => {
    return axiosClient.get(`/nhanvien/${id}`);
  },
  create: (data) => {
    return axiosClient.post('/nhanvien', data);
  },
  update: (id, data) => {
    return axiosClient.put(`/nhanvien/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`/nhanvien/${id}`);
  }
};

export default nhanVienApi;