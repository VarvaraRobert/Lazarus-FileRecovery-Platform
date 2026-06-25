from fastapi import APIRouter, Depends
from utils.security import get_current_user
from database import db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/stats")
async def get_stats(current_user=Depends(get_current_user)):
    user_id = current_user["_id"]
    
    scans = await db.scans.find({"user_id": str(user_id)}).to_list(1000)

    total_scans = len(scans)
    total_files = sum(s.get("recovered_count", 0) for s in scans)
    total_size = sum(s.get("file_size", 0) for s in scans)
    
    type_counts = {"jpeg": 0, "jpg": 0, "png": 0, "pdf": 0, "docx": 0}
    for scan in scans:
        for f in scan.get("recovered_files", []):
            ft = f.get("file_type", "").lower()
            if ft in type_counts:
                type_counts[ft] += 1
    
    jpeg_total = type_counts["jpeg"] + type_counts["jpg"]
    
    def sort_key(x):
        val = x.get("created_at", "")
        if isinstance(val, str):
            return val
        return val.isoformat()

    recent_scans = sorted(scans, key=sort_key, reverse=True)[:10]
    recent = []
    for s in recent_scans:
        recent.append({
            "scan_id": s.get("scan_id", ""),
            "filename": s.get("filename", ""),
            "status": s.get("status", ""),
            "recovered_count": s.get("recovered_count", 0),
            "file_size": s.get("file_size", 0),
            "created_at": s.get("created_at", "").isoformat() if hasattr(s.get("created_at", ""), "isoformat") else str(s.get("created_at", "")),
        })
    
    return {
        "total_scans": total_scans,
        "total_files": total_files,
        "total_size_mb": round(total_size / (1024 * 1024), 2),
        "file_types": {
            "jpeg": jpeg_total,
            "png": type_counts["png"],
            "pdf": type_counts["pdf"],
            "docx": type_counts["docx"],
        },
        "recent_scans": recent,
    }