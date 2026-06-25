from pydantic import BaseModel, EmailStr 
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    username: str
    email: EmailStr

class UserPreferences(BaseModel):
    theme: Optional[str] = "dark"
    language: Optional[str] = "en"