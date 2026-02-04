from typing import Literal, Optional
from langchain_core.messages import SystemMessage
from pydantic import BaseModel, Field


from src.state import GatexState

# 1. Pydantic Model for Structured Output
class TriageOutput(BaseModel):
    """Output schema for the triage step."""
    classification: Literal['emergency', 'routine', 'clarification_needed'] = Field(
        description="Classify the maintenance request based on urgency and clarity."
    )
    urgency_score: int = Field(
        description="Rate urgency from 1 (low) to 10 (life threatening/immediate property damage)."
    )
    maintenance_category: Optional[str] = Field(
        description="The technical category of the issue (e.g., plumbing, electrical, hvac, appliance, general).",
        default=None
    )
    reasoning: str = Field(
        description="Brief explanation of why this classification and score were given."
    )
    clarification_question: Optional[str] = Field(
        description="If classification is 'clarification_needed', write a polite question to ask the tenant for more details.",
        default=None
    )
    acknowledgment: Optional[str] = Field(
        description="A brief, polite acknowledgment of the issue to reassure the tenant (e.g., 'I understand your kitchen sink is leaking.').",
        default=None
    )

# 2. System Prompt
TRIAGE_SYSTEM_PROMPT = """You are the Triage Agent for Gatex, a property management system.
Your goal is to analyze tenant maintenance requests and classify them for safety and urgency.

RULES:
1. **Emergency**: Immediate threat to life, safety, or severe property damage (fire, flood, gas leak, no heat in winter).
2. **Routine**: Standard maintenance issues (leaky faucet, broken light, appliance issue).
3. **Clarification Needed**: If the request is too vague to classify (e.g., "It's broken", "Help").

LANGUAGE UNDERSTANDING:
- Tenants may use slang, colloquialisms, or non-standard English (e.g., "loo" for toilet, "bust" for broken, "sparky" for electrician issues).
- You must interpret these correctly based on context. 
- If you are unsure but it sounds serious, err on the side of caution (higher urgency).

CATEGORIES:
- **Plumbing**: Leaks, clogs, water pressure, toilets, sinks.
- **HVAC**: Heating, ventilation, air conditioning, thermostat.
- **Electrical**: Lights, outlets, breakers, power issues.
- **Appliances**: Refrigerator, stove, dishwasher, washer/dryer.
- **Fire Safety**: Smoke detectors, carbon monoxide, fire hazards.
- **General**: Windows, doors, floors, paint, pests, other.

OUTPUT:
- Must be valid JSON matching the TriageOutput schema.
- If 'clarification_needed', you MUST provide a `clarification_question`.
- Always provide a short `acknowledgment` to show you understood the issue.
"""

# 3. Node Function
def triage_node(state: GatexState):
    """
    The Gatekeeper Node. Analyzes the latest message and updates the state
    with classification and urgency.
    """
    messages = state['messages']
    
    # Initialize LLM (Mocked or Real)
    from src.llm_factory import get_llm
    from langchain_core.messages import AIMessage
    
    # Initialize LLM via Factory
    llm = get_llm(temperature=0)
    structured_llm = llm.with_structured_output(TriageOutput)
    
    # Construct the prompt
    chain = structured_llm
    
    # Invoke
    response: TriageOutput = chain.invoke([SystemMessage(content=TRIAGE_SYSTEM_PROMPT)] + messages)

    # Prepare updates
    updates = {
        "classification": response.classification,
        "urgency_score": response.urgency_score,
        "maintenance_category": response.maintenance_category,
    }
    
    # If we need clarification, or just want to acknowledge, we can append an AI message.
    # Logic:
    # 1. If clarification_needed -> Send question.
    # 2. If routine/emergency -> Send acknowledgment (optional, but good for UX).
    
    response_text = None
    if response.classification == 'clarification_needed' and response.clarification_question:
        response_text = response.clarification_question
    elif response.acknowledgment:
        # We might want to save this for the next step, but for now let's just log it 
        # or maybe we don't send it yet because 'knowledge' node might add more info?
        # A simple approach: specific nodes send specific messages. 
        # But triage is the first listener.
        # Let's simple say: if clarification is needed, we MUST output a message to stop the flow and ask.
        pass
        
    if response_text:
        updates["messages"] = [AIMessage(content=response_text)]
        
    return updates
