
import os
from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+psycopg://{os.getenv('USER', 'postgres')}@localhost:5432/interntrack",
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


class ApplicationDB(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(30), default="Saved")


class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: Literal[
        "Saved", "Applied", "Assessment",
        "Interview", "Offer", "Rejected"
    ] = "Saved"


class Application(ApplicationCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.query(ApplicationDB).count() == 0:
            db.add_all([
                ApplicationDB(
                    company="Google",
                    role="Software Engineering Intern",
                    status="Applied",
                ),
                ApplicationDB(
                    company="Microsoft",
                    role="SDE Intern",
                    status="Interview",
                ),
            ])
            db.commit()
    yield


app = FastAPI(title="InternTrack API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to InternTrack API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/applications", response_model=list[Application])
def get_applications():
    with SessionLocal() as db:
        return db.query(ApplicationDB).order_by(ApplicationDB.id).all()


@app.post("/applications", response_model=Application, status_code=201)
def create_application(data: ApplicationCreate):
    with SessionLocal() as db:
        application = ApplicationDB(**data.model_dump())
        db.add(application)
        db.commit()
        db.refresh(application)
        return application


@app.patch("/applications/{application_id}", response_model=Application)
def update_application(application_id: int, data: ApplicationCreate):
    with SessionLocal() as db:
        application = db.get(ApplicationDB, application_id)
        if application is None:
            raise HTTPException(status_code=404, detail="Application not found")

        for field, value in data.model_dump().items():
            setattr(application, field, value)

        db.commit()
        db.refresh(application)
        return application


@app.delete("/applications/{application_id}")
def delete_application(application_id: int):
    with SessionLocal() as db:
        application = db.get(ApplicationDB, application_id)
        if application is None:
            raise HTTPException(status_code=404, detail="Application not found")

        db.delete(application)
        db.commit()
        return {"message": "Application deleted"}
