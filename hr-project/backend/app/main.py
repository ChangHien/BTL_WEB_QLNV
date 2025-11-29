# main.py
from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routers import nhanvien, chamcong

# create tables when run (dev convenience)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Service - Dev2")

app.include_router(nhanvien.router)
app.include_router(chamcong.router)
