from typing import TypedDict, Annotated, List, Literal, Optional
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
import operator

class Vendor(TypedDict):
    id: str
    name: str
    rating: float
    rate_per_hour: float
    available: bool

class GatexState(TypedDict):
    """
    The shared state of the Gatex graph.
    """
    # Messaging History
    # add_messages is a reducer that appends new messages to the list
    messages: Annotated[List[BaseMessage], add_messages]
    
    # Triage & Classification
    request_id: str
    classification: Literal['emergency', 'routine', 'clarification_needed']
    urgency_score: int  # 1-10
    maintenance_category: Optional[str] # e.g., 'plumbing', 'electrical', 'hvac'
    location: Optional[str] # e.g. "Master Bedroom", "Unit 402"
    asset_info: Optional[str] # e.g. "Sony TV", "Samsung Fridge"
    
    # Policy & Knowledge
    lease_context: Optional[str]  # Information retrieved from RAG
    resolution_strategy: Literal['diy_guide', 'vendor_dispatch', 'human_escalation', 'pending_approval']
    
    # Execution & Logistics
    vendor_options: List[Vendor]
    selected_vendor: Optional[Vendor]
    draft_work_order: Optional[str]
    
    # Human-in-the-Loop
    approval_status: bool # True if human has approved
    retry_count: int # To prevent infinite clarification loops
