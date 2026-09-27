"""
PRALAYA Deterministic Hazard Engine - Elevation & Exposure Unit Tests
Tests low elevation vs high elevation and surface water interactions.
"""

import pytest
from risk.models.hazard_inputs import HazardCellInput
from risk.models.hazard_outputs import HazardLevel
from risk.engine.flood_exposure import FloodExposure


@pytest.fixture
def exposure_engine():
    return FloodExposure()


def test_low_elevation_critical(exposure_engine):
    """Low elevation (1.5m MSL) close to coast with water occurrence has HIGH/SEVERE exposure."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_LOW_ELEV",
        latitude=19.33,
        longitude=85.04,
        rainfall_rate_mm_h=10.0,
        accumulated_rainfall_24h_mm=50.0,
        wind_speed_kmh=40.0,
        coastal_proximity_m=300.0,
        elevation_m=1.5,
        surface_water_occurrence_pct=80.0,
    )
    output = exposure_engine.compute(cell)

    assert output.component_name == "flood_exposure"
    assert output.unit == "meters MSL"
    assert output.value == 1.5
    assert output.normalized_score > 0.70
    assert output.hazard_level in [HazardLevel.HIGH, HazardLevel.SEVERE, HazardLevel.CATASTROPHIC]
    assert output.details["critical_lowland_flag"] is True
    assert output.details["elevation_susceptibility"] > 0.70


def test_high_elevation_safe(exposure_engine):
    """High elevation (45.0m MSL) inland has LOW exposure score."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_HIGH_ELEV",
        latitude=19.45,
        longitude=84.80,
        rainfall_rate_mm_h=10.0,
        accumulated_rainfall_24h_mm=50.0,
        wind_speed_kmh=40.0,
        coastal_proximity_m=15000.0,
        elevation_m=45.0,
        surface_water_occurrence_pct=0.0,
    )
    output = exposure_engine.compute(cell)

    assert output.value == 45.0
    assert output.normalized_score < 0.25
    assert output.hazard_level == HazardLevel.LOW
    assert output.details["critical_lowland_flag"] is False
    assert output.details["elevation_susceptibility"] < 0.20


def test_below_sea_level_depression(exposure_engine):
    """Below sea level or coastal depression (e.g. -0.5m MSL) has maximum elevation susceptibility."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_DEPRESSION",
        latitude=19.32,
        longitude=85.02,
        rainfall_rate_mm_h=0.0,
        accumulated_rainfall_24h_mm=0.0,
        wind_speed_kmh=10.0,
        coastal_proximity_m=500.0,
        elevation_m=-0.5,
        surface_water_occurrence_pct=50.0,
    )
    output = exposure_engine.compute(cell)
    assert output.details["elevation_susceptibility"] == 1.0
