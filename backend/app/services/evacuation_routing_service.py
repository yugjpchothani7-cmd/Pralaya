from typing import List, Dict
from ..repositories.evacuation_routing_repository import EvacuationRoutingRepository
from ..models.evacuation_routing import EvacuationRoute, EvacuationRoutingResponse

class EvacuationRoutingService:
    """Business logic for disaster‑aware evacuation routing.
    It evaluates three candidate strategies:
    * Shortest Route – minimal distance.
    * Lowest Hazard Route – minimal hazard_exposure.
    * Balanced Route – weighted combination of distance and hazard.
    The final recommended route is chosen by a transparent scoring function that
    respects the active hazard model (no invented routes).
    """

    def __init__(self) -> None:
        self._repo = EvacuationRoutingRepository()
        # configurable weights – can be tuned per hazard type later
        self._weights = {
            "shortest": {"distance": 1.0, "hazard": 0.0, "reliability": 0.2},
            "lowest_hazard": {"distance": 0.0, "hazard": 1.0, "reliability": 0.2},
            "balanced": {"distance": 0.5, "hazard": 0.5, "reliability": 0.2},
        }
        # scaling factors to bring distance (km) and hazard (0‑1) onto comparable ranges
        self._max_distance_km = 100.0  # assumed worst‑case road network span for scaling

    def _normalize_distance(self, km: float) -> float:
        return min(1.0, km / self._max_distance_km)

    def _score_route(self, route: EvacuationRoute, strategy: str) -> float:
        w = self._weights[strategy]
        dist_norm = self._normalize_distance(route.distance_km)
        hazard = route.hazard_exposure
        reliability = route.reliability
        # Higher score is better; we invert distance/hazard because lower is preferable
        score = (
            w["distance"] * (1 - dist_norm) +
            w["hazard"] * (1 - hazard) +
            w["reliability"] * reliability
        )
        return max(0.0, min(1.0, score))

    async def evaluate(self, origin_lat: float, origin_lon: float, destination_ids: List[str]) -> EvacuationRoutingResponse:
        origin = {"lat": origin_lat, "lon": origin_lon}
        # For the demo we construct minimal destination dicts (id, latitude, longitude)
        # In a real system these would be looked up from a facility repository.
        dummy_destinations = [
            {"id": dest_id, "latitude": origin_lat + 0.05 * (i + 1), "longitude": origin_lon + 0.04 * (i + 1)}
            for i, dest_id in enumerate(destination_ids)
        ]
        routes: List[EvacuationRoute] = await self._repo.fetch_routes(origin, dummy_destinations)
        if not routes:
            raise ValueError("No routing data available for the given inputs")

        # Compute scores for each strategy
        scored: Dict[str, List[Dict]] = {"shortest": [], "lowest_hazard": [], "balanced": []}
        for r in routes:
            for strat in scored:
                scored[strat].append({"route": r, "score": self._score_route(r, strat)})
        # Pick best per strategy
        best_per_strategy = {
            strat: max(items, key=lambda x: x["score"])["route"] for strat, items in scored.items()
        }
        # Determine final recommendation – for the demo we prefer the balanced route, but
        # if its hazard exceeds 0.7 we fall back to the lowest_hazard route, and if that is also
        # unavailable we revert to the shortest.
        recommended = best_per_strategy["balanced"]
        if recommended.hazard_exposure > 0.7:
            recommended = best_per_strategy["lowest_hazard"]
        if recommended.hazard_exposure > 0.9:
            recommended = best_per_strategy["shortest"]
        # Annotate reason for the chosen recommendation
        recommended.reason = "Balanced route chosen; fallback logic applied based on hazard thresholds"
        # Build alternatives list (exclude the recommended route, limit to 3)
        alternatives = [r for r in routes if r.route_id != recommended.route_id][:3]
        response = EvacuationRoutingResponse(
            recommended_route=recommended,
            alternatives=alternatives,
            warnings=[],
            model_hazard="Current hazard model placeholder",
        )
        return response
