from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.features.chat.repository import ConversationRepository
from app.features.chat.schema import ConversationCreate, MessageCreate

class ConversationService:
    def __init__(self, db: Session):
        self.repo = ConversationRepository(db)

    def create_conversation(self, user_id: int, conv_in: ConversationCreate):
        return self.repo.create_conversation(user_id, conv_in)

    def get_user_conversations(self, user_id: int):
        return self.repo.get_user_conversations(user_id)

    def get_conversation(self, conv_id: int, user_id: int):
        conv = self.repo.get_conversation(conv_id, user_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conv

    def add_message(self, conv_id: int, user_id: int, msg_in: MessageCreate):
        # ensure conversation belongs to user
        self.get_conversation(conv_id, user_id)
        
        # Save user message
        user_msg = self.repo.add_message(conv_id, msg_in)
        
        # Load memory for Agent
        from app.agent.memory import MemoryManager
        from app.agent.graph import agent_graph
        
        mem_manager = MemoryManager(self.repo.db)
        messages = mem_manager.load_history(conv_id, user_id)
        
        # Construct State
        initial_state = {
            "messages": messages,
            "user_id": user_id,
            "conversation_id": conv_id,
            "has_document": False, # V1: hardcoded for now, will connect to doc context later
            "context": "",
            "final_response": ""
        }
        
        # Invoke Agent Graph
        final_state = agent_graph.invoke(initial_state)
        ai_text = final_state.get("final_response", "Sorry, I could not process that.")
        
        # Save AI message
        ai_msg_in = MessageCreate(
            sender_type="agent",
            message_type="text",
            content=ai_text,
            token_usage=0
        )
        ai_msg = self.repo.add_message(conv_id, ai_msg_in)
        
        return ai_msg
