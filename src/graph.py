from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3
from langchain_core.messages import AIMessage

from src.state import GatexState
from src.nodes.triage import triage_node
from src.nodes.knowledge import knowledge_node
from src.nodes.execution import execution_node

# --- Escalation / Endpoint Nodes ---

def human_escalation_node(state: GatexState):
    """
    Node for handling emergencies or fallback cases.
    """
    msg = AIMessage(content="ESCALATION TRIGGERED: Alerting Property Manager via SMS immediately.")
    return {
        "messages": [msg],
        "resolution_strategy": "human_escalation"
    }

def human_approval_node(state: GatexState):
    """
    The 'Waiting Room' for human approval.
    In a real app, this might just be a state update, 
    but here it serves as a breakpoint before dispatch.
    """
    # This node executes AFTER the interrupt resumes (if approved)
    # OR it executes as the step leading up to the interrupt.
    # We'll use it to mark the status.
    return {"approval_status": False} # Reset or set status

def dispatch_node(state: GatexState):
    """
    Final node that 'sends' the email/work order.
    Only reached after approval.
    """
    vendor = state.get("selected_vendor")
    msg = AIMessage(content=f"DISPATCH CONFIRMED: Work order sent to {vendor['name'] if vendor else 'Vendor'}.")
    return {
        "messages": [msg],
        "resolution_strategy": "resolved"
    }

# --- Conditional Routers ---

def route_triage(state: GatexState):
    classification = state.get("classification")
    if classification == "emergency":
        return "human_escalation"
    elif classification == "clarification_needed":
        return END # Returns to user for input
    else:
        return "knowledge" # Routine -> Check Policy

def route_knowledge(state: GatexState):
    strategy = state.get("resolution_strategy")
    if strategy == "diy_guide":
        return END # Issue resolved with guide
    elif strategy == "human_escalation":
        return "human_escalation"
    else:
        return "execution" # Go to vendor search

def route_execution(state: GatexState):
    strategy = state.get("resolution_strategy")
    if strategy == "human_escalation":
        return "human_escalation"
    return "human_approval" # Go to waiting room

# --- Graph Construction ---

workflow = StateGraph(GatexState)

# Add Nodes
workflow.add_node("triage", triage_node)
workflow.add_node("knowledge", knowledge_node)
workflow.add_node("execution", execution_node)
workflow.add_node("human_escalation", human_escalation_node)
workflow.add_node("human_approval", human_approval_node)
workflow.add_node("dispatch", dispatch_node)

# Set Entry Point
workflow.set_entry_point("triage")

# Add Edges
workflow.add_conditional_edges(
    "triage",
    route_triage,
    {
        "human_escalation": "human_escalation",
        "knowledge": "knowledge",
        END: END
    }
)

workflow.add_conditional_edges(
    "knowledge",
    route_knowledge,
    {
        "diy_guide": END,
        "human_escalation": "human_escalation",
        "execution": "execution"
    }
)

workflow.add_conditional_edges(
    "execution",
    route_execution,
    {
        "human_escalation": "human_escalation",
        "human_approval": "human_approval"
    }
)

# Human-in-the-Loop Logic
# We go from approval -> dispatch explicitly, BUT we interrupt before dispatch?
# Actually design says: "The graph reaches a 'Waiting Room' state... Once approved, the graph resumes"
# So we link approval -> dispatch, and set interrupt_before "dispatch"
workflow.add_edge("human_approval", "dispatch")
workflow.add_edge("dispatch", END)
workflow.add_edge("human_escalation", END)

# Compile
# We interrupt BEFORE 'dispatch' to allow human review of the drafted order
# Use SqliteSaver for persistence across restarts
import os
db_path = os.getenv("DB_PATH", "propflow.db")
conn = sqlite3.connect(db_path, check_same_thread=False)
checkpointer = SqliteSaver(conn)

app = workflow.compile(
    checkpointer=checkpointer,
    interrupt_before=["dispatch"] 
)
