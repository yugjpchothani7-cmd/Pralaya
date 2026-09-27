"""
PRALAYA Core Data Architecture Schemas & Domain Models
Strongly-typed Pydantic V2 definitions for the 18 core disaster entities.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Tuple, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.vulnerability import VulnerabilityComponentScores, VulnerabilityResponse


# ==============================================================================
# Domain Enums
# ==============================================================================

class EventType(str, Enum):
    CYCLONE = "cyclone"
    FLOOD = "flood"
    STORM_SURGE = "storm_surge"
    TSUNAMI = "tsunami"


class EventStatus(str, Enum):
    FORMING = "forming"
    ACTIVE = "active"
    LANDFALL = "landfall"
    DECAYING = "decaying"
    RESOLVED = "resolved"


class CriticalityLevel(str, Enum):
    URGENT = "URGENT"
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class AssetStatus(str, Enum):
    OPERATIONAL = "operational"
    DEGRADED = "degraded"
    SUBMERGED = "submerged"
    OFFLINE = "offline"


class RoadStatus(str, Enum):
    PASSABLE = "CLEAR"
    CAUTION = "CAUTION"
    IMPASSABLE = "IMPASSABLE"


class AlertSeverity(str, Enum):
    RED = "RED"
    ORANGE = "ORANGE"
    YELLOW = "YELLOW"
    INFO = "INFO"


class DependencyType(str, Enum):
    POWER_SUPPLY = "POWER_SUPPLY"
    WATER_SUPPLY = "WATER_SUPPLY"
    ACCESS_ROAD = "ACCESS_ROAD"
    TELECOM_LINK = "TELECOM_LINK"


# ==============================================================================
# 1. Event
# ==============================================================================

class Event(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Unique event identifier, e.g. CYC_KARUNA_2026")
    name: str = Field(..., description="Official designated storm/event name")
    type: EventType = Field(EventType.CYCLONE, description="Type of natural hazard event")
    category: str = Field(..., description="Categorization (e.g. Extremely Severe Cyclonic Storm)")
    basin: str = Field(..., description="Oceanic basin (e.g. Bay of Bengal)")
    current_position: Tuple[float, float] = Field(..., description="[Latitude, Longitude]")
    bearing_deg: float = Field(..., ge=0, le=360, description="Direction of movement in degrees")
    forward_speed_kmh: float = Field(..., ge=0, description="Forward storm propagation speed in km/h")
    central_pressure_hpa: float = Field(..., ge=800, le=1050, description="Central atmospheric pressure in hPa")
    max_sustained_winds_kmh: float = Field(..., ge=0, description="1-minute sustained wind speed in km/h")
    gusts_kmh: float = Field(..., ge=0, description="Peak gust speed in km/h")
    rmw_km: float = Field(..., ge=0, description="Radius of maximum winds in km")
    landfall_eta_hours: float = Field(..., ge=0, description="Estimated hours remaining until coastal crossing")
    landfall_location: str = Field(..., description="Anticipated coastal crossing point")
    official_bulletin: str = Field(..., description="Issuing agency bulletin reference")
    bulletin_time: str = Field(..., description="Timestamp of official bulletin")
    status: EventStatus = Field(EventStatus.ACTIVE, description="Active status of event")


# ==============================================================================
# 2. Region
# ==============================================================================

class Region(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Unique administrative region ID, e.g. REG_GANJAM_COAST")
    name: str = Field(..., description="Region name, e.g. Ganjam Coastal Corridor")
    state: str = Field(..., description="Federal state, e.g. Odisha")
    country: str = Field(default="India", description="Country name")
    bounding_box: Tuple[float, float, float, float] = Field(
        ..., description="[MinLat, MinLon, MaxLat, MaxLon] in EPSG:4326"
    )
    centroid: Tuple[float, float] = Field(..., description="[Latitude, Longitude]")
    population: int = Field(..., ge=0, description="Total census population")
    area_sq_km: float = Field(..., ge=0, description="Geographic area in square kilometers")
    districts: List[str] = Field(default_factory=list, description="Districts covered in region")
    mandals: List[str] = Field(default_factory=list, description="Sub-districts/blocks covered")
    coastal_length_km: float = Field(..., ge=0, description="Coastline length in kilometers")
    critical_assets_count: int = Field(default=0, ge=0, description="Number of registered critical infrastructure nodes")


# ==============================================================================
# 3. Hazard
# ==============================================================================

class Hazard(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Unique hazard assessment ID")
    region_id: str = Field(..., description="Reference region ID")
    event_id: str = Field(..., description="Reference event ID")
    hazard_type: str = Field(..., description="Primary hazard (e.g. Storm Surge + Pluvial Flooding)")
    severity_level: CriticalityLevel = Field(..., description="Severity classification")
    peak_surge_m: float = Field(..., ge=0, description="Peak hydrodynamic storm surge in meters MSL")
    flood_depth_max_m: float = Field(..., ge=0, description="Maximum water depth in meters")
    flood_depth_avg_m: float = Field(..., ge=0, description="Average inundated water depth in meters")
    inundation_area_sq_km: float = Field(..., ge=0, description="Total inundated footprint in sq km")
    wind_speed_max_kmh: float = Field(..., ge=0, description="Maximum wind gust velocity in km/h")
    rainfall_24h_mm: float = Field(..., ge=0, description="24-hour cumulative rainfall in mm")
    high_tide_coincidence: bool = Field(default=False, description="Whether surge coincides with astronomical high tide")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Calculation timestamp")


# ==============================================================================
# 4. WeatherObservation
# ==============================================================================

class WeatherObservation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    station_id: str = Field(..., description="WMO or IMD weather station ID")
    station_name: str = Field(..., description="Meteorological station name")
    coordinates: Tuple[float, float] = Field(..., description="[Latitude, Longitude]")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Observation timestamp")
    wind_speed_kmh: float = Field(..., ge=0, description="Measured wind speed in km/h")
    wind_direction_deg: float = Field(..., ge=0, le=360, description="Wind azimuth in degrees")
    wind_gusts_kmh: float = Field(..., ge=0, description="Peak measured gust in km/h")
    barometric_pressure_hpa: float = Field(..., ge=800, le=1050, description="Station pressure in hPa")
    precipitation_rate_mmh: float = Field(..., ge=0, description="Rainfall rate in mm/hour")
    temperature_c: float = Field(..., description="Ambient temperature in Celsius")
    humidity_pct: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    data_source: str = Field(default="IMD Automatic Weather Station Network", description="Source network")


# ==============================================================================
# 5. SatelliteLayer
# ==============================================================================

class SatelliteLayer(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Satellite raster layer identifier")
    sensor_name: str = Field(..., description="Satellite sensor (e.g. Sentinel-1 SAR GRD, INSAT-3D)")
    acquisition_time: datetime = Field(..., description="Data capture timestamp")
    resolution_m: float = Field(..., ge=0, description="Ground sampling distance in meters")
    coverage_bbox: Tuple[float, float, float, float] = Field(..., description="[MinLat, MinLon, MaxLat, MaxLon]")
    band: str = Field(..., description="Spectral or polarization band (e.g. VV/VH, Thermal IR)")
    raster_url: str = Field(..., description="Tile service or COG URL")
    flood_mask_confidence: float = Field(..., ge=0, le=1.0, description="Otsu binarization confidence score")
    processing_level: str = Field(default="Level 1 GRD Surface Inundation Mask", description="Processing pipeline stage")


# ==============================================================================
# 6. InfrastructureAsset
# ==============================================================================

class InfrastructureAsset(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Asset identifier, e.g. INFRA_SUBSTATION_01")
    region_id: str = Field(..., description="Region ID")
    name: str = Field(..., description="Asset title, e.g. Chhatrapur 132kV Main Substation")
    type: str = Field(..., description="Asset category: substation, hospital, bridge, pumping_station, telecom")
    coordinates: Tuple[float, float] = Field(..., description="[Latitude, Longitude]")
    status: AssetStatus = Field(..., description="Current operational state")
    water_depth_m: float = Field(default=0.0, ge=0, description="Current flood immersion in meters")
    criticality: CriticalityLevel = Field(..., description="Systemic criticality classification")
    backup_power_hours: Optional[float] = Field(None, ge=0, description="Remaining backup generator battery hours")
    details: str = Field(..., description="Diagnostic notes and failure context")
    affected_population: int = Field(default=0, ge=0, description="Downstream population vulnerable if asset fails")


# ==============================================================================
# 7. RoadSegment
# ==============================================================================

class RoadSegment(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Road segment ID, e.g. ROAD_SH14_KM12")
    region_id: str = Field(..., description="Region ID")
    road_name: str = Field(..., description="Designated road name, e.g. State Highway 14")
    road_type: str = Field(..., description="Classification: national_highway, state_highway, ridge_road, arterial")
    start_coord: Tuple[float, float] = Field(..., description="Start [Lat, Lon]")
    end_coord: Tuple[float, float] = Field(..., description="End [Lat, Lon]")
    length_km: float = Field(..., ge=0, description="Length in kilometers")
    surface_elevation_m: float = Field(..., description="Average road crown elevation in meters MSL")
    status: RoadStatus = Field(..., description="Passability status")
    current_flood_depth_m: float = Field(default=0.0, ge=0, description="Inundation depth across carriageway")
    max_tolerable_depth_m: float = Field(default=0.30, ge=0, description="Vehicular stalling depth threshold")
    is_evacuation_corridor: bool = Field(default=False, description="Designated primary emergency evacuation route")


# ==============================================================================
# 8. Hospital
# ==============================================================================

class Hospital(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Hospital identifier")
    region_id: str = Field(..., description="Region ID")
    name: str = Field(..., description="Hospital facility name")
    coordinates: Tuple[float, float] = Field(..., description="[Latitude, Longitude]")
    total_beds: int = Field(..., ge=0, description="Total registered bed capacity")
    icu_beds: int = Field(..., ge=0, description="Total intensive care unit beds")
    occupied_icu_beds: int = Field(..., ge=0, description="Currently occupied ICU patients")
    emergency_capacity: int = Field(..., ge=0, description="Surge triage beds available")
    power_status: str = Field(..., description="Primary grid vs diesel generator status")
    generator_fuel_remaining_hours: float = Field(..., ge=0, description="Remaining diesel autonomy in hours")
    generator_capacity_kva: float = Field(..., ge=0, description="Rated generator output in kVA")
    oxygen_reserve_hours: float = Field(..., ge=0, description="Liquid medical oxygen supply duration")
    flood_depth_m: float = Field(default=0.0, ge=0, description="Compound ingress depth in meters")
    operational_status: AssetStatus = Field(..., description="Overall triage operational capability")


# ==============================================================================
# 9. Shelter
# ==============================================================================

class Shelter(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Shelter facility ID, e.g. SHELTER_KALYANPUR")
    region_id: str = Field(..., description="Region ID")
    name: str = Field(..., description="Designated cyclone shelter name")
    coordinates: Tuple[float, float] = Field(..., description="[Latitude, Longitude]")
    certified_capacity: int = Field(..., ge=0, description="Verified disaster occupant capacity")
    current_occupancy: int = Field(..., ge=0, description="Current individuals sheltered")
    plinth_elevation_m: float = Field(..., description="Building ground plinth elevation MSL")
    clearance_margin_m: float = Field(..., description="Safety margin above calculated surge level")
    topsisScore: float = Field(..., ge=0.0, le=1.0, description="Multi-criteria TOPSIS suitability index")
    has_power: bool = Field(default=True, description="Electrical availability")
    has_water: bool = Field(default=True, description="Potable water tank storage")
    has_medical: bool = Field(default=True, description="First-aid medical detachment stationed")
    road_status: RoadStatus = Field(..., description="Accessibility status of access road")
    district: str = Field(..., description="Administrative district")


# ==============================================================================
# 10. PopulationZone
# ==============================================================================

class PopulationZone(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Zone identifier, e.g. ZONE_ARJIPALLI_01")
    region_id: str = Field(..., description="Region ID")
    zone_name: str = Field(..., description="Locality or Gram Panchayat name")
    coordinates: Tuple[float, float] = Field(..., description="Center [Lat, Lon]")
    total_population: int = Field(..., ge=0, description="Total resident count")
    infants_under_5: int = Field(..., ge=0, description="Children under 5 years")
    elderly_over_65: int = Field(..., ge=0, description="Seniors over 65 years")
    persons_with_disability: int = Field(default=0, ge=0, description="Persons with physical mobility limitations")
    kutcha_structures: int = Field(..., ge=0, description="Thatch/mud non-engineered dwellings")
    pucca_structures: int = Field(..., ge=0, description="Reinforced concrete engineered structures")
    livestock_count: int = Field(..., ge=0, description="Cattle, sheep, goats registered in sector")
    median_household_income_inr: float = Field(default=45000.0, ge=0, description="Annual median household income")


# ==============================================================================
# 11. VulnerabilityProfile
# ==============================================================================

class VulnerabilityProfile(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Profile ID")
    zone_id: str = Field(..., description="Reference population zone ID")
    region_id: str = Field(..., description="Region ID")
    physical_vulnerability: float = Field(..., ge=0, le=100, description="Elevation & housing fragility index")
    socio_demographic_vulnerability: float = Field(..., ge=0, le=100, description="Age & economic coping index")
    infrastructure_isolation_risk: float = Field(..., ge=0, le=100, description="Road cut-off and power failure risk")
    coping_capacity: float = Field(..., ge=0, le=100, description="Local emergency preparedness capacity")
    composite_vulnerability_index: float = Field(..., ge=0, le=100, description="Aggregated vulnerability score")
    primary_drivers: List[str] = Field(default_factory=list, description="Top fragility contributing factors")


# ==============================================================================
# 12. EvacuationRoute
# ==============================================================================

class EvacuationRoute(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Route ID, e.g. ROUTE_ARJIPALLI_TO_KALYANPUR")
    region_id: str = Field(..., description="Region ID")
    route_name: str = Field(..., description="Descriptive corridor label")
    origin: Tuple[float, float] = Field(..., description="Origin [Lat, Lon]")
    destination_shelter_id: str = Field(..., description="Target shelter ID")
    distance_km: float = Field(..., ge=0, description="Total distance in kilometers")
    estimated_transit_time_min: float = Field(..., ge=0, description="Travel duration under weather conditions")
    clearance_window_hours: float = Field(..., ge=0, description="Time remaining before surge blocks route")
    min_elevation_m: float = Field(..., description="Lowest topographic elevation point on road")
    max_flood_depth_m: float = Field(default=0.0, ge=0, description="Peak anticipated inundation depth")
    is_viable: bool = Field(..., description="Whether route is passable for transit buses")
    waypoint_coordinates: List[Tuple[float, float]] = Field(default_factory=list, description="Route line vertices")
    recommended_transport_mode: str = Field(default="BUS", description="BUS, HIGH_CLEARANCE_TRUCK, or BOAT")


# ==============================================================================
# 13. Resource
# ==============================================================================

class Resource(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Resource identifier, e.g. RES_NDRF_BOATS_01")
    region_id: str = Field(..., description="Region ID")
    resource_type: str = Field(..., description="Type: rescue_boats, evacuation_buses, diesel_tanker, food_packets")
    current_location: str = Field(..., description="Depot or sector location name")
    quantity: int = Field(..., ge=0, description="Total physical units")
    unit: str = Field(..., description="Unit of measurement (e.g. boats, buses, liters, kits)")
    status: str = Field(..., description="available, deployed, in_transit, exhausted")
    assigned_to_action_id: Optional[str] = Field(None, description="Action order ID if deployed")


# ==============================================================================
# 14. Alert
# ==============================================================================

class Alert(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Broadcast alert ID, e.g. ALERT_SH14_CUT_01")
    region_id: str = Field(..., description="Region ID")
    event_id: str = Field(..., description="Event ID")
    severity: AlertSeverity = Field(..., description="Alert urgency tier")
    title: str = Field(..., description="Concise advisory headline")
    message_en: str = Field(..., description="English alert broadcast text")
    message_od: str = Field(..., description="Verified Odia translation")
    message_te: str = Field(..., description="Verified Telugu translation")
    message_hi: str = Field(..., description="Verified Hindi translation")
    target_zones: List[str] = Field(default_factory=list, description="Targeted vulnerable communities")
    effective_until: datetime = Field(..., description="Expiry timestamp")
    verified_hash: str = Field(..., description="Cryptographic SHA-256 integrity hash")
    verification_level: str = Field(default="LEVEL_1_VERIFIED", description="Safety guardrail audit level")
    issued_by: str = Field(default="PRALAYA Disaster Mission Control", description="Issuing authority")


# ==============================================================================
# 15. SimulationScenario
# ==============================================================================

class SimulationScenario(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Scenario identifier")
    name: str = Field(..., description="Scenario designation")
    description: str = Field(..., description="Contextual hypothesis")
    baseline_event_id: str = Field(..., description="Reference event ID")
    surge_shock_m: float = Field(default=0.0, ge=0, description="Simulated surge elevation increment in meters")
    rainfall_shock_mm: float = Field(default=0.0, ge=0, description="Simulated rainfall shock increment in mm")
    high_tide_coincident: bool = Field(default=False, description="Astronomical high tide alignment")
    grid_blackout_triggered: bool = Field(default=False, description="Full regional electrical grid tripping")
    simulated_exposed_pop: int = Field(..., ge=0, description="Resulting vulnerable population count")
    simulated_risk_index: float = Field(..., ge=0, le=100, description="Resulting composite risk score")
    delta_shelters_compromised: int = Field(default=0, ge=0, description="Additional shelters cut off by water")


# ==============================================================================
# 16. RiskAssessment
# ==============================================================================

class RiskAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Risk assessment ID")
    region_id: str = Field(..., description="Region ID")
    event_id: str = Field(..., description="Event ID")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Evaluation timestamp")
    composite_risk_index: float = Field(..., ge=0, le=100, description="Overall risk metric 0-100")
    risk_level: str = Field(..., description="LOW, MODERATE, HIGH, EXTREME")
    total_exposed_population: int = Field(..., ge=0, description="Total people in danger zone")
    economic_exposure_cr_inr: float = Field(..., ge=0, description="Economic asset exposure in Crores INR")
    livestock_at_risk: int = Field(..., ge=0, description="Livestock count exposed to flood")
    infant_exposure: int = Field(..., ge=0, description="Infants under 5 exposed")
    elderly_exposure: int = Field(..., ge=0, description="Elderly 65+ exposed")
    kutcha_dwelling_exposure: int = Field(..., ge=0, description="Thatched/unreinforced homes in path")
    factor_breakdown: Dict[str, float] = Field(default_factory=dict, description="Component risk contributions")


# ==============================================================================
# 17. FailureNode
# ==============================================================================

class FailureNode(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Graph node identifier")
    asset_id: str = Field(..., description="Mapped physical asset ID")
    asset_name: str = Field(..., description="Asset name")
    asset_type: str = Field(..., description="substation, hospital, pump_station, telecom")
    failure_probability: float = Field(..., ge=0, le=1.0, description="Probability of imminent shutdown")
    current_state: str = Field(..., description="HEALTHY, VULNERABLE, FAILED")
    time_to_failure_hours: Optional[float] = Field(None, ge=0, description="Estimated time until complete cutoff")
    backup_depletion_hours: Optional[float] = Field(None, ge=0, description="Remaining backup operational reserve")
    critical_services_impacted: List[str] = Field(default_factory=list, description="Downstream services severed")


# ==============================================================================
# 18. FailureEdge
# ==============================================================================

class FailureEdge(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Directed graph dependency edge ID")
    source_node_id: str = Field(..., description="Source node whose failure triggers target")
    target_node_id: str = Field(..., description="Target node dependent on source")
    dependency_type: DependencyType = Field(..., description="Type of physical/functional dependency")
    propagation_delay_min: int = Field(default=0, ge=0, description="Minutes between source failure and target impact")
    cascade_criticality: CriticalityLevel = Field(..., description="Criticality of the linkage")


# ==============================================================================
# Action Recommendation Schema (Used for /actions/{region_id})
# ==============================================================================

class ActionRecommendation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Action directive ID, e.g. REC_01")
    priority: CriticalityLevel = Field(..., description="Priority tier: URGENT, HIGH, MEDIUM")
    title: str = Field(..., description="Action directive title")
    action_text: str = Field(..., description="Action instructions")
    deadline_hours: float = Field(..., ge=0, description="Deadline in hours")
    target_mandal: str = Field(..., description="Sector / Mandal name")
    impact_metric: str = Field(..., description="Quantified lives or services preserved")
    status: str = Field(default="PENDING", description="PENDING, DISPATCHED, COMPLETED")
