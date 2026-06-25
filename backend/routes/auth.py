from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from models.user import UserCreate, UserOut
from utils.jwt_handler import create_access_token
from database import db
from passlib.context import CryptContext
from routes.audit import log_action
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user_dict = user.model_dump()
    user_dict["password"] = pwd_context.hash(user_dict["password"])
    result = await db.users.insert_one(user_dict)
    await log_action(str(result.inserted_id), "REGISTER", f"New account created for {user.email}")
    return UserOut(username=user.username, email=user.email)

@router.post("/login")
async def login(from_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({
        "$or": [
            {"email": from_data.username},
            {"username": from_data.username}
        ]
    })
    if not user or not pwd_context.verify(from_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await log_action(str(user["_id"]), "LOGIN", f"User {user['email']} logged in")
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer"}