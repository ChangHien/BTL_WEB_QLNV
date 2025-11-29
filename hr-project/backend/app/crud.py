# crud.py
from sqlalchemy.orm import Session
from . import models
from .utils import generate_ma_nv
from datetime import datetime
from typing import Optional

def create_nhanvien(db: Session, nv_in):
    if nv_in.auto_generate:
        ma_nv = generate_ma_nv(db, nv_in.ma_phong, nv_in.ma_chuc_vu)
    else:
        if not nv_in.ma_nhan_vien:
            raise ValueError("ma_nhan_vien required if auto_generate false")
        ma_nv = nv_in.ma_nhan_vien
        if db.query(models.NhanVien).filter(models.NhanVien.ma_nhan_vien == ma_nv).first():
            raise ValueError("Duplicate ma_nhan_vien")
    nv = models.NhanVien(
        ma_nhan_vien=ma_nv,
        ten_nhan_vien=nv_in.ten_nhan_vien,
        ma_phong=nv_in.ma_phong,
        ma_chuc_vu=nv_in.ma_chuc_vu,
        muc_luong_co_ban=nv_in.muc_luong_co_ban,
        ngay_vao_lam=nv_in.ngay_vao_lam
    )
    db.add(nv)
    db.commit()
    db.refresh(nv)
    return nv

def list_nhanvien(db: Session, skip:int=0, limit:int=100, filters:dict=None):
    q = db.query(models.NhanVien)
    if filters:
        if filters.get("ma_phong"):
            q = q.filter(models.NhanVien.ma_phong == filters["ma_phong"])
        if filters.get("ma_chuc_vu"):
            q = q.filter(models.NhanVien.ma_chuc_vu == filters["ma_chuc_vu"])
        if filters.get("search"):
            s = f"%{filters['search']}%"
            q = q.filter(models.NhanVien.ten_nhan_vien.ilike(s) | models.NhanVien.ma_nhan_vien.ilike(s))
    return q.offset(skip).limit(limit).all()

def get_nhanvien(db: Session, ma_nv: str):
    return db.query(models.NhanVien).filter(models.NhanVien.ma_nhan_vien == ma_nv).first()

# ChamCong logic
def has_overlap(db: Session, ma_nv: str, new_checkin: datetime, new_checkout: Optional[datetime]):
    rows = db.query(models.ChamCong).filter(models.ChamCong.ma_nhan_vien==ma_nv).all()
    for r in rows:
        ex_ci = r.checkin_utc
        ex_co = r.checkout_utc
        # if existing open
        if new_checkout is None:
            # new open: overlap if ex_co is None or ex_co > new_checkin and ex_ci <= new_checkin
            if ex_co is None:
                # if existing session with no checkout overlaps in time
                if (ex_ci <= new_checkin):
                    return True
            else:
                # existing closed: if ex_ci < INF and ex_co > new_checkin and ex_ci <= new_checkin
                if ex_ci <= new_checkin < ex_co:
                    return True
        else:
            # both defined: overlap if ex_ci < new_checkout AND (ex_co is None or ex_co > new_checkin)
            if ex_ci < new_checkout and (ex_co is None or ex_co > new_checkin):
                return True
    return False

def create_checkin(db: Session, ma_nv: str, ts: datetime, source="self", note: str=None):
    nv = get_nhanvien(db, ma_nv)
    if not nv:
        raise ValueError("Nhan vien not found")
    if ts > datetime.utcnow():
        raise ValueError("Timestamp in future")
    if has_overlap(db, ma_nv, ts, None):
        raise ValueError("Overlap with existing session")
    rec = models.ChamCong(ma_nhan_vien=ma_nv, checkin_utc=ts, source=source, note=note)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

def create_checkout(db: Session, ma_nv: str, ts: datetime, source="self"):
    rec = db.query(models.ChamCong).filter(models.ChamCong.ma_nhan_vien==ma_nv, models.ChamCong.checkout_utc==None).order_by(models.ChamCong.checkin_utc.desc()).first()
    if not rec:
        raise ValueError("No open checkin")
    if ts <= rec.checkin_utc:
        raise ValueError("checkout must be after checkin")
    # check overlap against other sessions
    others = db.query(models.ChamCong).filter(models.ChamCong.ma_nhan_vien==ma_nv, models.ChamCong.id != rec.id).all()
    for ex in others:
        ex_ci = ex.checkin_utc
        ex_co = ex.checkout_utc
        if ex_ci < ts and (ex_co is None or ex_co > rec.checkin_utc):
            raise ValueError("Checkout would overlap with other session")
    rec.checkout_utc = ts
    db.commit()
    db.refresh(rec)
    return rec
