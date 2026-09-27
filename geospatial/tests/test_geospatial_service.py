"""
PRALAYA Geospatial Unit Tests - Service Orchestrator
Validates GeospatialService caching, fallback delegation, and custom ROI management.
"""

import pytest
from geospatial.models.roi import RegionOfInterest
from geospatial.services.geospatial_service import GeospatialService


@pytest.mark.asyncio
async def test_geospatial_service_caching_and_fallback():
    service = GeospatialService()
    await service.initialize()

    # Initial status
    status = service.get_service_status()
    assert "supported_regions" in status
    assert status["cache_hits"] == 0
    assert status["cache_misses"] == 0

    # First fetch (miss)
    layer1 = await service.get_elevation("gopalpur-coastal-odisha")
    assert layer1.resolution_meters == 30.0

    status = service.get_service_status()
    assert status["cache_misses"] == 1
    assert status["cache_size"] == 1

    # Second fetch (hit)
    layer2 = await service.get_elevation("gopalpur-coastal-odisha")
    assert layer2.layer_id == layer1.layer_id

    status = service.get_service_status()
    assert status["cache_hits"] == 1


@pytest.mark.asyncio
async def test_geospatial_service_all_layers_catalog():
    service = GeospatialService()
    catalog = await service.get_all_layers_catalog("gopalpur-coastal-odisha")
    assert len(catalog) == 5
    types = {layer.layer_type for layer in catalog}
    assert "elevation" in types
    assert "satellite_sar" in types
    assert "rainfall" in types
    assert "surface_water" in types
    assert "land_cover" in types


@pytest.mark.asyncio
async def test_custom_roi_registration():
    service = GeospatialService()
    custom_roi = RegionOfInterest(
        id="ROI_CUSTOM_CHILIKA",
        name="Chilika Lagoon Mouth",
        min_lat=19.60,
        min_lon=85.30,
        max_lat=19.90,
        max_lon=85.60,
    )
    service.register_region(custom_roi)
    retrieved = service.get_region("ROI_CUSTOM_CHILIKA")
    assert retrieved.id == "ROI_CUSTOM_CHILIKA"
    lat, lon = retrieved.centroid
    assert lat == pytest.approx(19.75)
    assert lon == pytest.approx(85.45)
