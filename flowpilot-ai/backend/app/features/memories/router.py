from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.features.auth.dependencies import get_current_user
from app.features.auth.model import User
from app.features.memories.schema import MemoryCreate, MemoryResponse
from app.features.memories.service import MemoryService

router = APIRouter(prefix="/memories", tags=["Memories"])

@router.post("/", response_model=MemoryResponse)
def create_memory(
    mem_in: MemoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = MemoryService(db)
    return svc.create_memory(current_user.id, mem_in)

@router.get("/", response_model=List[MemoryResponse])
def get_memories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = MemoryService(db)
    return svc.get_user_memories(current_user.id)

@router.get("/{memory_id}", response_model=MemoryResponse)
def get_memory(
    memory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = MemoryService(db)
    return svc.get_memory(memory_id, current_user.id)
