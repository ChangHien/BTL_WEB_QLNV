import axiosClient from './axiosClient';

const phongBanApi = {
  getAll: () => axiosClient.get('/phongban'),
  get: (id) => axiosClient.get(`/phongban/${id}`),
  create: (data) => axiosClient.post('/phongban', data),
  update: (id, data) => axiosClient.put(`/phongban/${id}`, data),
  delete: (id) => axiosClient.delete(`/phongban/${id}`)
};

export default phongBanApi;