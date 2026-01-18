# PropFlow

**Autonomous Property Maintenance Orchestration Engine**

---

## Project Identity & Scope

**PropFlow** is a workflow-first, agentic AI system designed to orchestrate the triage, decision-making, and execution of property maintenance requests in large-scale property management environments.

### Mission

To bridge the gap between tenant-reported issues and vendor resolution by orchestrating **intelligent, auditable, and resilient maintenance workflows** using agentic AI and secure browser automation.

### Intended Environment

PropFlow is explicitly designed for **enterprise property management platforms** where:

- Maintenance request volume is high
- Legacy vendor systems are unavoidable
- Cost controls and safety guarantees are mandatory
- Human operators must retain final authority
- Auditability and compliance are non-negotiable

PropFlow is **not** a consumer chatbot, ticketing system, or fully autonomous agent.

---

## Problem Statement

Property management organizations process thousands of maintenance requests daily.  
Each request typically requires manual effort to:

- Interpret tenant-reported issues
- Assess urgency and safety risk
- Consult lease agreements and warranty terms
- Review maintenance and incident history
- Select compliant vendors within cost limits
- Recover from failures in brittle vendor portals

This workflow is slow, expensive, and error-prone because it relies on **human glue logic** across disconnected systems.

### Core Insight

Maintenance resolution is **not a conversational problem**.  
It is a **stateful, safety-critical workflow orchestration problem**.

PropFlow models maintenance as a **deterministic state machine**, where AI assists with reasoning and context — but never bypasses operational safeguards.

---

## Design Philosophy

PropFlow is built on the following principles:

### 1. Workflow-First, Not Chat-First
Maintenance resolution is a state machine, not an LLM conversation.

### 2. AI Reasons, Systems Decide
LLMs generate insights and recommendations.  
Deterministic logic governs execution.

### 3. Safety Over Autonomy
Emergencies, ambiguity, and high-cost scenarios always escalate to humans.

### 4. Enterprise Operability by Default
Every action is auditable, replayable, permission-scoped, and reversible.

---

## High-Level Architecture

```mermaid
graph TD
    subgraph Client_Layer [Client Layer]
        A[Tenant App / Portal]
    end

    subgraph Infrastructure [Infrastructure & Security]
        B[API Gateway]
        B1[Authentication / Authorization]
        B2[Rate Limiting]
        B --> B1
        B --> B2
    end

    subgraph Core_Engine [LangGraph Workflow Engine]
        direction TB
        C{Workflow Coordinator}
        D[Triage Agent]
        E[Knowledge Agent]
        F[Execution Agent]
        G[Human Operations Console]

        C --> D
        D -- Safe --> E
        E -- Professional --> F
        D -- Emergency --> G
        F --> C
    end

    subgraph Persistence [Data & Compliance]
        H[(Immutable Audit Log)]
    end

    A --> B --> C
    C -. State Transitions .-> H
    F -. Execution Trace .-> H
    
flowchart TD
    Start((Tenant Issue)) --> Triage{Triage}

    Triage -- Emergency --> Human[Human Override]
    Human --> End((End))

    Triage -- Needs Clarification --> Clarify[Clarification Loop]
    Clarify --> Triage

    Triage -- Safe --> Knowledge{Knowledge}

    Knowledge -- Self-Resolvable --> SelfHelp[Self-Help Guidance]
    SelfHelp --> Wait[Wait & Observe]
    Wait --> Triage

    Knowledge -- Professional Required --> Execute[Execution]
    Execute --> Confirm[Confirmation]
    Confirm --> End
