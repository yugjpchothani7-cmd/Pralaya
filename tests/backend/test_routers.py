"""
Tests for PRALAYA Core Routers (Situation, Hazard, Shelters, Routing)
"""


def test_situation_summary(client):
    response = client.get("/api/v1/situation/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == "CYC_KARUNA_2026"
    assert data["current_status"]["central_pressure_hpa"] == 952.0
    assert data["impact_summary"]["population_in_danger_zone"] > 0
    assert data["provenance"]["source_authority"] == "India Meteorological Department, New Delhi"
    assert data["provenance"]["verification_level"] == "OFFICIAL_GOVERNMENT_FEED"


def test_hazard_status(client):
    response = client.get("/api/v1/hazard/status")
    assert response.status_code == 200
    data = response.json()
    assert data["event_id"] == "CYC_KARUNA_2026"
    assert data["metrics"]["peak_surge_height_m"] > 4.0
    assert data["provenance"]["verification_level"] == "SCIENTIFIC_SURROGATE_MODEL"


def test_shelters_ranking(client):
    response = client.get("/api/v1/shelters?origin_lat=19.35&origin_lon=85.02")
    assert response.status_code == 200
    data = response.json()
    assert data["candidate_count"] > 0
    assert len(data["ranked_shelters"]) == data["candidate_count"]
    # Check that first shelter has highest TOPSIS score
    top_shelter = data["ranked_shelters"][0]
    assert top_shelter["topsis_score"] > 0.9
    assert top_shelter["resilience"]["clearance_margin_m"] > 0


def test_routing_plan(client):
    response = client.get("/api/v1/routing/plan")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SAFE_ROUTE_COMPUTED"
    assert len(data["turn_by_turn"]) > 0
    assert data["metrics"]["max_flood_depth_on_path_m"] <= 0.05
