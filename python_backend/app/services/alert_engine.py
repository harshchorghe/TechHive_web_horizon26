from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from app.models import Alert


class AlertEngine:
    def generate(
        self,
        stress_score: int,
        low_stock_count: int,
        delayed_shipments: int,
        support_wait: float,
        sentiment_score: float,
        runway_days: int,
    ) -> list[Alert]:
        alerts: list[Alert] = []

        if low_stock_count >= 2:
            alerts.append(
                Alert(
                    id=str(uuid4()),
                    at=datetime.utcnow(),
                    type="crisis",
                    title="Main SKU Stockout Risk",
                    message=f"{low_stock_count} SKUs below reorder point across active warehouses.",
                    severity=90,
                    recommended_action="Trigger emergency restock and reroute to WH-C.",
                    impact="Revenue leakage risk in next 3 hours.",
                )
            )

        if runway_days < 15:
            alerts.append(
                Alert(
                    id=str(uuid4()),
                    at=datetime.utcnow(),
                    type="crisis",
                    title="Cash Runway Critical",
                    message=f"Cash runway has dropped to {runway_days} days.",
                    severity=95,
                    recommended_action="Pause underperforming campaign to save burn immediately.",
                    impact="High multiplier on all operational shocks.",
                )
            )

        if support_wait > 9:
            alerts.append(
                Alert(
                    id=str(uuid4()),
                    at=datetime.utcnow(),
                    type="anomaly",
                    title="Support Response Drift",
                    message=f"Average support response is {support_wait:.1f}m this hour.",
                    severity=72,
                    recommended_action="Shift on-call agents from general queue to logistics queue.",
                    impact="Customer sentiment and refund risk rising.",
                )
            )

        if delayed_shipments > 0 and sentiment_score > 70:
            alerts.append(
                Alert(
                    id=str(uuid4()),
                    at=datetime.utcnow(),
                    type="opportunity",
                    title="Trust Window Open",
                    message="High sentiment despite delays. Proactive updates can protect LTV.",
                    severity=45,
                    recommended_action="Send automated delay compensation vouchers to top-value customers.",
                    impact="Protects churn while preserving brand trust.",
                )
            )

        if stress_score > 80:
            alerts.append(
                Alert(
                    id=str(uuid4()),
                    at=datetime.utcnow(),
                    type="crisis",
                    title="War Room Trigger",
                    message="Stress score crossed 80. Crisis-only operation mode recommended.",
                    severity=88,
                    recommended_action="Activate war room and execute top 3 playbooks now.",
                    impact="Narrows focus to prevent cascade failures.",
                )
            )

        if not alerts:
            alerts.append(
                Alert(
                    id=str(uuid4()),
                    at=datetime.utcnow(),
                    type="opportunity",
                    title="Efficiency Opportunity",
                    message="System stable. Reinvest team capacity into conversion experiments.",
                    severity=30,
                    recommended_action="Increase high-ROI ad set by 20% for next 2 hours.",
                    impact="Captures upside while stress remains low.",
                )
            )

        return alerts[:8]
