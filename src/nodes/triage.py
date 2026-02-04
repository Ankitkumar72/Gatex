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
import os

def load_prompt(filename):
    path = os.path.join(os.path.dirname(__file__), "..", "prompts", filename)
    with open(path, "r") as f:
        return f.read()

TRIAGE_SYSTEM_PROMPT = load_prompt("triage.md")


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
