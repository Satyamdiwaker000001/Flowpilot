from sqlalchemy.orm import Session
from app.features.executions.model import ToolExecution
from app.features.executions.schema import ExecutionCreate

class ExecutionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_execution(self, conversation_id: int, exec_in: ExecutionCreate) -> ToolExecution:
        db_obj = ToolExecution(**exec_in.model_dump(), conversation_id=conversation_id)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_conversation_executions(self, conversation_id: int):
        return self.db.query(ToolExecution).filter(ToolExecution.conversation_id == conversation_id).all()

    def get_execution(self, exec_id: int, conversation_id: int):
        return self.db.query(ToolExecution).filter(ToolExecution.id == exec_id, ToolExecution.conversation_id == conversation_id).first()
