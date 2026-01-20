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

# --- New Nodes for Refined Flow ---

def wait_for_tenant_node(state: GatexState):
    """
    Breakpoint node for clarification.
    """
    # This node just serves as a marker to interrupt before.
    return {"status": "waiting_for_input"}

def send_guide_node(state: GatexState):
    """
    Handles DIY cases by sending a guide.
    """
    msg = AIMessage(content="[DIY Guide] This is a tenant responsibility. Please refer to the drafted guide: https://example.com/diy-guide")
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
        return END # Returns to user for input (handled by backend loop usually, or we could route to wait_for_tenant)
    else:
        return "knowledge" # Routine -> Check Policy

def route_knowledge(state: GatexState):
    strategy = state.get("resolution_strategy")
    if strategy == "diy":
        return "send_guide" # New path
    elif strategy == "decline":
        return END # Just stop (or send decline msg node)
    elif strategy == "clarify":
        return "wait_for_tenant" # Trigger interrupt
    elif strategy == "human_escalation":
        return "human_escalation"
    elif strategy == "vendor":
        return "execution" # Go to vendor search
    else:
        return END

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
workflow.add_node("send_guide", send_guide_node)
workflow.add_node("wait_for_tenant", wait_for_tenant_node)

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
        "execution": "execution",
        "human_escalation": "human_escalation",
        "send_guide": "send_guide",
        "wait_for_tenant": "wait_for_tenant",
        END: END
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
workflow.add_edge("human_approval", "dispatch")
workflow.add_edge("dispatch", END)
workflow.add_edge("human_escalation", END)
workflow.add_edge("send_guide", END)
workflow.add_edge("wait_for_tenant", END) # In reality this would END the turn, user replies, we resume.

# Compile
import os
db_path = os.getenv("DB_PATH", "propflow.db")
conn = sqlite3.connect(db_path, check_same_thread=False)
checkpointer = SqliteSaver(conn)

app = workflow.compile(
    checkpointer=checkpointer,
    interrupt_before=["dispatch", "wait_for_tenant"] 
)
