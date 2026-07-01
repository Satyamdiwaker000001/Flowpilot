from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ExecutionBase(BaseModel):
    tool_name: str
    status: str
    execution_time_ms: Optional[int] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class ExecutionCreate(ExecutionBase):
    pass

class ExecutionResponse(ExecutionBase):
    id: int
    conversation_id: int
    started_at: datetime

    class Config:
        from_attributes = True
