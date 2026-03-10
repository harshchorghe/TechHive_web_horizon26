# OpsPulse Feature README

From fragmented operational signals to decisive action.

OpsPulse is a real-time operations intelligence platform that simulates and monitors live business conditions, predicts operational stress, explains root causes, and recommends high-ROI actions before issues become outages.

## 1. Problem We Solve

Modern teams run sales, inventory, and support on disconnected dashboards. By the time leaders detect a serious issue, revenue, customer satisfaction, and team performance are already impacted.

OpsPulse solves this by:
- unifying cross-functional operational signals into one control plane
- converting noisy data into stress and risk intelligence
- shifting from reactive firefighting to predictive decision-making
- enabling rapid, auditable actions during crisis mode

## 2. Full Tech Stack Used

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Recharts
- Wouter (routing)
- TanStack React Query
- Radix UI component primitives
- Sonner (toasts)
- use-sound (event audio cues)

### Backend (Simulation + Intelligence)
- FastAPI
- Uvicorn
- Pydantic
- Python-dotenv
- WebSocket streaming (`/ws`)

### Data and Shared Contracts
- Shared operational types in `client/src/types`
- Backend domain models and engines in `python_backend/app`
- Optional Node/Express + Drizzle utilities in workspace for extension and integration paths

### Dev and Build Tooling
- npm scripts for unified frontend/backend DX
- TypeScript strict typing
- Vite fast dev server + production builds

## 3. End-to-End Product Flow

### User Flow
1. User lands on OpsPulse and authenticates.
2. User selects role (operator/expert/analytics lead style experiences).
3. Dashboard starts consuming live state from WebSocket stream.
4. Platform computes stress score and highlights alert tier.
5. User opens root-cause feed to understand why risk is increasing.
6. Recommendation engine provides playbooks with expected impact.
7. User approves actions and tracks stress/ROI improvements.
8. During high-risk conditions, War Room mode guides emergency recovery.

### System Flow (Data to Action)
1. `simulator.py` generates live business ticks (sales, inventory, support).
2. `stress_engine.py` calculates weighted stress and factor breakdown.
3. `alert_engine.py` classifies signals into `crisis`, `anomaly`, `opportunity`.
4. `prediction_engine.py` forecasts near-future stress trajectory.
5. `root_cause_engine.py` maps causal relationships across functions.
6. `recommendation_engine.py` creates playbooks with action rationale.
7. FastAPI streams updates over `WS /ws` and exposes REST snapshots.
8. React UI renders executive briefings, forecast charts, and decision matrix.

## 4. Feature List (What We Built)

### Core Intelligence Features
- Real-time operations stream via WebSocket
- Unified stress score with multi-factor weighted logic
- Tiered alerting: crisis, anomaly, opportunity
- Predictive stress trends and health projection
- Root-cause graphing across sales, inventory, and support
- Decision playbooks for action prioritization
- Action approval tracking and ROI history

### Experience and Workflow Features
- Executive briefing in plain-language summary style
- Pulse dashboard for top KPIs and signals
- Predictive stress engine visualization
- Root cause feed for rapid diagnosis
- Decision recommendation matrix
- Action ROI history timeline
- Domain modules: Sales, Inventory, Support
- AI analytics and predictive report views
- Integrations page for ecosystem simulation

### Emergency Handling Features
- Automatic War Room mode on stress threshold breach
- Manual emergency override support
- Task-gated recovery workflow
- Approval-based stress mitigation tracking
- Resume console and emergency sidebar controls
- Secure logout flow to landing state

### Access and Governance Features
- Role-aware route permissions
- Protected routing and role selector gate
- Lightweight local auth/session state handling

## 5. API and Platform Interfaces

### REST Endpoints
- `GET /health`
- `GET /api/v1/state`
- `GET /api/v1/alerts`
- `POST /api/v1/role/{Strategic|Tactical}`
- `POST /api/v1/playbooks/{playbook_id}/approve`

### Streaming Interface
- `WS /ws` for continuous state, alert, and recommendation updates

## 6. Why OpsPulse Is Hackathon-Winning (USP)

### USP #1: Closed-Loop Operations Intelligence
Most dashboards stop at visibility. OpsPulse completes the loop:
- detect risk
- explain root cause
- recommend action
- validate ROI

### USP #2: Cross-Functional Causal Engine
Instead of siloed metrics, OpsPulse models how one system pressure impacts others:
- sales surge can trigger stockouts
- stockouts increase support load
- support delays harm sentiment and revenue trend

### USP #3: Crisis-to-Recovery Command Center
War Room mode is not cosmetic. It includes:
- emergency escalation
- approval workflow
- measurable stress reduction path
- controlled exit criteria

### USP #4: Decision Velocity with Accountability
Recommendations are actionable, not generic. Teams can approve playbooks and track impact over time, creating a measurable operating memory.

### USP #5: Demo-Ready + Production-Extensible
Built for live hackathon storytelling while keeping a clean path to production scale:
- in-memory simulation for rapid iteration
- clear engine modularity for ML upgrades
- straightforward migration to Redis/Postgres + pub/sub

## 7. Uniqueness vs Typical Dashboards

What typical dashboards do:
- show historical charts
- provide isolated metrics
- rely on manual interpretation

What OpsPulse does differently:
- streams live operational reality
- quantifies stress with interpretable factors
- predicts next-state risk
- links cause to business impact
- turns insight into trackable action playbooks

## 8. Hackathon Judging Alignment

### Innovation
- Blends simulation, forecasting, root-cause analysis, and action recommendation in one operational brain.

### Technical Execution
- Real-time WebSocket architecture with modular AI/analytics engines.
- Strong full-stack integration: React + FastAPI + typed interfaces.

### Impact
- Directly maps to business outcomes: uptime resilience, lower decision latency, and improved operational ROI.

### Usability
- Role-aware UX, executive summaries, and emergency-first interaction design.

### Scalability
- Clear roadmap from in-memory demo to distributed, production-ready architecture.

## 9. Elevator Pitch

OpsPulse is an AI-powered real-time command center for business operations. It does not just tell you what happened; it predicts what is about to break, explains why, and guides your team to the highest-impact action with measurable recovery outcomes.

## 10. Future Enhancements (Optional Pitch Add-ons)

- LLM-powered natural-language Q&A on live operational state
- Multi-tenant organization support
- Slack/Teams incident bridge and alert routing
- Human-in-the-loop policy engine for autonomous approvals
- Scenario replay and postmortem intelligence reports

## 11. Local Run Commands

```bash
npm install
npm run install:backend
npm run dev:backend
npm run dev:frontend
```

Optional `.env` values:

```bash
VITE_OPSPULSE_API_BASE=http://localhost:8000
VITE_OPSPULSE_WS_URL=ws://localhost:8000/ws
```
