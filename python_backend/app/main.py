from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.simulator import OpsPulseSimulator


class ConnectionHub:
    def __init__(self) -> None:
        self.connections: set[WebSocket] = set()

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        self.connections.add(ws)

    def disconnect(self, ws: WebSocket) -> None:
        if ws in self.connections:
            self.connections.remove(ws)

    async def broadcast(self, payload: dict) -> None:
        stale: list[WebSocket] = []
        for ws in self.connections:
            try:
                await ws.send_json(payload)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self.disconnect(ws)


simulator = OpsPulseSimulator()
hub = ConnectionHub()


@asynccontextmanager
async def lifespan(_: FastAPI):
    task = asyncio.create_task(stream_loop())
    try:
        yield
    finally:
        task.cancel()


app = FastAPI(title="OpsPulse API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.get("/api/v1/state")
async def get_state() -> dict:
    return simulator.get_state().model_dump(mode="json")


@app.get("/api/v1/alerts")
async def get_alerts() -> list[dict]:
    return [a.model_dump(mode="json") for a in simulator.get_state().alerts]


@app.post("/api/v1/role/{role}")
async def set_role(role: str) -> dict:
    state = simulator.apply_role(role)
    return state.model_dump(mode="json")


@app.post("/api/v1/playbooks/{playbook_id}/approve")
async def approve_playbook(playbook_id: str) -> dict:
    return simulator.resolve_playbook(playbook_id)


@app.websocket("/ws")
async def websocket_stream(ws: WebSocket) -> None:
    await hub.connect(ws)
    await ws.send_json({"type": "snapshot", "payload": simulator.get_state().model_dump(mode="json")})
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        hub.disconnect(ws)


async def stream_loop() -> None:
    while True:
        await asyncio.sleep(settings.tick_interval_seconds)
        state = simulator.tick().model_dump(mode="json")
        await hub.broadcast({"type": "tick", "payload": state})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
