from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class MemoryBase(BaseModel):
    memory_type: str
    summary: str
    importance_score: Optional[float] = 1.0
    embedding_id: Optional[str] = None

class MemoryCreate(MemoryBase):
    pass

class MemoryResponse(MemoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
