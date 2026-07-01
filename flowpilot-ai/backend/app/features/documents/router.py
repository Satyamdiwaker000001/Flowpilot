from typing import List
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.features.auth.dependencies import get_current_user
from app.features.auth.model import User
from app.features.documents.schema import FileResponse
from app.features.documents.service import FileService

router = APIRouter(prefix="/files", tags=["Files"])

@router.post("/", response_model=FileResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = FileService(db)
    return await svc.upload_and_index(current_user.id, file)

@router.get("/", response_model=List[FileResponse])
def get_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = FileService(db)
    return svc.get_user_files(current_user.id)

@router.get("/{file_id}", response_model=FileResponse)
def get_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = FileService(db)
    return svc.get_file(file_id, current_user.id)
