from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import httpx
import os
from utils.jwt_handler import create_access_token
from database import db
from routes.audit import log_action
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth/google", tags=["Google OAuth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

@router.get("/login")
async def google_login():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{query}")

@router.get("/callback")
async def google_callback(code: str):
    async with httpx.AsyncClient() as client:
        token_res = await client.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        })
    
    if token_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get token from Google")
    
    token_data = token_res.json()
    access_token = token_data.get("access_token")

    async with httpx.AsyncClient() as client:
        userinfo_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
    
    if userinfo_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get user info from Google")
    
    userinfo = userinfo_res.json()
    email = userinfo.get("email")
    name = userinfo.get("name", email.split("@")[0])
    google_id = userinfo.get("id")

    user = await db.users.find_one({"email": email})
    
    if not user:
        new_user = {
            "username": name,
            "email": email,
            "password": f"google_{google_id}",
            "google_id": google_id,
            "auth_provider": "google",
        }
        result = await db.users.insert_one(new_user)
        user = await db.users.find_one({"_id": result.inserted_id})

    await log_action(str(user["_id"]), "LOGIN", f"User {email} logged in via Google OAuth2")

    jwt_token = create_access_token({"sub": str(user["_id"]), "email": email})
    
    return RedirectResponse(f"{FRONTEND_URL}/google-callback?token={jwt_token}")