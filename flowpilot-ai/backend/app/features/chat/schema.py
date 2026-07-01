from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class MessageBase(BaseModel):
    sender_type: str
    message_type: str
    content: str
    token_usage: Optional[int] = 0

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: int
    conversation_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    title: str
    status: Optional[str] = "active"

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True
