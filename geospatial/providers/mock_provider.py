"""
PRALAYA Mock Geospatial Provider
Deterministic, high-fidelity offline fallback providing realistic Earth Observation data
for the Coastal Odisha AOI (Gopalpur, Chhatrapur, Rushikulya Estuary, Chilika Lagoon).
"""

from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple, Dict, Any

from geospatial.models.roi import RegionOfInterest
from geospatial.models.layer import GeospatialLayerType, GeospatialLayerMetadata
from geospatial.models.comparison import TemporalComparisonResult
from geospatial.providers.base import GeospatialProvider


class MockGeospatialProvider(GeospatialProvider):
    """Provides pre-computed, verified Earth Observation layers when live GEE is unconfigured or offline."""

    def __init__(self):
        self._is_initialized = False

    async def initialize(self) -> bool:
        self._is_initialized = True
        return True

    def is_available(self) -> bool:
        return True

    async def get_elevation(self, roi: RegionOfInterest) -> GeospatialLayerMetadata:
        """NASA NASADEM & FABDEM 30m bare-earth elevation model."""
        return GeospatialLayerMetadata(
            layer_id=f"MOCK_ELEV_NASADEM_{roi.id}",
            layer_type=GeospatialLayerType.ELEVATION,
            name="Bare-Earth Digital Elevation Model (FABDEM / NASADEM 30m)",
            description="Forest And Buildings removed Copernicus DEM (FABDEM) calibrated with NASA NASADEM 30m resolution for accurate hydrodynamic plinth clearance.",
            timestamp=datetime(2026, 9, 27, 11, 0, 0, tzinfo=timezone.utc),
            temporal_range=(datetime(2020, 1, 1, tzinfo=timezone.utc), datetime(2024, 1, 1, tzinfo=timezone.utc)),
            source_dataset="NASA/NASADEM_HGT/001 / FABDEM 30m",
            source_attribution="NASA JPL / USGS / University of Bristol",
            resolution_meters=30.0,
            bands=["elevation"],
            units="meters MSL",
            min_value=0.0,
            max_value=120.0,
            palette=["#006600", "#339933", "#ffff99", "#ff9933", "#993300", "#ffffff"],
            tile_url_template="https://tiles.pralaya.ai/mock/nasadem/{z}/{x}/{y}.png",
            vector_geojson={
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [[84.95, 19.38], [84.98, 19.36], [85.02, 19.32]]
                        },
                        "properties": {"contour_m": 14.0, "classification": "Inland Ridge Safe Corridor"}
                    }
                ]
            },
            statistics={
                "min_elevation_m": 0.2,
                "mean_elevation_m": 12.8,
                "max_elevation_m": 114.5,
                "coastal_lowland_under_5m_pct": 28.4
            },
            is_live_gee=False,
            cache_hit=False,
            provenance_hash="7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        )

    async def get_satellite_sar(
        self, roi: RegionOfInterest, date_window: Optional[Tuple[datetime, datetime]] = None
    ) -> GeospatialLayerMetadata:
        """Copernicus Sentinel-1 Synthetic Aperture Radar (SAR) GRD flood extent."""
        now = datetime(2026, 9, 27, 9, 30, 0, tzinfo=timezone.utc)
        return GeospatialLayerMetadata(
            layer_id=f"MOCK_SAR_S1_{roi.id}",
            layer_type=GeospatialLayerType.SATELLITE_SAR,
            name="Sentinel-1 SAR C-Band Inundation Extent",
            description="Sentinel-1 Level-1 GRD IW Dual-Pol (VV+VH) backscatter radar delineating flood water under thick storm cloud penetration.",
            timestamp=now,
            temporal_range=date_window or (now - timedelta(hours=6), now),
            source_dataset="COPERNICUS/S1_GRD",
            source_attribution="European Space Agency (ESA) / Copernicus Programme",
            resolution_meters=10.0,
            bands=["VV", "VH", "water_mask"],
            units="backscatter dB / probability",
            min_value=-25.0,
            max_value=0.0,
            palette=["#020617", "#0ea5e9", "#ef4444"],
            tile_url_template="https://tiles.pralaya.ai/mock/sentinel1_sar/{z}/{x}/{y}.png",
            vector_geojson={
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [[[85.01, 19.31], [85.06, 19.34], [85.04, 19.37], [84.99, 19.33], [85.01, 19.31]]]
                        },
                        "properties": {"flood_severity": "EXTREME", "depth_est_m": 2.4, "flooded_sq_km": 88.4}
                    }
                ]
            },
            statistics={
                "inundated_area_sq_km": 88.4,
                "mean_backscatter_vv_db": -18.4,
                "flood_mask_confidence_pct": 96.5,
                "cloud_penetration": "100% All-Weather Radar"
            },
            is_live_gee=False,
            cache_hit=False,
            provenance_hash="8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
        )

    async def get_rainfall(
        self, roi: RegionOfInterest, target_date: Optional[datetime] = None
    ) -> GeospatialLayerMetadata:
        """CHIRPS / GPM IMERG 24-hour rainfall accumulation."""
        t_date = target_date or datetime(2026, 9, 27, 10, 0, 0, tzinfo=timezone.utc)
        return GeospatialLayerMetadata(
            layer_id=f"MOCK_RAIN_CHIRPS_{roi.id}",
            layer_type=GeospatialLayerType.RAINFALL,
            name="CHIRPS / GPM Daily Precipitation Accumulation",
            description="Climate Hazards Group InfraRed Precipitation with Station data (CHIRPS) blended with NASA GPM IMERG 24-hour accumulation.",
            timestamp=t_date,
            temporal_range=(t_date - timedelta(hours=24), t_date),
            source_dataset="UCSB-CHG/CHIRPS/DAILY / NASA/GPM_L3/IMERG_V06",
            source_attribution="UC Santa Barbara / USGS / NASA Earth Observatory",
            resolution_meters=5500.0,
            bands=["precipitation"],
            units="mm/24h",
            min_value=0.0,
            max_value=250.0,
            palette=["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b", "#7f0000"],
            tile_url_template="https://tiles.pralaya.ai/mock/rainfall/{z}/{x}/{y}.png",
            statistics={
                "max_rainfall_24h_mm": 182.4,
                "mean_rainfall_24h_mm": 124.0,
                "storm_center_rain_intensity_mmh": 32.5
            },
            is_live_gee=False,
            cache_hit=False,
            provenance_hash="9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
        )

    async def get_surface_water(self, roi: RegionOfInterest) -> GeospatialLayerMetadata:
        """JRC Global Surface Water (GSW) baseline permanence & seasonality."""
        return GeospatialLayerMetadata(
            layer_id=f"MOCK_GSW_{roi.id}",
            layer_type=GeospatialLayerType.SURFACE_WATER,
            name="JRC Global Surface Water (GSW) Baseline Permanence",
            description="38-year Landsat historical baseline recording permanent water bodies, seasonal estuaries, and recurrence recurrence metrics.",
            timestamp=datetime(2026, 9, 27, 0, 0, 0, tzinfo=timezone.utc),
            temporal_range=(datetime(1984, 1, 1, tzinfo=timezone.utc), datetime(2024, 12, 31, tzinfo=timezone.utc)),
            source_dataset="JRC/GSW1_4/GlobalSurfaceWater",
            source_attribution="European Commission Joint Research Centre (JRC)",
            resolution_meters=30.0,
            bands=["occurrence", "seasonality", "recurrence"],
            units="occurrence percentage (0-100%)",
            min_value=0.0,
            max_value=100.0,
            palette=["#ffffff", "#99ccff", "#0066cc", "#000066"],
            tile_url_template="https://tiles.pralaya.ai/mock/jrc_gsw/{z}/{x}/{y}.png",
            statistics={
                "permanent_water_sq_km": 34.2,
                "seasonal_wetland_sq_km": 21.5,
                "high_recurrence_zones_count": 8
            },
            is_live_gee=False,
            cache_hit=False,
            provenance_hash="0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
        )

    async def get_land_cover(self, roi: RegionOfInterest) -> GeospatialLayerMetadata:
        """ESA WorldCover 10m Land Use Land Cover (LULC)."""
        return GeospatialLayerMetadata(
            layer_id=f"MOCK_LULC_WORLDCOVER_{roi.id}",
            layer_type=GeospatialLayerType.LAND_COVER,
            name="ESA WorldCover 10m Land Use / Land Cover (LULC)",
            description="High-resolution global land cover derived from Sentinel-1 and Sentinel-2 optical/SAR fusion identifying built infrastructure, crops, and coastal mangroves.",
            timestamp=datetime(2026, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
            source_dataset="ESA/WorldCover/v200",
            source_attribution="European Space Agency (ESA) WorldCover Consortium",
            resolution_meters=10.0,
            bands=["Map"],
            units="Discrete Land Cover Class ID",
            min_value=10.0,
            max_value=100.0,
            palette=["#006400", "#ffbb22", "#ffff4c", "#f096ff", "#fa0000", "#b4b4b4", "#0064c8", "#0096a0"],
            tile_url_template="https://tiles.pralaya.ai/mock/worldcover/{z}/{x}/{y}.png",
            statistics={
                "cropland_pct": 42.1,
                "built_up_residential_pct": 18.5,
                "mangroves_and_wetlands_pct": 14.8,
                "bare_soil_pct": 11.2,
                "open_water_pct": 13.4
            },
            is_live_gee=False,
            cache_hit=False,
            provenance_hash="1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
        )

    async def get_temporal_comparison(
        self,
        roi: RegionOfInterest,
        baseline_window: Tuple[datetime, datetime],
        event_window: Tuple[datetime, datetime],
    ) -> TemporalComparisonResult:
        """Bi-temporal Otsu threshold change detection comparing dry baseline to landfall surge."""
        return TemporalComparisonResult(
            comparison_id=f"COMP_SAR_S1_{roi.id}",
            roi_id=roi.id,
            sensor_name="Sentinel-1 SAR C-Band IW GRD",
            baseline_window=baseline_window,
            event_window=event_window,
            baseline_layer_id="MOCK_GSW_BASELINE",
            event_layer_id=f"MOCK_SAR_S1_{roi.id}",
            baseline_water_area_sq_km=34.2,
            event_water_area_sq_km=88.4,
            newly_submerged_area_sq_km=54.2,
            receded_area_sq_km=0.0,
            delta_percentage=158.48,
            significant_change_detected=True,
            difference_tile_url="https://tiles.pralaya.ai/mock/sar_diff/{z}/{x}/{y}.png",
            difference_geojson={
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [[[85.02, 19.32], [85.05, 19.35], [85.03, 19.36], [85.00, 19.33], [85.02, 19.32]]]
                        },
                        "properties": {"change_status": "NEWLY_FLOODED", "area_sq_km": 54.2, "hazard_depth_m": 1.85}
                    }
                ]
            },
            source_attribution="Copernicus Sentinel-1 SAR / ESA / Google Earth Engine",
            is_live_gee=False,
            provenance_hash="2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
        )
