import { createContext, useEffect, useState } from "react";
import authApi from "../api/authApi";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Lưu thông tin user
  const [token, setToken] = useState(null);     // Lưu access token
  const [loading, setLoading] = useState(true); // Loading khi load dữ liệu từ localStorage

  // 🔹 Load token + user từ localStorage khi reload trang
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);

      // Set token mặc định cho axios
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // 🔹 Xử lý login
  const login = async (username, password) => {
    try {
      const res = await authApi.login({ username, password });

      const accessToken = res.token;
      const userInfo = res.user;

      // Lưu vào state
      setToken(accessToken);
      setUser(userInfo);

      // Lưu vào localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // Set token mặc định cho axios
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Đăng nhập thất bại" };
    }
  };

  // 🔹 Cập nhật thông tin user (dùng khi sửa hồ sơ chẳng hạn)
  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // 🔹 Xử lý logout
  const logout = () => {
    setToken(null);
    setUser(null);

    // Xóa token khỏi axios
    delete axiosClient.defaults.headers.common["Authorization"];

    // Xóa LocalStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
