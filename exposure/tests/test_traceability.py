"""
PRALAYA Exposure Engine - Unit Tests for Source Traceability
Ensures every asset and demographic metric is traceable to its authoritative registry.
"""

import pytest
from exposure.engine.exposure_engine import ExposureEngine
from exposure.models.exposure_models import ExposureSourceTrace


@pytest.fixture
def engine():
    return ExposureEngine()


def test_every_sector_has_valid_source_trace(engine):
    assessment = engine.assess_regional_exposure()

    for zone in assessment.zones:
        # Population trace
        pop_trace = zone.population_exposed.source_trace
        assert isinstance(pop_trace, ExposureSourceTrace)
        assert len(pop_trace.source_name) > 0
        assert len(pop_trace.agency) > 0
        assert pop_trace.confidence >= 0.90

        # Hospital trace
        for h in zone.hospital_exposure:
            assert isinstance(h.source_trace, ExposureSourceTrace)
            assert "Health" in h.source_trace.source_name or "HFR" in h.source_trace.source_name

        # Shelter trace
        for s in zone.shelter_exposure:
            assert isinstance(s.source_trace, ExposureSourceTrace)
            assert "OSDMA" in s.source_trace.agency or "Shelter" in s.source_trace.source_name

        # Road trace
        for r in zone.road_segments_exposed:
            assert isinstance(r.source_trace, ExposureSourceTrace)
            assert len(r.source_trace.dataset_version) > 0

        # Power trace
        for p in zone.power_assets_exposed:
            assert isinstance(p.source_trace, ExposureSourceTrace)
            assert "OPTCL" in p.source_trace.agency or "Power" in p.source_trace.source_name

        # Emergency trace
        for e in zone.emergency_facilities_exposed:
            assert isinstance(e.source_trace, ExposureSourceTrace)
            assert "ODRAF" in e.source_trace.agency or "NDRF" in e.source_trace.agency
