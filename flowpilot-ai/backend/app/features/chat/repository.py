from sqlalchemy.orm import Session
from app.features.chat.model import Conversation, Message
from app.features.chat.schema import ConversationCreate, MessageCreate

class ConversationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_conversation(self, user_id: int, conv_in: ConversationCreate) -> Conversation:
        db_obj = Conversation(**conv_in.model_dump(), user_id=user_id)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get_user_conversations(self, user_id: int):
        return self.db.query(Conversation).filter(Conversation.user_id == user_id).all()

    def get_conversation(self, conv_id: int, user_id: int):
        return self.db.query(Conversation).filter(Conversation.id == conv_id, Conversation.user_id == user_id).first()

    def add_message(self, conv_id: int, msg_in: MessageCreate) -> Message:
        db_obj = Message(**msg_in.model_dump(), conversation_id=conv_id)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
