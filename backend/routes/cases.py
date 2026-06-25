from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId
from database import db
from utils.security import get_current_user
from routes.notifications import create_notification

router = APIRouter(prefix="/cases", tags=["cases"])

class CaseCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    status: Optional[str] = "Active"

class CaseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

def serialize_case(case):
    return {
        "id": str(case["_id"]),
        "case_id": case.get("case_id", ""),
        "name": case.get("name", ""),
        "description": case.get("description", ""),
        "status": case.get("status", "Active"),
        "notes": case.get("notes", ""),
        "investigator": case.get("investigator", ""),
        "file_count": case.get("file_count", 0),
        "created_at": case.get("created_at", "").isoformat() if isinstance(case.get("created_at"), datetime) else str(case.get("created_at", "")),
    }

@router.get("/")
async def get_cases(current_user=Depends(get_current_user)):
    all_cases = await db["cases"].find({}).to_list(100)
    cases = await db["cases"].find({"user_id": current_user["_id"]}).to_list(100)
    print(f"ALL CASES: {len(all_cases)}, USER CASES: {len(cases)}, USER_ID: {current_user['_id']}")
    return [serialize_case(c) for c in cases]

@router.post("/")
async def create_case(data: CaseCreate, current_user=Depends(get_current_user)):
    count = await db["cases"].count_documents({"user_id": current_user["_id"]})
    case_id = f"CASE-{datetime.now().year}-{str(count + 1).zfill(3)}"
    case = {
        "case_id": case_id,
        "name": data.name,
        "description": data.description,
        "status": data.status,
        "notes": "",
        "investigator": current_user["username"],
        "file_count": 0,
        "user_id": current_user["_id"],
        "created_at": datetime.utcnow(),
    }
    result = await db["cases"].insert_one(case)
    case["_id"] = result.inserted_id
    await create_notification(str(current_user["_id"]), "Case Created", f"Case {case_id} has been created.", "info")
    return serialize_case(case)


@router.patch("/{case_id}")
async def update_case(case_id: str, data: CaseUpdate, current_user=Depends(get_current_user)):
    update = {k: v for k, v in data.dict().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="Nothing to update")
    await db["cases"].update_one(
        {"_id": ObjectId(case_id), "user_id": current_user["_id"]},
        {"$set": update}
    )
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    return serialize_case(case)

@router.delete("/{case_id}")
async def delete_case(case_id: str, current_user=Depends(get_current_user)):
    await db["cases"].delete_one({"_id": ObjectId(case_id), "user_id": current_user["_id"]})
    await create_notification(str(current_user["_id"]), "Case Deleted", f"Case {case_id} has been deleted.", "info")
    return {"message": "Case deleted"}
