"""
PRALAYA Deterministic Hazard Engine - Wind Unit Tests
Tests cyclonic wind force, dynamic pressure scaling, and gust thresholds.
"""

import pytest
from risk.models.hazard_inputs import HazardCellInput
from risk.models.hazard_outputs import HazardLevel
from risk.engine.wind_hazard import WindHazard


@pytest.fixture
def wind_engine():
    return WindHazard()


def test_breeze_wind(wind_engine):
    """Mild wind (30 km/h) should yield LOW hazard score."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_BREEZE",
        latitude=19.30,
        longitude=84.90,
        rainfall_rate_mm_h=0.0,
        accumulated_rainfall_24h_mm=0.0,
        wind_speed_kmh=30.0,
        coastal_proximity_m=5000.0,
        elevation_m=20.0,
        surface_water_occurrence_pct=0.0,
    )
    output = wind_engine.compute(cell)

    assert output.component_name == "wind"
    assert output.unit == "km/h"
    assert output.value == 30.0
    assert output.normalized_score < 0.25
    assert output.hazard_level == HazardLevel.LOW


def test_gale_to_storm_wind(wind_engine):
    """Gale to storm wind (95 km/h) should yield HIGH hazard score with tree uprooting flag."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_GALE",
        latitude=19.30,
        longitude=84.90,
        rainfall_rate_mm_h=0.0,
        accumulated_rainfall_24h_mm=0.0,
        wind_speed_kmh=95.0,
        coastal_proximity_m=2000.0,
        elevation_m=10.0,
        surface_water_occurrence_pct=0.0,
    )
    output = wind_engine.compute(cell)

    assert 0.50 <= output.normalized_score <= 0.75
    assert output.hazard_level == HazardLevel.HIGH
    assert output.details["tree_uprooting_danger"] is True
    assert output.details["structural_roof_failure_danger"] is False


def test_destructive_super_cyclonic_wind(wind_engine):
    """Extreme cyclonic wind (160 km/h with 200 km/h gusts) should yield SEVERE/CATASTROPHIC score."""
    cell = HazardCellInput(
        cell_id="CELL_TEST_SUPER_CYCLONE",
        latitude=19.30,
        longitude=84.90,
        rainfall_rate_mm_h=0.0,
        accumulated_rainfall_24h_mm=0.0,
        wind_speed_kmh=160.0,
        wind_gust_kmh=200.0,
        coastal_proximity_m=100.0,
        elevation_m=2.0,
        surface_water_occurrence_pct=0.0,
    )
    output = wind_engine.compute(cell)

    assert output.normalized_score >= 0.85
    assert output.hazard_level in [HazardLevel.SEVERE, HazardLevel.CATASTROPHIC]
    assert output.details["structural_roof_failure_danger"] is True
    assert output.details["dynamic_pressure_pa"] > 1000.0
