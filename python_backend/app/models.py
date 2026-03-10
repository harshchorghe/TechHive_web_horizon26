from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


AlertType = Literal["crisis", "opportunity", "anomaly"]
RoleType = Literal["Strategic", "Tactical"]


class SalesState(BaseModel):
    revenue_per_hour: float
    orders_per_hour: int
    conversion_rate: float
    avg_order_value: float
    refund_rate: float
    cash_reserve: float


class InventorySku(BaseModel):
    sku: str
    stock: int
    reorder_point: int
    velocity_per_hour: float
    warehouse: str
    delayed: bool = False


class InventoryState(BaseModel):
    fulfillment_minutes: float
    bottleneck: str
    skus: list[InventorySku]
    incoming_shipments: list[dict]


class SupportCategory(BaseModel):
    label: str
    tickets: int
    response_minutes: float


class SupportTicket(BaseModel):
    id: str
    customer: str
    sentiment: Literal["negative", "neutral", "positive"]
    status: Literal["active", "escalated", "resolved"]
    message: str
    eta_minutes: int


class SupportState(BaseModel):
    open_tickets: int
    ticket_volume_per_hour: int
    sentiment_score: float = Field(ge=0, le=100)
    resolution_minutes: float
    active_agents: int
    total_agents: int
    categories: list[SupportCategory]
    live_tickets: list[SupportTicket]


class Alert(BaseModel):
    id: str
    at: datetime
    type: AlertType
    title: str
    message: str
    severity: int = Field(ge=1, le=100)
    recommended_action: str
    impact: str


class RootCauseLink(BaseModel):
    origin: str
    impact: str
    financial_effect: str


class PredictionPoint(BaseModel):
    horizon_hours: int
    predicted_stress: int
    explanation: str


class ForecastSeriesPoint(BaseModel):
    time: str
    health: float
    predicted: float | None = None


class MetricsStrategic(BaseModel):
    net_profit: float
    runway_days: int
    ltv: float
    elasticity_score: float


class MetricsTactical(BaseModel):
    fulfillment_speed_minutes: float
    sku_velocity: float
    ticket_resolution_minutes: float
    warehouse_bottleneck: str


class RecommendationsState(BaseModel):
    playbooks: list[dict]


class BusinessState(BaseModel):
    timestamp: datetime
    role: RoleType = "Strategic"
    sales: SalesState
    inventory: InventoryState
    support: SupportState
    stress_score: int = Field(ge=0, le=100)
    stress_breakdown: dict
    alerts: list[Alert]
    events: list[dict]
    root_causes: list[RootCauseLink]
    predictions: list[PredictionPoint]
    chart_data: list[ForecastSeriesPoint]
    recommendations: RecommendationsState
    strategic_metrics: MetricsStrategic
    tactical_metrics: MetricsTactical
    war_room_active: bool
