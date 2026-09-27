"""
PRALAYA Geospatial Integration Tests - FastAPI Endpoints
Tests HTTP layer contracts for all 10 required capabilities.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_geospatial_status_endpoint(client):
    response = client.get("/api/v1/geospatial/status")
    assert response.status_code == 200
    data = response.json()
    assert "primary_gee_available" in data
    assert "active_provider_mode" in data
    assert "cache_size" in data


def test_geospatial_catalog_endpoint(client):
    response = client.get("/api/v1/geospatial/catalog?region_id=gopalpur-coastal-odisha")
    assert response.status_code == 200
    layers = response.json()
    assert isinstance(layers, list)
    assert len(layers) == 5
    for layer in layers:
        assert "layer_id" in layer
        assert "layer_type" in layer
        assert "source_attribution" in layer
        assert "timestamp" in layer


def test_elevation_endpoint(client):
    response = client.get("/api/v1/geospatial/elevation?region_id=gopalpur-coastal-odisha")
    assert response.status_code == 200
    layer = response.json()
    assert layer["layer_type"] == "elevation"
    assert layer["resolution_meters"] == 30.0
    assert "NASA" in layer["source_attribution"]


def test_sar_endpoint(client):
    response = client.get("/api/v1/geospatial/sar?region_id=gopalpur-coastal-odisha")
    assert response.status_code == 200
    layer = response.json()
    assert layer["layer_type"] == "satellite_sar"
    assert layer["resolution_meters"] == 10.0


def test_rainfall_endpoint(client):
    response = client.get("/api/v1/geospatial/rainfall?region_id=gopalpur-coastal-odisha")
    assert response.status_code == 200
    layer = response.json()
    assert layer["layer_type"] == "rainfall"
    assert layer["units"] == "mm/24h"


def test_surface_water_endpoint(client):
    response = client.get("/api/v1/geospatial/surface-water?region_id=gopalpur-coastal-odisha")
    assert response.status_code == 200
    layer = response.json()
    assert layer["layer_type"] == "surface_water"


def test_land_cover_endpoint(client):
    response = client.get("/api/v1/geospatial/land-cover?region_id=gopalpur-coastal-odisha")
    assert response.status_code == 200
    layer = response.json()
    assert layer["layer_type"] == "land_cover"


def test_comparison_endpoint(client):
    response = client.get("/api/v1/geospatial/comparison?region_id=gopalpur-coastal-odisha")
    assert response.status_code == 200
    comp = response.json()
    assert "baseline_water_area_sq_km" in comp
    assert "event_water_area_sq_km" in comp
    assert comp["significant_change_detected"] is True


def test_register_custom_roi_endpoint(client):
    payload = {
        "id": "ROI_TEST_API",
        "name": "Integration Test ROI",
        "min_lat": 19.30,
        "min_lon": 84.90,
        "max_lat": 19.60,
        "max_lon": 85.20,
    }
    response = client.post("/api/v1/geospatial/roi", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["roi"]["id"] == "ROI_TEST_API"
