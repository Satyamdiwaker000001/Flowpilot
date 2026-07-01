from app.agent.state import AgentState
from app.agent.model import hf_manager
from app.agent.prompts import SYSTEM_PROMPT, DOCUMENT_QA_PROMPT
import logging

logger = logging.getLogger(__name__)

def chat_node(state: AgentState) -> dict:
    """
    Handles standard chat without document context.
    """
    logger.info("Executing chat_node")
    last_message = state["messages"][-1]["content"] if state["messages"] else ""
    
    prompt = f"{SYSTEM_PROMPT}\n\nUser: {last_message}\nAssistant:"
    
    response = hf_manager.generate_response(prompt)
    
    return {"final_response": response}

def document_node(state: AgentState) -> dict:
    """
    Handles chat with document context retrieved from Qdrant.
    """
    logger.info("Executing document_node")
    last_message = state["messages"][-1]["content"] if state["messages"] else ""
    
    # Retrieve context from Vector DB
    from app.db.vector import vector_db
    
    # Only search if there's a valid message
    context = ""
    if last_message:
        results = vector_db.search(last_message, limit=3)
        if results:
            context_pieces = [f"Source ({res['filename']}): {res['text']}" for res in results]
            context = "\n\n".join(context_pieces)
    
    prompt = DOCUMENT_QA_PROMPT.format(context=context, question=last_message)
    
    response = hf_manager.generate_response(prompt)
    
    return {"final_response": response, "context": context}
