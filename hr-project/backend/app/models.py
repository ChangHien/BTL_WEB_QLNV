# models.py
from sqlalchemy import Column, Integer, String, Date, DateTime, DECIMAL, Enum, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class PhongBan(Base):
    __tablename__ = "PhongBan"
    ma_phong = Column(String(3), primary_key=True)
    ten_phong = Column(String(100), nullable=False)
    nam_thanh_lap = Column(Integer)
    trang_thai = Column(Enum('HoatDong','NgungHoatDong'), default='HoatDong')

class ChucVu(Base):
    __tablename__ = "ChucVu"
    ma_chuc_vu = Column(String(1), primary_key=True)
    ten_chuc_vu = Column(String(100), nullable=False)

class NhanVien(Base):
    __tablename__ = "NhanVien"
    ma_nhan_vien = Column(String(12), primary_key=True)
    ten_nhan_vien = Column(String(255), nullable=False)
    ma_phong = Column(String(3), ForeignKey("PhongBan.ma_phong"))
    ma_chuc_vu = Column(String(1), ForeignKey("ChucVu.ma_chuc_vu"))
    muc_luong_co_ban = Column(DECIMAL(12,2), nullable=False)
    ngay_vao_lam = Column(Date)
    trang_thai = Column(Enum('DangLam','DaNghi','TamNghi'), default='DangLam')
    is_hidden = Column(Boolean, default=False)

class ChamCong(Base):
    __tablename__ = "ChamCong"
    id = Column(Integer, primary_key=True, autoincrement=True)
    ma_nhan_vien = Column(String(12), ForeignKey("NhanVien.ma_nhan_vien"), nullable=False)
    checkin_utc = Column(DateTime, nullable=False)
    checkout_utc = Column(DateTime, nullable=True)
    source = Column(String(20), default="self")
    note = Column(String(255))

class GlobalSequence(Base):
    __tablename__ = "GlobalSequence"
    name = Column(String(50), primary_key=True)
    last_value = Column(Integer, default=0)
