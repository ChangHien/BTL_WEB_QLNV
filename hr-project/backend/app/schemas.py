# schemas.py
from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class NhanVienBase(BaseModel):
    ten_nhan_vien: str
    ma_phong: str
    ma_chuc_vu: str
    muc_luong_co_ban: float
    ngay_vao_lam: Optional[date] = None
    auto_generate: Optional[bool] = True
    ma_nhan_vien: Optional[str] = None

class NhanVienOut(BaseModel):
    ma_nhan_vien: str
    ten_nhan_vien: str
    ma_phong: Optional[str]
    ma_chuc_vu: Optional[str]
    muc_luong_co_ban: float
    ngay_vao_lam: Optional[date]
    trang_thai: Optional[str]
    is_hidden: bool

    class Config:
        orm_mode = True

class ChamCongCreate(BaseModel):
    ma_nhan_vien: str
    timestamp_utc: datetime
    source: Optional[str] = "self"
    note: Optional[str] = None

class ChamCongOut(BaseModel):
    id: int
    ma_nhan_vien: str
    checkin_utc: datetime
    checkout_utc: Optional[datetime]
    source: Optional[str]
    note: Optional[str]

    class Config:
        orm_mode = True
