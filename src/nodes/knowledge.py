from langchain_core.messages import AIMessage
from src.state import PropFlowState
from src.tools import search_lease_rag

def knowledge_node(state: PropFlowState):
    """
    The Researcher Node.
    Consults the 'lease' (RAG tool) to determine if this is a landlord or tenant responsibility.
    """
    category = state.get("maintenance_category", "general")
    classification = state.get("classification")
    
    # If it's an emergency, we skip policy checks and go straight to escalation/dispatch
    if classification == 'emergency':
        return {
            "resolution_strategy": "human_escalation",
            "lease_context": "Emergency Override: Immediate Tenant Safety Priority."
        }
        
    # Search RAG
    # In a real app, 'query' would be the user's last message or a synthesized query
    query = f"{category} maintenance policy"
    policy_info = search_lease_rag.invoke(query)
    
    # Simple Logic to determine strategy based on policy text
    # In reality, an LLM would analyze 'policy_info' to make this decision.
    # Here we simulate that decision logic.
    if "Tenant is responsible" in policy_info:
        strategy = "diy_guide"
        # We append a message here so the user sees the result immediately if it ends here
        response_msg = AIMessage(content=f"Reviewing your lease... Found policy: '{policy_info}'. \n\nSince this is a tenant responsibility, here is a guide on how to fix it: [Link to DIY Guide]")
        return {
            "lease_context": policy_info,
            "resolution_strategy": strategy,
            "messages": [response_msg]
        }
    else:
        # Landlord responsible -> Proceed to vendor
        strategy = "vendor_dispatch"
        return {
            "lease_context": policy_info,
            "resolution_strategy": strategy
        }
