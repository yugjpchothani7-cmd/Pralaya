"""
PRALAYA Exposure Engine - Unit Tests for Regional Assessment & Sector Summaries
"""

import pytest
from exposure.engine.exposure_engine import ExposureEngine


@pytest.fixture
def engine():
    return ExposureEngine()


def test_sector_summaries_generation(engine):
    assessment = engine.assess_regional_exposure()

    # Population sector
    assert assessment.sector_population.total_population > 100000
    assert assessment.sector_population.total_exposed > 30000
    assert assessment.sector_population.total_infants_under_5 > 0

    # Infrastructure sector
    assert assessment.sector_infrastructure.total_critical_assets > 0
    assert assessment.sector_infrastructure.bridges_at_risk_count >= 1

    # Medical sector
    assert assessment.sector_medical.total_hospitals >= 2
    assert assessment.sector_medical.total_beds > 200

    # Transportation sector
    assert assessment.sector_transportation.total_road_km > 30.0
    assert assessment.sector_transportation.severed_road_km > 0.0

    # Energy sector
    assert assessment.sector_energy.total_substations >= 3
    assert assessment.sector_energy.total_population_at_blackout_risk > 0

    # Emergency resources sector
    assert assessment.sector_emergency_resources.total_certified_shelters >= 4
    assert assessment.sector_emergency_resources.rescue_boats_deployed > 10
    assert assessment.sector_emergency_resources.odraf_ndrf_personnel_active > 100


def test_what_if_shock_reactivity(engine):
    baseline = engine.assess_regional_exposure(surge_shock=0.0, rain_shock=0.0)
    shocked = engine.assess_regional_exposure(surge_shock=2.0, rain_shock=50.0, high_tide=True)

    # In shock scenario, flood depths are higher
    baseline_coastal = next(z for z in baseline.zones if z.zone_id == "ZONE_GOPALPUR_COAST")
    shocked_coastal = next(z for z in shocked.zones if z.zone_id == "ZONE_GOPALPUR_COAST")

    assert shocked_coastal.peak_surge_depth_m > baseline_coastal.peak_surge_depth_m
