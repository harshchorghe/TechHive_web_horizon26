from __future__ import annotations

from app.models import PredictionPoint


class PredictionEngine:
    def forecast(self, stress_score: int, support_velocity: float, sku_burn_velocity: float) -> list[PredictionPoint]:
        projections: list[PredictionPoint] = []

        horizons = [6, 12, 24]
        for hours in horizons:
            slope = (support_velocity * 0.32 + sku_burn_velocity * 0.4) * (hours / 6)
            predicted = int(max(0, min(100, round(stress_score + slope))))
            projections.append(
                PredictionPoint(
                    horizon_hours=hours,
                    predicted_stress=predicted,
                    explanation=f"At current velocity, stress may reach {predicted} in {hours}h.",
                )
            )

        return projections
