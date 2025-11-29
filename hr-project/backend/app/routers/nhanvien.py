# routers/nhanvien.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/nhanvien", tags=["nhanvien"])

@router.post("", response_model=schemas.NhanVienOut)
def create_nv(payload: schemas.NhanVienBase, db: Session = Depends(get_db)):
    try:
        nv = crud.create_nhanvien(db, payload)
        return nv
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=list[schemas.NhanVienOut])
def list_nv(skip:int=0, limit:int=100, search: str|None=None, ma_phong: str|None=None, ma_chuc_vu: str|None=None, db: Session = Depends(get_db)):
    filters={}
    if search: filters["search"]=search
    if ma_phong: filters["ma_phong"]=ma_phong
    if ma_chuc_vu: filters["ma_chuc_vu"]=ma_chuc_vu
    return crud.list_nhanvien(db, skip, limit, filters)

@router.get("/{ma_nv}", response_model=schemas.NhanVienOut)
def get_nv(ma_nv: str, db: Session = Depends(get_db)):
    nv = crud.get_nhanvien(db, ma_nv)
    if not nv:
        raise HTTPException(404, "Nhan vien not found")
    return nv
