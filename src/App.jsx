import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/Auth/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PhongBanPage from './pages/PhongBan/PhongBanPage';
import ChucVuPage from './pages/ChucVu/ChucVuPage';
// import NhanVienPage from './pages/NhanVien/NhanVienPage'; // Nếu chưa làm thì comment lại
import TinhLuongPage from './pages/Luong/TinhLuongPage'; // <-- FILE MỚI
import BaoCaoThuNhap from './pages/BaoCao/BaoCaoThuNhap';
// import ChamCongPage from './pages/ChamCong/ChamCongPage';
import ComingSoonPage from './pages/ComingSoon/ComingSoonPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            {/* Quản lý tổ chức  */}
            <Route path="phong-ban" element={<PhongBanPage />} />
            <Route path="chuc-vu" element={<ChucVuPage />} />
            {/* <Route path="nhan-vien" element={<NhanVienPage />} /> */}

            {/* Quản lý lương */}
            <Route path="tinh-luong" element={<TinhLuongPage />} />
            <Route path="bao-cao" element={<BaoCaoThuNhap />} />
            {/* <Route path="cham-cong" element={<ChamCongPage />} /> */}

            {/* Nghiệp vụ khác  */}
            <Route path="nghi-phep" element={<ComingSoonPage title="Quản Lý Nghỉ Phép" />} />
            <Route path="thuong-phat" element={<ComingSoonPage title="Khen Thưởng & Kỷ Luật" />} />

            {/* Hệ thống ADMIN */}
            <Route path="tai-khoan" element={<ComingSoonPage title="Quản Lý Tài Khoản Hệ Thống" />} />
            <Route path="cai-dat" element={<ComingSoonPage title="Cấu Hình Hệ Thống" />} />
            <Route path="nhat-ky" element={<ComingSoonPage title="Nhật Ký Hoạt Động " />} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;