"""
PRALAYA Temporal Geospatial Comparison Models
Evaluates changes between pre-event baseline and active disaster event observations.
"""

from datetime import datetime, timezone
from typing import Tuple, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class TemporalComparisonResult(BaseModel):
    """Result of temporal change detection between baseline and active disaster states."""
    model_config = ConfigDict(extra="forbid")

    comparison_id: str = Field(..., description="Unique comparison identifier")
    roi_id: str = Field(..., description="Target region of interest ID")
    sensor_name: str = Field(..., description="Satellite sensor used (e.g. Sentinel-1 SAR)")
    baseline_window: Tuple[datetime, datetime] = Field(..., description="Pre-disaster observation timeframe")
    event_window: Tuple[datetime, datetime] = Field(..., description="Post-event / active observation timeframe")
    baseline_layer_id: str = Field(..., description="Reference baseline raster ID")
    event_layer_id: str = Field(..., description="Active event raster ID")
    baseline_water_area_sq_km: float = Field(..., ge=0.0, description="Permanent / baseline water surface area in sq km")
    event_water_area_sq_km: float = Field(..., ge=0.0, description="Total active water footprint in sq km")
    newly_submerged_area_sq_km: float = Field(..., ge=0.0, description="Newly flooded land surface in sq km")
    receded_area_sq_km: float = Field(default=0.0, ge=0.0, description="Receded water area in sq km")
    delta_percentage: float = Field(..., description="Percentage expansion in water surface extent")
    significant_change_detected: bool = Field(default=True, description="Whether flood change exceeds noise threshold")
    difference_tile_url: Optional[str] = Field(None, description="Tile URL for visualizing change difference raster")
    difference_geojson: Optional[Dict[str, Any]] = Field(None, description="Vectorized flood expansion polygons")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Calculation timestamp"
    )
    source_attribution: str = Field(
        default="Copernicus Sentinel-1 SAR GRD / ESA / Google Earth Engine",
        description="Attribution citation"
    )
    is_live_gee: bool = Field(default=False, description="Whether calculated via live GEE runtime")
    provenance_hash: str = Field(..., description="Integrity checksum")
