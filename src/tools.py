import os
import random
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.tools import tool
from typing import List, Dict, Union
from src.state import Vendor
from src.tiny_vector_store import TinyVectorStore

# Initialize Vector Store (Lazy load or global)
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "propflow_knowledge.json")

@tool
def search_lease_rag(query: str) -> str:
    """
    Searches the lease and warranty documents for policy information.
    Useful for determining tenant vs landlord responsibility.
    """
    if "GOOGLE_API_KEY" not in os.environ:
        return "Error: GOOGLE_API_KEY not set. Cannot query Vector DB."

    try:
        # Load Store
        vector_store = TinyVectorStore(persist_path=DB_PATH)
        if not vector_store.documents:
            return "Knowledge base is empty. Please run scripts/ingest.py first."

        # Get Query Embedding
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        q_vec = embeddings.embed_query(query)
        
        # Search for top 2 relevant chunks
        results = vector_store.similarity_search(q_vec, k=2)
        
        if not results:
            return "No specific policy found in lease documents."
            
        # Format context
        context_str = "\n---\n".join(results)
        return f"Policy Information from Lease:\n{context_str}"
        
    except Exception as e:
        return f"Error querying knowledge base: {e}"

@tool
def vendor_database_query(category: str) -> List[Vendor]:
    """
    Searches the approved vendor database for a specific maintenance category (e.g., 'plumbing', 'electrical').
    """
    mock_vendors = {
        "plumbing": [
            {"id": "v1", "name": "Joe's Plumbing", "rating": 4.8, "rate_per_hour": 150.0, "available": True},
            {"id": "v2", "name": "Rapid Rooter", "rating": 4.2, "rate_per_hour": 120.0, "available": True},
        ],
        "electrical": [
            {"id": "v3", "name": "Sparky's Electric", "rating": 4.9, "rate_per_hour": 160.0, "available": True},
        ],
        "hvac": [
            {"id": "v4", "name": "Cool Air Pros", "rating": 4.7, "rate_per_hour": 140.0, "available": True},
        ],
        "general": [
            {"id": "v5", "name": "Handy Andy", "rating": 4.5, "rate_per_hour": 80.0, "available": True},
        ],
        "appliances": [
            {"id": "v6", "name": "Appliance Medics", "rating": 4.6, "rate_per_hour": 110.0, "available": True},
        ],
        "fire safety": [
            {"id": "v7", "name": "SafeGuard Fire Protection", "rating": 5.0, "rate_per_hour": 200.0, "available": True},
        ]
    }
    
    return mock_vendors.get(category.lower(), mock_vendors["general"])

@tool
def calendar_check(vendor_id: str) -> bool:
    """
    Checks if a vendor is available for the requested time slot.
    """
    # Randomly availability for the mock, mostly true
    return random.random() > 0.2
