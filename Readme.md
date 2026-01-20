# GateX: AI Agent for Property Maintenance

GateX is an intelligent, autonomous agent system designed to triage, troubleshoot, and dispatch vendors for property maintenance requests. Built with **LangGraph**, it serves as a stateful orchestration engine that manages the entire lifecycle of a maintenance ticket—from the initial tenant SMS to the final vendor dispatch—while keeping a human in the loop for critical financial decisions.

## 🚀 Key Features

*   **Stateful Orchestration**: Remembers conversation context and status across long wait times (e.g., waiting 4 hours for a tenant reply) using SQLite persistence.
*   **Intelligent Triage**: Uses **Google Gemini 1.5 Pro** to analyze the urgency ("Emergency" vs. "Routine") and safety risks of every request.
*   **Policy Auditor (RAG)**: A dedicated Knowledge Node that cites specific lease sections (e.g., "Section 4.1") to determine liability.
    *   *Context-Aware Ingestion*: Prepends section headers to chunks for accurate retrieval.
    *   *Clarification Cycle*: Proactively asks tenants for missing details.
    *   *Logic Guardrails*: Automatically detects DIY issues and sends guides instead of dispatching vendors.
*   **Human-in-the-Loop (HITL)**: "Dead Man's Switch" architecture ensures no vendor is dispatched without explicit property manager approval.
*   **Clean Architecture**: Separation of concerns into Schema (`state.py`), Agents (`nodes/`), and Routing (`graph.py`).

## 👥 The 3-Interface Architecture

GateX is built to serve three distinct user roles, powered by a unified RAG brain:

1.  **For the Tenant (The Requester)**
    *   *Role*: 24/7 Support Agent.
    *   *Capability*: Instantly answers lease questions ("Can I paint?") and troubleshoots issues.
    *   *Benefit*: Reduces repetitive questions and instant DIY support.

2.  **For the Manager (The Approver)**
    *   *Role*: Decision Support Tool.
    *   *Capability*: Provides a "Reasoning Summary" for approval requests (e.g., "Dispatch recommended per Section 4.1").
    *   *Benefit*: One-click approvals with confidence.

3.  **For the Technician (The Solver)**
    *   *Role*: On-Site Technical Manual.
    *   *Capability*: Retrieves appliance manuals and repair history [Planned].
    *   *Benefit*: Technician arrives with the right tools and knowledge.

## 🛠️ Tech Stack

*   **Framework**: LangGraph, LangChain
*   **LLM**: Google Gemini 1.5 Pro
*   **Embeddings**: Google Gemini `text-embedding-004`
*   **Vector Store**: TinyVectorStore (JSON + Metadata + Header Injection)
*   **Backend**: FastAPI
*   **Validation**: Pydantic (Structured Output)
*   **Persistence**: SQLite (SqliteSaver)
*   **Runtime**: Python 3.10+

## 📂 Project Structure

```
d:/PropFlow/
├── backend/
│   └── main.py       # FastAPI Entry Point (HITL Bridge)
├── src/
│   ├── graph.py       # Main Orchestrator (Nodes & Edges)
│   ├── state.py       # GateXState Schema
│   ├── tiny_vector_store.py  # Custom Vector DB
│   ├── llm_factory.py # Model Configuration (Gemini/OpenAI)
│   ├── nodes/         # The "Brains"
│   │   ├── triage.py     # Gatekeeper (Emergency vs Routine)
│   │   ├── knowledge.py  # Policy Auditor (RAG)
│   │   └── execution.py  # Coordinator (Vendor matchmaking)
│   └── tools.py       # External Tools Interface
├── scripts/
│   ├── ingest.py             # RAG Ingestion (Chunking + Headers)
│   ├── simulate_flow.py      # E2E Simulations
│   └── test_api.py           # API Integration Tests
├── GateX.db        # LangGraph State Persistence
└── propflow_knowledge.json  # Vector Store Data
```

## ⚡ Quick Start

### 1. Prerequisites
Ensure you have Python installed. Install dependencies:
```bash
pip install langgraph langchain langchain-google-genai langchain-core pydantic langgraph-checkpoint-sqlite fastapi uvicorn requests python-dotenv
```

### 2. Configure Environment
Set your Google API Key:
```powershell
$env:GOOGLE_API_KEY="AIza-your-key-here"
```

### 3. Run Ingestion (Load the Brain)
Index the lease agreement:
```bash
python scripts/ingest.py
```

### 4. Run the API Server
Start the backend to serve the agent:
```bash
python -m uvicorn backend.main:app --reload
```

## 🧠 Workflow Logic

1.  **Input**: Tenant says "My kitchen tap is leaking."
2.  **Triage Node**: Classifies as `Routine` / `Plumbing`.
3.  **Knowledge Node**: RAG Search -> "Landlord Responsibility" (Section 1.1).
4.  **Execution Node**: Finds "Joe's Plumbing". Drafts Work Order.
5.  **Status Check**: API reports `waiting_for_approval`.
6.  **Action**: Manager POSTs to `/agent/approve`.
7.  **Dispatch**: System sends email/SMS to vendor.

## 🗺️ Roadmap

- [x] **Phase 1: MVP Core** (State, Agents, Mock Tools, Persistence)
- [x] **Phase 2: Intelligence** (Integration with Real LLM - Gemini)
- [x] **Phase 3: Knowledge** (RAG, Policy Auditor, HITL Bridge)
- [ ] **Phase 4: Frontend** (Next.js Dashboard Integration)
- [ ] **Phase 5: Technician Module** (Manuals & History RAG)
