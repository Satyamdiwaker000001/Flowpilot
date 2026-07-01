from langgraph.graph import StateGraph, END, START
from app.agent.state import AgentState
from app.agent.nodes import chat_node, document_node
from app.agent.router import route_request

# Initialize StateGraph
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("chat_node", chat_node)
workflow.add_node("document_node", document_node)

# Add conditional routing from START
workflow.add_conditional_edges(
    START,
    route_request,
    {
        "chat_node": "chat_node",
        "document_node": "document_node"
    }
)

# Add edges to END
workflow.add_edge("chat_node", END)
workflow.add_edge("document_node", END)

# Compile Graph
agent_graph = workflow.compile()
