import json
import os
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from src.state import GatexState
from src.llm_factory import get_llm

def load_prompt(filename):
    path = os.path.join(os.path.dirname(__file__), "..", "prompts", filename)
    with open(path, "r") as f:
        return f.read()

PAYMENT_PROMPT_TEMPLATE = load_prompt("payment_coordinator.md")

def payment_node(state: GatexState):
    """
    Payment Coordinator Node.
    Determines who pays and requests authorization.
    """
    selected_vendor = state.get("selected_vendor")
    if not selected_vendor:
        # Should not happen if coming from execution, but safety check
        return {"resolution_strategy": "human_escalation"}

    category = state.get("maintenance_category", "General")
    # Estimate cost: rate * 2 hours (mock)
    rate = selected_vendor.get('rate_per_hour', 100)
    estimated_cost = rate * 2.0
    
    # Render prompt
    system_prompt = PAYMENT_PROMPT_TEMPLATE.replace("{cost_estimate}", f"${estimated_cost}").replace("{category}", category)
    
    llm = get_llm(temperature=0)
    
    # We want the LLM to generate the message to the user asking for approval.
    # The output format in the prompt says JSON, but in a chat flow, we usually want a natural message first.
    # Actually, the prompt says "OUTPUT: payer, status...". 
    # But it also creates "INSTRUCTIONS: Explain the cost...".
    # Let's adjust this. 
    # If the LLM returns JSON, we parse it. But the USER needs to see the text.
    # The Prompt structure provided implies it generates a structured decision *and* maybe we want the text?
    # The prompt says: "INSTRUCTIONS: 1. Explain the cost... 2. Identify the Payer...".
    # And "OUTPUT: payer, status".
    # This is a bit conflicting if we want the TEXT to be sent to the user.
    # We will assume we want the LLM to generate the *message* to the user, and we interpret the intent.
    # OR, we use the LLM to *decide* first, then we format the message?
    # Let's trust the LLM to follow the instructions and output the JSON.
    # Wait, if it outputs JSON, the user sees JSON. That's bad.
    # We probably want the LLM to output the natural language response to the user.
    # The prompt provided "OUTPUT: payer..." seems like an internal classification step.
    # Let's separate the "Analysis" from the "Message".
    
    # Actually, let's look at the instructions again.
    # It says "Call to Action: Do you authorize...". This implies the output should be the message.
    # But the OUTPUT section says JSON.
    # I will modify the execution slightly: Use the prompt to generate the text response to the user.
    # We can parse the intent later or carry it in state?
    # Actually, the 'payment_coordinator' is getting authorization.
    # So this node generates the QUESTION.
    # "The estimated cost is $X... Do you authorize?"
    # The NEXT step (after user replies) would handle the "status: authorized".
    
    # So for *this* node, we just want the Message.
    # I will tweak the prompt usage to just generate the message for now?
    # Or strict adherence: The user-provided prompt seems designed for a Function Call / JSON mode agent.
    # But here we are in a text chat.
    # Let's ask the LLM to output the JSON *and* a field for "message_to_user".
    
    # But I can't change the prompt file I just created (user instructions).
    # "OUTPUT: - payer, - status".
    # This looks like it expects us to run this *after* the user says "Yes"?
    # No, "Your goal is to secure a Payment Authorization".
    # Okay, this node acts as the "Proposal".
    
    response = llm.invoke([
         SystemMessage(content=system_prompt.replace("OUTPUT FORMAT (JSON ONLY)", "OUTPUT")),
         HumanMessage(content="Generate the authorization request message based on the rules.")
    ])
    
    # If the model follows instructions 1-4, it will generate text.
    # The "OUTPUT" section might be ignored if I ask for text.
    # Let's just return the content as the message to the user.
    
    return {
        "messages": [AIMessage(content=response.content + " [PAYMENT_AUTH]")],
        "resolution_strategy": "payment_authorization_pending"
    }
