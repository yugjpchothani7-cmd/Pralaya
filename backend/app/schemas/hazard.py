"""
PRALAYA Hazard, Shelter & Routing Schemas
"""

from datetime import datetime, timezone
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.common import ProvenanceMetadata


# Hazard Schemas
class HazardMetrics(BaseModel):
    peak_surge_height_m: float = Field(..., description="Peak hydrodynamic surge height above normal tide")
    max_inland_penetration_km: float = Field(..., description="Maximum coastal flood penetration distance")
    modeled_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    algorithm: str = Field(default="Holland-SLOSH Hydrodynamic Surrogate v1")


class HazardStatusResponse(BaseModel):
    event_id: str
    status: str = Field(default="ACTIVE_HAZARD_COMPUTED")
    metrics: HazardMetrics
    active_inundation_zones_count: int
    provenance: ProvenanceMetadata


# Shelter Schemas
class ShelterResilience(BaseModel):
    plinth_elevation_m: float
    clearance_margin_m: float
    has_backup_generator: bool
    has_potable_ro_plant: bool
    medical_staff_present: bool


class ShelterCapacity(BaseModel):
    certified: int
    current_occupancy: int
    available_capacity: int
    occupancy_pct: float


class ShelterItem(BaseModel):
    shelter_id: str
    name: str
    topsis_score: float = Field(ge=0.0, le=1.0)
    coordinates: List[float] = Field(description="[longitude, latitude]")
    distance_km: float
    capacity: ShelterCapacity
    resilience: ShelterResilience
    corridor_status: str


class ShelterListResponse(BaseModel):
    candidate_count: int
    ranked_shelters: List[ShelterItem]
    provenance: ProvenanceMetadata


# Routing Schemas
class TurnByTurnStep(BaseModel):
    step: int
    instruction: str
    distance_m: int
    flood_depth_m: float


class RouteMetrics(BaseModel):
    total_distance_km: float
    estimated_travel_time_minutes: float
    max_flood_depth_on_path_m: float
    safe_clearance_window_hours: float


class RoutingPlanResponse(BaseModel):
    route_id: str
    status: str = Field(default="SAFE_ROUTE_COMPUTED")
    metrics: RouteMetrics
    turn_by_turn: List[TurnByTurnStep]
    transport_mode: str
    provenance: ProvenanceMetadata
