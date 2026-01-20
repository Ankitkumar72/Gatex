import sys
import os
import uuid
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load .env manually
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if os.path.exists(env_path):
    print(f"Loading env from {env_path}")
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, _, value = line.partition('=')
                os.environ[key.strip()] = value.strip().strip('"\'')

from langchain_core.messages import HumanMessage
from src.graph import app as graph_app


# --- Models ---
class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None
    
class ChatResponse(BaseModel):
    response: str
    thread_id: str
    status: str # 'active', 'interrupted' (waiting for approval), 'completed'
    final_state: Optional[Dict[str, Any]] = None

class ApprovalRequest(BaseModel):
    thread_id: str
    action: str # 'approve', 'reject'

# --- App Setup ---
app = FastAPI(title="Gatex API", version="1.0.0")

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Gatex API. Visit /docs for Swagger UI."}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Gatex Agent"}

@app.post("/agent/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    # 1. Setup ID
    thread_id = req.thread_id or f"web-{uuid.uuid4().hex[:6]}"
    config = {"configurable": {"thread_id": thread_id}}
    
    # 2. Check for Approval State (Resume)
    # If the user is just sending text, but we are paused, we might need to handle it.
    # But typically, 'resume' is a separate action. 
    # Here we assume this is a NEW message or a continuation of an unblocked flow.
    
    inputs = {"messages": [HumanMessage(content=req.message)], "request_id": thread_id}
    
    try:
        # Run graph to the next interruption or end
        # We assume the graph is compiled with interrupt_before=["dispatch"]
        
        # We need to run it until it stops
        final_event = None
        for event in graph_app.stream(inputs, config=config):
            final_event = event
            
        # Check State
        snapshot = graph_app.get_state(config)
        
        # Determine Status
        status = "active"
        if not snapshot.next:
            status = "completed"
        elif snapshot.next == ('dispatch',):
            status = "waiting_for_approval"
            
        # Extract last AI message if available, or summarize status
        ai_response = "Request Processed."
        if snapshot.values.get("messages"):
             # Simple heuristic to get last message content
             last_msg = snapshot.values["messages"][-1]
             if hasattr(last_msg, "content"):
                 ai_response = last_msg.content
        
        return ChatResponse(
            response=ai_response,
            thread_id=thread_id,
            status=status,
            final_state=snapshot.values
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agent/approve", response_model=ChatResponse)
def approve_endpoint(req: ApprovalRequest):
    config = {"configurable": {"thread_id": req.thread_id}}
    snapshot = graph_app.get_state(config)
    
    if snapshot.next != ('dispatch',):
        raise HTTPException(status_code=400, detail="Thread is not waiting for approval.")
        
    if req.action.lower() != "approve":
        # Handle rejection (reset or end)
        return ChatResponse(response="Request Rejected.", thread_id=req.thread_id, status="completed")
        
    # Resume
    try:
        # Passing None to resume
        for event in graph_app.stream(None, config=config):
            pass
            
        snapshot = graph_app.get_state(config)
        return ChatResponse(
            response="Dispatch Approved and Sent.",
            thread_id=req.thread_id,
            status="completed", # assuming dispatch is the end
            final_state=snapshot.values
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Clean env for reload to work if run directly
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
