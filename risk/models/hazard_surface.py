"""
PRALAYA Deterministic Hazard Engine - Geospatial Surface Models
Represents discretized spatial grid cells and composite multi-hazard surface layers.
"""

from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict

from risk.models.hazard_outputs import ComponentHazardOutput, HazardLevel
from risk.models.hazard_explanation import HazardExplanation


class GeospatialHazardCell(BaseModel):
    """A single spatial tile or grid cell evaluated across all hazard components."""
    model_config = ConfigDict(extra="forbid")

    cell_id: str = Field(..., description="Unique cell ID, e.g. CELL_GANJAM_1935_8502")
    latitude: float = Field(..., description="Cell centroid latitude")
    longitude: float = Field(..., description="Cell centroid longitude")
    elevation_m: float = Field(..., description="Bare-earth elevation in meters MSL")
    coastal_proximity_m: float = Field(..., description="Distance to shoreline in meters")

    rainfall_hazard: ComponentHazardOutput = Field(..., description="Deterministic rainfall hazard evaluation")
    wind_hazard: ComponentHazardOutput = Field(..., description="Deterministic wind hazard evaluation")
    surge_hazard: ComponentHazardOutput = Field(..., description="Deterministic storm surge hazard evaluation")
    flood_exposure: ComponentHazardOutput = Field(..., description="Deterministic flood exposure & terrain susceptibility evaluation")
    combined_hazard: ComponentHazardOutput = Field(..., description="Compound multi-hazard synthesis")

    explanation: HazardExplanation = Field(..., description="Diagnostic explanation for this specific cell")


class GeospatialHazardSurface(BaseModel):
    """Complete 2D geospatial hazard grid across an evaluated Region of Interest."""
    model_config = ConfigDict(extra="forbid")

    surface_id: str = Field(..., description="Unique surface run identifier")
    region_id: str = Field(..., description="Target region ID, e.g. gopalpur-coastal-odisha")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Calculation timestamp in UTC"
    )
    grid_resolution_km: float = Field(..., ge=0.01, description="Spatial cell spacing in kilometers")
    model_version: str = Field(default="PRALAYA-HAZARD-v1.0-DETERMINISTIC", description="Model engine version")
    total_cells: int = Field(..., ge=1, description="Number of grid cells evaluated")

    cells: List[GeospatialHazardCell] = Field(..., description="List of evaluated geospatial cells")

    # Aggregate regional metrics
    mean_hazard_score: float = Field(..., ge=0.0, le=1.0, description="Mean composite hazard index across all cells")
    max_hazard_score: float = Field(..., ge=0.0, le=1.0, description="Peak composite hazard score observed")
    overall_hazard_level: HazardLevel = Field(..., description="Regional severity categorization")
    high_hazard_area_pct: float = Field(..., ge=0.0, le=100.0, description="Percentage of cells with HIGH/SEVERE/CATASTROPHIC rating")

    # Vectorized GeoJSON representation for immediate map display
    geojson_features: Dict[str, Any] = Field(
        default_factory=dict, description="GeoJSON FeatureCollection representing spatial hazard polygons"
    )

    regional_explanation: HazardExplanation = Field(..., description="Executive regional explanation summary")
