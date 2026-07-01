from sqlalchemy.orm import Session
from app.features.memories.model import Memory
from app.features.memories.schema import MemoryCreate

class MemoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_memory(self, user_id: int, mem_in: MemoryCreate) -> Memory:
        db_obj = Memory(**mem_in.model_dump(), user_id=user_id)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_user_memories(self, user_id: int):
        return self.db.query(Memory).filter(Memory.user_id == user_id).all()

    def get_memory(self, memory_id: int, user_id: int):
        return self.db.query(Memory).filter(Memory.id == memory_id, Memory.user_id == user_id).first()
