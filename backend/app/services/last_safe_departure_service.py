import math
from typing import List

from ..repositories.last_safe_departure_repository import IncidentRepository  # placeholder import if needed
from ..schemas.last_safe_departure import LastSafeDepartureRequest, LastSafeDepartureResponse

class LastSafeDepartureService:
    """Estimator for the last safe departure window.
    The logic is intentionally transparent and deterministic, suitable for a hackathon prototype.
    """

    def __init__(self) -> None:
        # In a full implementation you would inject a repository that provides
        # historical hazard trends, route degradation curves, etc.
        self._repo = IncidentRepository()  # currently unused placeholder

    def _compute_risk_score(self, request: LastSafeDepartureRequest) -> float:
        """Combine current route hazard with trend and predicted degradation.
        Returns a composite hazard score (higher = worse).
        """
        # Simplified model: hazard = current + trend * travel_time + predicted_degradation
        return (
            request.hazard_trend * request.travel_time_minutes
            + request.predicted_degradation
        )

    def _estimate_window(self, request: LastSafeDepartureRequest, risk_score: float) -> float:
        """Estimate minutes until the combined hazard exceeds the safety threshold.
        If already above threshold, return 0.
        """
        remaining = request.safety_threshold - risk_score
        if remaining <= 0:
            return 0.0
        # Assume hazard grows linearly with (hazard_trend + predicted_degradation) per minute
        growth_rate = request.hazard_trend + request.predicted_degradation
        if growth_rate <= 0:
            # Hazard not worsening – return a large window (practically infinite)
            return math.inf
        return remaining / growth_rate

    async def estimate(self, request: LastSafeDepartureRequest) -> LastSafeDepartureResponse:
        # Compute a simple risk score
        risk_score = self._compute_risk_score(request)
        window = self._estimate_window(request, risk_score)

        # Recommended departure state logic
        buffer_minutes = 10  # safety buffer before the window closes
        if window == math.inf:
            recommended = "depart"
        elif window > request.travel_time_minutes + buffer_minutes:
            recommended = "depart"
        elif window > buffer_minutes:
            recommended = "prepare"
        else:
            recommended = "review"

        # Trend description
        if request.hazard_trend > 0:
            trend = "degrading"
        elif request.hazard_trend < 0:
            trend = "improving"
        else:
            trend = "stable"

        assumptions: List[str] = [
            "Linear hazard progression",
            "No sudden infrastructure failure",
            f"Safety threshold defined as {request.safety_threshold:.2f}",
        ]

        # Uncertainty – simplistic: inverse of window size (larger window = lower uncertainty)
        uncertainty = None
        if window not in (0, math.inf):
            uncertainty = min(1.0, 1 / (window / 60))  # larger window => lower uncertainty

        return LastSafeDepartureResponse(
            recommended_departure_state=recommended,
            estimated_degradation_window_minutes=window if window != math.inf else 99999,
            route_reliability_trend=trend,
            assumptions=assumptions,
            uncertainty=uncertainty,
        )
