"""
PRALAYA Phase 3 - API Endpoints Verification Tests
Validates all 10 required REST endpoints, status codes, schemas, and 404 error handling.
"""

REGION_ID = "REG_GANJAM_COAST"
EVENT_ID = "CYC_KARUNA_2026"


def test_endpoint_1_health(client):
    """GET /api/v1/health"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"].lower() in ["healthy", "operational"]
    assert "version" in data
    assert "project_name" in data


def test_endpoint_2_events(client):
    """GET /api/v1/events"""
    response = client.get("/api/v1/events")
    assert response.status_code == 200
    events = response.json()
    assert isinstance(events, list)
    assert len(events) >= 1
    event = events[0]
    assert event["id"] == EVENT_ID
    assert event["name"] == "Cyclone KARUNA"
    assert event["central_pressure_hpa"] == 938.0
    assert event["max_sustained_winds_kmh"] == 185.0


def test_endpoint_2b_event_by_id(client):
    """GET /api/v1/events/{id}"""
    response = client.get(f"/api/v1/events/{EVENT_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == EVENT_ID

    # 404 test for unknown event
    response_404 = client.get("/api/v1/events/UNKNOWN_EVENT")
    assert response_404.status_code == 404


def test_endpoint_3_regions(client):
    """GET /api/v1/regions/{id}"""
    response = client.get(f"/api/v1/regions/{REGION_ID}")
    assert response.status_code == 200
    region = response.json()
    assert region["id"] == REGION_ID
    assert region["name"] == "Ganjam Coastal Corridor"
    assert region["state"] == "Odisha"
    assert region["population"] == 420000

    # 404 for unknown region
    response_404 = client.get("/api/v1/regions/UNKNOWN_REGION")
    assert response_404.status_code == 404


def test_endpoint_4_hazards(client):
    """GET /api/v1/hazards/{region_id}"""
    response = client.get(f"/api/v1/hazards/{REGION_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["region_id"] == REGION_ID
    assert "hazard" in data
    assert data["hazard"]["peak_surge_m"] == 4.8
    assert data["hazard"]["inundation_area_sq_km"] == 88.4
    assert len(data["weather_observations"]) >= 1
    assert len(data["satellite_layers"]) >= 1

    # 404 test
    assert client.get("/api/v1/hazards/UNKNOWN_REGION").status_code == 404


def test_endpoint_5_exposure(client):
    """GET /api/v1/exposure/{region_id}"""
    response = client.get(f"/api/v1/exposure/{REGION_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["region_id"] == REGION_ID
    assert data["total_exposed_population"] > 0
    assert "demographic_breakdown" in data
    assert data["demographic_breakdown"]["infants_under_5"] > 0
    assert data["demographic_breakdown"]["elderly_over_65"] > 0
    assert data["demographic_breakdown"]["kutcha_structures"] > 0
    assert "vulnerability_profile" in data
    assert data["vulnerability_profile"]["composite_vulnerability_index"] == 88.4

    # 404 test
    assert client.get("/api/v1/exposure/UNKNOWN_REGION").status_code == 404


def test_endpoint_6_infrastructure(client):
    """GET /api/v1/infrastructure/{region_id}"""
    response = client.get(f"/api/v1/infrastructure/{REGION_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["region_id"] == REGION_ID
    assert data["total_assets"] >= 5
    assert data["submerged_assets_count"] >= 1
    assert "assets" in data
    assert "hospitals" in data
    assert len(data["hospitals"]) >= 1
    hospital = data["hospitals"][0]
    assert hospital["icu_beds"] == 24
    assert hospital["generator_fuel_remaining_hours"] == 7.2
    assert "failure_cascade" in data
    assert len(data["failure_cascade"]["nodes"]) >= 4
    assert len(data["failure_cascade"]["edges"]) >= 3

    # 404 test
    assert client.get("/api/v1/infrastructure/UNKNOWN_REGION").status_code == 404


def test_endpoint_7_shelters(client):
    """GET /api/v1/shelters/{region_id}"""
    response = client.get(f"/api/v1/shelters/{REGION_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["region_id"] == REGION_ID
    assert data["total_shelters"] == 5
    assert data["total_capacity"] > 0
    assert data["available_capacity"] > 0
    assert len(data["shelters"]) == 5
    # TOPSIS descending sort check
    top_shelter = data["shelters"][0]
    assert top_shelter["topsisScore"] >= data["shelters"][1]["topsisScore"]

    # 404 test
    assert client.get("/api/v1/shelters/UNKNOWN_REGION").status_code == 404


def test_endpoint_8_routes(client):
    """GET /api/v1/routes/{region_id}"""
    response = client.get(f"/api/v1/routes/{REGION_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["region_id"] == REGION_ID
    assert len(data["viable_corridors"]) >= 1
    assert len(data["rejected_corridors"]) >= 1
    assert len(data["road_segments"]) >= 3
    # Check that rejected corridor has is_viable=False
    rejected = data["rejected_corridors"][0]
    assert rejected["is_viable"] is False
    assert rejected["max_flood_depth_m"] > 0.30

    # 404 test
    assert client.get("/api/v1/routes/UNKNOWN_REGION").status_code == 404


def test_endpoint_9_risk(client):
    """GET /api/v1/risk/{region_id}"""
    response = client.get(f"/api/v1/risk/{REGION_ID}")
    assert response.status_code == 200
    risk = response.json()
    assert risk["region_id"] == REGION_ID
    assert risk["composite_risk_index"] == 88.4
    assert risk["risk_level"] == "EXTREME"
    assert risk["total_exposed_population"] == 142500
    assert risk["economic_exposure_cr_inr"] == 480.2

    # 404 test
    assert client.get("/api/v1/risk/UNKNOWN_REGION").status_code == 404


def test_endpoint_10_actions(client):
    """GET /api/v1/actions/{region_id}"""
    response = client.get(f"/api/v1/actions/{REGION_ID}")
    assert response.status_code == 200
    data = response.json()
    assert data["region_id"] == REGION_ID
    assert data["total_actions"] >= 4
    assert len(data["action_recommendations"]) >= 4
    assert len(data["active_alerts"]) >= 1

    # Check multilingual alert content
    alert = data["active_alerts"][0]
    assert alert["severity"] == "RED"
    assert "message_en" in alert
    assert "message_od" in alert
    assert "message_te" in alert
    assert "message_hi" in alert
    assert alert["verification_level"] == "LEVEL_1_VERIFIED"

    # 404 test
    assert client.get("/api/v1/actions/UNKNOWN_REGION").status_code == 404
