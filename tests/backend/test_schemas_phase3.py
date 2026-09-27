"""
PRALAYA Phase 3 - Typed Schema Validation Tests
Validates all 18 core disaster models, field constraints, and strict schema validation.
"""

from datetime import datetime, timezone
import pytest
from pydantic import ValidationError

from app.schemas.models import (
    Event,
    EventType,
    EventStatus,
    Region,
    Hazard,
    WeatherObservation,
    SatelliteLayer,
    InfrastructureAsset,
    RoadSegment,
    Hospital,
    Shelter,
    PopulationZone,
    VulnerabilityProfile,
    EvacuationRoute,
    Resource,
    Alert,
    SimulationScenario,
    RiskAssessment,
    FailureNode,
    FailureEdge,
    CriticalityLevel,
    AssetStatus,
    RoadStatus,
    AlertSeverity,
    DependencyType,
)


def test_1_event_model():
    event = Event(
        id="CYC_TEST_01",
        name="Cyclone TEST",
        type=EventType.CYCLONE,
        category="VSCS",
        basin="Bay of Bengal",
        current_position=(19.0, 85.0),
        bearing_deg=315.0,
        forward_speed_kmh=15.0,
        central_pressure_hpa=940.0,
        max_sustained_winds_kmh=175.0,
        gusts_kmh=200.0,
        rmw_km=30.0,
        landfall_eta_hours=6.0,
        landfall_location="Gopalpur",
        official_bulletin="IMD Test Bulletin",
        bulletin_time="27-SEP-2026 10:00",
        status=EventStatus.ACTIVE,
    )
    assert event.id == "CYC_TEST_01"
    assert event.central_pressure_hpa == 940.0

    # Constraint validation: bearing cannot exceed 360 deg
    with pytest.raises(ValidationError):
        Event(
            id="CYC_BAD",
            name="Bad",
            type=EventType.CYCLONE,
            category="Test",
            basin="Bay of Bengal",
            current_position=(19.0, 85.0),
            bearing_deg=450.0,  # Invalid
            forward_speed_kmh=15.0,
            central_pressure_hpa=940.0,
            max_sustained_winds_kmh=175.0,
            gusts_kmh=200.0,
            rmw_km=30.0,
            landfall_eta_hours=6.0,
            landfall_location="Gopalpur",
            official_bulletin="IMD",
            bulletin_time="2026",
            status=EventStatus.ACTIVE,
        )


def test_2_region_model():
    region = Region(
        id="REG_TEST",
        name="Test Coastal Corridor",
        state="Odisha",
        country="India",
        bounding_box=(19.2, 84.8, 19.5, 85.2),
        centroid=(19.35, 85.0),
        population=100000,
        area_sq_km=500.0,
        coastal_length_km=30.0,
    )
    assert region.population == 100000

    # Negative population should fail
    with pytest.raises(ValidationError):
        Region(
            id="REG_BAD",
            name="Bad",
            state="Odisha",
            bounding_box=(19.2, 84.8, 19.5, 85.2),
            centroid=(19.35, 85.0),
            population=-500,  # Invalid
            area_sq_km=500.0,
            coastal_length_km=30.0,
        )


def test_3_hazard_model():
    hazard = Hazard(
        id="HAZ_01",
        region_id="REG_TEST",
        event_id="EVT_01",
        hazard_type="Surge",
        severity_level=CriticalityLevel.CRITICAL,
        peak_surge_m=4.5,
        flood_depth_max_m=2.0,
        flood_depth_avg_m=1.0,
        inundation_area_sq_km=75.0,
        wind_speed_max_kmh=180.0,
        rainfall_24h_mm=150.0,
    )
    assert hazard.peak_surge_m == 4.5


def test_4_weather_observation():
    obs = WeatherObservation(
        station_id="ST_01",
        station_name="Test AWS",
        coordinates=(19.3, 85.0),
        wind_speed_kmh=120.0,
        wind_direction_deg=310.0,
        wind_gusts_kmh=140.0,
        barometric_pressure_hpa=960.0,
        precipitation_rate_mmh=25.0,
        temperature_c=26.5,
        humidity_pct=95.0,
    )
    assert obs.wind_speed_kmh == 120.0


def test_5_satellite_layer():
    sat = SatelliteLayer(
        id="SAT_01",
        sensor_name="Sentinel-1 SAR",
        acquisition_time=datetime.now(timezone.utc),
        resolution_m=10.0,
        coverage_bbox=(19.2, 84.8, 19.5, 85.2),
        band="VV",
        raster_url="https://pralaya.ai/test.cog",
        flood_mask_confidence=0.95,
    )
    assert sat.resolution_m == 10.0


def test_6_infrastructure_asset():
    asset = InfrastructureAsset(
        id="INFRA_01",
        region_id="REG_TEST",
        name="Test Substation",
        type="substation",
        coordinates=(19.35, 85.0),
        status=AssetStatus.SUBMERGED,
        water_depth_m=0.5,
        criticality=CriticalityLevel.CRITICAL,
        details="Flooded",
        affected_population=50000,
    )
    assert asset.status == AssetStatus.SUBMERGED


def test_7_road_segment():
    road = RoadSegment(
        id="ROAD_01",
        region_id="REG_TEST",
        road_name="NH-16",
        road_type="national_highway",
        start_coord=(19.2, 84.9),
        end_coord=(19.4, 85.0),
        length_km=25.0,
        surface_elevation_m=15.0,
        status=RoadStatus.PASSABLE,
    )
    assert road.status == RoadStatus.PASSABLE


def test_8_hospital():
    hosp = Hospital(
        id="HOSP_01",
        region_id="REG_TEST",
        name="Test Hospital",
        coordinates=(19.34, 84.98),
        total_beds=200,
        icu_beds=20,
        occupied_icu_beds=18,
        emergency_capacity=30,
        power_status="Generator Active",
        generator_fuel_remaining_hours=8.0,
        generator_capacity_kva=500.0,
        oxygen_reserve_hours=24.0,
        operational_status=AssetStatus.DEGRADED,
    )
    assert hosp.icu_beds == 20


def test_9_shelter():
    shelter = Shelter(
        id="SHELTER_01",
        region_id="REG_TEST",
        name="Test Shelter",
        coordinates=(19.38, 84.96),
        certified_capacity=1000,
        current_occupancy=350,
        plinth_elevation_m=12.0,
        clearance_margin_m=6.5,
        topsisScore=0.92,
        road_status=RoadStatus.PASSABLE,
        district="Ganjam",
    )
    assert shelter.topsisScore == 0.92


def test_10_population_zone():
    zone = PopulationZone(
        id="ZONE_01",
        region_id="REG_TEST",
        zone_name="Sector 1",
        coordinates=(19.32, 85.01),
        total_population=25000,
        infants_under_5=3200,
        elderly_over_65=4100,
        kutcha_structures=8500,
        pucca_structures=2000,
        livestock_count=12000,
    )
    assert zone.total_population == 25000


def test_11_vulnerability_profile():
    vuln = VulnerabilityProfile(
        id="VULN_01",
        zone_id="ZONE_01",
        region_id="REG_TEST",
        physical_vulnerability=88.0,
        socio_demographic_vulnerability=76.0,
        infrastructure_isolation_risk=82.0,
        coping_capacity=45.0,
        composite_vulnerability_index=84.5,
    )
    assert vuln.composite_vulnerability_index == 84.5


def test_12_evacuation_route():
    route = EvacuationRoute(
        id="ROUTE_01",
        region_id="REG_TEST",
        route_name="Safe Ridge Link",
        origin=(19.31, 85.01),
        destination_shelter_id="SHELTER_01",
        distance_km=12.5,
        estimated_transit_time_min=28.0,
        clearance_window_hours=4.0,
        min_elevation_m=11.0,
        is_viable=True,
    )
    assert route.is_viable is True


def test_13_resource():
    res = Resource(
        id="RES_01",
        region_id="REG_TEST",
        resource_type="rescue_boats",
        current_location="Hub A",
        quantity=5,
        unit="boats",
        status="available",
    )
    assert res.quantity == 5


def test_14_alert():
    alert = Alert(
        id="ALERT_01",
        region_id="REG_TEST",
        event_id="EVT_01",
        severity=AlertSeverity.RED,
        title="Evacuation Warning",
        message_en="Evacuate now",
        message_od="ତୁରନ୍ତ ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ",
        message_te="వెంటనే సురక్షిత ప్రాంతాలకు వెళ్లండి",
        message_hi="तुरंत सुरक्षित स्थान पर जाएं",
        effective_until=datetime.now(timezone.utc),
        verified_hash="abc123hash",
    )
    assert alert.severity == AlertSeverity.RED


def test_15_simulation_scenario():
    sim = SimulationScenario(
        id="SIM_01",
        name="Surge Shock",
        description="Shock test",
        baseline_event_id="EVT_01",
        surge_shock_m=1.0,
        rainfall_shock_mm=50.0,
        simulated_exposed_pop=150000,
        simulated_risk_index=90.0,
    )
    assert sim.surge_shock_m == 1.0


def test_16_risk_assessment():
    risk = RiskAssessment(
        id="RISK_01",
        region_id="REG_TEST",
        event_id="EVT_01",
        composite_risk_index=88.4,
        risk_level="EXTREME",
        total_exposed_population=142500,
        economic_exposure_cr_inr=480.0,
        livestock_at_risk=68000,
        infant_exposure=18000,
        elderly_exposure=24000,
        kutcha_dwelling_exposure=41000,
    )
    assert risk.composite_risk_index == 88.4


def test_17_failure_node():
    node = FailureNode(
        id="FN_01",
        asset_id="INFRA_01",
        asset_name="Main Substation",
        asset_type="substation",
        failure_probability=1.0,
        current_state="FAILED",
    )
    assert node.current_state == "FAILED"


def test_18_failure_edge():
    edge = FailureEdge(
        id="FE_01",
        source_node_id="FN_01",
        target_node_id="FN_02",
        dependency_type=DependencyType.POWER_SUPPLY,
        cascade_criticality=CriticalityLevel.CRITICAL,
    )
    assert edge.dependency_type == DependencyType.POWER_SUPPLY
