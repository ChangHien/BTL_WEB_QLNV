// Frontend/src/api/axiosClient.js
import axios from "axios";

// Tạo instance của axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api", // Thay bằng URL backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor nếu cần (ví dụ: tự động gắn token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Hoặc từ AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response global (nếu muốn)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Có thể handle 401, 403, 500 ở đây
    return Promise.reject(error);
  }
);

export default axiosClient;
