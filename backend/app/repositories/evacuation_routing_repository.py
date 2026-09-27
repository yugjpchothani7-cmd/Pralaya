from typing import List, Dict
from ..models.evacuation_routing import EvacuationRoute, EvacuationRoutingResponse
import uuid
import math

class MockRoutingProvider:
    """Provides synthetic road network and routing data.
    In production this would call an external routing engine (OSRM, GraphHopper, etc.)
    and combine it with hazard exposure layers.
    """

    def _mock_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        # Simple haversine distance (km) as a placeholder for road distance
        R = 6371.0
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    async def get_routes(self, origin: Dict[str, float], destinations: List[Dict]) -> List[EvacuationRoute]:
        routes: List[EvacuationRoute] = []
        for dest in destinations:
            dist = self._mock_distance(origin["lat"], origin["lon"], dest["latitude"], dest["longitude"])
            # Simulated metrics – in a real system these would be derived from GIS layers
            hazard = max(0.0, min(1.0, dist / 100))  # longer routes assume higher hazard exposure
            reliability = 0.9 - 0.3 * hazard  # lower reliability with higher hazard
            blocked = []
            if hazard > 0.6:
                blocked.append("segment_critical")
            route = EvacuationRoute(
                route_id=str(uuid.uuid4()),
                origin_lat=origin["lat"],
                origin_lon=origin["lon"],
                destination_id=dest["id"],
                distance_km=round(dist, 2),
                estimated_time_min=round(dist / 40 * 60, 1),  # assume 40 km/h avg speed
                hazard_exposure=round(hazard, 3),
                blocked_segments=blocked,
                reliability=round(reliability, 3),
                reason=None,
            )
            routes.append(route)
        return routes

class EvacuationRoutingRepository:
    """Repository that abstracts the routing provider.
    The provider can be swapped for a real service; during the hackathon we use MockRoutingProvider.
    """

    def __init__(self, provider: MockRoutingProvider | None = None):
        self._provider = provider or MockRoutingProvider()

    async def fetch_routes(self, origin: Dict[str, float], destinations: List[Dict]) -> List[EvacuationRoute]:
        return await self._provider.get_routes(origin, destinations)
