from sqlalchemy import create_engine, Column, String, Boolean, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from typing import Generator
from .config import get_settings

settings = get_settings()

# Database Setup
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# --- Database Models ---

class UserDB(Base):
    """User database model"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="tenant")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class TicketDB(Base):
    """Ticket database model"""
    __tablename__ = "tickets"
    
    id = Column(String, primary_key=True, index=True)
    tenant_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, default="open")  # open, in_progress, waiting_approval, completed, cancelled
    priority = Column(String, default="normal")  # normal, high, emergency
    category = Column(String)  # hvac, plumbing, electrical, etc.
    assigned_to = Column(String)  # technician_id
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# --- Database Initialization ---

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
