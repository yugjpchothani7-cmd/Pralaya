from typing import List
from ..repositories.safe_destination_repository import SafeDestinationRepository
from ..models.safe_destination import DestinationCandidate, SafeDestinationResponse
import datetime

class SafeDestinationService:
    """Business logic for evaluating safe destinations under the active disaster scenario.
    The algorithm is transparent – each factor contributes to a normalized suitability score
    and the reasons list explains why a candidate was ranked as it was.
    """

    def __init__(self) -> None:
        self._repo = SafeDestinationRepository()
        # Weight configuration – can be tuned per hazard type in future extensions
        self._weights = {
            "hazard_exposure": -0.30,   # lower exposure is better
            "capacity_remaining": 0.25,
            "route_accessibility": 0.20,
            "distance": -0.10,
            "travel_time": -0.05,
            "elevation": 0.05,          # higher elevation often safer for flood
            "occupancy": -0.15,         # less crowded is preferable
        }

    def _compute_score(self, cand: DestinationCandidate) -> float:
        # Normalize factors to 0-1 where appropriate
        capacity_remaining = (cand.capacity - cand.occupancy) / cand.capacity if cand.capacity else 0
        occupancy_ratio = cand.occupancy / cand.capacity if cand.capacity else 0
        distance_norm = 1 - min(cand.distance_km / 50, 1)  # assume >50km is effectively far
        travel_time_norm = 1 - min(cand.travel_time_min / 120, 1)  # >2h considered far
        elevation_norm = min(cand.elevation / 100, 1)  # 0-100m scaled
        # Apply weighted sum
        score = (
            self._weights["hazard_exposure"] * cand.hazard_exposure +
            self._weights["capacity_remaining"] * capacity_remaining +
            self._weights["route_accessibility"] * cand.route_accessibility +
            self._weights["distance"] * distance_norm +
            self._weights["travel_time"] * travel_time_norm +
            self._weights["elevation"] * elevation_norm +
            self._weights["occupancy"] * occupancy_ratio
        )
        # Scale to 0‑1 for readability
        return max(0.0, min(1.0, (score + 1) / 2))

    def _populate_reasons(self, cand: DestinationCandidate) -> List[str]:
        reasons = []
        if cand.hazard_exposure > 0.5:
            reasons.append("High hazard exposure")
        if cand.capacity - cand.occupancy < 20:
            reasons.append("Low remaining capacity")
        if cand.route_accessibility < 0.6:
            reasons.append("Reduced route accessibility")
        if cand.distance_km > 20:
            reasons.append("Far distance")
        if not cand.current_availability:
            reasons.append("Facility currently unavailable")
        return reasons

    async def evaluate(self, user_lat: float, user_lon: float) -> SafeDestinationResponse:
        candidates: List[DestinationCandidate] = await self._repo.get_candidates(user_lat, user_lon)
        for cand in candidates:
            cand.suitability_score = round(self._compute_score(cand), 3)
            cand.reasons = self._populate_reasons(cand)
        # Filter to only those with data freshness reasonable (<60 mins)
        fresh_candidates = [c for c in candidates if c.data_freshness_minutes <= 60]
        # Sort by suitability_score descending
        sorted_cands = sorted(fresh_candidates, key=lambda c: c.suitability_score, reverse=True)
        if not sorted_cands:
            raise ValueError("No suitable verified destination available.")
        recommended = sorted_cands[0]
        alternatives = sorted_cands[1:4]  # top three alternatives
        response = SafeDestinationResponse(
            recommended=recommended,
            alternatives=alternatives,
            model_hazard="Current hazard model placeholder",  # to be replaced by real model info
            warnings=[],
        )
        return response
