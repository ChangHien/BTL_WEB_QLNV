# routers/chamcong.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas
from datetime import datetime
import csv, io

router = APIRouter(prefix="/api/chamcong", tags=["chamcong"])

@router.post("/checkin", response_model=schemas.ChamCongOut)
def api_checkin(payload: schemas.ChamCongCreate, db: Session = Depends(get_db)):
    try:
        r = crud.create_checkin(db, payload.ma_nhan_vien, payload.timestamp_utc, payload.source, payload.note)
        return r
    except ValueError as e:
        raise HTTPException(400, str(e))

@router.post("/checkout", response_model=schemas.ChamCongOut)
def api_checkout(payload: schemas.ChamCongCreate, db: Session = Depends(get_db)):
    try:
        r = crud.create_checkout(db, payload.ma_nhan_vien, payload.timestamp_utc, payload.source)
        return r
    except ValueError as e:
        raise HTTPException(400, str(e))

@router.post("/import")
def import_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(content))
    result = {"imported":0, "errors":[]}
    for i,row in enumerate(reader, start=1):
        try:
            ma = row.get("ma_nhan_vien")
            ci = datetime.fromisoformat(row.get("checkin_utc")) if row.get("checkin_utc") else None
            co = datetime.fromisoformat(row.get("checkout_utc")) if row.get("checkout_utc") else None
            if ci:
                crud.create_checkin(db, ma, ci, source="import")
            if co:
                crud.create_checkout(db, ma, co, source="import")
            result["imported"] += 1
        except Exception as e:
            result["errors"].append({"row":i, "error":str(e)})
    return result
