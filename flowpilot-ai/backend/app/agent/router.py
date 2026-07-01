from app.agent.state import AgentState

def route_request(state: AgentState) -> str:
    """
    Conditional edge router. 
    Routes to 'document_node' if a document context is needed/uploaded,
    otherwise routes to 'chat_node'.
    """
    if state.get("has_document", False):
        return "document_node"
    return "chat_node"
