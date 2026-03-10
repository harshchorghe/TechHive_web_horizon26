# OpsPulse

From fragmented operational signals to decisive action.

OpsPulse is a real-time operations command center that combines a React frontend with a FastAPI simulation backend. It streams live business conditions (sales, inventory, support), calculates stress and risk, recommends actions, and supports emergency workflows.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Wouter
- Backend: FastAPI, WebSocket streaming, Pydantic models
- Shared: cross-module typing and schema conventions via `client/src/types` and backend models

## Project Structure

- `client/`: Frontend app and all UI modules
- `python_backend/`: FastAPI app, simulator, stress/prediction/recommendation engines
- `server/`: Node server utilities used by the workspace build/runtime setup
- `shared/`: shared schema artifacts
- `script/`: project build scripts

## Core Product Capabilities

- Live stream engine over `WS /ws` for continuous state updates
- Stress score computation using multi-factor weighted logic
- Cross-system dynamics:
- sales pressure affects inventory and support load
- delays and low stock affect sentiment and revenue trajectory
- Alerting tiers:
- `crisis`
- `anomaly`
- `opportunity`
- Predictive forecasts for near-future stress and health trends
- Root-cause linkage between operations signals and business impact
- Decision playbooks with approval actions and ROI/stress tracking
- Role-aware UX and route access:
- Beginner Operator
- CRM Expert
- Analytics Lead
- Data Analytics Specialist

## Frontend Modules Included

- `ExecutiveBriefing`: natural-language operational summary
- `PulseDashboard`: top-level KPI and signal tiles
- `PredictiveStressEngine`: forecast visualization and trend interpretation
- `RootCauseFeed`: cross-functional issue mapping
- `DecisionRecommendation`: emergency decision matrix and playbook actions
- `ActionROIHistory`: approved action impact history
- `SalesModule`, `InventoryModule`, `SupportModule`: domain deep-dives
- `PredictiveReports`: scenario and projection analysis view
- `AiAnalytics`: AI analytics-focused page
- `Integrations`: simulated ecosystem integrations

## Emergency (War Room) Workflow

War Room mode activates from backend state when stress crosses threshold.

Recovery flow implemented:

- Manual emergency override support in app state
- Task-gated exit from emergency matrix
- Exit unlock after required approvals are completed
- Each approval reduces stress in UI (`stress mitigation`)
- Chart projections recover as stress is reduced
- Emergency sidebar and matrix provide `Resume Console`
- Global `Logout` sends user back to landing screen

## Routing and Auth Behavior

- Public routes:
- `/`
- `/signin`
- `/signup`
- Protected flows:
- role selection gate at `/role-selector`
- role-based route filtering via `ROLE_ALLOWED_PATHS`
- local storage keys:
- `opspulse-authenticated`
- `opspulse-user-role`

## Backend API

- `GET /health`: health check
- `GET /api/v1/state`: current full simulated state snapshot
- `GET /api/v1/alerts`: current alerts list
- `POST /api/v1/role/{Strategic|Tactical}`: change backend role context
- `POST /api/v1/playbooks/{playbook_id}/approve`: approve emergency playbook
- `WS /ws`: live event/state stream

## Backend Engines Included

- `simulator.py`: orchestrates ticks and produces full business state
- `stress_engine.py`: computes stress score + breakdown
- `alert_engine.py`: builds tiered alerts
- `prediction_engine.py`: creates forecast points
- `root_cause_engine.py`: creates causal links
- `recommendation_engine.py`: builds action playbooks

## Local Development

1. Install frontend dependencies.

```bash
npm install
```

2. Install backend dependencies.

```bash
npm run install:backend
```

3. Start backend.

```bash
npm run dev:backend
```

4. Start frontend (new terminal).

```bash
npm run dev:frontend
```

5. Production build check.

```bash
npm run build
```

## Environment Variables

Create `.env` in repository root (optional defaults shown):

```bash
VITE_OPSPULSE_API_BASE=http://localhost:8000
VITE_OPSPULSE_WS_URL=ws://localhost:8000/ws
```

## UX Notes

- War-room visual mode includes focused emergency styling and scanline overlays
- Sound cues are triggered for key emergency and approval events
- Scenario simulator (`Traffic Spike`) allows stress testing dashboard behavior

## Scalability Notes

Current backend state is in-memory for speed and demonstration. For production scale:

- persist state/history to Redis/Postgres
- run multiple API instances behind a load balancer
- move tick generation to worker/queue architecture
- broadcast stream updates via pub/sub
