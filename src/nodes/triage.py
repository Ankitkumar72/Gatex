from typing import Literal, Optional
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI 
# In a real scenario, we might use:
# from langchain_google_genai import ChatGoogleGenerativeAI

from src.state import PropFlowState

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

# 2. System Prompt
TRIAGE_SYSTEM_PROMPT = """You are the Triage Agent for PropFlow, a property management system.
Your goal is to analyze tenant maintenance requests and classify them for safety and urgency.

RULES:
1. **Emergency**: Immediate threat to life, safety, or severe property damage (fire, flood, gas leak, no heat in winter).
2. **Routine**: Standard maintenance issues (leaky faucet, broken light, appliance issue).
3. **Clarification Needed**: If the request is too vague to classify (e.g., "It's broken").

Output must be valid JSON matching the TriageOutput schema.
"""

# 3. Node Function
def triage_node(state: PropFlowState):
    """
    The Gatekeeper Node. Analyzes the latest message and updates the state
    with classification and urgency.
    """
    messages = state['messages']
    
    # Initialize LLM (Mocked or Real)
    # NOTE: In production, ensure OPENAI_API_KEY is set.
    # We use structured output to ensure strict adherence to the schema.
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    structured_llm = llm.with_structured_output(TriageOutput)
    
    # Construct the prompt
    # We pass the full conversation history to give context
    chain = structured_llm
    
    # Invoke
    # In a real run, we would need the API key. 
    # For now, if this fails due to missing key, we might need a fallback mock for the user to run locally.
    try:
        response: TriageOutput = chain.invoke([SystemMessage(content=TRIAGE_SYSTEM_PROMPT)] + messages)
    except Exception as e:
        # Fallback for demo purposes if no API key is present
        print(f"LLM call failed (likely no API key): {e}. Using mock response.")
        # Simple keyword fallback
        last_msg = messages[-1].content.lower()
        if "fire" in last_msg or "flood" in last_msg:
            response = TriageOutput(classification="emergency", urgency_score=10, maintenance_category="general", reasoning="Mock emergency detection")
        elif "broken" in last_msg and len(last_msg) < 15:
            response = TriageOutput(classification="clarification_needed", urgency_score=1, reasoning="Mock vague detection")
        else:
            response = TriageOutput(classification="routine", urgency_score=3, maintenance_category="general", reasoning="Mock routine detection")

    return {
        "classification": response.classification,
        "urgency_score": response.urgency_score,
        "maintenance_category": response.maintenance_category,
        # We don't overwrite messages here, just update metadata
    }
