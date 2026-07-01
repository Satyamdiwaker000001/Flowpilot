from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class FileBase(BaseModel):
    original_filename: str
    storage_key: str
    mime_type: str
    file_size: int
    upload_status: Optional[str] = "pending"

class FileCreate(FileBase):
    conversation_id: Optional[int] = None

class FileResponse(FileBase):
    id: int
    user_id: int
    conversation_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
