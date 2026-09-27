from pydantic import BaseModel
from typing import List, Optional

class EvacuationRoute(BaseModel):
    """A candidate evacuation route from an origin to a destination."""
    route_id: str
    origin_lat: float
    origin_lon: float
    destination_id: str
    distance_km: float
    estimated_time_min: float
    hazard_exposure: float  # 0‑1 normalized (higher = more hazardous)
    blocked_segments: List[str]  # identifiers of road segments that are blocked or degraded
    reliability: float  # 0‑1 where 1 is fully reliable
    reason: Optional[str] = None  # explanation why this route was chosen/filtered

class EvacuationRoutingResponse(BaseModel):
    """Result of evacuation routing for a given origin and candidate destinations."""
    recommended_route: EvacuationRoute
    alternatives: List[EvacuationRoute]
    warnings: List[str] = []
    model_hazard: str  # description of the current hazard model used for scoring
