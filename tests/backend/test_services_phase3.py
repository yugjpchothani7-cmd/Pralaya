"""
PRALAYA Phase 3 - Service & Repository Layer Isolation Tests
Validates that services depend exclusively on the abstract DisasterDataRepository interface.
"""

import pytest
from app.repositories.mock_repository import MockDisasterRepository
from app.services.disaster_service import DisasterService


@pytest.fixture
def disaster_service():
    repo = MockDisasterRepository()
    return DisasterService(repository=repo)


@pytest.mark.asyncio
async def test_service_event_retrieval(disaster_service):
    events = await disaster_service.get_all_events()
    assert len(events) >= 1
    assert events[0].id == "CYC_KARUNA_2026"


@pytest.mark.asyncio
async def test_service_region_hazard_aggregation(disaster_service):
    data = await disaster_service.get_hazard_assessment("REG_GANJAM_COAST")
    assert data["hazard"].peak_surge_m == 4.8
    assert len(data["weather_observations"]) >= 1


@pytest.mark.asyncio
async def test_service_shelter_topsis_ranking(disaster_service):
    status = await disaster_service.get_shelters_status("REG_GANJAM_COAST")
    shelters = status["shelters"]
    assert len(shelters) == 5
    for i in range(len(shelters) - 1):
        assert shelters[i].topsisScore >= shelters[i + 1].topsisScore


@pytest.mark.asyncio
async def test_service_failure_cascade_graph(disaster_service):
    infra = await disaster_service.get_infrastructure_status("REG_GANJAM_COAST")
    nodes = infra["failure_cascade"]["nodes"]
    edges = infra["failure_cascade"]["edges"]
    assert len(nodes) >= 4
    assert len(edges) >= 3
    # Verify Substation is failed
    substation = next(n for n in nodes if n.asset_id == "INFRA_SUBSTATION_01")
    assert substation.current_state == "FAILED"
