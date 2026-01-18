# PropFlow: AI Agent for Property Maintenance

PropFlow is an intelligent, autonomous agent system designed to triage, troubleshoot, and dispatch vendors for property maintenance requests. Built with **LangGraph**, it serves as a stateful orchestration engine that manages the entire lifecycle of a maintenance ticket—from the initial tenant SMS to the final vendor dispatch—while keeping a human in the loop for critical financial decisions.

## 🚀 Key Features

*   **Stateful Orchestration**: Remembers conversation context and status across long wait times (e.g., waiting 4 hours for a tenant reply) using SQLite persistence.
*   **Intelligent Triage**: Uses **Google Gemini 1.5 Pro** to analyze the urgency ("Emergency" vs. "Routine") and safety risks of every request.
*   **Human-in-the-Loop (HITL)**: "Dead Man's Switch" architecture ensures no vendor is dispatched (and no money spent) without explicit property manager approval.
*   **RAG-Ready Architecture**: "Knowledge Agent" node designed to look up Lease and Warranty policies (currently mocked, ready for Vector DB).
*   **Clean Architecture**: Separation of concerns into Schema (`state.py`), Agents (`nodes/`), and Routing (`graph.py`).

## 🛠️ Tech Stack

*   **Framework**: LangGraph, LangChain
*   **LLM**: Google Gemini 1.5 Pro
*   **Embeddings**: Google Gemini `text-embedding-004`
*   **Vector Store**: TinyVectorStore (Custom JSON-based for MVP)
*   **Validation**: Pydantic (Structured Output)
*   **Persistence**: SQLite (SqliteSaver)
*   **Runtime**: Python 3.10+

## 📂 Project Structure

```
d:/PropFlow/
├── src/
│   ├── graph.py       # Main Application (Routing Logic & Conditional Edges)
│   ├── state.py       # PropFlowState Schema (TypedDict)
│   ├── nodes/         # The "Brains" of the operation
│   │   ├── triage.py     # Gatekeeper (Emergency vs Routine)
│   │   ├── knowledge.py  # Researcher (Lease/Policy checker)
│   │   └── execution.py  # Coordinator (Vendor matchmaking)
│   └── tools.py       # Interface for external APIs (Mocked for MVP)
├── scripts/
│   ├── interactive_cli.py    # Chat with the agent in your terminal
│   ├── simulate_flow.py      # Run pre-canned scenarios
│   └── verify_persistence.py # functionality tests
├── propflow.db        # Local SQLite database for state persistence
└── requirements.txt   # Python dependencies
```

## ⚡ Quick Start

### 1. Prerequisites
Ensure you have Python installed. Install dependencies:
```bash
pip install langgraph langchain langchain-google-genai langchain-core pydantic langgraph-checkpoint-sqlite
```

### 2. Configure Environment
Set your Google API Key (required for the Triage agent):
```powershell
$env:GOOGLE_API_KEY="AIza-your-key-here"
```

### 3. Run the Agent
Start the interactive CLI to chat with PropFlow:
```bash
python scripts/interactive_cli.py
```

### 4. Verification
Run the unit tests to verify the logic (uses mocks, safe to run without costs):
```bash
python scripts/test_real_llm_mock.py
```

## 🧠 Workflow Logic

1.  **Input**: Tenant says "My kitchen tap is leaking."
2.  **Triage Node**: Classifies as `Routine` / `Plumbing`.
3.  **Knowledge Node**: Checks Lease. Result: "Landlord Responsibility".
4.  **Execution Node**: Finds "Joe's Plumbing" (Available). Drafts Work Order.
5.  **Human Approval**: graph **PAUSES**.
6.  **Action**: Manager types `approve`.
7.  **Dispatch**: System sends email/SMS to vendor.

## 🗺️ Roadmap

- [x] **Phase 1: MVP Core** (State, Agents, Mock Tools, Persistence)
- [x] **Phase 2: Intelligence** (Integration with Real LLM - Gemini)
- [x] **Phase 3: Knowledge** (RAG with TinyVectorStore + Gemini Embeddings)
- [ ] **Phase 4: Web Interface** (FastAPI Backend + Next.js Frontend)
