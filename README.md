# OpsPulse

OpsPulse is a real-time operations command center for sales, inventory, and support teams. It combines live telemetry, predictive stress scoring, root-cause analysis, and action playbooks so teams can move from reactive firefighting to structured recovery.

## Table of Contents

- [Why OpsPulse](#why-opspulse)
- [What the App Does](#what-the-app-does)
- [System Architecture](#system-architecture)
- [Model and Decision Logic](#model-and-decision-logic)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [How to Demo It](#how-to-demo-it)
- [Production Path](#production-path)

## Why OpsPulse

Most teams monitor operations through disconnected tools. Sales signals, stock risk, and customer support pressure are visible, but not connected. OpsPulse closes that gap by:

- Streaming all major operational signals in one place.
- Converting metrics into an explainable stress score.
- Predicting near-term risk before failure happens.
- Recommending concrete actions and tracking outcomes.

## What the App Does

- Live dashboard with streaming state updates.
- Alert tiers: `crisis`, `anomaly`, `opportunity`.
- Predictive stress and health trajectory charts.
- Root-cause feed linking operational cause to business impact.
- Playbook recommendations with approval flow.
- War Room mode for high-stress incident response.
- Role-based experience and route access control.

## System Architecture

OpsPulse follows a modular, event-driven architecture with a typed frontend and an engine-based backend.

```text
React (Vite + TypeScript) UI
	|
	| HTTP snapshot + role/actions
	v
FastAPI service (state + APIs + WebSocket hub)
	|
	| periodic tick loop
	v
Simulation + Intelligence Engines
  - stress_engine
  - alert_engine
  - prediction_engine
  - root_cause_engine
  - recommendation_engine
```

Design notes:

- Backend owns state generation and business logic.
- Frontend consumes snapshots and stream ticks, then renders role-aware workflows.
- Typed contracts are mirrored between backend Pydantic models and frontend TypeScript interfaces.

## Model and Decision Logic

OpsPulse currently uses an explainable rule-based intelligence model, not a black-box LLM.

### Stress Model

Stress is computed from weighted pressure inputs:

- Support pressure: ticket load and resolution latency.
- Inventory pressure: low-stock gap, delays, fulfillment latency.
- Sales pressure: conversion drop and refund trend.

Core formula:

```text
weighted = 0.35 * support_pressure
	 + 0.35 * inventory_pressure
	 + 0.30 * sales_pressure

elasticity_modifier = max(0.4, 1.25 - elasticity_score / 100)
low_cash_multiplier = 2.0 if cash_reserve < low_cash_threshold else 1.0

normalized_weighted = clamp(weighted / 100, 0, 1)
nonlinear = (normalized_weighted ^ 1.35) * 100
raw_score = nonlinear * elasticity_modifier * low_cash_multiplier
stress_score = clamp(round(raw_score), 0, 100)
```

### Decision Pipeline

1. Simulator generates operational ticks.
2. Stress engine computes score + breakdown.
3. Alert engine classifies risk tier.
4. Prediction engine projects near-future trajectory.
5. Root-cause engine builds causal links.
6. Recommendation engine creates playbooks.
7. UI surfaces actions and tracks mitigation.

## Tech Stack

### Frontend

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Wouter
- TanStack React Query
- Recharts
- Framer Motion
- Radix UI + Sonner

### Backend

- FastAPI
- Uvicorn
- Pydantic
- WebSocket streaming

### Tooling

- npm scripts for unified local workflow
- Python requirements in `python_backend/requirements.txt`

## Repository Layout

```text
client/          Frontend app, pages, components, hooks, types
python_backend/  FastAPI app and intelligence engines
server/          Node server utilities in workspace
shared/          Shared schema artifacts
script/          Build/helper scripts
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+

### Run Locally

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

4. In a second terminal, start frontend.

```bash
npm run dev:frontend
```

5. Open the app in your browser.

```text
http://localhost:5173
```

### Build for Production Check

```bash
npm run build
```

## Configuration

Create a root `.env` file if you want to override defaults:

```bash
VITE_OPSPULSE_API_BASE=http://localhost:8000
VITE_OPSPULSE_WS_URL=ws://localhost:8000/ws
```

If omitted, the frontend uses localhost defaults automatically.

## API Reference

### REST

- `GET /health` - service health check.
- `GET /api/v1/state` - full current state snapshot.
- `GET /api/v1/alerts` - active alerts only.
- `POST /api/v1/role/{Strategic|Tactical}` - switch role context.
- `POST /api/v1/playbooks/{playbook_id}/approve` - approve a playbook.

### WebSocket

- `WS /ws` - live stream of `snapshot` and `tick` payloads.

## How to Demo It

1. Sign in and choose a role.
2. Open Dashboard and watch live state updates.
3. Trigger pressure using the simulation controls.
4. Walk through root-cause and prediction panels.
5. Enter War Room when stress crosses threshold.
6. Approve playbooks and show stress mitigation impact.

This sequence demonstrates detection, explanation, recommendation, and measurable recovery in one story.

## Production Path

Current implementation is in-memory by design for fast iteration and demos. A practical scale-up path is:

- Persist state/history in Postgres or Redis.
- Move tick generation to a worker queue.
- Add pub/sub fan-out for multi-instance streaming.
- Add authentication, RBAC, and audit trails.
- Add policy controls around automated playbook execution.

## License

MIT
