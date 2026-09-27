"""
PRALAYA Exposure Engine - Unit Tests for Zone Exposure Metrics
Verifies that every geographic zone produces:
- population_exposed
- critical_facilities_exposed
- road_segments_exposed
- power_assets_exposed
- hospital_exposure
- shelter_exposure
"""

import pytest
from exposure.engine.exposure_engine import ExposureEngine
from exposure.models.exposure_models import GeographicZoneExposure


@pytest.fixture
def exposure_engine():
    return ExposureEngine()


def test_zone_mandated_outputs_presence(exposure_engine):
    assessment = exposure_engine.assess_regional_exposure()
    assert assessment.total_zones == 4

    for zone in assessment.zones:
        assert isinstance(zone, GeographicZoneExposure)
        assert zone.zone_id is not None
        assert zone.zone_name is not None

        # 1. Population exposed
        assert zone.population_exposed is not None
        assert zone.population_exposed.total_population >= zone.population_exposed.population_exposed
        assert zone.population_exposed.infants_under_5 >= 0
        assert zone.population_exposed.elderly_over_65 >= 0
        assert zone.population_exposed.kutcha_mud_housing_units >= 0

        # 2. Critical facilities exposed
        assert isinstance(zone.critical_facilities_exposed, list)

        # 3. Road segments exposed
        assert isinstance(zone.road_segments_exposed, list)
        for road in zone.road_segments_exposed:
            assert road.length_km >= road.submerged_length_km

        # 4. Power assets exposed
        assert isinstance(zone.power_assets_exposed, list)
        for power in zone.power_assets_exposed:
            assert power.downstream_population_served >= 0

        # 5. Hospital exposure
        assert isinstance(zone.hospital_exposure, list)
        for hosp in zone.hospital_exposure:
            assert hosp.total_beds >= hosp.icu_beds

        # 6. Shelter exposure
        assert isinstance(zone.shelter_exposure, list)
        for shelter in zone.shelter_exposure:
            assert shelter.certified_capacity >= shelter.current_occupancy


def test_coastal_vs_inland_zone_contrast(exposure_engine):
    assessment = exposure_engine.assess_regional_exposure()
    
    coastal_zone = next(z for z in assessment.zones if z.zone_id == "ZONE_GOPALPUR_COAST")
    inland_zone = next(z for z in assessment.zones if z.zone_id == "ZONE_HINJILICUT_INLAND")

    # Coastal zone has severe surge and high exposure %
    assert coastal_zone.peak_surge_depth_m > 1.0
    assert coastal_zone.population_exposed.exposure_percentage > 50.0

    # Inland zone is on high ground, minimal exposure %
    assert inland_zone.peak_surge_depth_m == 0.0
    assert inland_zone.population_exposed.exposure_percentage < 10.0
    assert inland_zone.elevation_mean_m > 30.0
