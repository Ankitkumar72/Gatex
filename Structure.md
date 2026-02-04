# PropFlow Project Structure

## 🏗️ High-Level Architecture

PropFlow (formerly Gatex) is an AI-powered property management agent designed to handle tenant requests, verify policies using RAG, and draft work orders.

- **Frontend**: Next.js (React) application for the tenant/manager interface.
- **Backend**: FastAPI (Python) server exposing the AI agent via REST API.
- **Core AI**: LangChain + LangGraph based agentic workflow.
- **Database**: SQLite (via `sqlite-vec` & `langgraph-checkpoint`) for vector search and state persistence.

---

## 📂 Directory Breakdown

### 1. Root Directory (`/`)
- **`.env`**: Local environment variables (API Keys, Config). **(Git Ignored)**
- **`.env.example`**: Template for environment variables.
- **`.gitignore`**: Git configuration for ignored files.
- **`requirements.txt`**: Python dependencies frozen for reproducibility.
- **`Structure.md`**: This documentation file.
- **`Readme.md`**: Project overview and setup instructions.
- **`propflow.db`**: SQLite database for LangGraph state checkpoints.
- **`propflow_knowledge.json`**: JSON store for vector embeddings and metadata.
- **`verify_generalization.py`**: Integration test script for verifying agent generalization.
- **`verify_slang.py`**: Test script for validating slang understanding.
- **`verify_ai.py`**: Endpoint test script.
- **`get_token.py`**: Authentication utility for generating test JWT tokens.
- **`docs/`**: Documentation and policy files.
    - **`sample_lease.txt`**: Sample lease document for RAG ingestion.
- **`migrations/`**: Database migration scripts.

### 2. Core AI Logic (`src/`)
The core reasoning engine of the agent resides here.

- **`graph.py`**: Defines the `LangGraph` state machine (workflow). CONNECTS nodes, edges, and dynamic response generation.
- **`state.py`**: Defines `GatexState` (TypedDict), the shared memory between nodes.
- **`llm_factory.py`**: Central factory configuration to instantiate AI models (Google/OpenAI).
- **`tiny_vector_store.py`**: Custom lightweight vector database implementation.
- **`prompts/`**: (New) Directory for externalized prompt templates, allowing strict separation of logic and instruction.
    - **`triage.md`**: System prompt for the classification engine.
- **`skills/`**: (New) Directory for tool definitions and external capabilities.
    - **`maintenance_skills.py`**: Tools for creating tickets and finding vendors.
    - **`lease_skills.py`**: Tools for lease querying.

#### Nodes (`src/nodes/`)
Individual steps in the agent workflow:
- **`triage.py`**: Classifies requests (Emergency vs Routine) using the LLM. Loads dynamic prompts from `src/prompts/`.
- **`knowledge.py`**: RAG Lookup node. Checks lease policies and citations.
- **`execution.py`**: Finds vendors and drafts work orders.

### 3. Backend (`backend/`)
- **`main.py`**: FastAPI entry point.
    - Exposes POST `/agent/chat` for tenant interaction using JWT Authentication.
    - Exposes POST `/agent/approve` for property manager authorization.
    - Exposes `/auth/register` and `/auth/login` for user management.
    - Handles CORS and manual `.env` loading.
    - Handles session persistence via `thread_id` headers.

### 4. Frontend (`frontend/`)
Next.js web application for the user interface.

#### App Router (`frontend/src/app/`)
- **`page.tsx`**: Main landing page.
- **`layout.tsx`**: Root layout definition.
- **`globals.css`**: Global styles.
- **`approval_state.tsx`**: Component/Page for handling approval states.
- **`dashboard/`**: Dashboard pages.
- **`login/`**: Authentication pages.
- **`archive/`**, **`developers/`**, **`platform/`**, **`portal/`**, **`pricing/`**, **`solutions/`**, **`technician/`**: Feature-specific routes.

#### Components (`frontend/src/components/`)
Reusable UI components.
- **`AgentChat.tsx`**: Chat interface component for interacting with the agent.
- **`Navbar.tsx`**, **`Footer.tsx`**: Navigation and Layout components.

#### Utilities (`frontend/src/lib/`)
- **`api.ts`**: API client functions for communicating with the backend (Authenticated).
- **`constants.ts`**: Global constants.

### 5. Scripts (`scripts/`)
Utilities for development, testing, and data management.
- **`ingest.py`**: Ingests documents into the vector store.
- **`simulate_flow.py`**: Runs the agent loop in the CLI.

---

## 🔑 Key Concepts

### Shared State (`GatexState`)
The agent tracks the following throughout the lifecycle:
- `messages`: History of the conversation.
- `user_request`: The parsed intent of the tenant.
- `policy_context`: Data retrieved from RAG for grounding.
- `is_emergency`: Boolean flag set by the triage node.
- `approval_status`: Enum [pending, approved, denied].

### Model Agnostic Design
The project uses a factory pattern (`src/llm_factory.py`) to decouple the logic from specific providers.
- Switch providers by changing `LLM_PROVIDER` in `.env`.

### Retrieval Augmented Generation (RAG)
- **Ingestion**: Scripts read lease documents and embed them.
- **Storage**: `tiny_vector_store.py` manages local JSON storage.
- **Retrieval**: `src/nodes/knowledge.py` queries this store for policy checking.

### Human-in-the-Loop
- **Approval**: The graph interrupts before critical actions (dispatch).
- **Bridging**: `backend/main.py` exposes `waiting_for_approval` state.
- **Resume**: Property managers approve via `/agent/approve`.

## 🤖 Agentic Behavior & Safety
- **Interrupt Points**: The graph is hard-coded to interrupt at the `execution.py` node if a vendor dispatch is required.
- **Dynamic Prompts**: System instructions are externalized (`src/prompts/`) to allow for rapid iteration without code changes.
- **Unit Testing**: Scripts like `verify_generalization.py` ensure the agent behaves correctly across diverse, unseen inputs.
