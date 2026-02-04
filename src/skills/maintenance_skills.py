import logging
import random
from typing import List, Dict, Any, Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field

# Setup logger for production tracing
logger = logging.getLogger(__name__)

# --- 1. Create Ticket Skill ---

class CreateTicketInput(BaseModel):
    """Input schema for creating a maintenance ticket."""
    
    property_id: str = Field(
        ..., 
        description="The unique ID of the property (e.g., 'PROP-123')."
    )
    issue_description: str = Field(
        ..., 
        description="A detailed description of the maintenance issue reported by the user."
    )
    severity: str = Field(
        "medium", 
        description="Severity level: 'low', 'medium', or 'high'. Default is 'medium'."
    )

@tool(args_schema=CreateTicketInput)
def create_maintenance_ticket(
    property_id: str, 
    issue_description: str, 
    severity: str = "medium"
) -> Dict[str, Any]:
    """
    Creates a new maintenance ticket in the database.
    
    Use this tool when a user reports a physical issue with the property 
    (e.g., leaking tap, broken AC, electrical fault).
    
    Returns:
        Dict: A summary of the created ticket including the Ticket ID and status.
    """
    try:
        logger.info(f"Creating ticket for Property: {property_id}, Severity: {severity}")
        
        # --- PRODUCTION LOGIC START ---
        # Mock response for demonstration
        ticket_id = f"TICKET-{hash(issue_description) % 10000}"
        status = "open"
        # --- PRODUCTION LOGIC END ---

        return {
            "status": "success",
            "ticket_id": ticket_id,
            "message": f"Maintenance ticket created successfully for {property_id}.",
            "data": {"severity": severity, "current_status": status}
        }

    except Exception as e:
        logger.error(f"Failed to create ticket: {str(e)}")
        return {
            "status": "error",
            "error_code": "DB_INSERT_FAILED",
            "message": f"Failed to generate ticket. System reported: {str(e)}"
        }

# --- 2. Find Vendors Skill ---

class FindVendorsInput(BaseModel):
    """Input schema for finding vendors by category."""
    category: str = Field(
        ...,
        description="The maintenance category to search for (e.g., 'plumbing', 'electrical', 'hvac')."
    )

@tool(args_schema=FindVendorsInput)
def find_vendors(category: str) -> List[Dict[str, Any]]:
    """
    Searches the approved vendor database for a specific maintenance category.
    Returns a list of available vendors with their ratings and rates.
    """
    try:
        logger.info(f"Searching vendors for category: {category}")
        
        # Mock Database
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
        
        results = mock_vendors.get(category.lower(), mock_vendors["general"])
        return results

    except Exception as e:
        logger.error(f"Error finding vendors: {e}")
        return []

# --- 3. Check Availability Skill ---

class CheckAvailabilityInput(BaseModel):
    """Input schema for checking vendor availability."""
    vendor_id: str = Field(
        ...,
        description="The unique ID of the vendor to check."
    )

@tool(args_schema=CheckAvailabilityInput)
def check_vendor_availability(vendor_id: str) -> bool:
    """
    Checks if a specific vendor is available for the requested time slot.
    """
    try:
        logger.info(f"Checking availability for vendor: {vendor_id}")
        return random.random() > 0.2
    except Exception as e:
        logger.error(f"Error checking availability: {e}")
        return False
