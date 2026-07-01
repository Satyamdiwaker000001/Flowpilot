from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.features.executions.repository import ExecutionRepository
from app.features.executions.schema import ExecutionCreate
from app.features.chat.repository import ConversationRepository

class ExecutionService:
    def __init__(self, db: Session):
        self.repo = ExecutionRepository(db)
        self.conv_repo = ConversationRepository(db)

    def create_execution(self, conversation_id: int, user_id: int, exec_in: ExecutionCreate):
        # Validate conversation ownership
        conv = self.conv_repo.get_conversation(conversation_id, user_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return self.repo.create_execution(conversation_id, exec_in)

    def get_conversation_executions(self, conversation_id: int, user_id: int):
        # Validate conversation ownership
        conv = self.conv_repo.get_conversation(conversation_id, user_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return self.repo.get_conversation_executions(conversation_id)

    def get_execution(self, exec_id: int, conversation_id: int, user_id: int):
        # Validate conversation ownership
        conv = self.conv_repo.get_conversation(conversation_id, user_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        exc = self.repo.get_execution(exec_id, conversation_id)
        if not exc:
            raise HTTPException(status_code=404, detail="Execution not found")
        return exc
