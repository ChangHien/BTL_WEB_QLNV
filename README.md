👨‍💻 Giới thiệu
Nhánh này bao gồm:
- Foundation Tasks: Thiết lập cấu trúc thư mục, layout chính, routing, API client, authentication.
- Feature Tasks: Quản lý Phòng ban, Chức vụ, Tính lương và Báo cáo thu nhập.
  
📂 Cấu trúc thư mục
src/
 ├── api/
 │    ├── axiosClient.js
 │    ├── phongBanApi.js
 │    ├── chucVuApi.js
 │    ├── luongApi.js
 │    └── baoCaoApi.js
 │
 ├── components/
 │    └── layout/
 │         ├── MainLayout.jsx
 │         └── Sidebar.jsx
 │
 ├── contexts/
 │    └── AuthContext.jsx
 │
 ├── hooks/
 │
 ├── pages/
 │    ├── Auth/LoginPage.jsx
 │    ├── PhongBan/PhongBanPage.jsx
 │    ├── ChucVu/ChucVuPage.jsx
 │    ├── Luong/TinhLuongPage.jsx
 │    └── BaoCao/BaoCaoThuNhap.jsx
 │
 ├── routes/
 │    └── AppRoutes.jsx
 │
 └── App.jsx
 │
 └── index.css
 


 
⚙️ Foundation Tasks
- Cấu trúc thư mục: Tạo các thư mục api, components, pages, routes, hooks.
- Layout chính:
- MainLayout.jsx chứa Sidebar, Header, Menu.
- Sidebar.jsx định nghĩa menu item (Trang chủ, Phòng ban, Nhân viên...).
- Routing:
- AppRoutes.jsx định nghĩa các đường dẫn.
- App.jsx sử dụng AppRoutes.
- API Client:
- axiosClient.js cấu hình baseURL (chờ backend cung cấp).
- Authentication:
- LoginPage.jsx để đăng nhập.
- AuthContext.jsx quản lý token và trạng thái đăng nhập.

  
🛠️ Feature Tasks – Quản lý Tổ chức & Lương
1. CRUD Phòng ban
- UI: PhongBanPage.jsx (Bảng danh sách, Modal thêm/sửa).
- API: phongBanApi.js (getPhongBanList, createPhongBan, updatePhongBan, deletePhongBan).
2. CRUD Chức vụ
- UI: ChucVuPage.jsx.
- API: chucVuApi.js.
3. Tính lương
- UI: TinhLuongPage.jsx (chọn tháng/năm để chạy payroll).
- API: luongApi.js.
4. Báo cáo thu nhập
- UI: BaoCaoThuNhap.jsx (biểu đồ + bảng báo cáo).
- API: baoCaoApi.js.

