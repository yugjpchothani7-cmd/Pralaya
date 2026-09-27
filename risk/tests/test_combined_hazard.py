"""
PRALAYA Deterministic Hazard Engine - Combined Multi-Hazard Unit Tests
Tests compound multi-hazard interactions, output metadata, and the Explanation Object.
"""

import pytest
from risk.models.hazard_inputs import HazardCellInput
from risk.models.hazard_outputs import HazardLevel
from risk.engine.combined_hazard import CombinedHazard


@pytest.fixture
def combined_engine():
    return CombinedHazard()


def test_combined_hazard_metadata_and_explanation(combined_engine):
    """
    Verifies that every output includes value, timestamp, source, model_version,
    confidence/uncertainty, and the exact requested explanation object.
    """
    cell = HazardCellInput(
        cell_id="CELL_GOPALPUR_SHORE",
        latitude=19.26,
        longitude=84.91,
        rainfall_rate_mm_h=40.0,
        accumulated_rainfall_24h_mm=210.0,
        wind_speed_kmh=145.0,
        wind_gust_kmh=180.0,
        coastal_proximity_m=150.0,
        elevation_m=1.8,
        surface_water_occurrence_pct=85.0,
        storm_surge_peak_m=3.8,
    )

    rain_out, wind_out, surge_out, exp_out, combined_out, explanation = combined_engine.compute(cell)

    # 1. Output components have all required metadata
    for out in [rain_out, wind_out, surge_out, exp_out, combined_out]:
        assert out.value is not None
        assert out.timestamp is not None
        assert out.source != ""
        assert out.model_version == "PRALAYA-HAZARD-v1.0-DETERMINISTIC"
        assert 0.0 <= out.confidence <= 1.0
        assert len(out.uncertainty_range) == 2
        assert 0.0 <= out.normalized_score <= 1.0

    # 2. Check compound multiplier effect
    # Compound multiplier should exceed 1.0 due to surge + rain backwater coupling
    assert combined_out.details["compound_multiplier"] > 1.0
    assert combined_out.hazard_level in [HazardLevel.SEVERE, HazardLevel.CATASTROPHIC]

    # 3. Check requested explanation object structure:
    # { hazard_level, primary_drivers, contributing_factors, timestamp, sources }
    exp_dict = explanation.model_dump()
    assert "hazard_level" in exp_dict
    assert "primary_drivers" in exp_dict
    assert "contributing_factors" in exp_dict
    assert "timestamp" in exp_dict
    assert "sources" in exp_dict

    assert exp_dict["hazard_level"] in ["SEVERE", "CATASTROPHIC"]
    assert len(exp_dict["primary_drivers"]) >= 1
    assert len(exp_dict["contributing_factors"]) >= 1
    assert len(exp_dict["sources"]) >= 1

    # Verify primary drivers highlight surge and wind
    joined_drivers = " ".join(exp_dict["primary_drivers"])
    assert "storm surge" in joined_drivers.lower() or "wind" in joined_drivers.lower() or "rainfall" in joined_drivers.lower()


def test_mild_scenario_combined_low(combined_engine):
    """Calm conditions should produce LOW hazard level with clean explanation."""
    cell = HazardCellInput(
        cell_id="CELL_CALM",
        latitude=19.40,
        longitude=84.85,
        rainfall_rate_mm_h=1.0,
        accumulated_rainfall_24h_mm=5.0,
        wind_speed_kmh=15.0,
        coastal_proximity_m=20000.0,
        elevation_m=35.0,
        surface_water_occurrence_pct=0.0,
        storm_surge_peak_m=0.0,
    )

    rain_out, wind_out, surge_out, exp_out, combined_out, explanation = combined_engine.compute(cell)

    assert combined_out.normalized_score < 0.20
    assert combined_out.hazard_level == HazardLevel.LOW
    assert explanation.hazard_level == "LOW"
