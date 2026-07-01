from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.features.auth.dependencies import get_current_user
from app.features.auth.model import User
from app.features.chat.schema import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse
from app.features.chat.service import ConversationService

router = APIRouter(prefix="/conversations", tags=["Conversations"])

@router.post("/", response_model=ConversationResponse)
def create_conversation(
    conv_in: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = ConversationService(db)
    return svc.create_conversation(current_user.id, conv_in)

@router.get("/", response_model=List[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = ConversationService(db)
    return svc.get_user_conversations(current_user.id)

@router.get("/{conv_id}", response_model=ConversationResponse)
def get_conversation(
    conv_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = ConversationService(db)
    return svc.get_conversation(conv_id, current_user.id)

@router.post("/{conv_id}/messages", response_model=MessageResponse)
def add_message(
    conv_id: int,
    msg_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = ConversationService(db)
    return svc.add_message(conv_id, current_user.id, msg_in)
