"""
PRALAYA Deterministic Hazard Engine - Rainfall Unit Tests
Tests low, moderate, and extreme rainfall scenarios with physical threshold validation.
"""

import pytest
from risk.models.hazard_inputs import HazardCellInput
from risk.models.hazard_outputs import HazardLevel
from risk.engine.rainfall_hazard import RainfallHazard


@pytest.fixture
def rainfall_engine():
    return RainfallHazard()


def test_low_rainfall(rainfall_engine):
    """Low rainfall (2 mm/h, 15 mm 24h) should yield LOW hazard score."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_LOW_RAIN",
        latitude=19.30,
        longitude=84.90,
        rainfall_rate_mm_h=2.0,
        accumulated_rainfall_24h_mm=15.0,
        wind_speed_kmh=20.0,
        coastal_proximity_m=5000.0,
        elevation_m=15.0,
        surface_water_occurrence_pct=5.0,
    )
    output = rainfall_engine.compute(cell)

    assert output.component_name == "rainfall"
    assert output.unit == "mm/h"
    assert output.value == 2.0
    assert output.normalized_score < 0.25
    assert output.hazard_level == HazardLevel.LOW
    assert output.source != ""
    assert output.model_version == "PRALAYA-HAZARD-v1.0-DETERMINISTIC"
    assert output.confidence > 0.8
    assert len(output.uncertainty_range) == 2
    assert output.details["cloudburst_trigger"] is False


def test_moderate_rainfall(rainfall_engine):
    """Moderate rainfall (20 mm/h, 130 mm 24h) should yield MODERATE or HIGH hazard."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_MOD_RAIN",
        latitude=19.30,
        longitude=84.90,
        rainfall_rate_mm_h=20.0,
        accumulated_rainfall_24h_mm=130.0,
        wind_speed_kmh=45.0,
        coastal_proximity_m=3000.0,
        elevation_m=10.0,
        surface_water_occurrence_pct=15.0,
    )
    output = rainfall_engine.compute(cell)

    assert 0.25 <= output.normalized_score <= 0.75
    assert output.hazard_level in [HazardLevel.MODERATE, HazardLevel.HIGH]
    assert output.details["soil_saturation_warning"] is True
    assert output.details["cloudburst_trigger"] is False


def test_extreme_rainfall(rainfall_engine):
    """Extreme cloudburst rainfall (75 mm/h, 340 mm 24h) should yield SEVERE or CATASTROPHIC hazard."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_EXT_RAIN",
        latitude=19.30,
        longitude=84.90,
        rainfall_rate_mm_h=75.0,
        accumulated_rainfall_24h_mm=340.0,
        wind_speed_kmh=90.0,
        coastal_proximity_m=2000.0,
        elevation_m=5.0,
        surface_water_occurrence_pct=30.0,
    )
    output = rainfall_engine.compute(cell)

    assert output.normalized_score >= 0.85
    assert output.hazard_level in [HazardLevel.SEVERE, HazardLevel.CATASTROPHIC]
    assert output.details["cloudburst_trigger"] is True
    assert output.details["soil_saturation_warning"] is True
