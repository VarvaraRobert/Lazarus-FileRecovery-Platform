from fastapi import APIRouter, Depends, HTTPException
from database import db
from utils.security import get_current_user
import os

router = APIRouter(prefix="/hexviewer", tags=["HexViewer"])

@router.get("/scans")
async def get_scans(current_user=Depends(get_current_user)):
    scans = await db.scans.find(
        {"user_id": str(current_user["_id"]), "status": "completed", "recovered_count": {"$gt": 0}}
    ).sort("created_at", -1).to_list(20)
    return [{
        "scan_id": s.get("scan_id", ""),
        "filename": s.get("filename", ""),
        "recovered_count": s.get("recovered_count", 0),
        "created_at": s.get("created_at", "").isoformat() if hasattr(s.get("created_at", ""), "isoformat") else str(s.get("created_at", "")),
    } for s in scans]

@router.get("/files/{scan_id}")
async def get_files(scan_id: str, current_user=Depends(get_current_user)):
    scan = await db.scans.find_one({"scan_id": scan_id, "user_id": str(current_user["_id"])})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan.get("recovered_files", [])

@router.get("/hex/{scan_id}/{file_id}")
async def get_hex(scan_id: str, file_id: str, offset: int = 0, limit: int = 512, current_user=Depends(get_current_user)):
    scan = await db.scans.find_one({"scan_id": scan_id, "user_id": str(current_user["_id"])})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    files = scan.get("recovered_files", [])
    file_info = next((f for f in files if f["file_id"] == file_id), None)
    if not file_info:
        raise HTTPException(status_code=404, detail="File not found")
    
    filepath = file_info.get("filepath", "")
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File no longer exists on disk")
    
    with open(filepath, "rb") as f:
        f.seek(offset)
        data = f.read(limit)
    
    file_size = os.path.getsize(filepath)
    
    rows = []
    for i in range(0, len(data), 16):
        chunk = data[i:i+16]
        row_offset = offset + i
        hex_bytes = ' '.join(f'{b:02X}' for b in chunk)
        hex_padded = hex_bytes.ljust(47)
        ascii_repr = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
        rows.append({
            "offset": f"{row_offset:08X}",
            "hex": hex_padded,
            "ascii": ascii_repr,
        })
    
    return {
        "rows": rows,
        "file_size": file_size,
        "offset": offset,
        "limit": limit,
        "has_more": offset + limit < file_size,
        "filename": file_info.get("filename", ""),
        "file_type": file_info.get("file_type", ""),
    }