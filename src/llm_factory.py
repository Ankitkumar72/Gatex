import os
from functools import lru_cache
from typing import Optional

from langchain_core.language_models import BaseChatModel
from langchain_google_genai import ChatGoogleGenerativeAI
# Conditional import for OpenAI to avoid generic errors if not installed
try:
    from langchain_openai import ChatOpenAI
except ImportError:
    ChatOpenAI = None

def get_llm(temperature: float = 0) -> BaseChatModel:
    """
    Returns a configured LLM based on environment variables.
    Defaults to Google Gemini if not specified.
    """
    provider = os.getenv("LLM_PROVIDER", "google").lower()
    model_name = os.getenv("LLM_MODEL")

    if provider == "google":
        # Default to gemini-1.5-flash (stable) instead of 2.5-flash (preview/strict limits)
        model = model_name or "gemini-1.5-flash"
        return ChatGoogleGenerativeAI(model=model, temperature=temperature, max_retries=2)
    
    elif provider == "openai":
        if not ChatOpenAI:
            raise ImportError("langchain-openai is not installed. Run `pip install langchain-openai`.")
        
        # Default to gpt-4o if not set
        model = model_name or "gpt-4o"
        return ChatOpenAI(model=model, temperature=temperature)
    
    else:
        raise ValueError(f"Unsupported LLM_PROVIDER: {provider}")
