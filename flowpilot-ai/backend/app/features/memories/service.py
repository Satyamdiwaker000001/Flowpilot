from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.features.memories.repository import MemoryRepository
from app.features.memories.schema import MemoryCreate

class MemoryService:
    def __init__(self, db: Session):
        self.repo = MemoryRepository(db)

    def create_memory(self, user_id: int, mem_in: MemoryCreate):
        return self.repo.create_memory(user_id, mem_in)

    def get_user_memories(self, user_id: int):
        return self.repo.get_user_memories(user_id)

    def get_memory(self, memory_id: int, user_id: int):
        mem = self.repo.get_memory(memory_id, user_id)
        if not mem:
            raise HTTPException(status_code=404, detail="Memory not found")
        return mem
