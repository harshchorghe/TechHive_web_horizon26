# OpsPulse

From Fragmented Data to Decisive Action.

## Architecture

- `client/`: React + Vite frontend
- `python_backend/`: FastAPI backend with live simulation and WebSocket streaming

## Implemented Features

- Live stream engine for Sales, Inventory, and Support over WebSocket (`/ws`)
- Cross-vertical interaction: sales events drain inventory and increase support load
- Dynamic multi-variate stress score with:
  - weighted non-linear formula
  - low cash multiplier (`2x` risk)
  - operational elasticity modifier
- Three-tier alert system:
  - `crisis`
  - `opportunity`
  - `anomaly`
- Dual role UI views:
  - Strategic (owner)
  - Tactical (ops)
- Dedicated Predictive Reports module (`/reports`) with:
  - mode switch (`Strategic`, `Tactical`, `War Room`)
  - stress projection envelope chart
  - scenario delta chart (conservative / expected / worst-case)
  - frontend feature coverage panel
- War Room mode auto-activation when stress crosses threshold
- Predictive pulse forecast for `6h`, `12h`, `24h` with interactive horizon selection in dashboard chart
- Root cause mapping links across inventory, support, and sales
- One-click recommendation playbooks with approval endpoint
- Home "Full Analysis" CTA wired to Predictive Reports
- **Executive Natural Language Briefing**: AI CEO morning brief parsing real-time metrics into readable directives.
- **Ecosystem Integration Hub**: Simulated bi-directional syncs with Slack, Shopify, Stripe, and Zendesk with live toggles.
- **Closed-Loop Action Engine**: Real-time tracker for playbooks to register ROI and impact metrics immediately after action.
- **Scenario Simulator**: A sandbox "What-If" slider capable of multiplying current load organically to preview stress reactions natively in UI.
- **Tactical Polish Layer**: High-end CRT overlays, scanning Lottie vectors, and conditional auditory pings active specifically within War Room states.

## Backend API

- `GET /health`
- `GET /api/v1/state`
- `GET /api/v1/alerts`
- `POST /api/v1/role/{Strategic|Tactical}`
- `POST /api/v1/playbooks/{playbook_id}/approve`
- `WS /ws`

## Run Locally

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
npm run install:backend
```

3. Run backend:

```bash
npm run dev:backend
```

4. Run frontend (new terminal):

```bash
npm run dev:frontend
```

## Optional Frontend Environment Variables

Use a `.env` file in project root:

```bash
VITE_OPSPULSE_API_BASE=http://localhost:8000
VITE_OPSPULSE_WS_URL=ws://localhost:8000/ws
```

## Scalability Notes

Current backend is modular and in-memory for speed of iteration. To scale:

- move simulator state to Redis/Postgres
- run multiple API instances behind a load balancer
- offload tick generation to a queue worker
- push stream events via Redis pub/sub
