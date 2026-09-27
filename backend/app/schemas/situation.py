"""
PRALAYA Situation & Disaster Intelligence Schemas
"""

from datetime import datetime, timezone
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.common import ProvenanceMetadata


class CycloneLocation(BaseModel):
    center_lat: float = Field(..., ge=-90.0, le=90.0)
    center_lon: float = Field(..., ge=-180.0, le=180.0)
    central_pressure_hpa: float = Field(..., description="Barometric central pressure in hPa")
    max_sustained_wind_kmh: float = Field(..., description="1-minute sustained wind in km/h")
    gusts_kmh: float = Field(..., description="Peak gusts in km/h")
    movement_speed_kmh: float = Field(..., description="Forward speed in km/h")
    bearing_deg: float = Field(..., ge=0.0, le=360.0, description="Movement direction degrees")
    landfall_eta: datetime = Field(..., description="Estimated time of coastal landfall")


class ImpactSummary(BaseModel):
    population_in_danger_zone: int = Field(..., ge=0)
    evacuation_completed_count: int = Field(..., ge=0)
    evacuation_progress_pct: float = Field(..., ge=0.0, le=100.0)
    submerged_area_sqkm: float = Field(..., ge=0.0)
    critical_assets_at_risk_count: int = Field(..., ge=0)
    active_shelters_count: int = Field(..., ge=0)
    shelter_total_capacity: int = Field(..., ge=0)
    shelter_current_occupancy: int = Field(..., ge=0)


class SituationSummaryResponse(BaseModel):
    event_id: str = Field(..., description="Active disaster event identifier")
    name: str = Field(..., description="Event name (e.g. Cyclone Karuna)")
    category: str = Field(..., description="Storm classification category")
    current_status: CycloneLocation
    impact_summary: ImpactSummary
    provenance: ProvenanceMetadata
