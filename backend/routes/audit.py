from fastapi import APIRouter, Depends
from database import db
from utils.security import get_current_user
from datetime import datetime

router = APIRouter(prefix="/audit", tags=["Audit"])

async def log_action(user_id: str, action: str, details: str = ""):
    await db.audit_logs.insert_one({
        "user_id": user_id,
        "action": action,
        "details": details,
        "timestamp": datetime.utcnow()
    })

@router.get("/logs")
async def get_logs(current_user=Depends(get_current_user)):
    logs = await db.audit_logs.find(
        {"user_id": str(current_user["_id"])}
    ).sort("timestamp", -1).to_list(100)
    
    return [{
        "action": l.get("action", ""),
        "details": l.get("details", ""),
        "timestamp": l.get("timestamp", "").isoformat() if isinstance(l.get("timestamp"), datetime) else str(l.get("timestamp", "")),
    } for l in logs]