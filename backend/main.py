import sys
import os
import uuid
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from slowapi.errors import RateLimitExceeded

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

import langchain
from langchain_core.messages import HumanMessage
from langchain_community.cache import SQLiteCache
from src.graph import app as graph_app

# Security imports
from backend.config import get_settings
from backend.auth import (
    hash_password, verify_password, create_access_token, create_refresh_token,
    get_current_user, require_role, UserRole, User,
    LoginRequest, RegisterRequest, TokenResponse
)
from backend.database import init_db, get_db, UserDB
from backend.rate_limiting import limiter, rate_limit_exceeded_handler
from backend.logging_config import logger

# Enable Caching
langchain.llm_cache = SQLiteCache(database_path=".langchain.db")

# Get settings
settings = get_settings()

# Initialize database
init_db()
logger.info("Database initialized")

# --- Models ---
class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None
    
class ChatResponse(BaseModel):
    message: str
    thread_id: str
    status: str # 'active', 'interrupted' (waiting for approval), 'completed'
    final_state: Optional[Dict[str, Any]] = None

class ApprovalRequest(BaseModel):
    thread_id: str
    action: str # 'approve', 'reject'

# --- App Setup ---
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS Configuration (SECURED)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,  # ✅ Locked down to configured origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

logger.info(f"CORS allowed origins: {settings.allowed_origins_list}")

@app.get("/")
def read_root():
    return {"message": "Welcome to Gatex API. Visit /docs for Swagger UI."}

@app.get("/health")
def health_check():
    logger.info("Health check requested")
    return {"status": "ok", "service": "Gatex Agent", "version": settings.APP_VERSION}


# =====================
# AUTHENTICATION ROUTES
# =====================

@app.post("/auth/register", response_model=TokenResponse)
@limiter.limit("3/minute")
async def register(request: Request, body: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user"""
    logger.info(f"Registration attempt: {body.email}")
    
    # Check if user exists
    existing_user = db.query(UserDB).filter(UserDB.email == body.email).first()
    if existing_user:
        logger.warning(f"Registration failed - email exists: {body.email}")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(body.password)
    
    new_user = UserDB(
        id=user_id,
        email=body.email,
        hashed_password=hashed_pwd,
        name=body.name,
        role=body.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create tokens
    access_token = create_access_token({"sub": user_id, "email": body.email, "role": body.role, "name": body.name})
    refresh_token = create_refresh_token({"sub": user_id})
    
    logger.info(f"User registered successfully: {body.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=User(id=user_id, email=body.email, role=body.role, name=body.name)
    )


@app.post("/auth/login", response_model=TokenResponse)
@limiter.limit(settings.LOGIN_RATE_LIMIT)
async def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return JWT tokens"""
    logger.info(f"Login attempt: {body.email}")
    
    # Find user
    user = db.query(UserDB).filter(UserDB.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        logger.warning(f"Failed login attempt: {body.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        logger.warning(f"Login attempt for inactive user: {body.email}")
        raise HTTPException(status_code=403, detail="Account is inactive")
    
    # Create tokens
    access_token = create_access_token({"sub": user.id, "email": user.email, "role": user.role, "name": user.name})
    refresh_token = create_refresh_token({"sub": user.id})
    
    logger.info(f"User logged in successfully: {body.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=User(id=user.id, email=user.email, role=user.role, name=user.name)
    )


@app.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user


# =====================
# AGENT ROUTES (PROTECTED)
# =====================

@app.post("/agent/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat_endpoint(
    request: Request,
    req: ChatRequest,
    current_user: User = Depends(get_current_user)  # ✅ Authentication required
):
    """Chat with AI agent (authenticated users only)"""
    logger.info(f"Chat request from user {current_user.email}, thread: {req.thread_id}")
    
    # 1. Setup ID
    thread_id = req.thread_id or f"web-{uuid.uuid4().hex[:6]}"
    config = {"configurable": {"thread_id": thread_id}}
    
    # 2. Check for Approval State (Resume)
    # If the user is just sending text, but we are paused, we might need to handle it.
    inputs = {"messages": [HumanMessage(content=req.message)], "request_id": thread_id}
    
    try:
        # Run graph to the next interruption or end
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
        elif snapshot.next == ('wait_for_tenant',):
            status = "waiting_for_input"
            
        # Extract last AI message if available, or summarize status
        ai_response = "Request Processed."
        if snapshot.values.get("messages"):
             # Simple heuristic to get last message content
             last_msg = snapshot.values["messages"][-1]
             if hasattr(last_msg, "content"):
                 ai_response = last_msg.content
        
        return ChatResponse(
            message=ai_response,
            thread_id=thread_id,
            status=status,
            final_state=snapshot.values
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/agent/approve", response_model=ChatResponse)
@limiter.limit("10/minute")
async def approve_endpoint(
    request: Request,
    req: ApprovalRequest,
    current_user: User = Depends(require_role(UserRole.MANAGER, UserRole.ADMIN))  # ✅ Manager/Admin only
):
    """Approve dispatch (managers/admins only)"""
    logger.info(f"Approval request by {current_user.email} for thread {req.thread_id}")
    
    config = {"configurable": {"thread_id": req.thread_id}}
    snapshot = graph_app.get_state(config)
    
    if snapshot.next != ('dispatch',):
        raise HTTPException(status_code=400, detail="Thread is not waiting for approval.")
        
    if req.action.lower() != "approve":
        # Handle rejection (reset or end)
        return ChatResponse(message="Request Rejected.", thread_id=req.thread_id, status="completed")
        
    # Resume
    try:
        # Passing None to resume
        for event in graph_app.stream(None, config=config):
            pass
            
        snapshot = graph_app.get_state(config)
        return ChatResponse(
            message="Dispatch Approved and Sent.",
            thread_id=req.thread_id,
            status="completed", # assuming dispatch is the end
            final_state=snapshot.values
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"Error in approval endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    # Clean env for reload to work if run directly
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
