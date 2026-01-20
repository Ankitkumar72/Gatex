import os
import json
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from src.state import GatexState
from src.tiny_vector_store import TinyVectorStore
from src.llm_factory import get_llm

def retrieve_policy_context(category: str, query: str) -> str:
    """
    Retrieves relevant policy sections from the TinyVectorStore.
    """
    # Initialize components
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    db_path = os.path.join(os.path.dirname(__file__), "..", "..", "propflow_knowledge.json")
    vector_store = TinyVectorStore(persist_path=db_path)
    
    # Construct search query
    search_text = f"{category} maintenance issues. {query}"
    query_vec = embeddings.embed_query(search_text)
    
    # Search
    results = vector_store.similarity_search(query_vec, k=3)
    
    # Format context with citations
    context_parts = []
    for res in results:
        # handle dict/object difference just in case, though we updated store to return dicts
        content = res.get("content", "") if isinstance(res, dict) else res
        meta = res.get("metadata", {}) if isinstance(res, dict) else {}
        section = meta.get("section", "General Policy")
        context_parts.append(f"[{section}]\n{content}")
        
    return "\n\n".join(context_parts)

def knowledge_node(state: GatexState):
    """
    The Policy Auditor Node.
    Uses RAG to determine liability and strategy.
    """
    category = state.get("maintenance_category", "general")
    classification = state.get("classification")
    user_messages = state.get("messages", [])
    
    # Get the latest user text for the query
    last_user_msg = "Maintenance request"
    for msg in reversed(user_messages):
        if isinstance(msg, HumanMessage):
            last_user_msg = msg.content
            break
            
    # Emergency Override
    if classification == 'emergency':
        return {
            "resolution_strategy": "human_escalation",
            "lease_context": "Emergency Override: Immediate Tenant Safety Priority.",
            "reasoning": "Classified as Emergency - Bypassing policy check."
        }
        
    # 1. Retrieve Context
    context = retrieve_policy_context(category, last_user_msg)
    
    # 2. Policy Auditor Logic
    llm = get_llm(temperature=0)
    
    system_prompt = f"""You are the GateX Policy Auditor. Verify who is responsible for a maintenance request based ONLY on the Lease Agreement snippets.

RULES:
1. Interpret informal/slang text (e.g., "ac bust" -> "AC Failure").
2. CITATION: Quote specific sections (e.g. "Section 4.1") if present.
3. DECISION:
   - 'vendor': Landlord responsibility (structural, main systems).
   - 'diy': Tenant responsibility (consumables, minor clogs, cleaning).
   - 'decline': Explicitly prohibited or not covered.
   - 'clarify': Request is too vague (e.g. "it's broken") to determine policy.
4. If 'clarify', provide a specific 'clarifying_question'.

SNIPPETS:
{context}

OUTPUT FORMAT (JSON ONLY):
{{
  "resolution_strategy": "vendor" | "diy" | "decline" | "clarify",
  "reasoning": "Citing Section X, the landlord handles...",
  "clarifying_question": "Optional question if strategy is clarify"
}}
"""
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Request Category: {category}\nTenant Input: {last_user_msg}")
    ])
    
    # 3. Parse and Return
    try:
        # Clean potential markdown code blocks
        content = response.content.replace("```json", "").replace("```", "").strip()
        data = json.loads(content)
        
        strategy = data.get("resolution_strategy", "human_escalation")
        reasoning = data.get("reasoning", "Analysis failed.")
        
        # If clarification needed, we might want to communicate that back
        if strategy == "clarify":
             # In a real graph, we might loop back to user. For now, we can append a message.
             q = data.get("clarifying_question", "Could you provide more details?")
             return {
                 "resolution_strategy": strategy,
                 "reasoning": reasoning,
                 "lease_context": context,
                 "messages": [AIMessage(content=q)]
             }

        return {
            "resolution_strategy": strategy,
            "reasoning": reasoning,
            "lease_context": context
        }
        
    except Exception as e:
        print(f"Error parsing Policy Auditor response: {e}")
        return {
            "resolution_strategy": "human_escalation",
            "reasoning": "Policy check failed due to parsing error.",
            "lease_context": context
        }
