"""
PRALAYA Deterministic Hazard Engine - Coastal vs Inland Unit Tests
Tests hydrodynamic surge dissipation and coastal vs inland cell behavior.
"""

import pytest
from risk.models.hazard_inputs import HazardCellInput
from risk.models.hazard_outputs import HazardLevel
from risk.engine.surge_hazard import SurgeHazard


@pytest.fixture
def surge_engine():
    return SurgeHazard()


def test_coastal_cell_inundation(surge_engine):
    """
    Coastal cell directly on shoreline (150m inland) with 1.8m elevation facing 3.8m surge.
    Surge propagates with minimal attenuation (~0.05m loss), inundating cell by ~1.95m.
    """
    cell = HazardCellInput(
        cell_id="CELL_COASTAL_SHORELINE",
        latitude=19.26,
        longitude=84.91,
        rainfall_rate_mm_h=20.0,
        accumulated_rainfall_24h_mm=100.0,
        wind_speed_kmh=140.0,
        coastal_proximity_m=150.0,
        elevation_m=1.8,
        surface_water_occurrence_pct=85.0,
        storm_surge_peak_m=3.8,
    )
    output = surge_engine.compute(cell)

    assert output.component_name == "surge"
    assert output.unit == "meters"
    assert output.value > 1.5  # Overland inundation depth > 1.5m
    assert output.normalized_score > 0.60
    assert output.hazard_level in [HazardLevel.HIGH, HazardLevel.SEVERE]
    assert output.details["inland_distance_km"] == 0.15
    assert output.details["net_overland_depth_m"] > 1.5


def test_inland_cell_surge_dissipation(surge_engine):
    """
    Inland cell located 15 km from coast with 28.0m elevation.
    Overland surge completely dissipates (loss ~ 5.25m + 28m terrain barrier).
    Net surge depth is 0.0m with 0.0 normalized hazard score.
    """
    cell = HazardCellInput(
        cell_id="CELL_INLAND_HINTERLAND",
        latitude=19.32,
        longitude=84.79,
        rainfall_rate_mm_h=20.0,
        accumulated_rainfall_24h_mm=100.0,
        wind_speed_kmh=120.0,
        coastal_proximity_m=15000.0,
        elevation_m=28.0,
        surface_water_occurrence_pct=0.0,
        storm_surge_peak_m=3.8,
    )
    output = surge_engine.compute(cell)

    assert output.value == 0.0
    assert output.normalized_score == 0.0
    assert output.hazard_level == HazardLevel.LOW
    assert output.details["net_overland_depth_m"] == 0.0
    assert output.details["terrain_clearance_m"] > 25.0
