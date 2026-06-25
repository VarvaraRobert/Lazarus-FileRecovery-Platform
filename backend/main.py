from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from utils.security import get_current_user
from routes.upload import router as upload_router
from routes.results import router as results_router
from routes.cases import router as cases_router
from routes.reports import router as reports_router
from database import db
from routes.audit import router as audit_router
from routes.notifications import router as notifications_router
from routes.hexviewer import router as hexviewer_router
from routes.google_auth import router as google_auth_router
from routes.password_reset import router as password_reset_router

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(
    title="File Recovery Platform",
    description="A web platform for recovering deleted files using file carving techniques",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(results_router)

app.include_router(upload_router)

app.include_router(auth_router)

app.include_router(cases_router)

app.include_router(reports_router)

app.include_router(audit_router)

app.include_router(notifications_router)

app.include_router(hexviewer_router)

app.include_router(google_auth_router)

app.include_router(password_reset_router)

@app.get("/")
async def read_root():
    return {"message": "File Recovery Platform API is running"}

@app.get("/api/me")
async def get_me(current_user = Depends(get_current_user)):
    return {"username": current_user["username"], "email": current_user["email"]}

@app.patch("/api/me/preferences")
async def update_preferences(preferences: dict, current_user=Depends(get_current_user)):
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"preferences": preferences}}
    )
    return {"message": "Preferences updated"}

@app.get("/api/me/preferences")
async def get_preferences(current_user=Depends(get_current_user)):
    prefs = current_user.get("preferences", {"theme": "dark", "language": "en"})
    return prefs