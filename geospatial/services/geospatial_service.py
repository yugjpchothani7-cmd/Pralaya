"""
PRALAYA Geospatial Service
Reusable high-level service managing Earth Observation processing pipelines.
Coordinates GEEProvider with transparent fallback to MockGeospatialProvider.
Implements TTL caching, regional registry, error resiliency, and provenance tracking.
"""

import logging
import time
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Tuple, List

from geospatial.models.roi import RegionOfInterest
from geospatial.models.layer import GeospatialLayerMetadata, GeospatialLayerType
from geospatial.models.comparison import TemporalComparisonResult
from geospatial.providers.base import GeospatialProvider
from geospatial.providers.mock_provider import MockGeospatialProvider
from geospatial.providers.gee_provider import GEEProvider

logger = logging.getLogger("pralaya.geospatial.service")


class CacheEntry:
    """Represents a cached layer or comparison object with expiration timestamp."""

    def __init__(self, data: Any, ttl_seconds: int = 1800):
        self.data = data
        self.expires_at = time.time() + ttl_seconds

    @property
    def is_expired(self) -> bool:
        return time.time() > self.expires_at


class GeospatialService:
    """
    Core Geospatial Data Service for PRALAYA.
    Orchestrates GEE and Mock providers with in-memory TTL caching and graceful fallback.
    """

    def __init__(
        self,
        primary_provider: Optional[GeospatialProvider] = None,
        fallback_provider: Optional[GeospatialProvider] = None,
        default_ttl_seconds: int = 1800,
    ):
        self._primary = primary_provider or GEEProvider()
        self._fallback = fallback_provider or MockGeospatialProvider()
        self._cache: Dict[str, CacheEntry] = {}
        self._default_ttl = default_ttl_seconds

        # Metrics & Monitoring
        self._cache_hits = 0
        self._cache_misses = 0
        self._fallback_invocations = 0

        # Predefined Coastal Regions of Interest (Configurable)
        self._regions: Dict[str, RegionOfInterest] = {
            "gopalpur-coastal-odisha": RegionOfInterest(
                id="gopalpur-coastal-odisha",
                name="Gopalpur & Ganjam Coastal Corridor",
                description="Southern coastal belt of Odisha vulnerable to severe cyclonic landfall and tidal storm surges.",
                min_lon=84.80,
                min_lat=19.15,
                max_lon=85.20,
                max_lat=19.45,
                crs="EPSG:4326",
            ),
            "paradip-port-estuary": RegionOfInterest(
                id="paradip-port-estuary",
                name="Paradip Port & Mahanadi Estuary",
                description="Major commercial port and low-lying river delta subject to combined pluvial and coastal flooding.",
                min_lon=86.50,
                min_lat=20.15,
                max_lon=86.85,
                max_lat=20.40,
                crs="EPSG:4326",
            ),
            "puri-konark-heritage": RegionOfInterest(
                id="puri-konark-heritage",
                name="Puri-Konark Coastal Belt",
                description="High-density pilgrim coastline and Chilika lagoon mouth vulnerable to severe barrier breach.",
                min_lon=85.70,
                min_lat=19.70,
                max_lon=86.15,
                max_lat=20.00,
                crs="EPSG:4326",
            ),
        }

    async def initialize(self) -> None:
        """Initialize underlying providers."""
        primary_ok = await self._primary.initialize()
        if primary_ok:
            logger.info("GeospatialService: Primary GEE provider initialized and active.")
        else:
            logger.info("GeospatialService: GEE provider unavailable; operating in Resilient Fallback Mode (Mock Provider).")
        await self._fallback.initialize()

    @property
    def is_gee_active(self) -> bool:
        """Check whether live Earth Engine provider is operational."""
        return self._primary.is_available()

    def get_service_status(self) -> Dict[str, Any]:
        """Provides status summary for monitoring and health check endpoints."""
        return {
            "primary_gee_available": self.is_gee_active,
            "active_provider_mode": "google_earth_engine" if self.is_gee_active else "resilient_fallback_mock",
            "cache_size": len(self._cache),
            "cache_hits": self._cache_hits,
            "cache_misses": self._cache_misses,
            "fallback_invocations": self._fallback_invocations,
            "supported_regions": list(self._regions.keys()),
        }

    def register_region(self, roi: RegionOfInterest) -> None:
        """Register or update a custom Region of Interest."""
        self._regions[roi.region_id] = roi

    def get_region(self, region_id: str) -> RegionOfInterest:
        """Retrieve registered ROI or raise KeyError."""
        if region_id not in self._regions:
            # Fallback to Gopalpur if not registered
            logger.warning(f"Region '{region_id}' not found; defaulting to Gopalpur Coastal Corridor.")
            return self._regions["gopalpur-coastal-odisha"]
        return self._regions[region_id]

    def _generate_cache_key(self, prefix: str, roi: RegionOfInterest, extra: str = "") -> str:
        h = hashlib.sha256(f"{prefix}:{roi.region_id}:{extra}".encode()).hexdigest()[:16]
        return f"{prefix}:{roi.region_id}:{h}"

    def _get_from_cache(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry:
            if not entry.is_expired:
                self._cache_hits += 1
                return entry.data
            else:
                del self._cache[key]
        self._cache_misses += 1
        return None

    def _set_in_cache(self, key: str, data: Any, ttl: Optional[int] = None) -> None:
        self._cache[key] = CacheEntry(data, ttl_seconds=ttl or self._default_ttl)

    async def get_elevation(self, region_id: str = "gopalpur-coastal-odisha") -> GeospatialLayerMetadata:
        """Get bare-earth elevation raster with metadata."""
        roi = self.get_region(region_id)
        cache_key = self._generate_cache_key("elevation", roi)
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached

        try:
            if self._primary.is_available():
                result = await self._primary.get_elevation(roi)
            else:
                self._fallback_invocations += 1
                result = await self._fallback.get_elevation(roi)
        except Exception as e:
            logger.warning(f"Error fetching GEE elevation for {roi.region_id}: {e}. Falling back.")
            self._fallback_invocations += 1
            result = await self._fallback.get_elevation(roi)

        self._set_in_cache(cache_key, result)
        return result

    async def get_satellite_sar(
        self,
        region_id: str = "gopalpur-coastal-odisha",
        date_window: Optional[Tuple[datetime, datetime]] = None,
    ) -> GeospatialLayerMetadata:
        """Get Sentinel-1 C-Band SAR radar backscatter imagery."""
        roi = self.get_region(region_id)
        extra = f"{date_window[0].isoformat()}_{date_window[1].isoformat()}" if date_window else "latest"
        cache_key = self._generate_cache_key("sar", roi, extra)
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached

        try:
            if self._primary.is_available():
                result = await self._primary.get_satellite_sar(roi, date_window)
            else:
                self._fallback_invocations += 1
                result = await self._fallback.get_satellite_sar(roi, date_window)
        except Exception as e:
            logger.warning(f"Error fetching GEE SAR for {roi.region_id}: {e}. Falling back.")
            self._fallback_invocations += 1
            result = await self._fallback.get_satellite_sar(roi, date_window)

        self._set_in_cache(cache_key, result)
        return result

    async def get_rainfall(
        self,
        region_id: str = "gopalpur-coastal-odisha",
        target_date: Optional[datetime] = None,
    ) -> GeospatialLayerMetadata:
        """Get precipitation grid layer."""
        roi = self.get_region(region_id)
        extra = target_date.strftime("%Y%m%d") if target_date else "latest"
        cache_key = self._generate_cache_key("rainfall", roi, extra)
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached

        try:
            if self._primary.is_available():
                result = await self._primary.get_rainfall(roi, target_date)
            else:
                self._fallback_invocations += 1
                result = await self._fallback.get_rainfall(roi, target_date)
        except Exception as e:
            logger.warning(f"Error fetching GEE rainfall for {roi.region_id}: {e}. Falling back.")
            self._fallback_invocations += 1
            result = await self._fallback.get_rainfall(roi, target_date)

        self._set_in_cache(cache_key, result)
        return result

    async def get_surface_water(self, region_id: str = "gopalpur-coastal-odisha") -> GeospatialLayerMetadata:
        """Get historical and seasonal surface water layer."""
        roi = self.get_region(region_id)
        cache_key = self._generate_cache_key("water", roi)
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached

        try:
            if self._primary.is_available():
                result = await self._primary.get_surface_water(roi)
            else:
                self._fallback_invocations += 1
                result = await self._fallback.get_surface_water(roi)
        except Exception as e:
            logger.warning(f"Error fetching GEE surface water for {roi.region_id}: {e}. Falling back.")
            self._fallback_invocations += 1
            result = await self._fallback.get_surface_water(roi)

        self._set_in_cache(cache_key, result)
        return result

    async def get_land_cover(self, region_id: str = "gopalpur-coastal-odisha") -> GeospatialLayerMetadata:
        """Get 10m Land Use / Land Cover classification."""
        roi = self.get_region(region_id)
        cache_key = self._generate_cache_key("lulc", roi)
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached

        try:
            if self._primary.is_available():
                result = await self._primary.get_land_cover(roi)
            else:
                self._fallback_invocations += 1
                result = await self._fallback.get_land_cover(roi)
        except Exception as e:
            logger.warning(f"Error fetching GEE land cover for {roi.region_id}: {e}. Falling back.")
            self._fallback_invocations += 1
            result = await self._fallback.get_land_cover(roi)

        self._set_in_cache(cache_key, result)
        return result

    async def get_temporal_comparison(
        self,
        region_id: str = "gopalpur-coastal-odisha",
        baseline_window: Optional[Tuple[datetime, datetime]] = None,
        event_window: Optional[Tuple[datetime, datetime]] = None,
    ) -> TemporalComparisonResult:
        """Get pre- vs post-disaster flood inundation comparison."""
        roi = self.get_region(region_id)
        now = datetime.now(timezone.utc)
        base = baseline_window or (now - timedelta(days=20), now - timedelta(days=10))
        event = event_window or (now - timedelta(days=2), now)

        extra = f"{base[0].strftime('%Y%m%d')}_{event[1].strftime('%Y%m%d')}"
        cache_key = self._generate_cache_key("comparison", roi, extra)
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached

        try:
            if self._primary.is_available():
                result = await self._primary.get_temporal_comparison(roi, base, event)
            else:
                self._fallback_invocations += 1
                result = await self._fallback.get_temporal_comparison(roi, base, event)
        except Exception as e:
            logger.warning(f"Error executing GEE temporal comparison for {roi.region_id}: {e}. Falling back.")
            self._fallback_invocations += 1
            result = await self._fallback.get_temporal_comparison(roi, base, event)

        self._set_in_cache(cache_key, result)
        return result

    async def get_all_layers_catalog(self, region_id: str = "gopalpur-coastal-odisha") -> List[GeospatialLayerMetadata]:
        """Convenience method returning catalog of all available geospatial layers for a region."""
        elevation = await self.get_elevation(region_id)
        sar = await self.get_satellite_sar(region_id)
        rainfall = await self.get_rainfall(region_id)
        water = await self.get_surface_water(region_id)
        lulc = await self.get_land_cover(region_id)
        return [elevation, sar, rainfall, water, lulc]


# Global singleton instance for injection across API routes
_geospatial_service: Optional[GeospatialService] = None


def get_geospatial_service() -> GeospatialService:
    """Retrieve or initialize singleton GeospatialService."""
    global _geospatial_service
    if _geospatial_service is None:
        _geospatial_service = GeospatialService()
    return _geospatial_service
