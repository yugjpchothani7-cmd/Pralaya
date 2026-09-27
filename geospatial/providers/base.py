"""
PRALAYA Geospatial Providers - Base Contract
Defines abstract interface for Earth Observation data providers (GEE, Mock, STAC).
"""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, Tuple

from geospatial.models.roi import RegionOfInterest
from geospatial.models.layer import GeospatialLayerMetadata
from geospatial.models.comparison import TemporalComparisonResult


class GeospatialProvider(ABC):
    """Abstract provider contract for Earth Observation processing."""

    @abstractmethod
    async def initialize(self) -> bool:
        """Initialize connection, authenticate credentials, and report availability."""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if provider is operational and authenticated."""
        pass

    @abstractmethod
    async def get_elevation(self, roi: RegionOfInterest) -> GeospatialLayerMetadata:
        """Retrieve bare-earth elevation model (e.g. NASADEM / FABDEM / SRTM 30m)."""
        pass

    @abstractmethod
    async def get_satellite_sar(
        self, roi: RegionOfInterest, date_window: Optional[Tuple[datetime, datetime]] = None
    ) -> GeospatialLayerMetadata:
        """Retrieve Sentinel-1 Synthetic Aperture Radar (SAR) backscatter / inundation raster."""
        pass

    @abstractmethod
    async def get_rainfall(
        self, roi: RegionOfInterest, target_date: Optional[datetime] = None
    ) -> GeospatialLayerMetadata:
        """Retrieve precipitation / rainfall-related raster (e.g. CHIRPS / GPM IMERG)."""
        pass

    @abstractmethod
    async def get_surface_water(self, roi: RegionOfInterest) -> GeospatialLayerMetadata:
        """Retrieve baseline surface water, permanent reservoirs, and seasonality (e.g. JRC GSW)."""
        pass

    @abstractmethod
    async def get_land_cover(self, roi: RegionOfInterest) -> GeospatialLayerMetadata:
        """Retrieve 10m land use / land cover classification (e.g. ESA WorldCover)."""
        pass

    @abstractmethod
    async def get_temporal_comparison(
        self,
        roi: RegionOfInterest,
        baseline_window: Tuple[datetime, datetime],
        event_window: Tuple[datetime, datetime],
    ) -> TemporalComparisonResult:
        """Perform bi-temporal change detection comparing pre-disaster baseline to active event."""
        pass
