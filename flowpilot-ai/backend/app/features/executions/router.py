from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.features.auth.dependencies import get_current_user
from app.features.auth.model import User
from app.features.executions.schema import ExecutionCreate, ExecutionResponse
from app.features.executions.service import ExecutionService

router = APIRouter(prefix="/conversations/{conversation_id}/executions", tags=["Executions"])

@router.post("/", response_model=ExecutionResponse)
def create_execution(
    conversation_id: int,
    exec_in: ExecutionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = ExecutionService(db)
    return svc.create_execution(conversation_id, current_user.id, exec_in)

@router.get("/", response_model=List[ExecutionResponse])
def get_executions(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = ExecutionService(db)
    return svc.get_conversation_executions(conversation_id, current_user.id)

@router.get("/{exec_id}", response_model=ExecutionResponse)
def get_execution(
    conversation_id: int,
    exec_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    svc = ExecutionService(db)
    return svc.get_execution(exec_id, conversation_id, current_user.id)
