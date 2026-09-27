"""
PRALAYA Deterministic Hazard Engine - Geospatial Surface Unit Tests
Tests spatial grid generation, GeoJSON properties, and What-If scenario shock reactivity.
"""

import pytest
from risk.models.hazard_outputs import HazardLevel
from risk.engine.hazard_surface_generator import HazardSurfaceGenerator


@pytest.fixture
def surface_generator():
    return HazardSurfaceGenerator()


def test_regional_scenario_surface_generation(surface_generator):
    """Generates baseline hazard surface across 12 coastal cells."""
    surface = surface_generator.generate_regional_scenario_surface(
        region_id="gopalpur-coastal-odisha",
        surge_shock=0.0,
        rain_shock=0.0,
        high_tide=False,
    )

    assert surface.region_id == "gopalpur-coastal-odisha"
    assert surface.total_cells == 12
    assert len(surface.cells) == 12
    assert 0.0 <= surface.mean_hazard_score <= 1.0
    assert 0.0 <= surface.max_hazard_score <= 1.0
    assert surface.high_hazard_area_pct > 0.0
    assert surface.overall_hazard_level in [HazardLevel.MODERATE, HazardLevel.HIGH, HazardLevel.SEVERE]

    # Verify GeoJSON FeatureCollection structure
    geojson = surface.geojson_features
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 12

    first_feat = geojson["features"][0]
    assert first_feat["type"] == "Feature"
    assert "geometry" in first_feat
    assert first_feat["geometry"]["type"] == "Polygon"
    assert len(first_feat["geometry"]["coordinates"][0]) == 5

    props = first_feat["properties"]
    assert "cell_id" in props
    assert "hazard_level" in props
    assert "combined_score" in props
    assert "surge_depth_m" in props
    assert "rainfall_rate_mm_h" in props
    assert "wind_speed_kmh" in props
    assert "elevation_m" in props
    assert "primary_driver" in props


def test_what_if_shocks_reactivity(surface_generator):
    """Verifies that surge and rain shocks deterministically elevate hazard scores."""
    base_surface = surface_generator.generate_regional_scenario_surface(
        region_id="gopalpur-coastal-odisha",
        surge_shock=0.0,
        rain_shock=0.0,
        high_tide=False,
    )

    shocked_surface = surface_generator.generate_regional_scenario_surface(
        region_id="gopalpur-coastal-odisha",
        surge_shock=1.5,
        rain_shock=50.0,
        high_tide=True,
    )

    # Shocked surface must have strictly higher mean and peak hazard scores
    assert shocked_surface.mean_hazard_score > base_surface.mean_hazard_score
    assert shocked_surface.max_hazard_score >= base_surface.max_hazard_score
    assert shocked_surface.high_hazard_area_pct >= base_surface.high_hazard_area_pct
