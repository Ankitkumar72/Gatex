from datetime import datetime
from langchain_core.messages import AIMessage
from src.state import GatexState
from src.tools import vendor_database_query, calendar_check

def execution_node(state: GatexState):
    """
    The Coordinator Node.
    Finds a vendor, checks availability, and drafts a work order.
    Does NOT send it yet. That requires Human Approval or specific 'Dispatch' node.
    """
    category = state.get("maintenance_category", "general")
    
    # 1. Find Vendors
    vendors = vendor_database_query.invoke(category)
    
    # 2. Select Best Vendor (Mock logic: best rating)
    # Sort by rating descending
    sorted_vendors = sorted(vendors, key=lambda x: x['rating'], reverse=True)
    selected = None
    
    # 3. Check Availability
    for v in sorted_vendors:
        if calendar_check.invoke(v['id']):
            selected = v
            break
            
    if not selected and vendors:
        # Fallback if none available (mock)
        selected = vendors[0]
    
    # 4. Draft Work Order
    if selected:
        draft = (
            f"WORK ORDER DRAFT\n"
            f"ID: {state.get('request_id', 'REQ-001')}\n"
            f"Issue: {category}\n"
            f"Vendor: {selected['name']} (${selected['rate_per_hour']}/hr)\n"
            f"Status: PENDING OWNER APPROVAL"
        )
        
        # Prepare message for the Human-in-the-Loop (Tenant doesn't see this internal drafts usually, 
        # but for this demo the chatbot tells the tenant "I've sent a request to...")
        # Actually, the user story says "Property Manager receives notification". 
        # But we'll add a message to the state to show progress.
        
        msg = AIMessage(content=f"I have found a top-rated vendor, {selected['name']}, who is available. \n\nSending authorization request to the property manager now...")
        
        return {
            "vendor_options": vendors,
            "selected_vendor": selected,
            "draft_work_order": draft,
            "messages": [msg],
            "resolution_strategy": "pending_approval" # Move state forward
        }
    else:
        # No vendor found
        return {
            "resolution_strategy": "human_escalation",
            "messages": [AIMessage(content="I could not find an available vendor automatically. Escalating to property manager manually.")]
        }
