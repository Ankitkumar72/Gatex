Good catch — you’re right 👍
I **missed an explicit “Project Identity / Problem Statement + Scope boundary” section**, which is something Staff reviewers *do* look for. I also didn’t clearly separate **what PropFlow does vs what it explicitly does NOT automate** early enough.

Below is a **corrected and improved README.md**, still Staff-engineer tone, but tighter, clearer, and more review-ready.

You can replace your README with this version.

---

```md
# PropFlow

**Autonomous Property Maintenance Orchestration Engine**

---

## Project Identity

**PropFlow** is a workflow-first, agentic AI system designed to automate the triage, decision-making, and dispatch of property maintenance requests in large-scale property management environments.

**Mission**  
To bridge the gap between tenant distress and vendor resolution by orchestrating intelligent, auditable, and resilient maintenance workflows using agentic AI and secure browser automation.

PropFlow is intentionally designed for **enterprise property management platforms** where:
- Volume is high
- Legacy systems are unavoidable
- Safety, cost control, and auditability are mandatory

---

## Problem Statement

Property management organizations handle thousands of maintenance requests daily.  
Most requests require manual effort to:

- Interpret tenant-reported issues
- Assess urgency and safety
- Look up lease, warranty, and maintenance history
- Select and schedule appropriate vendors
- Recover from failures in legacy vendor portals

This process is slow, costly, and error-prone.

**PropFlow addresses this by modeling maintenance as a deterministic workflow**, where AI assists with reasoning and context—but never bypasses operational safeguards.

---

## Design Philosophy

PropFlow is built on the following principles:

- **Workflow-first, not chat-first**  
  Maintenance is a state machine, not a conversation.

- **AI reasons, systems decide**  
  LLMs generate insights; deterministic logic governs execution.

- **Safety over autonomy**  
  Emergencies and low-confidence situations always trigger human intervention.

- **Enterprise operability by default**  
  Every action is auditable, replayable, and permission-scoped.

---

## High-Level Architecture

```

Tenant App / Portal
│
▼
API Gateway (AuthN/AuthZ, Rate Limits)
│
▼
LangGraph Workflow Engine
│
├── Triage Agent (LLM)
├── Knowledge Agent (RAG)
├── Execution Agent (Playwright)
├── Human Ops Console
│
▼
Immutable Audit & Compliance Store

```

AI components operate **inside** the workflow engine — not as standalone services.

---

## Core Agents

### 1. Triage Agent (Tenant-Facing)

**Responsibilities**
- Conversational intake of tenant issues
- Structured extraction (issue type, location, severity)
- Emergency detection
- Clarification loops when confidence is insufficient

**Constraints**
- Cannot execute actions
- Cannot schedule vendors
- Emergency classification is rule-enforced, not probabilistic

---

### 2. Knowledge Agent (Context & Reasoning)

**Responsibilities**
- Retrieval-augmented reasoning over:
  - Lease agreements
  - Appliance warranties
  - Maintenance history
  - Vendor performance data
- Recommend corrective actions
- Define cost ceilings and vendor eligibility

**Constraints**
- Advisory only
- No system-side effects

---

### 3. Execution Agent (Deterministic Automation)

**Responsibilities**
- Securely automate legacy vendor portals using Playwright
- Enforce vendor ratings, cost caps, and retry policies
- Execute as a checkpointed, resumable state machine

**Constraints**
- No LLM usage
- No autonomous decision-making
- Executes only when explicitly authorized by workflow state

---

## Workflow Orchestration

PropFlow uses **LangGraph** to model maintenance as a cyclic, state-driven DAG:

```

TRIAGE
├── Emergency → HUMAN OVERRIDE → END
├── Needs Clarification → TRIAGE
└── Safe → KNOWLEDGE
├── Self-Help → WAIT → TRIAGE
└── Vendor Required → EXECUTION → CONFIRMATION → END

```

This structure enables:
- Clarification loops
- Safe retries
- Deferred execution
- Human-in-the-loop escalation

---

## Failure Recovery Model

Failure is treated as a first-class concern.

- **Transient failures** → Retry with backoff
- **Portal downtime** → Deferred execution queue
- **Partial success** → State reconciliation before retry
- **Automation crashes** → Resume from last successful step

Execution is decomposed into atomic, idempotent steps to prevent duplicate bookings or inconsistent state.

---

## Security & Compliance

PropFlow is designed to align with **SOC2-style enterprise requirements**:

- OAuth2 / SAML authentication
- Role-based and attribute-based authorization (RBAC + ABAC)
- Strict tenant and property data isolation
- Immutable, append-only audit logs
- Versioned prompts and model governance
- Secrets managed via vaults (never exposed to LLMs)

Each workflow transition is logged with:
- Actor identity
- Action performed
- Before/after state hashes
- Model and prompt version (if applicable)

---

## Human-in-the-Loop Controls

Human operators are invoked when:

- An emergency is detected
- Confidence falls below SLA thresholds
- Costs exceed authorization limits
- Automation encounters systemic failure

Humans **resume** workflows from preserved state rather than restarting them.

---

## Observability & Evaluation

- State-based workflows enable full replay and forensic analysis
- Golden datasets are used to evaluate triage accuracy pre-deployment
- Emergency recall is prioritized over precision
- Metrics tracked:
  - Time-to-resolution
  - Cost avoidance
  - Escalation rate
  - Automation success rate

---

## Technology Stack

- **Workflow Orchestration:** LangGraph
- **LLM Reasoning:** OpenAI-compatible APIs
- **Retrieval:** Vector database (tenant-scoped)
- **Automation:** Playwright (containerized, isolated)
- **Secrets Management:** Vault / KMS
- **Audit Logs:** Append-only object storage
- **Infrastructure:** Kubernetes-based execution environment

---

## Explicit Non-Goals

PropFlow intentionally does **not** attempt to:

- Fully automate emergency response
- Allow LLMs direct access to production systems
- Replace human property managers
- Bypass compliance or authorization controls

---

## Project Status

PropFlow is a **reference architecture and implementation blueprint** demonstrating Staff-level system design for agentic AI in regulated enterprise environments.

---

## Author’s Note

PropFlow reflects a core belief:  
The future of enterprise AI is not autonomy without oversight, but **orchestration with accountability**.
```

---

