from __future__ import annotations

import random
from collections import deque
from datetime import datetime
from uuid import uuid4

from app.config import settings
from app.models import (
    BusinessState,
    ForecastSeriesPoint,
    InventorySku,
    InventoryState,
    MetricsStrategic,
    MetricsTactical,
    RecommendationsState,
    SalesState,
    SupportCategory,
    SupportState,
    SupportTicket,
)
from app.services.alert_engine import AlertEngine
from app.services.prediction_engine import PredictionEngine
from app.services.recommendation_engine import RecommendationEngine
from app.services.root_cause_engine import RootCauseEngine
from app.services.stress_engine import StressEngine, StressInputs


class OpsPulseSimulator:
    def __init__(self) -> None:
        self.stress_engine = StressEngine()
        self.alert_engine = AlertEngine()
        self.prediction_engine = PredictionEngine()
        self.root_cause_engine = RootCauseEngine()
        self.recommendation_engine = RecommendationEngine()
        self.history: deque[float] = deque(maxlen=30)
        self.state = self._initial_state()
        for _ in range(30):
            self.history.append(float(self.state.stress_score))

    def _initial_state(self) -> BusinessState:
        sales = SalesState(
            revenue_per_hour=12000,
            orders_per_hour=96,
            conversion_rate=4.1,
            avg_order_value=125.0,
            refund_rate=1.4,
            cash_reserve=settings.default_cash_reserve,
        )
        inventory = InventoryState(
            fulfillment_minutes=38.0,
            bottleneck="Warehouse B conveyor",
            skus=[
                InventorySku(sku="SKU-402", stock=220, reorder_point=120, velocity_per_hour=28, warehouse="WH-B", delayed=True),
                InventorySku(sku="SKU-108", stock=520, reorder_point=200, velocity_per_hour=14, warehouse="WH-A"),
                InventorySku(sku="SKU-205", stock=300, reorder_point=160, velocity_per_hour=18, warehouse="WH-C"),
                InventorySku(sku="SKU-611", stock=120, reorder_point=110, velocity_per_hour=10, warehouse="WH-B"),
            ],
            incoming_shipments=[
                {"id": "LOG-928", "status": "In Transit", "eta": "4h 20m", "item": "SKU-402 (200 units)"},
                {"id": "LOG-929", "status": "Delayed", "eta": "48h", "item": "SKU-108 (500 units)"},
                {"id": "LOG-930", "status": "Processing", "eta": "72h", "item": "SKU-205 (1000 units)"},
            ],
        )
        support = SupportState(
            open_tickets=132,
            ticket_volume_per_hour=84,
            sentiment_score=72,
            resolution_minutes=7.5,
            active_agents=12,
            total_agents=14,
            categories=[
                SupportCategory(label="Billing", tickets=22, response_minutes=2.1),
                SupportCategory(label="Technical", tickets=28, response_minutes=4.5),
                SupportCategory(label="Logistics", tickets=64, response_minutes=11.4),
                SupportCategory(label="General", tickets=18, response_minutes=1.0),
            ],
            live_tickets=self._seed_tickets(),
        )

        stress_score, breakdown = self._compute_stress(sales, inventory, support)
        alerts = self.alert_engine.generate(
            stress_score=stress_score,
            low_stock_count=self._low_stock_count(inventory),
            delayed_shipments=self._delayed_shipments(inventory),
            support_wait=support.resolution_minutes,
            sentiment_score=support.sentiment_score,
            runway_days=self._runway_days(sales),
        )

        predictions = self.prediction_engine.forecast(
            stress_score=stress_score,
            support_velocity=support.ticket_volume_per_hour / 15,
            sku_burn_velocity=sum(s.velocity_per_hour for s in inventory.skus) / 30,
        )

        root_causes = self.root_cause_engine.build(
            delayed_shipments=self._delayed_shipments(inventory),
            refund_rate=sales.refund_rate,
            revenue_drop_pct=max(0, 8 - sales.conversion_rate),
        )
        recommendations = RecommendationsState(
            playbooks=self.recommendation_engine.build_playbooks(alerts)
        )

        chart_data = self._build_chart_data(stress_score)

        return BusinessState(
            timestamp=datetime.utcnow(),
            sales=sales,
            inventory=inventory,
            support=support,
            stress_score=stress_score,
            stress_breakdown=breakdown,
            alerts=alerts,
            events=self._events_from_alerts(alerts),
            root_causes=root_causes,
            predictions=predictions,
            chart_data=chart_data,
            recommendations=recommendations,
            strategic_metrics=self._strategic_metrics(sales, stress_score),
            tactical_metrics=self._tactical_metrics(inventory, support),
            war_room_active=stress_score >= settings.war_room_threshold,
        )

    def _seed_tickets(self) -> list[SupportTicket]:
        templates = [
            ("John Doe", "negative", "active", "Shipment #402 stuck in processing for 48 hours."),
            ("Nina Carter", "neutral", "active", "Need invoice correction before EOD."),
            ("Rahul Iyer", "negative", "escalated", "Order partial delivery impacted client launch."),
            ("Meera Singh", "positive", "resolved", "Thanks for expedited replacement."),
            ("Ethan Lee", "neutral", "active", "Need update on delayed warehouse dispatch."),
        ]
        tickets: list[SupportTicket] = []
        for customer, sentiment, status, message in templates:
            tickets.append(
                SupportTicket(
                    id=f"TIC-{random.randint(1000, 9999)}",
                    customer=customer,
                    sentiment=sentiment,
                    status=status,
                    message=message,
                    eta_minutes=random.randint(2, 15),
                )
            )
        return tickets

    def _compute_stress(self, sales: SalesState, inventory: InventoryState, support: SupportState) -> tuple[int, dict]:
        support_pressure = min(100.0, support.ticket_volume_per_hour * 0.7 + support.resolution_minutes * 4)

        low_stock_pressure = sum(
            max(0.0, (sku.reorder_point - sku.stock) * 0.5) for sku in inventory.skus
        )
        delay_pressure = self._delayed_shipments(inventory) * 12.0
        inventory_pressure = min(100.0, low_stock_pressure + delay_pressure + inventory.fulfillment_minutes)

        sales_pressure = min(
            100.0,
            max(0.0, (2.5 - sales.conversion_rate) * 18) + sales.refund_rate * 10,
        )

        elasticity = self._elasticity_score(sales.cash_reserve)
        return self.stress_engine.calculate(
            StressInputs(
                support_pressure=support_pressure,
                inventory_pressure=inventory_pressure,
                sales_pressure=sales_pressure,
                cash_reserve=sales.cash_reserve,
                low_cash_threshold=settings.low_cash_threshold,
                elasticity_score=elasticity,
            )
        )

    def _elasticity_score(self, cash_reserve: float) -> float:
        # 0 reserve means almost no shock absorption, 100 means high elasticity.
        return max(0.0, min(100.0, (cash_reserve / 100000) * 100))

    def _runway_days(self, sales: SalesState) -> int:
        daily_burn = max(1200.0, 5000 - sales.revenue_per_hour * 0.18)
        return max(1, int(sales.cash_reserve / daily_burn))

    def _low_stock_count(self, inventory: InventoryState) -> int:
        return sum(1 for sku in inventory.skus if sku.stock <= sku.reorder_point)

    def _delayed_shipments(self, inventory: InventoryState) -> int:
        delayed = sum(1 for s in inventory.incoming_shipments if s["status"] == "Delayed")
        delayed += sum(1 for sku in inventory.skus if sku.delayed)
        return delayed

    def _build_chart_data(self, stress_score: int) -> list[ForecastSeriesPoint]:
        history = list(self.history)
        if len(history) < 30:
            history = ([float(stress_score)] * (30 - len(history))) + history

        now_index = 20
        points: list[ForecastSeriesPoint] = []
        for i in range(30):
            label = f"T-{29 - i}"
            health = history[i]
            predicted = None
            if i >= now_index:
                drift = (i - now_index) * random.uniform(1.8, 3.2)
                predicted = max(0.0, min(100.0, health + drift))
            points.append(ForecastSeriesPoint(time=label, health=health, predicted=predicted))
        return points

    def _events_from_alerts(self, alerts: list) -> list[dict]:
        return [
            {
                "id": alert.id,
                "time": alert.at.strftime("%H:%M:%S"),
                "type": alert.type,
                "message": alert.message,
                "title": alert.title,
                "impact": alert.impact,
                "recommendedAction": alert.recommended_action,
            }
            for alert in alerts
        ]

    def _strategic_metrics(self, sales: SalesState, stress_score: int) -> MetricsStrategic:
        net_profit = sales.revenue_per_hour * 0.28 - 2100
        return MetricsStrategic(
            net_profit=round(net_profit, 2),
            runway_days=self._runway_days(sales),
            ltv=round(900 + sales.conversion_rate * 90 - sales.refund_rate * 20, 2),
            elasticity_score=round(self._elasticity_score(sales.cash_reserve), 2),
        )

    def _tactical_metrics(self, inventory: InventoryState, support: SupportState) -> MetricsTactical:
        avg_velocity = sum(sku.velocity_per_hour for sku in inventory.skus) / max(1, len(inventory.skus))
        return MetricsTactical(
            fulfillment_speed_minutes=round(inventory.fulfillment_minutes, 2),
            sku_velocity=round(avg_velocity, 2),
            ticket_resolution_minutes=round(support.resolution_minutes, 2),
            warehouse_bottleneck=inventory.bottleneck,
        )

    def tick(self) -> BusinessState:
        state = self.state.model_copy(deep=True)
        state.timestamp = datetime.utcnow()

        # Simulate sales and cash movement.
        sale_orders = random.randint(4, 16)
        sale_revenue = sale_orders * state.sales.avg_order_value
        state.sales.orders_per_hour = max(20, state.sales.orders_per_hour + random.randint(-5, 8))
        state.sales.revenue_per_hour = max(5000, state.sales.revenue_per_hour + random.uniform(-700, 900))
        state.sales.conversion_rate = max(1.5, min(7.5, state.sales.conversion_rate + random.uniform(-0.4, 0.35)))
        state.sales.refund_rate = max(0.3, min(4.5, state.sales.refund_rate + random.uniform(-0.2, 0.3)))

        operational_burn = random.uniform(900, 1700)
        state.sales.cash_reserve = max(500, state.sales.cash_reserve + sale_revenue * 0.23 - operational_burn)

        # Sales drain inventory in real-time.
        hot_sku = random.choice(state.inventory.skus)
        for sku in state.inventory.skus:
            depletion = max(1, int((sale_orders / len(state.inventory.skus)) * (1.25 if sku == hot_sku else 0.9)))
            sku.stock = max(0, sku.stock - depletion)
            sku.velocity_per_hour = max(4.0, min(36.0, sku.velocity_per_hour + random.uniform(-2, 2.4)))

            if sku.stock < sku.reorder_point and random.random() < 0.25:
                sku.delayed = True
            elif random.random() < 0.35:
                sku.delayed = False

        # Occasional restock events.
        if random.random() < 0.25:
            restock_sku = random.choice(state.inventory.skus)
            restock_sku.stock += random.randint(60, 180)

        state.inventory.fulfillment_minutes = max(15.0, min(95.0, state.inventory.fulfillment_minutes + random.uniform(-4, 6)))
        state.inventory.bottleneck = random.choice(
            ["Warehouse B conveyor", "Dock allocation", "Carrier pickup window", "Labeling station"]
        )

        # Support reacts to inventory and sales issues.
        low_stock = self._low_stock_count(state.inventory)
        support_spike = low_stock * random.randint(2, 6)
        state.support.ticket_volume_per_hour = max(20, state.support.ticket_volume_per_hour + random.randint(-6, 10) + support_spike)
        state.support.open_tickets = max(20, state.support.open_tickets + random.randint(-8, 16) + support_spike)
        state.support.resolution_minutes = max(
            1.5,
            min(24.0, state.support.resolution_minutes + random.uniform(-1.5, 2.2) + low_stock * 0.3),
        )
        state.support.sentiment_score = max(30, min(95, state.support.sentiment_score + random.uniform(-4.5, 2.0)))

        for category in state.support.categories:
            if category.label == "Logistics":
                category.tickets = max(8, category.tickets + random.randint(-4, 12) + support_spike)
                category.response_minutes = max(1.5, min(20.0, category.response_minutes + random.uniform(-1, 2.5)))
            else:
                category.tickets = max(4, category.tickets + random.randint(-3, 4))
                category.response_minutes = max(0.8, min(12.0, category.response_minutes + random.uniform(-0.8, 1.0)))

        state.support.live_tickets = self._seed_tickets()

        stress_score, breakdown = self._compute_stress(state.sales, state.inventory, state.support)
        state.stress_score = stress_score
        state.stress_breakdown = breakdown
        self.history.append(float(stress_score))

        state.alerts = self.alert_engine.generate(
            stress_score=stress_score,
            low_stock_count=low_stock,
            delayed_shipments=self._delayed_shipments(state.inventory),
            support_wait=state.support.resolution_minutes,
            sentiment_score=state.support.sentiment_score,
            runway_days=self._runway_days(state.sales),
        )
        state.events = self._events_from_alerts(state.alerts)

        state.root_causes = self.root_cause_engine.build(
            delayed_shipments=self._delayed_shipments(state.inventory),
            refund_rate=state.sales.refund_rate,
            revenue_drop_pct=max(0, 7.5 - state.sales.conversion_rate),
        )
        state.predictions = self.prediction_engine.forecast(
            stress_score=stress_score,
            support_velocity=state.support.ticket_volume_per_hour / 15,
            sku_burn_velocity=sum(s.velocity_per_hour for s in state.inventory.skus) / 30,
        )
        state.recommendations = RecommendationsState(
            playbooks=self.recommendation_engine.build_playbooks(state.alerts)
        )
        state.chart_data = self._build_chart_data(stress_score)
        state.strategic_metrics = self._strategic_metrics(state.sales, stress_score)
        state.tactical_metrics = self._tactical_metrics(state.inventory, state.support)
        state.war_room_active = stress_score >= settings.war_room_threshold

        for shipment in state.inventory.incoming_shipments:
            if random.random() < 0.2:
                shipment["status"] = random.choice(["In Transit", "Delayed", "Processing"])

        self.state = state
        return state

    def get_state(self) -> BusinessState:
        return self.state

    def apply_role(self, role: str) -> BusinessState:
        if role in ("Strategic", "Tactical"):
            self.state.role = role
        return self.state

    def resolve_playbook(self, playbook_id: str) -> dict:
        for playbook in self.state.recommendations.playbooks:
            if playbook["id"] == playbook_id:
                return {
                    "status": "approved",
                    "playbook_id": playbook_id,
                    "message": f"Playbook '{playbook['title']}' approved and queued for execution.",
                    "execution_id": str(uuid4()),
                }
        return {
            "status": "not_found",
            "playbook_id": playbook_id,
            "message": "Playbook not found in current recommendation window.",
        }
