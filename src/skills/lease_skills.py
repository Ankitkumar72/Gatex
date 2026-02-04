import logging
import os
from typing import Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from src.tiny_vector_store import TinyVectorStore

# Setup logger
logger = logging.getLogger(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "propflow_knowledge.json")

class SearchLeaseInput(BaseModel):
    """Input schema for searching lease documents."""
    query: str = Field(
        ...,
        description="The natural language query to search for in the lease agreement (e.g. 'who pays for ac repair?')."
    )

@tool(args_schema=SearchLeaseInput)
def search_lease_policy(query: str) -> str:
    """
    Searches the lease and warranty documents for policy information.
    Useful for determining tenant vs landlord responsibility.
    """
    if "GOOGLE_API_KEY" not in os.environ:
        logger.error("GOOGLE_API_KEY not set.")
        return "Error: GOOGLE_API_KEY not set. Cannot query Vector DB."

    try:
        logger.info(f"Searching lease policy for: {query}")
        
        # Load Store
        # Note: In production, store should be loaded once or cached.
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
        logger.error(f"Error querying knowledge base: {e}")
        return f"Error querying knowledge base: {e}"
