import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks, HTTPException
from utils.security import get_current_user
from services.carving_service import CarvingService
from database import db
from pydantic import BaseModel
from datetime import datetime
from routes.audit import log_action
from routes.notifications import create_notification

router = APIRouter(prefix="/upload", tags=["Upload"])

ALLOWED_EXTENSIONS = {".img", ".dd", ".bin", ".raw"}
MAX_FILE_SIZE = 500 * 1024 * 1024

async def run_carving(scan_id: str, data: bytes, user_id: str):
    service = CarvingService()
    recovered = service.carve(data, scan_id)
    await db.scans.update_one(
        {"scan_id": scan_id},
        {"$set": {
            "status": "completed",
            "recovered_count": len(recovered),
            "recovered_files": recovered
        }}
    )
    await log_action(user_id, "SCAN_COMPLETE", f"Scan completed: {len(recovered)} files recovered")
    await create_notification(user_id, "Scan Complete", f"Recovered {len(recovered)} files from scan.", "success")

@router.post("/disk-image")
async def upload_disk_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed")
    data = await file.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    scan_id = str(uuid.uuid4())
    await db.scans.insert_one({
        "scan_id": scan_id,
        "user_id": str(current_user["_id"]),
        "filename": file.filename,
        "file_size": len(data),
        "status": "processing",
        "recovered_count": 0,
        "recovered_files": [],
        "created_at": datetime.utcnow(),
    })

class FilePathRequest(BaseModel):
    file_path: str

@router.post("/by-path")
async def upload_by_path(
    background_tasks: BackgroundTasks,
    request: FilePathRequest,
    current_user=Depends(get_current_user)
):
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=400, detail="File not found")
    with open(request.file_path, "rb") as f:
        data = f.read()
    scan_id = str(uuid.uuid4())
    await db.scans.insert_one({
        "scan_id": scan_id,
        "user_id": str(current_user["_id"]),
        "filename": os.path.basename(request.file_path),
        "file_size": len(data),
        "status": "processing",
        "recovered_count": 0,
        "recovered_files": [],
        "created_at": datetime.utcnow(),
    })

    await log_action(str(current_user["_id"]), "SCAN_STARTED", f"Scan started on {request.file_path}")
    background_tasks.add_task(run_carving, scan_id, data, str(current_user["_id"]))
    return {"scan_id": scan_id, "status": "processing"}

    background_tasks.add_task(run_carving, scan_id, data, str(current_user["_id"]))

    return {"scan_id": scan_id, "status": "processing"}
