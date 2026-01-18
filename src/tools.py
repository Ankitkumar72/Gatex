import random
from typing import List, Dict, Union
from langchain_core.tools import tool
from src.state import Vendor

@tool
def search_lease_rag(query: str) -> str:
    """
    Searches the lease and warranty documents for policy information.
    Useful for determining tenant vs landlord responsibility.
    """
    # Mock knowledge base
    knowledge_base = {
        "lightbulb": "Lease Clause 4.2: Tenant is responsible for replacing consumable items including lightbulbs and smoke detector batteries.",
        "faucet": "Lease Clause 5.1: Landlord is responsible for all plumbing fixtures unless damage is caused by Tenant negligence.",
        "leak": "Lease Clause 5.1: Landlord is responsible for all plumbing fixtures unless damage is caused by Tenant negligence. Emergency contact required if flooding.",
        "fire": "Emergency Policy: In case of fire, call 911 immediately. Landlord responsible for structural repairs after safety is ensured.",
        "lawn": "Lease Clause 8.0: Tenant is responsible for general lawn maintenance (mowing/watering). Landlord covers tree trimming.",
        "filter": "Warranty Doc: HVAC filters must be changed every 3 months. Tenant responsibility."
    }
    
    # Simple keyword matching for mock
    query_lower = query.lower()
    for key, value in knowledge_base.items():
        if key in query_lower:
            return value
    
    return "No specific policy found in lease documents for this issue. Default to Landlord responsibility for structural/maintenance issues."

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
