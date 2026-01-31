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
- **`docs/`**: Documentation and policy files.
    - **`sample_lease.txt`**: Sample lease document for RAG ingestion.
- **`migrations/`**: Database migration scripts.

### 2. Core AI Logic (`src/`)
The core reasoning engine of the agent resides here.

- **`graph.py`**: Defines the `LangGraph` state machine (workflow). Connects nodes and edges.
- **`state.py`**: Defines `GatexState` (TypedDict), the shared memory between nodes.
- **`llm_factory.py`**: Central factory configuration to instantiate AI models (Google/OpenAI).
- **`tiny_vector_store.py`**: Custom lightweight vector database implementation.
- **`tools.py`**: Tool definitions.
    - **`search_lease()`**: Queries `tiny_vector_store` for policy compliance.
    - **`dispatch_vendor()`**: *Requires manual approval.* Drafts a work order for the property manager.
    - **`check_calendar()`**: Interface with Google/Outlook to find vendor slots.

#### Nodes (`src/nodes/`)
Individual steps in the agent workflow:
- **`triage.py`**: Classifies requests (Emergency vs Routine) using the LLM.
- **`knowledge.py`**: RAG Lookup node. Checks lease policies and citations.
- **`execution.py`**: Finds vendors and drafts work orders.

### 3. Backend (`backend/`)
- **`main.py`**: FastAPI entry point.
    - Exposes POST `/agent/chat` for tenant interaction.
    - Exposes POST `/agent/approve` for property manager authorization.
    - Handles CORS and manual `.env` loading.
    - Handles session persistence via `thread_id` headers, allowing the AI to 'remember' the state of a specific maintenance request across multiple API calls.
- **`propflow.db`**: Backend-specific database file (if distinct from root).

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

#### Types (`frontend/src/types/`)
- Directory for TypeScript type definitions (`interface MaintenanceRequest`, etc).

#### Components (`frontend/src/components/`)
Reusable UI components.
- **`AgentChat.tsx`**: Chat interface component for interacting with the agent.
- **`FeatureCard.tsx`**: Display card for features.
- **`Footer.tsx`**: Site footer.
- **`Navbar.tsx`**: Site navigation bar.

#### Utilities (`frontend/src/lib/`)
- **`api.ts`**: API client functions for communicating with the backend.
- **`constants.ts`**: Global constants.

### 5. Scripts (`scripts/`)
Utilities for development, testing, and data management.
*(Based on common structure)*
- **`ingest.py`**: Ingests documents into the vector store.
- **`simulate_flow.py`**: Runs the agent loop in the CLI.
- **`interactive_cli.py`**: Interactive terminal chat.
- **`test_*.py`**: Testing scripts.

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
- **RAG Grounding**: The `knowledge.py` node enforces a "Strict Mode"—if a policy isn't found in the vector store, the agent must escalate to a human rather than guessing.
- **State Cleanup**: `scripts/db_cleanup.py` is provided to wipe old checkpoints and reset the graph state for testing.
