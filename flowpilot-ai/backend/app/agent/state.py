from typing import TypedDict, Annotated, Sequence
import operator

class AgentState(TypedDict):
    """
    State for the Workflow Agent.
    """
    messages: Annotated[Sequence[dict], operator.add]
    user_id: int
    conversation_id: int
    has_document: bool
    context: str
    final_response: str
