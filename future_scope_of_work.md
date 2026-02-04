# Future Scope of Work: PropFlow

This document outlines the roadmap for PropFlow, detailing upcoming features and how they will be architected using the existing LangGraph + Next.js + FastAPI structure.

## 1. Technician Mobile Experience (The "Solver" Interface)
*Current Status: Planned*

### Feature Description
A mobile-first view for vendors/technicians to view assigned jobs, upload completion photos, and access property details.

### Technical Implementation
*   **Frontend**: Create `frontend/src/app/technician/dashboard/` with camera access capability.
*   **Backend**: Expose `GET /work-orders/{id}` and `POST /work-orders/{id}/complete`.
*   **AI Agent**:
    *   **New Node**: `src/nodes/verification.py` (Visual inspection node).
    *   **Logic**: When a technician uploads a photo, this node uses Gemini 1.5 Pro (Vision) to verify the repair (e.g., "Is the pipe actually fixed?").
    *   **Graph Update**: Add edge `execution -> verification -> dispatch`.

## 2. Advanced RAG & Multi-Modal Ingestion
*Current Status: Basic Text Ingestion*

### Feature Description
Ingesting visual data (blueprints, circuit diagrams) and audio (voicemail reports) into the Knowledge Base.

### Technical Implementation
*   **Ingestion Script**: Update `scripts/ingest.py` to process `.pdf` (images) and `.jpg` files using Gemini 1.5 Pro Vision, converting them to text descriptions before embedding.
*   **Vector Store**: Update `src/tiny_vector_store.py` to support metadata filtering by `media_type`.
*   **Node Update**: Update `src/nodes/knowledge.py` to retrieve and serve image links to technicians (e.g., "Here is the wiring diagram for Unit 404").

## 3. Financial Integration (Payments & Accounting)
*Current Status: Mocked in Skills*

### Feature Description
Ability to collect rent, process application fees, and pay vendors automatically upon job completion.

### Technical Implementation
*   **New Skill**: `src/skills/payment_skills.py`.
    *   `verify_rent_payment(tenant_id)`
    *   `process_vendor_payout(vendor_id, amount)`
*   **Integration**: Stripe Connect API.
*   **Graph Update**:
    *   **Rent Check Node**: Before `execution`, check if `tenant_status == 'delinquent'`.
    *   If delinquent, route to `negotiation.py` node instead of accepting maintenance request (for non-emergencies).

## 4. IoT & Smart Home Integration
*Current Status: Manual "Lockout" Policy*

### Feature Description
Direct integration with smart locks (Yale/August) and thermostats (Nest/Ecobee) to handle lockouts and HVAC alerts automatically.

### Technical Implementation
*   **New Skill**: `src/skills/iot_skills.py`.
    *   `unlock_door(unit_id)`
    *   `get_thermostat_telemetry(unit_id)`
*   **Triage Logic**: Update `src/prompts/triage_agent.md` to recognize "I'm locked out" and trigger the `iot_skills.unlock_door` tool instead of dispatching a human.
*   **Auth**: strict 2FA verification before unlocking.

## 5. Voice Interface (Phone Support)
*Current Status: Text/Chat Only*

### Feature Description
Tenants can call a dedicated number, talk to the AI, and have it process requests just like chat.

### Technical Implementation
*   **Service**: Twilio Voice + OpenAI Whisper (STT) + ElevenLabs (TTS).
*   **Entry Point**: `backend/voice_webhook.py` (New File).
*   **Flow**:
    1.  Receive Audio -> Transcribe to Text.
    2.  Inject Text into `src/graph.py` (Existing Workflow).
    3.  Receive Text Response -> Synthesize to Audio.
    4.  Play Audio to caller.

## 6. Proactive Maintenance (Predictive AI)
*Current Status: Reactive*

### Feature Description
AI analyzes history to predict failures (e.g., "Unit 303's HVAC is 15 years old and has needed 3 repairs this summer -> Suggest Replacement").

### Technical Implementation
*   **New Workflow**: `src/workflows/audit_workflow.py` (Batch Process).
*   **Data Source**: `propflow.db` (Historical Tickets).
*   **Logic**:
    *   Run nightly analysis of `propflow.db`.
    *   Identify repeating assets.
    *   Draft "Capital Expenditure Request" for the Property Manager.

## 7. Multi-Property / Multi-Tenant Architecture
*Current Status: Single Property Context*

### Feature Description
Scaling the system to handle thousands of properties with distinct policies.

### Technical Implementation
*   **State Update**: Update `GatexState` in `src/state.py` to include `organization_id` and `property_id`.
*   **Vector Store**: Shard `propflow_knowledge.json` by `organization_id` or add `filter={'org_id': '...'}` to every query in `src/nodes/knowledge.py`.
*   **Auth**: Update `backend/auth.py` to manage Role-Based Access Control (RBAC) (Super Admin vs. Property Manager vs. Tenant).

## Summary of New Files Required

| Feature | New Files / Modifications |
| :--- | :--- |
| **Technician App** | `frontend/src/app/technician/`, `src/nodes/verification.py` |
| **Advanced RAG** | `scripts/ingest_multimodal.py` |
| **Payments** | `src/skills/payment_skills.py` |
| **IoT** | `src/skills/iot_skills.py` |
| **Voice** | `backend/voice_webhook.py` |
| **Predictive** | `src/cron/nightly_audit.py` |
