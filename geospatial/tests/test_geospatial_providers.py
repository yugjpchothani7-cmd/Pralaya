"""
PRALAYA Geospatial Unit Tests - Providers
Validates MockGeospatialProvider generation and GEEProvider availability/fallback.
"""

import pytest
from datetime import datetime, timezone

from geospatial.models.roi import RegionOfInterest
from geospatial.models.layer import GeospatialLayerType
from geospatial.providers.mock_provider import MockGeospatialProvider
from geospatial.providers.gee_provider import GEEProvider


@pytest.fixture
def sample_roi():
    return RegionOfInterest(
        id="ROI_TEST_GANJAM",
        name="Ganjam Coastal Testing ROI",
        min_lat=19.20,
        min_lon=84.85,
        max_lat=19.45,
        max_lon=85.15,
    )


@pytest.mark.asyncio
async def test_mock_provider_elevation(sample_roi):
    provider = MockGeospatialProvider()
    await provider.initialize()
    assert provider.is_available() is True

    elevation = await provider.get_elevation(sample_roi)
    assert elevation.layer_type == GeospatialLayerType.ELEVATION
    assert elevation.resolution_meters == 30.0
    assert elevation.units == "meters MSL"
    assert "NASA" in elevation.source_attribution
    assert elevation.is_live_gee is False


@pytest.mark.asyncio
async def test_mock_provider_satellite_sar(sample_roi):
    provider = MockGeospatialProvider()
    sar = await provider.get_satellite_sar(sample_roi)
    assert sar.layer_type == GeospatialLayerType.SATELLITE_SAR
    assert sar.resolution_meters == 10.0
    assert "Copernicus" in sar.source_attribution
    assert sar.is_live_gee is False


@pytest.mark.asyncio
async def test_mock_provider_rainfall(sample_roi):
    provider = MockGeospatialProvider()
    rain = await provider.get_rainfall(sample_roi)
    assert rain.layer_type == GeospatialLayerType.RAINFALL
    assert rain.units == "mm/24h"
    assert rain.max_value >= 150.0


@pytest.mark.asyncio
async def test_mock_provider_surface_water(sample_roi):
    provider = MockGeospatialProvider()
    water = await provider.get_surface_water(sample_roi)
    assert water.layer_type == GeospatialLayerType.SURFACE_WATER
    assert water.resolution_meters == 30.0
    assert "JRC" in water.source_attribution


@pytest.mark.asyncio
async def test_mock_provider_land_cover(sample_roi):
    provider = MockGeospatialProvider()
    lulc = await provider.get_land_cover(sample_roi)
    assert lulc.layer_type == GeospatialLayerType.LAND_COVER
    assert lulc.resolution_meters == 10.0
    assert "WorldCover" in lulc.source_attribution


@pytest.mark.asyncio
async def test_mock_provider_temporal_comparison(sample_roi):
    provider = MockGeospatialProvider()
    comp = await provider.get_temporal_comparison(
        sample_roi,
        baseline_window=(datetime(2026, 9, 1, tzinfo=timezone.utc), datetime(2026, 9, 10, tzinfo=timezone.utc)),
        event_window=(datetime(2026, 9, 25, tzinfo=timezone.utc), datetime(2026, 9, 27, tzinfo=timezone.utc)),
    )
    assert comp.newly_submerged_area_sq_km > 0.0
    assert comp.significant_change_detected is True
    assert comp.is_live_gee is False


@pytest.mark.asyncio
async def test_gee_provider_unauthenticated_fallback():
    provider = GEEProvider()
    # In test environment without service account or GCP credentials, initialize returns False
    initialized = await provider.initialize()
    # It must handle missing credentials cleanly
    if not initialized:
        assert provider.is_available() is False
        with pytest.raises(RuntimeError):
            roi = RegionOfInterest(
                id="TEST",
                name="Test",
                min_lat=19.0,
                min_lon=84.0,
                max_lat=20.0,
                max_lon=85.0,
            )
            await provider.get_elevation(roi)
