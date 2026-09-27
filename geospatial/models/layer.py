"""
PRALAYA Geospatial Layer Models
Provides strongly-typed schemas for Earth Observation raster and vector layers.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Tuple, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class GeospatialLayerType(str, Enum):
    ELEVATION = "elevation"
    SATELLITE_SAR = "satellite_sar"
    SATELLITE_OPTICAL = "satellite_optical"
    RAINFALL = "rainfall"
    SURFACE_WATER = "surface_water"
    LAND_COVER = "land_cover"
    TEMPORAL_COMPARISON = "temporal_comparison"


class GeospatialLayerMetadata(BaseModel):
    """Metadata envelope for every geospatial layer returned by PRALAYA services."""
    model_config = ConfigDict(extra="forbid")

    layer_id: str = Field(..., description="Unique layer identifier, e.g. GEE_ELEV_NASADEM_GANJAM")
    layer_type: GeospatialLayerType = Field(..., description="Classification category of geospatial layer")
    name: str = Field(..., description="Display title of the layer")
    description: str = Field(..., description="Detailed explanation of layer scientific content")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Observation or computation timestamp in UTC"
    )
    temporal_range: Optional[Tuple[datetime, datetime]] = Field(
        None, description="Start and end observation window if composite"
    )
    source_dataset: str = Field(..., description="Catalog identifier (e.g. NASA/NASADEM_HGT/001, COPERNICUS/S1_GRD)")
    source_attribution: str = Field(..., description="Official attribution citation (e.g. NASA JPL, ESA Copernicus)")
    resolution_meters: float = Field(..., ge=0.0, description="Spatial resolution / pixel scale in meters")
    bands: List[str] = Field(default_factory=list, description="Available spectral or derived bands")
    units: Optional[str] = Field(None, description="Physical units (e.g. meters MSL, mm/24h, dB)")
    min_value: Optional[float] = Field(None, description="Visualization minimum clip value")
    max_value: Optional[float] = Field(None, description="Visualization maximum clip value")
    palette: Optional[List[str]] = Field(None, description="Hex color scale for raster gradient rendering")
    tile_url_template: Optional[str] = Field(
        None, description="Earth Engine MapId tile URL template: https://.../tiles/{z}/{x}/{y}"
    )
    vector_geojson: Optional[Dict[str, Any]] = Field(
        None, description="Inundation polygon or boundary feature collection for rendering"
    )
    statistics: Dict[str, Any] = Field(
        default_factory=dict, description="Summary spatial metrics (e.g. mean elevation, flooded area sq km)"
    )
    is_live_gee: bool = Field(
        default=False, description="True if actively computed via Google Earth Engine; False if served from verified fallback"
    )
    cache_hit: bool = Field(default=False, description="Whether payload was served from high-speed in-memory cache")
    provenance_hash: str = Field(..., description="Cryptographic SHA-256 fingerprint for data integrity")
