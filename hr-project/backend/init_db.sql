CREATE DATABASE IF NOT EXISTS baitaplon;
USE baitaplon;

CREATE TABLE IF NOT EXISTS PhongBan (
    ma_phong CHAR(3) PRIMARY KEY,
    ten_phong VARCHAR(100) NOT NULL,
    nam_thanh_lap YEAR,
    trang_thai ENUM('HoatDong', 'NgungHoatDong') DEFAULT 'HoatDong'
);

CREATE TABLE IF NOT EXISTS ChucVu (
    ma_chuc_vu CHAR(1) PRIMARY KEY,
    ten_chuc_vu VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS NhanVien (
    ma_nhan_vien VARCHAR(12) PRIMARY KEY,
    ten_nhan_vien VARCHAR(255) NOT NULL,
    ma_phong CHAR(3),
    ma_chuc_vu CHAR(1),
    muc_luong_co_ban DECIMAL(12,2) NOT NULL,
    ngay_vao_lam DATE,
    trang_thai ENUM('DangLam', 'DaNghi', 'TamNghi') DEFAULT 'DangLam',
    is_hidden TINYINT(1) DEFAULT 0,
    FOREIGN KEY (ma_phong) REFERENCES PhongBan(ma_phong),
    FOREIGN KEY (ma_chuc_vu) REFERENCES ChucVu(ma_chuc_vu)
);

-- ChamCong: lưu DATETIME (UTC) cho checkin/checkout
CREATE TABLE IF NOT EXISTS ChamCong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nhan_vien VARCHAR(12),
    checkin_utc DATETIME NOT NULL,
    checkout_utc DATETIME NULL,
    source VARCHAR(20) DEFAULT 'self',
    note VARCHAR(255),
    FOREIGN KEY (ma_nhan_vien) REFERENCES NhanVien(ma_nhan_vien)
);

CREATE TABLE IF NOT EXISTS BangLuong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nhan_vien VARCHAR(12),
    thang INT,
    nam INT,
    tong_gio_lam DECIMAL(6,2),
    luong_co_ban DECIMAL(12,2),
    luong_them_gio DECIMAL(12,2),
    tong_luong DECIMAL(12,2),
    status ENUM('Draft','Finalized') DEFAULT 'Draft',
    FOREIGN KEY (ma_nhan_vien) REFERENCES NhanVien(ma_nhan_vien),
    UNIQUE(ma_nhan_vien, thang, nam)
);

CREATE TABLE IF NOT EXISTS TaiKhoan (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'hr', 'nhanvien'),
    ma_nhan_vien VARCHAR(12),
    FOREIGN KEY (ma_nhan_vien) REFERENCES NhanVien(ma_nhan_vien)
);

-- Global sequence for ma_nhan_vien
CREATE TABLE IF NOT EXISTS GlobalSequence (
    name VARCHAR(50) PRIMARY KEY,
    last_value INT DEFAULT 0
);
