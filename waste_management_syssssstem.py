# --- 1. IMPORTS & SETUP ---
import os
import uvicorn
from datetime import datetime, timedelta
from typing import List, Optional, Dict

# FastAPI for API creation
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# Pydantic for data validation and settings
from pydantic import BaseModel, Field

# SQLAlchemy for database interaction
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.ext.declarative import declarative_base

# JWT for authentication
from jose import JWTError, jwt

# Password hashing
from passlib.context import CryptContext

# Other standard libraries
import random
import enum
import time

# --- 2. CONFIGURATION ---
SECRET_KEY = "a_very_secret_key_for_jwt"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
DATABASE_URL = "sqlite:///./waste_management.db"

# --- 3. DATABASE SETUP & MODELS ---
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enums
class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    FIELD_STAFF = "field_staff"
    ADMIN = "admin"

class IssueStatus(str, enum.Enum):
    REPORTED = "reported"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"

class BinStatus(str, enum.Enum):
    EMPTY = "empty"
    FILLING = "filling"
    FULL = "full"
    OVERFLOWING = "overflowing"
    MAINTENANCE = "maintenance"

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CITIZEN)
    is_active = Column(Integer, default=1)

    issues_reported = relationship(
        "Issue",
        back_populates="reporter",
        foreign_keys="Issue.reporter_id"
    )
    issues_assigned = relationship(
        "Issue",
        back_populates="assignee",
        foreign_keys="Issue.assigned_to_id"
    )
    points = relationship("RewardPoint", back_populates="user")

class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    waste_type = Column(String, default="General")
    location = Column(String)
    status = Column(Enum(IssueStatus), default=IssueStatus.REPORTED)
    reported_at = Column(DateTime, default=datetime.utcnow)
    reporter_id = Column(Integer, ForeignKey("users.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    reporter = relationship(
        "User",
        back_populates="issues_reported",
        foreign_keys=[reporter_id]
    )
    assignee = relationship(
        "User",
        back_populates="issues_assigned",
        foreign_keys=[assigned_to_id]
    )

class RewardPoint(Base):
    __tablename__ = "reward_points"
    id = Column(Integer, primary_key=True, index=True)
    points = Column(Integer, nullable=False)
    reason = Column(String)
    awarded_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="points")

class WasteBin(Base):
    __tablename__ = "waste_bins"
    id = Column(Integer, primary_key=True, index=True)
    location_lat = Column(Float, nullable=False)
    location_lon = Column(Float, nullable=False)
    capacity_liters = Column(Integer, default=100)
    current_fill_level = Column(Float, default=0.0)
    status = Column(Enum(BinStatus), default=BinStatus.EMPTY)
    last_emptied = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# --- 4. PYDANTIC SCHEMAS ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    username: str
    password: str
    role: UserRole = UserRole.CITIZEN

class UserInDB(UserBase):
    id: int
    username: str
    role: UserRole
    is_active: bool
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class IssueBase(BaseModel):
    title: str
    description: str
    location: str

class IssueCreate(IssueBase):
    pass

class IssueView(IssueBase):
    id: int
    status: IssueStatus
    reported_at: datetime
    reporter_id: int
    class Config:
        orm_mode = True

class BinBase(BaseModel):
    location_lat: float
    location_lon: float
    capacity_liters: Optional[int] = 100

class BinCreate(BinBase):
    pass

class BinView(BinBase):
    id: int
    current_fill_level: float
    status: BinStatus
    last_emptied: datetime
    class Config:
        orm_mode = True

# --- 5. SECURITY & AUTHENTICATION ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

def is_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user

def is_field_staff(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.FIELD_STAFF:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Field staff access required")
    return current_user

# --- 6. SERVICES ---
class NotificationService:
    @staticmethod
    def send_notification(user_email: str, message: str):
        print(f"--- NOTIFICATION ---\nTo: {user_email}\nMessage: {message}\n--------------------")

class IncentiveService:
    @staticmethod
    def award_points(db: Session, user: User, points: int, reason: str):
        reward = RewardPoint(user_id=user.id, points=points, reason=reason)
        db.add(reward)
        db.commit()
        db.refresh(reward)
        NotificationService.send_notification(user.email, f"You earned {points} points for: {reason}.")
        return reward

class IoTService:
    @staticmethod
    def simulate_bin_fill_level_update(db: Session, bin_id: int):
        db_bin = db.query(WasteBin).filter(WasteBin.id == bin_id).first()
        if not db_bin:
            return
        db_bin.current_fill_level = round(random.uniform(0, 100), 2)
        if db_bin.current_fill_level > 95:
            db_bin.status = BinStatus.OVERFLOWING
        elif db_bin.current_fill_level > 80:
            db_bin.status = BinStatus.FULL
        elif db_bin.current_fill_level > 10:
            db_bin.status = BinStatus.FILLING
        else:
            db_bin.status = BinStatus.EMPTY
        db.commit()
        return db_bin

# --- 7. API SETUP ---
app = FastAPI(title="Unified Waste Management System")

# ROUTERS (auth, citizen, staff, admin, iot)
# --- [Insert all your routers here, unchanged from your code] ---
# ... same as your previous code ...

# --- 8. MAIN APPLICATION SETUP ---

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        if not get_user(db, "admin"):
            register_user(UserCreate(username="admin", email="admin@example.com", password="adminpassword", role=UserRole.ADMIN, full_name="Admin User"), db)
        if not get_user(db, "citizen1"):
            register_user(UserCreate(username="citizen1", email="citizen1@example.com", password="password123", role=UserRole.CITIZEN, full_name="John Doe"), db)
        if not get_user(db, "staff1"):
            register_user(UserCreate(username="staff1", email="staff1@example.com", password="staffpass", role=UserRole.FIELD_STAFF, full_name="Jane Smith"), db)

        if db.query(WasteBin).count() == 0:
            db.add(WasteBin(location_lat=12.9716, location_lon=77.5946))  # Bangalore
            db.add(WasteBin(location_lat=28.6139, location_lon=77.2090, capacity_liters=250))  # Delhi
            db.commit()
    finally:
        db.close()
    print("--- Application has started. Default users created. ---")

@app.get("/", tags=["Root"])
def read_root():
    return {"status": "Unified Waste Management System API is running."}

# --- 9. SCRIPT EXECUTION ---
if __name__ == "__main__":
    print("--- Starting Uvicorn server from script ---")
    uvicorn.run(app, host="127.0.0.1", port=8000)