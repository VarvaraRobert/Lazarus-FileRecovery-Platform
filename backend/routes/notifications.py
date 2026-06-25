from fastapi import APIRouter, Depends
from database import db
from utils.security import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/notifications", tags=["Notifications"])

async def create_notification(user_id: str, title: str, message: str, notif_type: str = "info"):
    await db.notifications.insert_one({
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": notif_type,
        "read": False,
        "created_at": datetime.utcnow()
    })

@router.get("/")
async def get_notifications(current_user=Depends(get_current_user)):
    notifs = await db.notifications.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).to_list(20)
    return [{
        "id": str(n["_id"]),
        "title": n.get("title", ""),
        "message": n.get("message", ""),
        "type": n.get("type", "info"),
        "read": n.get("read", False),
        "created_at": n.get("created_at", "").isoformat() if isinstance(n.get("created_at"), datetime) else str(n.get("created_at", "")),
    } for n in notifs]

@router.patch("/read-all")
async def mark_all_read(current_user=Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": str(current_user["_id"]), "read": False},
        {"$set": {"read": True}}
    )
    return {"message": "All notifications marked as read"}

@router.patch("/{notif_id}/read")
async def mark_read(notif_id: str, current_user=Depends(get_current_user)):
    await db.notifications.update_one(
        {"_id": ObjectId(notif_id), "user_id": str(current_user["_id"])},
        {"$set": {"read": True}}
    )
    return {"message": "Notification marked as read"}