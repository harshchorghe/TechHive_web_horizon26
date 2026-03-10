from __future__ import annotations

from dataclasses import dataclass


@dataclass
class StressInputs:
    support_pressure: float
    inventory_pressure: float
    sales_pressure: float
    cash_reserve: float
    low_cash_threshold: float
    elasticity_score: float


class StressEngine:
    def calculate(self, payload: StressInputs) -> tuple[int, dict]:
        weighted = (
            payload.support_pressure * 0.35
            + payload.inventory_pressure * 0.35
            + payload.sales_pressure * 0.30
        )

        # Elasticity reduces stress sensitivity when reserves are healthy.
        elasticity_modifier = max(0.4, 1.25 - payload.elasticity_score / 100)

        low_cash_multiplier = 2.0 if payload.cash_reserve < payload.low_cash_threshold else 1.0
        nonlinear = (weighted**1.15) * 1.6
        raw_score = nonlinear * elasticity_modifier * low_cash_multiplier
        stress_score = int(max(0, min(100, round(raw_score))))

        return stress_score, {
            "support_pressure": round(payload.support_pressure, 2),
            "inventory_pressure": round(payload.inventory_pressure, 2),
            "sales_pressure": round(payload.sales_pressure, 2),
            "elasticity_modifier": round(elasticity_modifier, 3),
            "low_cash_multiplier": low_cash_multiplier,
        }
