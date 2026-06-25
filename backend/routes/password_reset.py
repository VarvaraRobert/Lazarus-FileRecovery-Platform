from fastapi import APIRouter, HTTPException
from database import db
from pydantic import BaseModel
from datetime import datetime, timedelta
import uuid
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["Password Reset"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    user = await db.users.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    await db.password_resets.delete_many({"email": request.email})
    await db.password_resets.insert_one({
        "email": request.email,
        "token": token,
        "expires_at": expires_at,
        "used": False
    })
    
    return {
        "message": "Reset token generated",
        "token": token,
        "email": request.email,
        "expires_in": "15 minutes"
    }

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    reset_record = await db.password_resets.find_one({
        "token": request.token,
        "used": False
    })
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    if datetime.utcnow() > reset_record["expires_at"]:
        raise HTTPException(status_code=400, detail="Token has expired")
    
    hashed_password = pwd_context.hash(request.new_password)
    await db.users.update_one(
        {"email": reset_record["email"]},
        {"$set": {"password": hashed_password}}
    )
    
    await db.password_resets.update_one(
        {"token": request.token},
        {"$set": {"used": True}}
    )
    
    return {"message": "Password reset successfully"}