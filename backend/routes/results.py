from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from utils.security import get_current_user
from database import db
import os

router = APIRouter(prefix="/results", tags=["Results"])

@router.get("/{scan_id}")
async def get_results(scan_id: str, current_user=Depends(get_current_user)):
    scan = await db.scans.find_one({"scan_id": scan_id})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    scan["_id"] = str(scan["_id"])
    return scan

@router.get("/download/{scan_id}/{file_id}")
async def download_file(scan_id: str, file_id: str, current_user=Depends(get_current_user)):
    scan = await db.scans.find_one({"scan_id": scan_id})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    recovered = scan.get("recovered_files", [])
    file_info = next((f for f in recovered if f["file_id"] == file_id), None)
    
    if not file_info:
        raise HTTPException(status_code=404, detail="File not found")
    
    if not os.path.exists(file_info["filepath"]):
        raise HTTPException(status_code=404, detail="File no longer exists")
    
    return FileResponse(
        path=file_info["filepath"],
        filename=file_info["filename"],
        media_type="application/octet-stream"
    )