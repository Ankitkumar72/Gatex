# Gatex Project Structure

## 🏗️ High-Level Architecture

Gatex is an AI-powered property management agent designed to handle tenant requests, verify policies using RAG, and draft work orders.

- **Frontend**: Next.js (React) application for the tenant/manager interface.
- **Backend**: FastAPI (Python) server exposing the AI agent via REST API.
- **Core AI**: LangChain + LangGraph based agentic workflow.
- **Database**: SQLite (via `sqlite-vec` & `langgraph-checkpoint`) for vector search and state persistence.

---

## 📂 Directory Breakdown

### 1. Root Directory (`/`)
- **`.env`**: Local environment variables (API Keys, Config). **(Git Ignored)**
- **`.env.example`**: Template for environment variables.
- **`requirements.txt`**: Python dependencies frozen for reproducibility.
- **`Structure.md`**: This documentation file.
- **`gatex.db`**: SQLite database for LangGraph state checkpoints.

### 2. Source Code (`src/`)
The core logic of the AI agent resides here.

- **`graph.py`**: Defines the `LangGraph` state machine (workflow). Connects nodes and edges.
- **`state.py`**: Defines `GatexState` (TypedDict), the shared memory between nodes.
- **`llm_factory.py`**: **[New]** Central factory configuration to instantiate AI models (Google/OpenAI) based on environment vars.
- **`tiny_vector_store.py`**: Custom lightweight vector database implementation.
- **`tools.py`**: Tool definitions (RAG search, vendor lookup, calendar check).

#### Nodes (`src/nodes/`)
Individual steps in the agent workflow:
- **`triage.py`**: Classifies requests (Emergency vs Routine) using the LLM.
- **`knowledge.py`**: RAG Lookup node. Checks lease policies.
- **`execution.py`**: Finds vendors and drafts work orders.

### 3. Backend (`backend/`)
- **`main.py`**: FastAPI entry point.
    - Exposes POST `/agent/chat` for tenant interaction.
    - Exposes POST `/agent/approve` for property manager authorization.
    - Handles CORS and manual `.env` loading.

### 4. Frontend (`frontend/`)
Next.js web application.
- **`src/app/`**: App router pages and layouts.
- **`public/`**: Static assets.

### 5. Scripts (`scripts/`)
Utilities for development and testing.
- **`ingest.py`**: Ingests `sample_lease.txt` into the vector store.
- **`verify_refactor.py`**: Verifies LLM swapping logic.
- **`simulate_flow.py`**: Runs the agent loop in the CLI without the API.
- **`interactive_cli.py`**: Interactive terminal chat with the agent.
- **`test_*.py`**: Various unit and integration tests.

---

## 🔑 Key Concepts

### Model Agnostic Design
The project uses a factory pattern (`src/llm_factory.py`) to decouple the logic from specific providers.
- Switch providers by changing `LLM_PROVIDER` in `.env`.
- Supports `google` (Gemini) and `openai` (GPT) out of the box.

### Retrieval Augmented Generation (RAG)
- **Ingestion**: `scripts/ingest.py` reads lease documents, prepends Section Headers for context, and embeds them.
- **Storage**: `tiny_vector_store.py` stores embeddings + metadata locally in JSON.
- **Retrieval**: `src/nodes/knowledge.py` ("Policy Auditor") queries this store to cite specific policies.
- **Cycles**: 
    - `knowledge` -> `wait_for_tenant`: Pauses graph to ask clarifying questions.
    - `knowledge` -> `send_guide`: Automatically handles DIY issues.

### Human-in-the-Loop
- **Approval**: The graph interrupts before the `dispatch` action.
- **Bridging**: `backend/main.py` detects the interruption and exposes it as `waiting_for_approval`.
- **Resume**: Occurs via the `/agent/approve` endpoint.
