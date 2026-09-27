"""
PRALAYA Mock Data Repository Adapter
Implements DisasterDataRepository with realistic, deterministic coastal Odisha emergency scenario data.
"""

from datetime import datetime, timedelta, timezone
from typing import List, Optional, Tuple

from app.repositories.base import DisasterDataRepository
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
    ActionRecommendation,
    CriticalityLevel,
    AssetStatus,
    RoadStatus,
    AlertSeverity,
    DependencyType,
)


class MockDisasterRepository(DisasterDataRepository):
    """In-memory mock adapter satisfying all repository contracts with coastal Odisha data."""

    def __init__(self):
        self._region_id = "REG_GANJAM_COAST"
        self._event_id = "CYC_KARUNA_2026"

        # 1. Event
        self._events = [
            Event(
                id=self._event_id,
                name="Cyclone KARUNA",
                type=EventType.CYCLONE,
                category="Extremely Severe Cyclonic Storm (ESCS)",
                basin="Bay of Bengal",
                current_position=(19.28, 85.22),
                bearing_deg=315.0,
                forward_speed_kmh=14.5,
                central_pressure_hpa=938.0,
                max_sustained_winds_kmh=185.0,
                gusts_kmh=210.0,
                rmw_km=32.5,
                landfall_eta_hours=4.0,
                landfall_location="Between Gopalpur & Chhatrapur, Odisha",
                official_bulletin="IMD RSMC Cyclone Bulletin #14 (Verified Level 1)",
                bulletin_time="27-SEP-2026 11:00 IST",
                status=EventStatus.ACTIVE,
            )
        ]

        # 2. Region
        self._regions = {
            self._region_id: Region(
                id=self._region_id,
                name="Ganjam Coastal Corridor",
                state="Odisha",
                country="India",
                bounding_box=(19.20, 84.80, 19.55, 85.25),
                centroid=(19.35, 85.02),
                population=420000,
                area_sq_km=680.0,
                districts=["Ganjam", "Puri"],
                mandals=["Chhatrapur", "Gopalpur", "Rangeilunda", "Ganjam Block"],
                coastal_length_km=42.5,
                critical_assets_count=5,
            )
        }

        # 3. Hazard
        self._hazards = {
            self._region_id: Hazard(
                id="HAZ_GANJAM_01",
                region_id=self._region_id,
                event_id=self._event_id,
                hazard_type="Storm Surge & Pluvial Estuary Flooding",
                severity_level=CriticalityLevel.CRITICAL,
                peak_surge_m=4.8,
                flood_depth_max_m=2.4,
                flood_depth_avg_m=1.2,
                inundation_area_sq_km=88.4,
                wind_speed_max_kmh=185.0,
                rainfall_24h_mm=180.0,
                high_tide_coincidence=True,
                timestamp=datetime(2026, 9, 27, 11, 0, 0),
            )
        }

        # 4. Weather Observations
        self._weather = [
            WeatherObservation(
                station_id="AWS_GOPALPUR_01",
                station_name="Gopalpur Coastal Observatory",
                coordinates=(19.26, 84.91),
                timestamp=datetime(2026, 9, 27, 11, 0, 0),
                wind_speed_kmh=185.0,
                wind_direction_deg=315.0,
                wind_gusts_kmh=210.0,
                barometric_pressure_hpa=938.0,
                precipitation_rate_mmh=32.5,
                temperature_c=25.8,
                humidity_pct=98.0,
                data_source="IMD AWS Network",
            )
        ]

        # 5. Satellite Layers
        self._satellite = [
            SatelliteLayer(
                id="SAT_SENTINEL1_20260927",
                sensor_name="Sentinel-1 SAR GRD C-Band",
                acquisition_time=datetime(2026, 9, 27, 9, 30, 0),
                resolution_m=10.0,
                coverage_bbox=(19.20, 84.80, 19.55, 85.25),
                band="VV+VH Dual Polarimetric",
                raster_url="https://tiles.pralaya.ai/sar/sentinel1_ganjam_inundation_20260927.cog",
                flood_mask_confidence=0.965,
                processing_level="Level 1 GRD Surface Inundation Mask",
            )
        ]

        # 6. Infrastructure Assets
        self._infrastructure = [
            InfrastructureAsset(
                id="INFRA_SUBSTATION_01",
                region_id=self._region_id,
                name="Chhatrapur 132kV Main Grid Substation",
                type="substation",
                coordinates=(19.355, 84.995),
                status=AssetStatus.SUBMERGED,
                water_depth_m=0.65,
                criticality=CriticalityLevel.CRITICAL,
                details="Transformer bay submerged 0.65m > 0.40m flood threshold. Tripped at T-5h to prevent catastrophic arc.",
                affected_population=85000,
            ),
            InfrastructureAsset(
                id="INFRA_HOSPITAL_01",
                region_id=self._region_id,
                name="Ganjam District Headquarter Hospital",
                type="hospital",
                coordinates=(19.340, 84.975),
                status=AssetStatus.DEGRADED,
                water_depth_m=0.12,
                criticality=CriticalityLevel.CRITICAL,
                backup_power_hours=7.2,
                details="Primary grid severed from Substation 01. Operating on 750kVA diesel generator with 7.2 hours fuel remaining. 24 ICU patients.",
                affected_population=14000,
            ),
            InfrastructureAsset(
                id="INFRA_BRIDGE_01",
                region_id=self._region_id,
                name="Rushikulya Estuary Bridge (State Highway 14)",
                type="bridge",
                coordinates=(19.330, 85.040),
                status=AssetStatus.OFFLINE,
                water_depth_m=0.85,
                criticality=CriticalityLevel.HIGH,
                details="Approach road washed over by 0.85m surge. Impassable for all civilian vehicles. Severed evacuation route.",
                affected_population=42000,
            ),
            InfrastructureAsset(
                id="INFRA_PUMP_01",
                region_id=self._region_id,
                name="North Drinking Water Booster Station",
                type="pumping_station",
                coordinates=(19.370, 84.980),
                status=AssetStatus.OFFLINE,
                water_depth_m=0.45,
                criticality=CriticalityLevel.HIGH,
                details="Pump motors offline due to upstream power grid failure. Fresh water reservoir holding 14 hours supply.",
                affected_population=65000,
            ),
            InfrastructureAsset(
                id="INFRA_TELECOM_01",
                region_id=self._region_id,
                name="Chhatrapur Coastal Cellular Mast T-14",
                type="telecom",
                coordinates=(19.362, 85.012),
                status=AssetStatus.DEGRADED,
                water_depth_m=0.05,
                criticality=CriticalityLevel.MEDIUM,
                backup_power_hours=3.5,
                details="Battery backup active. Wind gusts of 185 km/h degrading microwave alignment.",
                affected_population=28000,
            ),
        ]

        # 7. Road Segments
        self._roads = [
            RoadSegment(
                id="ROAD_NH16_SEC1",
                region_id=self._region_id,
                road_name="National Highway 16 (Inland Arterial)",
                road_type="national_highway",
                start_coord=(19.25, 84.90),
                end_coord=(19.45, 85.05),
                length_km=26.5,
                surface_elevation_m=18.5,
                status=RoadStatus.PASSABLE,
                current_flood_depth_m=0.0,
                max_tolerable_depth_m=0.30,
                is_evacuation_corridor=True,
            ),
            RoadSegment(
                id="ROAD_SH14_KM12",
                region_id=self._region_id,
                road_name="State Highway 14 (Rushikulya Estuary Link)",
                road_type="state_highway",
                start_coord=(19.32, 85.02),
                end_coord=(19.34, 85.06),
                length_km=6.8,
                surface_elevation_m=3.2,
                status=RoadStatus.IMPASSABLE,
                current_flood_depth_m=0.85,
                max_tolerable_depth_m=0.30,
                is_evacuation_corridor=False,
            ),
            RoadSegment(
                id="ROAD_RIDGE_NORTH",
                region_id=self._region_id,
                road_name="Inland Ridge Road bypass",
                road_type="ridge_road",
                start_coord=(19.31, 85.01),
                end_coord=(19.39, 84.96),
                length_km=14.8,
                surface_elevation_m=14.2,
                status=RoadStatus.PASSABLE,
                current_flood_depth_m=0.0,
                max_tolerable_depth_m=0.30,
                is_evacuation_corridor=True,
            ),
        ]

        # 8. Hospitals
        self._hospitals = [
            Hospital(
                id="HOSP_GANJAM_01",
                region_id=self._region_id,
                name="Ganjam District Headquarter Hospital",
                coordinates=(19.340, 84.975),
                total_beds=350,
                icu_beds=24,
                occupied_icu_beds=24,
                emergency_capacity=50,
                power_status="Operating on 750kVA Emergency Diesel Generator",
                generator_fuel_remaining_hours=7.2,
                generator_capacity_kva=750.0,
                oxygen_reserve_hours=36.0,
                flood_depth_m=0.12,
                operational_status=AssetStatus.DEGRADED,
            )
        ]

        # 9. Shelters
        self._shelters = [
            Shelter(
                id="SHELTER_KALYANPUR",
                region_id=self._region_id,
                name="Kalyanpur High School Cyclone Shelter",
                coordinates=(19.385, 84.965),
                certified_capacity=1200,
                current_occupancy=410,
                plinth_elevation_m=14.8,
                clearance_margin_m=10.0,
                topsisScore=0.945,
                has_power=True,
                has_water=True,
                has_medical=True,
                road_status=RoadStatus.PASSABLE,
                district="Ganjam",
            ),
            Shelter(
                id="SHELTER_GOVT_COLLEGE",
                region_id=self._region_id,
                name="Chhatrapur Autonomous College Complex",
                coordinates=(19.360, 84.950),
                certified_capacity=2000,
                current_occupancy=1150,
                plinth_elevation_m=12.2,
                clearance_margin_m=7.4,
                topsisScore=0.880,
                has_power=True,
                has_water=True,
                has_medical=True,
                road_status=RoadStatus.PASSABLE,
                district="Ganjam",
            ),
            Shelter(
                id="SHELTER_RUSHIKULYA",
                region_id=self._region_id,
                name="Rushikulya Primary Cyclone Shelter",
                coordinates=(19.335, 85.035),
                certified_capacity=800,
                current_occupancy=640,
                plinth_elevation_m=4.8,
                clearance_margin_m=0.0,
                topsisScore=0.310,
                has_power=False,
                has_water=False,
                has_medical=False,
                road_status=RoadStatus.IMPASSABLE,
                district="Ganjam",
            ),
            Shelter(
                id="SHELTER_ARJIPALLI",
                region_id=self._region_id,
                name="Arjipalli Fishermen Community Center",
                coordinates=(19.310, 85.010),
                certified_capacity=600,
                current_occupancy=580,
                plinth_elevation_m=5.5,
                clearance_margin_m=0.7,
                topsisScore=0.420,
                has_power=True,
                has_water=True,
                has_medical=False,
                road_status=RoadStatus.CAUTION,
                district="Ganjam",
            ),
            Shelter(
                id="SHELTER_PURUSHOTTAMPUR",
                region_id=self._region_id,
                name="Purushottampur Inland Polytechnic",
                coordinates=(19.420, 84.910),
                certified_capacity=2500,
                current_occupancy=450,
                plinth_elevation_m=22.0,
                clearance_margin_m=17.2,
                topsisScore=0.965,
                has_power=True,
                has_water=True,
                has_medical=True,
                road_status=RoadStatus.PASSABLE,
                district="Ganjam",
            ),
        ]

        # 10. Population Zones
        self._zones = [
            PopulationZone(
                id="ZONE_ARJIPALLI_01",
                region_id=self._region_id,
                zone_name="Arjipalli Fishermen Hamlet",
                coordinates=(19.31, 85.01),
                total_population=48500,
                infants_under_5=6200,
                elderly_over_65=8190,
                persons_with_disability=1420,
                kutcha_structures=14100,
                pucca_structures=3200,
                livestock_count=23100,
                median_household_income_inr=38000.0,
            ),
            PopulationZone(
                id="ZONE_CHHATRAPUR_COAST",
                region_id=self._region_id,
                zone_name="Chhatrapur Coastal Sector",
                coordinates=(19.35, 84.99),
                total_population=94000,
                infants_under_5=12040,
                elderly_over_65=15892,
                persons_with_disability=2890,
                kutcha_structures=27367,
                pucca_structures=14500,
                livestock_count=44900,
                median_household_income_inr=52000.0,
            ),
        ]

        # 11. Vulnerability Profiles
        self._vulnerability = VulnerabilityProfile(
            id="VULN_GANJAM_01",
            zone_id="ZONE_ARJIPALLI_01",
            region_id=self._region_id,
            physical_vulnerability=92.0,
            socio_demographic_vulnerability=84.0,
            infrastructure_isolation_risk=89.0,
            coping_capacity=42.0,
            composite_vulnerability_index=88.4,
            primary_drivers=[
                "High density of non-engineered kutcha homes in 0-5m elevation zone",
                "State Highway 14 severed, eliminating direct eastern evacuation access",
                "Substation 01 submerged, triggering loss of municipal drinking water boosters",
            ],
        )

        # 12. Evacuation Routes
        self._routes = [
            EvacuationRoute(
                id="ROUTE_ARJIPALLI_RIDGE_KALYANPUR",
                region_id=self._region_id,
                route_name="Arjipalli to Kalyanpur Safe Ridge Corridor",
                origin=(19.31, 85.01),
                destination_shelter_id="SHELTER_KALYANPUR",
                distance_km=14.8,
                estimated_transit_time_min=32.0,
                clearance_window_hours=3.5,
                min_elevation_m=14.2,
                max_flood_depth_m=0.0,
                is_viable=True,
                waypoint_coordinates=[
                    (19.31, 85.01),
                    (19.34, 84.98),
                    (19.37, 84.97),
                    (19.385, 84.965),
                ],
                recommended_transport_mode="BUS",
            ),
            EvacuationRoute(
                id="ROUTE_ARJIPALLI_SH14_REJECTED",
                region_id=self._region_id,
                route_name="State Highway 14 (REJECTED HAZARD ROUTE)",
                origin=(19.31, 85.01),
                destination_shelter_id="SHELTER_RUSHIKULYA",
                distance_km=8.2,
                estimated_transit_time_min=999.0,
                clearance_window_hours=0.0,
                min_elevation_m=2.8,
                max_flood_depth_m=0.85,
                is_viable=False,
                waypoint_coordinates=[
                    (19.31, 85.01),
                    (19.33, 85.04),
                    (19.335, 85.035),
                ],
                recommended_transport_mode="AMPHIBIOUS_ONLY",
            ),
        ]

        # 13. Resources
        self._resources = [
            Resource(
                id="RES_NDRF_BOATS_01",
                region_id=self._region_id,
                resource_type="rescue_boats",
                current_location="Kalyanpur Staging Ground",
                quantity=6,
                unit="motorized inflatable boats",
                status="deployed",
                assigned_to_action_id="REC_03",
            ),
            Resource(
                id="RES_KSRTC_BUSES_01",
                region_id=self._region_id,
                resource_type="evacuation_buses",
                current_location="Arjipalli Ridge Depot",
                quantity=8,
                unit="buses",
                status="deployed",
                assigned_to_action_id="REC_01",
            ),
            Resource(
                id="RES_DIESEL_TANKER_01",
                region_id=self._region_id,
                resource_type="diesel_tanker",
                current_location="National Highway 16 Fuel Hub",
                quantity=5000,
                unit="liters",
                status="in_transit",
                assigned_to_action_id="REC_02",
            ),
        ]

        # 14. Alerts
        self._alerts = [
            Alert(
                id="ALERT_SH14_CUT_01",
                region_id=self._region_id,
                event_id=self._event_id,
                severity=AlertSeverity.RED,
                title="Critical Route Closure: State Highway 14 Submerged",
                message_en="CRITICAL ALERT: State Highway 14 (Rushikulya Estuary Bridge) submerged under 0.85m storm surge. Convoys must reroute via Inland Ridge Road to Kalyanpur Shelter.",
                message_od="ଜରୁରୀ ସୂଚନା: ଷ୍ଟେଟ୍ ହାଇୱେ-୧୪ (ଋଷିକୁଲ୍ୟା ବ୍ରିଜ୍) ୦.୮୫ ମିଟର ପାଣିରେ ବୁଡ଼ି ରହିଛି। ସମସ୍ତ ଗାଡ଼ି ରିଜ୍ ରୋଡ୍ ଦେଇ କଲ୍ୟାଣପୁର ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ।",
                message_te="ముఖ్యమైన హెచ్చరిక: స్టేట్ హైవే 14 పై 0.85 మీటర్ల నీరు చేరింది. కాన్వాయ్‌లు ఇన్‌ల్యాండ్ రిడ్జ్ రోడ్ మీదుగా కల్యాణ్‌పూర్ షెల్టర్‌కు వెళ్లాలి.",
                message_hi="अति आवश्यक चेतावनी: राज्य राजमार्ग 14 (ऋषिकुल्या ब्रिज) 0.85 मीटर पानी में डूबा है। सभी वाहन रिज़ रोड से कल्याणपुर शरणस्थल की ओर जाएं।",
                target_zones=["Arjipalli", "Rushikulya", "Chhatrapur Rural"],
                effective_until=datetime.now(timezone.utc) + timedelta(hours=8),
                verified_hash="9b2c4e8f1a3d67bc8201a0fe19283746",
                verification_level="LEVEL_1_VERIFIED",
                issued_by="PRALAYA Disaster Mission Control",
            )
        ]

        # 15. Simulation Scenarios
        self._scenarios = [
            SimulationScenario(
                id="SIM_SURGE_SHOCK_1.2M",
                name="Surge Shock +1.2m Scenario",
                description="Evaluating astronomical high tide coincidence adding 1.2m surge across coastal estuary",
                baseline_event_id=self._event_id,
                surge_shock_m=1.2,
                rainfall_shock_mm=0.0,
                high_tide_coincident=True,
                grid_blackout_triggered=False,
                simulated_exposed_pop=164700,
                simulated_risk_index=92.2,
                delta_shelters_compromised=1,
            )
        ]

        # 16. Risk Assessment
        self._risk = RiskAssessment(
            id="RISK_GANJAM_T_MINUS_4H",
            region_id=self._region_id,
            event_id=self._event_id,
            timestamp=datetime(2026, 9, 27, 11, 0, 0),
            composite_risk_index=88.4,
            risk_level="EXTREME",
            total_exposed_population=142500,
            economic_exposure_cr_inr=480.2,
            livestock_at_risk=68000,
            infant_exposure=18240,
            elderly_exposure=24082,
            kutcha_dwelling_exposure=41467,
            factor_breakdown={
                "physical_hazard_depth": 92.0,
                "socio_demographic_fragility": 84.0,
                "infrastructure_isolation": 89.0,
            },
        )

        # 17 & 18. Failure Cascade Graph (Nodes and Directed Edges)
        self._failure_nodes = [
            FailureNode(
                id="FN_SUBSTATION_01",
                asset_id="INFRA_SUBSTATION_01",
                asset_name="Chhatrapur 132kV Substation",
                asset_type="substation",
                failure_probability=1.0,
                current_state="FAILED",
                time_to_failure_hours=0.0,
                backup_depletion_hours=0.0,
                critical_services_impacted=["Regional 11kV Feeder Lines", "North Water Booster"],
            ),
            FailureNode(
                id="FN_HOSPITAL_01",
                asset_id="INFRA_HOSPITAL_01",
                asset_name="Ganjam District Hospital",
                asset_type="hospital",
                failure_probability=0.78,
                current_state="VULNERABLE",
                time_to_failure_hours=7.2,
                backup_depletion_hours=7.2,
                critical_services_impacted=["24 ICU Ventilators", "Cold Chain Blood Bank"],
            ),
            FailureNode(
                id="FN_PUMP_01",
                asset_id="INFRA_PUMP_01",
                asset_name="North Drinking Water Booster",
                asset_type="pump_station",
                failure_probability=1.0,
                current_state="FAILED",
                time_to_failure_hours=0.0,
                backup_depletion_hours=14.0,
                critical_services_impacted=["Potable Water Supply to 65,000 residents"],
            ),
            FailureNode(
                id="FN_TELECOM_01",
                asset_id="INFRA_TELECOM_01",
                asset_name="Coastal Mast T-14",
                asset_type="telecom",
                failure_probability=0.65,
                current_state="VULNERABLE",
                time_to_failure_hours=3.5,
                backup_depletion_hours=3.5,
                critical_services_impacted=["Arjipalli Cellular Coverage", "Emergency Broadcast SMS"],
            ),
        ]

        self._failure_edges = [
            FailureEdge(
                id="FE_SUBSTATION_TO_HOSPITAL",
                source_node_id="FN_SUBSTATION_01",
                target_node_id="FN_HOSPITAL_01",
                dependency_type=DependencyType.POWER_SUPPLY,
                propagation_delay_min=0,
                cascade_criticality=CriticalityLevel.CRITICAL,
            ),
            FailureEdge(
                id="FE_SUBSTATION_TO_PUMP",
                source_node_id="FN_SUBSTATION_01",
                target_node_id="FN_PUMP_01",
                dependency_type=DependencyType.POWER_SUPPLY,
                propagation_delay_min=0,
                cascade_criticality=CriticalityLevel.HIGH,
            ),
            FailureEdge(
                id="FE_SUBSTATION_TO_TELECOM",
                source_node_id="FN_SUBSTATION_01",
                target_node_id="FN_TELECOM_01",
                dependency_type=DependencyType.POWER_SUPPLY,
                propagation_delay_min=15,
                cascade_criticality=CriticalityLevel.MEDIUM,
            ),
        ]

        # Action Recommendations
        self._actions = [
            ActionRecommendation(
                id="REC_01",
                priority=CriticalityLevel.URGENT,
                title="Evacuate Arjipalli Fishermen Hamlet to Purushottampur",
                action_text="Dispatch 8 KSRTC evacuation buses along Inland Ridge Road (avoid SH-14). 420 residents in low-lying kutcha structures.",
                deadline_hours=2.0,
                target_mandal="Arjipalli Coastal Sector",
                impact_metric="420 Lives at Immediate Risk from 4.8m Surge",
                status="PENDING",
            ),
            ActionRecommendation(
                id="REC_02",
                priority=CriticalityLevel.URGENT,
                title="Deploy Mobile Diesel Generator & Fuel to District Hospital",
                action_text="Hospital generator fuel reserve at 7.2h. Dispatch 5,000L diesel tanker via unflooded National Highway 16 corridor.",
                deadline_hours=3.5,
                target_mandal="Chhatrapur Urban Core",
                impact_metric="24 ICU Patients & Life Support Continuity",
                status="DISPATCHED",
            ),
            ActionRecommendation(
                id="REC_03",
                priority=CriticalityLevel.HIGH,
                title="Pre-Stage NDRF 3rd Battalion Inflatable Boats at Kalyanpur",
                action_text="Pre-position 6 motorized Gemini boats near Rushikulya backwater breach point prior to high-tide surge peak at 15:30 IST.",
                deadline_hours=2.5,
                target_mandal="Rushikulya Estuary",
                impact_metric="Rapid Amphibious Extraction Capability",
                status="PENDING",
            ),
            ActionRecommendation(
                id="REC_04",
                priority=CriticalityLevel.MEDIUM,
                title="Broadcast Multilingual Advisory (Odia / Telugu) on AIR & SMS",
                action_text='Broadcast warning: "State Highway 14 is closed at KM 12. Proceed exclusively via Ridge Road toward Kalyanpur High School."',
                deadline_hours=1.0,
                target_mandal="All Coastal Mandals",
                impact_metric="Prevents Evacuation Convoy Water Trapping",
                status="COMPLETED",
            ),
        ]

    # --- Repository Method Implementations ---

    async def get_events(self) -> List[Event]:
        return self._events

    async def get_event_by_id(self, event_id: str) -> Optional[Event]:
        for e in self._events:
            if e.id == event_id:
                return e
        return None

    async def get_region(self, region_id: str) -> Optional[Region]:
        return self._regions.get(region_id)

    async def get_hazard_by_region(self, region_id: str) -> Optional[Hazard]:
        return self._hazards.get(region_id)

    async def get_weather_observations(self, region_id: str) -> List[WeatherObservation]:
        return self._weather

    async def get_satellite_layers(self, region_id: str) -> List[SatelliteLayer]:
        return self._satellite

    async def get_population_zones(self, region_id: str) -> List[PopulationZone]:
        return self._zones

    async def get_vulnerability_profile(self, region_id: str) -> Optional[VulnerabilityProfile]:
        return self._vulnerability

    async def get_infrastructure_assets(self, region_id: str) -> List[InfrastructureAsset]:
        return self._infrastructure

    async def get_hospitals(self, region_id: str) -> List[Hospital]:
        return self._hospitals

    async def get_failure_graph(self, region_id: str) -> Tuple[List[FailureNode], List[FailureEdge]]:
        return self._failure_nodes, self._failure_edges

    async def get_shelters(self, region_id: str) -> List[Shelter]:
        return self._shelters

    async def get_routes(self, region_id: str) -> List[EvacuationRoute]:
        return self._routes

    async def get_road_segments(self, region_id: str) -> List[RoadSegment]:
        return self._roads

    async def get_risk_assessment(self, region_id: str) -> Optional[RiskAssessment]:
        return self._risk

    async def get_actions(self, region_id: str) -> List[ActionRecommendation]:
        return self._actions

    async def get_alerts(self, region_id: str) -> List[Alert]:
        return self._alerts

    async def get_resources(self, region_id: str) -> List[Resource]:
        return self._resources

    async def get_simulation_scenarios(self, region_id: str) -> List[SimulationScenario]:
        return self._scenarios
