from sqlalchemy.orm import Session
from app.features.chat.repository import ConversationRepository
import logging

logger = logging.getLogger(__name__)

class MemoryManager:
    """
    Handles V1 conversation history using PostgreSQL.
    """
    def __init__(self, db: Session):
        self.repo = ConversationRepository(db)

    def load_history(self, conversation_id: int, user_id: int) -> list:
        logger.info(f"Loading history for conversation {conversation_id}")
        conv = self.repo.get_conversation(conversation_id, user_id)
        if not conv:
            return []
        
        # Format for state
        messages = []
        for msg in conv.messages:
            messages.append({
                "sender": msg.sender_type,
                "content": msg.content
            })
        return messages
