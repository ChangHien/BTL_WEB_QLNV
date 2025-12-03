import React, { createContext, useEffect, useState, useContext } from "react";
import authApi from "../api/authApi";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authApi.login({ username, password });

      const accessToken = res.token;
      const userInfo = res.user;

      setToken(accessToken);
      setUser(userInfo);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userInfo));

      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Đăng nhập thất bại" };
    }
  };

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    delete axiosClient.defaults.headers.common["Authorization"];

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

export const useAuth = () => useContext(AuthContext);
