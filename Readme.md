# GateX: AI Agent for Property Maintenance

GateX is an intelligent, autonomous agent system designed to triage, troubleshoot, and dispatch vendors for property maintenance requests. Built with **LangGraph**, it serves as a stateful orchestration engine that manages the entire lifecycle of a maintenance ticket—from the initial tenant SMS to the final vendor dispatch—while keeping a human in the loop for critical financial decisions.

## 🚀 Key Features

*   **Stateful Orchestration**: Remembers conversation context and status across long wait times (e.g., waiting 4 hours for a tenant reply) using SQLite persistence.
*   **Intelligent Triage**: Uses **Google Gemini 1.5 Pro** to analyze the urgency ("Emergency" vs. "Routine") and safety risks of every request.
    *   *Dynamic Prompts*: Rules are stored in `src/prompts/` for easy editing.
    *   *Slang Support*: Understands colloquialisms (e.g., "sparky", "busted").
*   **Policy Auditor (RAG)**: A dedicated Knowledge Node that cites specific lease sections (e.g., "Section 4.1") to determine liability.
    *   *Context-Aware Ingestion*: Prepends section headers to chunks for accurate retrieval.
    *   *Clarification Cycle*: Proactively asks tenants for missing details.
    *   *Logic Guardrails*: Automatically detects DIY issues and sends guides instead of dispatching vendors.
*   **Human-in-the-Loop (HITL)**: "Dead Man's Switch" architecture ensures no vendor is dispatched without explicit property manager approval.
*   **Secure Authentication**: JWT-based Auth flow ensuring only verified tenants can submit requests.
*   **Clean Architecture**: Separation of concerns into Schema (`state.py`), Agents (`nodes/`), Routing (`graph.py`), and Skills (`skills/`).

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
*   **Auth**: JWT (JSON Web Tokens)
*   **Validation**: Pydantic (Structured Output)
*   **Persistence**: SQLite (SqliteSaver)
*   **Runtime**: Python 3.10+

## 📂 Project Structure

```
d:/PropFlow/
├── backend/
│   └── main.py       # FastAPI Entry Point (HITL Bridge & Auth)
├── src/
│   ├── graph.py       # Main Orchestrator (Nodes & Edges)
│   ├── state.py       # GateXState Schema
│   ├── tiny_vector_store.py  # Custom Vector DB
│   ├── llm_factory.py # Model Configuration (Gemini/OpenAI)
│   ├── prompts/       # External System Prompts
│   │   └── triage.md     # Triage Rules
│   ├── nodes/         # The "Brains"
│   │   ├── triage.py     # Gatekeeper (Emergency vs Routine)
│   │   ├── knowledge.py  # Policy Auditor (RAG)
│   │   └── execution.py  # Coordinator (Vendor matchmaking)
│   └── skills/        # The "Hands"
│       └── maintenance_skills.py # Tools for tickets & vendors
├── scripts/
│   ├── ingest.py             # RAG Ingestion (Chunking + Headers)
│   ├── simulate_flow.py      # E2E Simulations
├── verify_generalization.py  # Integration Test Suite
└── verify_slang.py           # Slang Understanding Test
```

## ⚡ Quick Start

### 1. Prerequisites
Ensure you have Python installed. Install dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Set your Google API Key and other secrets in `.env`:
```powershell
GOOGLE_API_KEY="AIza-your-key-here"
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

### 5. Run Verification Tests
Verify the agent's logic with unseen test cases:
```bash
python verify_generalization.py
```

## 🧠 Workflow Logic

1.  **Input**: Tenant says "My kitchen tap is leaking."
2.  **Auth**: Token verified via Middleware.
3.  **Triage Node**: Classifies as `Routine` / `Plumbing` using `src/prompts/triage.md`.
4.  **Knowledge Node**: RAG Search -> "Landlord Responsibility" (Section 1.1).
5.  **Execution Node**: Finds "Joe's Plumbing" via `skills/`. Drafts Work Order.
6.  **Status Check**: API reports `waiting_for_approval`.
7.  **Action**: Manager POSTs to `/agent/approve`.
8.  **Dispatch**: System sends email/SMS to vendor.

## 🗺️ Roadmap

- [x] **Phase 1: MVP Core** (State, Agents, Mock Tools, Persistence)
- [x] **Phase 2: Intelligence** (Integration with Real LLM - Gemini)
- [x] **Phase 3: Knowledge** (RAG, Policy Auditor, HITL Bridge)
- [x] **Phase 4: Dynamic Configuration** (External Prompts, Skills Refactor)
- [ ] **Phase 5: Frontend** (Next.js Dashboard Integration)
- [ ] **Phase 6: Technician Module** (Manuals & History RAG)
