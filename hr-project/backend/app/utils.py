# utils.py
from sqlalchemy.orm import Session
from .models import GlobalSequence
from sqlalchemy import select
from datetime import datetime

def get_next_global_seq(db: Session, name: str = "nhan_vien") -> int:
    # simple transaction-safe increment
    seq = db.query(GlobalSequence).filter(GlobalSequence.name == name).with_for_update().first()
    if not seq:
        seq = GlobalSequence(name=name, last_value=1)
        db.add(seq)
        db.commit()
        db.refresh(seq)
        return seq.last_value
    seq.last_value += 1
    db.commit()
    db.refresh(seq)
    return seq.last_value

def generate_ma_nv(db: Session, ma_phong: str, ma_chuc_vu: str) -> str:
    mp = (ma_phong or "XXX").upper()[:3].ljust(3, "X")
    cv = (ma_chuc_vu or "X").upper()[:1]
    seq = get_next_global_seq(db, name="nhan_vien")
    return f"{mp}{cv}{seq:04d}"
