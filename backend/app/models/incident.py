from pydantic import BaseModel
from typing import Literal, Optional

class IncidentReport(BaseModel):
    """A user‑submitted incident affecting the disaster response landscape."""
    id: str
    reporter_name: Optional[str] = None
    incident_type: Literal['road_block', 'flood', 'infrastructure_damage', 'medical_emergency']
    latitude: float
    longitude: float
    description: str
    reported_at: str  # ISO‑8601 timestamp
    severity: float  # 0‑1 normalized (higher = more severe)
    verified: bool = False

class IncidentResponse(BaseModel):
    """Response containing a list of incidents and optional aggregation."""
    incidents: list[IncidentReport]
    total: int
    unverified_count: int
    severity_summary: Optional[float] = None  # average severity of verified incidents
