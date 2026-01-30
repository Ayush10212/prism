from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.schemas import User
from pydantic import BaseModel, EmailStr
from intelligence.auth_utils import get_password_hash, verify_password, create_access_token

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pass = get_password_hash(user_in.password)
    new_user = User(email=user_in.email, hashed_password=hashed_pass)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": new_user.email, "id": new_user.id})
    return {"access_token": token, "token_type": "bearer", "user": {"email": new_user.email, "id": new_user.id}}

@router.post("/login")
async def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user.email, "id": user.id})
    return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "id": user.id}}
