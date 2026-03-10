from __future__ import annotations

from app.models import Alert


class RecommendationEngine:
    def build_playbooks(self, alerts: list[Alert]) -> list[dict]:
        playbooks: list[dict] = []
        for alert in alerts:
            if alert.type == "crisis":
                cost = "$1.2k/day"
                urgency = "immediate"
            elif alert.type == "anomaly":
                cost = "$0.4k/day"
                urgency = "high"
            else:
                cost = "$0.2k/day"
                urgency = "medium"

            playbooks.append(
                {
                    "id": alert.id,
                    "title": alert.title,
                    "risk": alert.impact,
                    "action": alert.recommended_action,
                    "estimated_cost": cost,
                    "urgency": urgency,
                }
            )

        return playbooks[:3]
