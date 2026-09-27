"""
PRALAYA Geospatial Intelligence - Region of Interest (ROI) Model
Defines spatial bounding box, centroid, projection, and geographic buffering.
"""

from typing import Tuple, Optional
from pydantic import BaseModel, Field, ConfigDict, model_validator


class RegionOfInterest(BaseModel):
    """Spatial bounding box and coordinate envelope for Earth Engine processing."""
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Unique ROI identifier, e.g. ROI_GANJAM_COAST")
    name: str = Field(..., description="Human-readable name, e.g. Ganjam Coastal Corridor")
    description: Optional[str] = Field(None, description="Detailed geographical summary")
    min_lat: float = Field(..., ge=-90.0, le=90.0, description="Minimum latitude (South)")
    min_lon: float = Field(..., ge=-180.0, le=180.0, description="Minimum longitude (West)")
    max_lat: float = Field(..., ge=-90.0, le=90.0, description="Maximum latitude (North)")
    max_lon: float = Field(..., ge=-180.0, le=180.0, description="Maximum longitude (East)")
    crs: str = Field(default="EPSG:4326", description="Coordinate Reference System")
    buffer_km: float = Field(default=0.0, ge=0.0, description="Outward buffer distance in kilometers")

    @property
    def region_id(self) -> str:
        """Alias for id."""
        return self.id

    @model_validator(mode="after")
    def validate_bbox_bounds(self) -> "RegionOfInterest":
        if self.min_lat >= self.max_lat:
            raise ValueError(f"min_lat ({self.min_lat}) must be strictly less than max_lat ({self.max_lat})")
        if self.min_lon >= self.max_lon:
            raise ValueError(f"min_lon ({self.min_lon}) must be strictly less than max_lon ({self.max_lon})")
        return self

    @property
    def bbox(self) -> Tuple[float, float, float, float]:
        """Return (min_lat, min_lon, max_lat, max_lon)."""
        return (self.min_lat, self.min_lon, self.max_lat, self.max_lon)

    @property
    def centroid(self) -> Tuple[float, float]:
        """Return center (lat, lon)."""
        return ((self.min_lat + self.max_lat) / 2.0, (self.min_lon + self.max_lon) / 2.0)

    @property
    def ee_bounds(self) -> Tuple[float, float, float, float]:
        """Return (west, south, east, north) for Earth Engine ee.Geometry.Rectangle."""
        return (self.min_lon, self.min_lat, self.max_lon, self.max_lat)
