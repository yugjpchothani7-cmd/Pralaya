from pydantic import BaseModel
from typing import List, Optional

class DestinationCandidate(BaseModel):
    """A potential safe destination facility."""
    id: str
    name: str
    facility_type: str  # shelter | emergency | medical
    latitude: float
    longitude: float
    capacity: int
    occupancy: int
    hazard_exposure: float  # 0-1 normalized risk exposure
    elevation: float  # meters above sea level
    route_accessibility: float  # 0-1 where 1 is fully accessible
    distance_km: float
    travel_time_min: float
    suitability_score: float
    current_availability: bool
    data_freshness_minutes: int
    reasons: List[str]

class SafeDestinationResponse(BaseModel):
    """Result of safe destination lookup for a user location."""
    recommended: DestinationCandidate
    alternatives: List[DestinationCandidate]
    model_hazard: str  # description of the currently modeled hazard scenario
    warnings: List[str]
