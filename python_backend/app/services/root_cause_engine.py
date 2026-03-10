from __future__ import annotations

from app.models import RootCauseLink


class RootCauseEngine:
    def build(self, delayed_shipments: int, refund_rate: float, revenue_drop_pct: float) -> list[RootCauseLink]:
        if delayed_shipments <= 0 and refund_rate < 2.0:
            return [
                RootCauseLink(
                    origin="Stable logistics throughput",
                    impact="No cross-silo cascade detected",
                    financial_effect="Revenue impact negligible",
                )
            ]

        return [
            RootCauseLink(
                origin=f"{delayed_shipments} delayed shipments in Warehouse B",
                impact=f"Refund pressure increased with refund rate at {refund_rate:.2f}%",
                financial_effect=f"Estimated revenue dip {revenue_drop_pct:.1f}%",
            ),
            RootCauseLink(
                origin="Inventory bottleneck on top velocity SKU",
                impact="Support queue shifted to logistics complaints",
                financial_effect="LTV erosion risk due to response delay",
            ),
        ]
