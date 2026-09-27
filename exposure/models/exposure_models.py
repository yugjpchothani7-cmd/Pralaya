"""
PRALAYA Exposure Engine - Models
Strongly-typed schemas for multi-sector disaster exposure assessment by geographic zone.
Every metric maintains explicit source traceability and provenance metadata.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field, ConfigDict

from risk.models.hazard_outputs import HazardLevel


class ExposureSeverity(str, Enum):
    """Categorical exposure severity classification."""
    MINIMAL = "MINIMAL"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ExposureSourceTrace(BaseModel):
    """Traceability provenance linking an exposure datum to its authoritative registry or sensor source."""
    model_config = ConfigDict(extra="forbid")

    source_name: str = Field(..., description="Authoritative dataset or sensor name")
    agency: str = Field(..., description="Originating agency or institution (e.g. WorldPop, OSDMA, OPTCL, NHM)")
    dataset_version: str = Field(..., description="Release version or ingestion run ID")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Observation or census timestamp"
    )
    resolution: str = Field(..., description="Spatial or administrative resolution (e.g. 100m raster, asset-level, village-level)")
    confidence: float = Field(default=0.95, ge=0.0, le=1.0, description="Confidence in asset geo-location and attribute fidelity")
    license_or_citation: str = Field(..., description="Official citation or data license")


class DemographicExposedBreakdown(BaseModel):
    """Vulnerable demographic segments within exposed population."""
    model_config = ConfigDict(extra="forbid")

    total_population: int = Field(..., ge=0, description="Total resident population within zone")
    population_exposed: int = Field(..., ge=0, description="Population directly intersecting flood/surge hazard buffer")
    exposure_percentage: float = Field(..., ge=0.0, le=100.0, description="Percentage of zone population exposed")
    population_density_per_sq_km: float = Field(..., ge=0.0, description="Population density")
    infants_under_5: int = Field(..., ge=0, description="Children under 5 years requiring emergency nutrition/pediatric care")
    elderly_over_65: int = Field(..., ge=0, description="Geriatric residents with limited independent mobility")
    persons_with_disability: int = Field(..., ge=0, description="Residents requiring specialized accessible evacuation transport")
    kutcha_mud_housing_units: int = Field(..., ge=0, description="Thatch/mud structures susceptible to cyclone wind/water collapse")
    pucca_concrete_units: int = Field(..., ge=0, description="Reinforced concrete housing units")
    livestock_count: int = Field(..., ge=0, description="Bovine, caprine, and draft animals requiring high-ground corraling")
    source_trace: ExposureSourceTrace = Field(..., description="Demographic source traceability")


class HospitalExposureDetail(BaseModel):
    """Hospital facility exposure and operational status."""
    model_config = ConfigDict(extra="forbid")

    facility_id: str = Field(..., description="Unique hospital ID")
    name: str = Field(..., description="Facility name")
    facility_type: str = Field(..., description="DISTRICT_HEADQUARTERS | COMMUNITY_HEALTH_CENTRE | PRIMARY_HEALTH_CENTRE")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    total_beds: int = Field(..., ge=0)
    icu_beds: int = Field(..., ge=0)
    oxygen_plant_type: str = Field(..., description="PSA_ON_SITE | CYLINDER_MANIFOLD | LIQUID_MEDICAL_O2")
    plinth_elevation_m: float = Field(..., description="Floor plinth elevation in meters MSL")
    flood_depth_m: float = Field(default=0.0, ge=0.0, description="Simulated inundation depth at facility")
    backup_power_generator: bool = Field(default=True)
    generator_fuel_hours: float = Field(..., ge=0.0, description="Diesel fuel operational hours remaining")
    status: str = Field(..., description="OPERATIONAL | AT_RISK | DEGRADED | SUBMERGED")
    access_road_passable: bool = Field(default=True)
    source_trace: ExposureSourceTrace = Field(..., description="Health ministry registry source trace")


class ShelterExposureDetail(BaseModel):
    """Cyclone shelter network exposure and occupancy metrics."""
    model_config = ConfigDict(extra="forbid")

    shelter_id: str = Field(..., description="Unique shelter ID")
    name: str = Field(..., description="Designated cyclone shelter name")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    certified_capacity: int = Field(..., ge=0)
    current_occupancy: int = Field(..., ge=0)
    available_capacity: int = Field(..., ge=0)
    plinth_elevation_m: float = Field(..., description="Finished floor elevation MSL")
    clearance_margin_m: float = Field(..., description="Clearance margin above flood/surge peak")
    topsis_score: float = Field(..., ge=0.0, le=1.0, description="Multi-criteria suitability score")
    potable_water_days: float = Field(..., ge=0.0)
    dg_set_functional: bool = Field(default=True)
    sanitation_facilities_count: int = Field(..., ge=0)
    status: str = Field(..., description="CERTIFIED_SAFE | AT_CAPACITY | ENDANGERED | ISOLATED")
    source_trace: ExposureSourceTrace = Field(..., description="OSDMA Shelter registry source trace")


class RoadSegmentExposureDetail(BaseModel):
    """Transportation road segment exposure."""
    model_config = ConfigDict(extra="forbid")

    segment_id: str = Field(..., description="Road segment identifier")
    name: str = Field(..., description="Highway or corridor name, e.g. NH-16, SH-14")
    road_class: str = Field(..., description="NATIONAL_HIGHWAY | STATE_HIGHWAY | MAJOR_DISTRICT_ROAD | RURAL_ROAD")
    length_km: float = Field(..., ge=0.0)
    submerged_length_km: float = Field(..., ge=0.0)
    max_flood_depth_m: float = Field(..., ge=0.0)
    is_bridge: bool = Field(default=False)
    bridge_name: Optional[str] = Field(None)
    bridge_clearance_m: Optional[float] = Field(None)
    passable: bool = Field(default=True)
    evacuation_corridor: bool = Field(default=False, description="Designated arterial evacuation lifeline")
    source_trace: ExposureSourceTrace = Field(..., description="Highways GIS source trace")


class PowerAssetExposureDetail(BaseModel):
    """Electrical power grid and substation exposure."""
    model_config = ConfigDict(extra="forbid")

    asset_id: str = Field(..., description="Substation or feeder ID")
    name: str = Field(..., description="Substation name, e.g. Chatrapur 132/33kV")
    voltage_kv: float = Field(..., ge=0.0, description="Voltage level (e.g. 220kV, 132kV, 33kV)")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    plinth_elevation_m: float = Field(..., description="Switchyard ground elevation MSL")
    flood_depth_m: float = Field(default=0.0, ge=0.0)
    status: str = Field(..., description="ONLINE | DEGRADED | SUBMERGED | ISOLATED_SAFETY_SHUTDOWN")
    transformer_count: int = Field(..., ge=1)
    downstream_population_served: int = Field(..., ge=0)
    feeder_lines_at_risk: int = Field(default=0, ge=0)
    source_trace: ExposureSourceTrace = Field(..., description="Power transmission GIS trace")


class CommunicationAssetExposureDetail(BaseModel):
    """Telecom and emergency radio communication asset exposure."""
    model_config = ConfigDict(extra="forbid")

    asset_id: str = Field(..., description="Tower or repeater ID")
    name: str = Field(..., description="Tower site name")
    asset_type: str = Field(..., description="CELLULAR_TOWER_4G_5G | VHF_POLICE_REPEATER | SATCOM_TERMINAL")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    tower_height_m: float = Field(..., ge=0.0)
    wind_load_rating_kmh: float = Field(..., ge=0.0)
    battery_backup_hours: float = Field(..., ge=0.0)
    status: str = Field(..., description="OPERATIONAL | BATTERY_BACKUP | STRUCTURAL_RISK | OFFLINE")
    source_trace: ExposureSourceTrace = Field(..., description="Telecom registry source trace")


class EmergencyFacilityExposureDetail(BaseModel):
    """First responder bases and rescue staging facilities."""
    model_config = ConfigDict(extra="forbid")

    facility_id: str = Field(..., description="Emergency facility ID")
    name: str = Field(..., description="Unit name, e.g. ODRAF 3rd Battalion Base")
    facility_type: str = Field(..., description="ODRAF_BASE | NDRF_STAGING_CAMP | FIRE_STATION | COAST_GUARD_POST")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    personnel_count: int = Field(..., ge=0)
    inflatable_boats: int = Field(..., ge=0)
    heavy_amphibious_vehicles: int = Field(..., ge=0)
    satellite_phones_count: int = Field(..., ge=0)
    status: str = Field(..., description="ACTIVE_DEPLOYED | STANDBY | MARGINALLY_INUNDATED | OPERATIONAL")
    source_trace: ExposureSourceTrace = Field(..., description="Disaster response command trace")


class GeographicZoneExposure(BaseModel):
    """
    Comprehensive multi-sector exposure record for a single discrete geographic zone.
    Produces all mandated outputs:
    population_exposed, critical_facilities_exposed, road_segments_exposed,
    power_assets_exposed, hospital_exposure, shelter_exposure.
    """
    model_config = ConfigDict(extra="forbid")

    zone_id: str = Field(..., description="Unique zone identifier (e.g. ZONE_GOPALPUR_COAST)")
    zone_name: str = Field(..., description="Descriptive geographic name (e.g. Gopalpur Coastal Shoreline Strip)")
    bounding_box: Tuple[float, float, float, float] = Field(
        ..., description="[min_lon, min_lat, max_lon, max_lat]"
    )
    polygon_coordinates: List[List[Tuple[float, float]]] = Field(
        ..., description="Geospatial polygon boundary coordinates"
    )
    elevation_mean_m: float = Field(..., description="Mean elevation above sea level in meters")
    coastal_distance_km: float = Field(..., ge=0.0, description="Mean distance to coastline in km")

    # Local hazard level intersecting this zone
    hazard_level: HazardLevel = Field(..., description="Predominant hazard severity tier")
    hazard_score: float = Field(..., ge=0.0, le=1.0, description="Mean compound hazard score [0.0, 1.0]")
    peak_surge_depth_m: float = Field(..., ge=0.0, description="Simulated peak storm surge depth")
    rainfall_rate_mm_h: float = Field(..., ge=0.0, description="Local precipitation rate")

    # Mandated Phase 6 exposure deliverables
    population_exposed: DemographicExposedBreakdown = Field(
        ..., description="Demographic exposure breakdown"
    )
    critical_facilities_exposed: List[Dict[str, Any]] = Field(
        ..., description="Aggregated list of all exposed critical infrastructure sites"
    )
    road_segments_exposed: List[RoadSegmentExposureDetail] = Field(
        ..., description="Highways, arterial roads, and bridges exposed"
    )
    power_assets_exposed: List[PowerAssetExposureDetail] = Field(
        ..., description="Substations and transmission corridors exposed"
    )
    hospital_exposure: List[HospitalExposureDetail] = Field(
        ..., description="Hospitals and health facilities exposed"
    )
    shelter_exposure: List[ShelterExposureDetail] = Field(
        ..., description="Designated cyclone shelters evaluated"
    )
    communication_assets_exposed: List[CommunicationAssetExposureDetail] = Field(
        default_factory=list, description="Telecom towers and radio repeaters"
    )
    emergency_facilities_exposed: List[EmergencyFacilityExposureDetail] = Field(
        default_factory=list, description="Fire stations, ODRAF bases, NDRF staging sites"
    )

    # Key aggregated counts for fast KPI display
    total_critical_facilities_count: int = Field(..., ge=0)
    severed_road_km: float = Field(..., ge=0.0)
    unusable_shelter_count: int = Field(..., ge=0)
    degraded_power_assets_count: int = Field(..., ge=0)
    overall_exposure_severity: ExposureSeverity = Field(...)


# Sector summaries for the 6 Exposure Panel sections
class PopulationSectorSummary(BaseModel):
    """Aggregate population exposure across all zones."""
    total_population: int = Field(..., ge=0)
    total_exposed: int = Field(..., ge=0)
    total_infants_under_5: int = Field(..., ge=0)
    total_elderly_over_65: int = Field(..., ge=0)
    total_kutcha_units: int = Field(..., ge=0)
    total_livestock: int = Field(..., ge=0)
    source_attribution: str = Field(default="Census of India 2021 Project / WorldPop 100m High-Resolution Mosaics")


class InfrastructureSectorSummary(BaseModel):
    """Aggregate critical infrastructure exposure."""
    total_critical_assets: int = Field(..., ge=0)
    submerged_assets_count: int = Field(..., ge=0)
    degraded_assets_count: int = Field(..., ge=0)
    bridges_at_risk_count: int = Field(..., ge=0)
    source_attribution: str = Field(default="OSDMA State Disaster Infrastructure Registry / National Informatics Centre")


class MedicalSectorSummary(BaseModel):
    """Aggregate medical care system exposure."""
    total_hospitals: int = Field(..., ge=0)
    total_beds: int = Field(..., ge=0)
    total_icu_beds: int = Field(..., ge=0)
    hospitals_at_risk: int = Field(..., ge=0)
    oxygen_plants_compromised: int = Field(..., ge=0)
    source_attribution: str = Field(default="National Health Mission (NHM) Health Facility Registry (HFR)")


class TransportationSectorSummary(BaseModel):
    """Aggregate road and transportation network exposure."""
    total_road_km: float = Field(..., ge=0.0)
    severed_road_km: float = Field(..., ge=0.0)
    passable_corridors_km: float = Field(..., ge=0.0)
    impassable_bridges_count: int = Field(..., ge=0)
    source_attribution: str = Field(default="NHAI National Highway GIS / PMGSY Rural Connectivity Database")


class EnergySectorSummary(BaseModel):
    """Aggregate power grid exposure."""
    total_substations: int = Field(..., ge=0)
    submerged_substations: int = Field(..., ge=0)
    total_population_at_blackout_risk: int = Field(..., ge=0)
    feeder_lines_tripped: int = Field(..., ge=0)
    source_attribution: str = Field(default="OPTCL State Transmission Grid GIS / Discom Feeder Supervisory Network")


class EmergencyResourcesSectorSummary(BaseModel):
    """Aggregate first-responder and shelter capacity."""
    total_certified_shelters: int = Field(..., ge=0)
    functional_shelters: int = Field(..., ge=0)
    total_shelter_capacity: int = Field(..., ge=0)
    current_shelter_occupancy: int = Field(..., ge=0)
    rescue_boats_deployed: int = Field(..., ge=0)
    odraf_ndrf_personnel_active: int = Field(..., ge=0)
    source_attribution: str = Field(default="ODRAF / NDRF 3rd Battalion Incident Command / OSDMA Emergency Operations")


class RegionalExposureAssessment(BaseModel):
    """Complete multi-zone exposure assessment model for the entire Region of Interest."""
    model_config = ConfigDict(extra="forbid")

    assessment_id: str = Field(..., description="Unique run identifier")
    region_id: str = Field(..., description="Target region ID")
    region_name: str = Field(..., description="Human readable region name")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Assessment generation timestamp"
    )
    hazard_scenario: str = Field(..., description="Coupled cyclone-flood hazard scenario identifier")
    total_zones: int = Field(..., ge=1)
    zones: List[GeographicZoneExposure] = Field(..., description="List of per-zone detailed exposure records")

    # Sector Summaries (Population, Infrastructure, Medical, Transportation, Energy, Emergency resources)
    sector_population: PopulationSectorSummary = Field(...)
    sector_infrastructure: InfrastructureSectorSummary = Field(...)
    sector_medical: MedicalSectorSummary = Field(...)
    sector_transportation: TransportationSectorSummary = Field(...)
    sector_energy: EnergySectorSummary = Field(...)
    sector_emergency_resources: EmergencyResourcesSectorSummary = Field(...)

    # GeoJSON FeatureCollection of Zone Polygons for direct map vector layers
    geojson_features: Dict[str, Any] = Field(
        default_factory=dict, description="GeoJSON FeatureCollection representing exposure zone boundaries"
    )
