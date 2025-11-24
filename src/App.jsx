import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. CÁC FILE IMPORT PHẢI ĐÚNG ĐƯỜNG DẪN
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/Auth/LoginPage';
import PrivateRoute from './routes/PrivateRoute';

import DashboardPage from './pages/Dashboard/DashboardPage';
import PhongBanPage from './pages/PhongBan/PhongBanPage';
// import ChucVuPage from './pages/ChucVu/ChucVuPage'; // Nếu chưa làm thì comment lại
// import NhanVienPage from './pages/NhanVien/NhanVienPage'; // Nếu chưa làm thì comment lại
import TinhLuongPage from './pages/Luong/TinhLuongPage'; // <-- FILE MỚI
import BaoCaoThuNhap from './pages/BaoCao/BaoCaoThuNhap';
import ChamCongPage from './pages/ChamCong/ChamCongPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="phong-ban" element={<PhongBanPage />} />
            {/* <Route path="chuc-vu" element={<ChucVuPage />} /> */}
            {/* <Route path="nhan-vien" element={<NhanVienPage />} /> */}
            
            {/* ROUTE MỚI */}
            <Route path="tinh-luong" element={<TinhLuongPage />} />
            <Route path="bao-cao" element={<BaoCaoThuNhap />} />
            <Route path="cham-cong" element={<ChamCongPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;