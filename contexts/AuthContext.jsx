import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem('user_token');
    const storedUser = localStorage.getItem('user_info');
    
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // === HÀM ĐĂNG NHẬP ===
  const login = async (username, password) => {
    console.log("Login  với:", username, password);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username) {
      const fakeUser = {
        id: 1,
        username: username,
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=' + username
      };
      
      setUser(fakeUser);
      localStorage.setItem('user_token', 'token_gia_lap_123456');
      localStorage.setItem('user_info', JSON.stringify(fakeUser));
      return true;
    }
    return false;
  };

  // === HÀM ĐĂNG XUẤT ===
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);