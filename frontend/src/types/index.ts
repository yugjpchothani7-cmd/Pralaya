/**
 * PRALAYA Frontend Type Definitions
 * Strictly matches backend Pydantic schemas.
 */

export interface ProvenanceMetadata {
  source_id: string;
  source_authority: string;
  verification_level: string;
  fetched_at: string;
  dataset: string;
  processing_stage: string;
  model_version: string;
  classification: 'OBSERVED' | 'MODELED' | 'SIMULATED';
  confidence_score?: number;
  uncertainty?: number;
  is_synthetic_simulation?: boolean;
}

export interface ServiceComponentStatus {
  status: string;
  latency_ms: number;
  details: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  project_name: string;
  version: string;
  environment: string;
  uptime_seconds?: number;
  services?: Record<string, ServiceComponentStatus>;
  principles?: Record<string, boolean>;
}

export interface CycloneLocation {
  center_lat: number;
  center_lon: number;
  central_pressure_hpa: number;
  max_sustained_wind_kmh: number;
  gusts_kmh: number;
  movement_speed_kmh: number;
  bearing_deg: number;
  landfall_eta: string;
}

export interface ImpactSummary {
  population_in_danger_zone: number;
  evacuation_completed_count: number;
  evacuation_progress_pct: number;
  submerged_area_sqkm: number;
  critical_assets_at_risk_count: number;
  active_shelters_count: number;
  shelter_total_capacity: number;
  shelter_current_occupancy: number;
}

export interface SituationSummaryResponse {
  event_id: string;
  name: string;
  category: string;
  current_status: CycloneLocation;
  impact_summary: ImpactSummary;
  provenance: ProvenanceMetadata;
}

export interface ShelterItem {
  shelter_id: string;
  name: string;
  topsis_score: number;
  coordinates: [number, number];
  distance_km: number;
  capacity: {
    certified: number;
    current_occupancy: number;
    available_capacity: number;
    occupancy_pct: number;
  };
  resilience: {
    plinth_elevation_m: number;
    clearance_margin_m: number;
    has_backup_generator: boolean;
    has_potable_ro_plant: boolean;
    medical_staff_present: boolean;
  };
  corridor_status: string;
}

export interface ShelterListResponse {
  candidate_count: number;
  ranked_shelters: ShelterItem[];
  provenance: ProvenanceMetadata;
}

export interface TurnByTurnStep {
  step: number;
  instruction: string;
  distance_m: number;
  flood_depth_m: number;
}

export interface RoutingPlanResponse {
  route_id: string;
  status: string;
  metrics: {
    total_distance_km: number;
    estimated_travel_time_minutes: number;
    max_flood_depth_on_path_m: number;
    safe_clearance_window_hours: number;
  };
  turn_by_turn: TurnByTurnStep[];
  transport_mode: string;
  provenance: ProvenanceMetadata;
}

export type ActiveTab = 'situation' | 'shelters' | 'routing' | 'health';

// ==============================================================================
// Phase 3 Backend Integration Types
// ==============================================================================

export interface BackendEvent {
  id: string;
  name: string;
  type: string;
  category: string;
  basin: string;
  current_position: [number, number];
  bearing_deg: number;
  forward_speed_kmh: number;
  central_pressure_hpa: number;
  max_sustained_winds_kmh: number;
  gusts_kmh: number;
  rmw_km: number;
  landfall_eta_hours: number;
  landfall_location: string;
  official_bulletin: string;
  bulletin_time: string;
  status: string;
}

export interface BackendRegion {
  id: string;
  name: string;
  state: string;
  country: string;
  bounding_box: [number, number, number, number];
  centroid: [number, number];
  population: number;
  area_sq_km: number;
  districts: string[];
  mandals: string[];
  coastal_length_km: number;
  critical_assets_count: number;
}

export interface BackendHazardResponse {
  region_id: string;
  hazard: {
    id: string;
    peak_surge_m: number;
    flood_depth_max_m: number;
    flood_depth_avg_m: number;
    inundation_area_sq_km: number;
    wind_speed_max_kmh: number;
    rainfall_24h_mm: number;
    high_tide_coincidence: boolean;
  };
  weather_observations: Array<{
    station_id: string;
    station_name: string;
    wind_speed_kmh: number;
    barometric_pressure_hpa: number;
  }>;
  satellite_layers: Array<{
    id: string;
    sensor_name: string;
    flood_mask_confidence: number;
  }>;
}

export interface BackendExposureResponse {
  region_id: string;
  region_name: string;
  total_exposed_population: number;
  demographic_breakdown: {
    infants_under_5: number;
    elderly_over_65: number;
    kutcha_structures: number;
    livestock_count: number;
  };
  vulnerability_profile: {
    composite_vulnerability_index: number;
    primary_drivers: string[];
  };
}

export interface BackendInfrastructureResponse {
  region_id: string;
  total_assets: number;
  submerged_assets_count: number;
  degraded_assets_count: number;
  assets: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    water_depth_m: number;
    criticality: string;
  }>;
  hospitals: Array<{
    id: string;
    name: string;
    icu_beds: number;
    generator_fuel_remaining_hours: number;
  }>;
  failure_cascade: {
    nodes: Array<{
      id: string;
      asset_name: string;
      current_state: string;
    }>;
    edges: Array<{
      id: string;
      dependency_type: string;
    }>;
  };
}

export interface BackendSheltersResponse {
  region_id: string;
  total_shelters: number;
  total_capacity: number;
  total_occupancy: number;
  available_capacity: number;
  system_utilization_pct: number;
  shelters: Array<{
    id: string;
    name: string;
    certified_capacity: number;
    current_occupancy: number;
    topsisScore: number;
    road_status: string;
  }>;
}

export interface BackendRoutesResponse {
  region_id: string;
  total_routes_evaluated: number;
  viable_corridors: Array<{
    id: string;
    route_name: string;
    distance_km: number;
    is_viable: boolean;
  }>;
  rejected_corridors: Array<{
    id: string;
    route_name: string;
    max_flood_depth_m: number;
    is_viable: boolean;
  }>;
}

export interface BackendRiskResponse {
  id: string;
  region_id: string;
  composite_risk_index: number;
  risk_level: string;
  total_exposed_population: number;
  economic_exposure_cr_inr: number;
  livestock_at_risk: number;
  infant_exposure: number;
  elderly_exposure: number;
  kutcha_dwelling_exposure: number;
}

export interface BackendActionsResponse {
  region_id: string;
  total_actions: number;
  action_recommendations: Array<{
    id: string;
    priority: string;
    title: string;
    action_text: string;
    deadline_hours: number;
  }>;
  active_alerts: Array<{
    id: string;
    severity: string;
    title: string;
    message_en: string;
    message_od: string;
  }>;
}

export type GeospatialLayerType =
  | 'elevation'
  | 'satellite_sar'
  | 'satellite_optical'
  | 'rainfall'
  | 'surface_water'
  | 'land_cover'
  | 'temporal_comparison';

export interface GeospatialLayerMetadata {
  layer_id: string;
  layer_type: GeospatialLayerType;
  name: string;
  description: string;
  timestamp: string;
  temporal_range?: [string, string];
  source_dataset: string;
  source_attribution: string;
  resolution_meters: number;
  bands: string[];
  units?: string;
  min_value?: number;
  max_value?: number;
  palette?: string[];
  tile_url_template?: string;
  vector_geojson?: Record<string, unknown>;
  statistics: Record<string, unknown>;
  is_live_gee: boolean;
  cache_hit: boolean;
  provenance_hash: string;
}

export interface TemporalComparisonResult {
  comparison_id: string;
  roi_id: string;
  sensor_name: string;
  baseline_window: [string, string];
  event_window: [string, string];
  baseline_layer_id: string;
  event_layer_id: string;
  baseline_water_area_sq_km: number;
  event_water_area_sq_km: number;
  newly_submerged_area_sq_km: number;
  receded_area_sq_km: number;
  delta_percentage: number;
  significant_change_detected: boolean;
  difference_tile_url?: string;
  difference_geojson?: Record<string, unknown>;
  timestamp: string;
  source_attribution: string;
  is_live_gee: boolean;
  provenance_hash: string;
}

export interface GeospatialStatusResponse {
  primary_gee_available: boolean;
  active_provider_mode: string;
  cache_size: number;
  cache_hits: number;
  cache_misses: number;
  fallback_invocations: number;
  supported_regions: string[];
}

// Phase 5 Deterministic Hazard Engine Types
export type HazardLevelType = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'CATASTROPHIC';

export interface ComponentHazardOutput {
  component_name: string;
  value: number;
  normalized_score: number;
  hazard_level: HazardLevelType;
  unit: string;
  timestamp: string;
  source: string;
  model_version: string;
  confidence: number;
  uncertainty_range: [number, number];
  details: Record<string, unknown>;
}

export interface HazardExplanation {
  hazard_level: string;
  primary_drivers: string[];
  contributing_factors: string[];
  timestamp: string;
  sources: string[];
}

export interface GeospatialHazardCell {
  cell_id: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  coastal_proximity_m: number;
  rainfall_hazard: ComponentHazardOutput;
  wind_hazard: ComponentHazardOutput;
  surge_hazard: ComponentHazardOutput;
  flood_exposure: ComponentHazardOutput;
  combined_hazard: ComponentHazardOutput;
  explanation: HazardExplanation;
}

export interface GeospatialHazardSurface {
  surface_id: string;
  region_id: string;
  timestamp: string;
  grid_resolution_km: number;
  model_version: string;
  total_cells: number;
  cells: GeospatialHazardCell[];
  mean_hazard_score: number;
  max_hazard_score: number;
  overall_hazard_level: HazardLevelType;
  high_hazard_area_pct: number;
  geojson_features: {
    type: string;
    features: Array<{
      type: string;
      id: string;
      geometry: {
        type: string;
        coordinates: number[][][];
      };
      properties: {
        cell_id: string;
        latitude: number;
        longitude: number;
        hazard_level: HazardLevelType;
        combined_score: number;
        surge_depth_m: number;
        surge_score: number;
        rainfall_rate_mm_h: number;
        rainfall_score: number;
        wind_speed_kmh: number;
        wind_score: number;
        elevation_m: number;
        coastal_distance_km: number;
        primary_driver: string;
      };
    }>;
  };
  regional_explanation: HazardExplanation;
}

// ==============================================================================
// Phase 6 Exposure Engine Types
// ==============================================================================

export type ExposureSeverityType = 'MINIMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ExposureSourceTrace {
  source_name: string;
  agency: string;
  dataset_version: string;
  timestamp: string;
  resolution: string;
  confidence: number;
  license_or_citation: string;
}

export interface DemographicExposedBreakdown {
  total_population: number;
  population_exposed: number;
  exposure_percentage: number;
  population_density_per_sq_km: number;
  infants_under_5: number;
  elderly_over_65: number;
  persons_with_disability: number;
  kutcha_mud_housing_units: number;
  pucca_concrete_units: number;
  livestock_count: number;
  source_trace: ExposureSourceTrace;
}

export interface HospitalExposureDetail {
  facility_id: string;
  name: string;
  facility_type: string;
  latitude: number;
  longitude: number;
  total_beds: number;
  icu_beds: number;
  oxygen_plant_type: string;
  plinth_elevation_m: number;
  flood_depth_m: number;
  backup_power_generator: boolean;
  generator_fuel_hours: number;
  status: string;
  access_road_passable: boolean;
  source_trace: ExposureSourceTrace;
}

export interface ShelterExposureDetail {
  shelter_id: string;
  name: string;
  latitude: number;
  longitude: number;
  certified_capacity: number;
  current_occupancy: number;
  available_capacity: number;
  plinth_elevation_m: number;
  clearance_margin_m: number;
  topsis_score: number;
  potable_water_days: number;
  dg_set_functional: boolean;
  sanitation_facilities_count: number;
  status: string;
  source_trace: ExposureSourceTrace;
}

export interface RoadSegmentExposureDetail {
  segment_id: string;
  name: string;
  road_class: string;
  length_km: number;
  submerged_length_km: number;
  max_flood_depth_m: number;
  is_bridge: boolean;
  bridge_name?: string | null;
  bridge_clearance_m?: number | null;
  passable: boolean;
  evacuation_corridor: boolean;
  source_trace: ExposureSourceTrace;
}

export interface PowerAssetExposureDetail {
  asset_id: string;
  name: string;
  voltage_kv: number;
  latitude: number;
  longitude: number;
  plinth_elevation_m: number;
  flood_depth_m: number;
  status: string;
  transformer_count: number;
  downstream_population_served: number;
  feeder_lines_at_risk: number;
  source_trace: ExposureSourceTrace;
}

export interface CommunicationAssetExposureDetail {
  asset_id: string;
  name: string;
  asset_type: string;
  latitude: number;
  longitude: number;
  tower_height_m: number;
  wind_load_rating_kmh: number;
  battery_backup_hours: number;
  status: string;
  source_trace: ExposureSourceTrace;
}

export interface EmergencyFacilityExposureDetail {
  facility_id: string;
  name: string;
  facility_type: string;
  latitude: number;
  longitude: number;
  personnel_count: number;
  inflatable_boats: number;
  heavy_amphibious_vehicles: number;
  satellite_phones_count: number;
  status: string;
  source_trace: ExposureSourceTrace;
}

export interface GeographicZoneExposure {
  zone_id: string;
  zone_name: string;
  bounding_box: [number, number, number, number];
  polygon_coordinates: Array<Array<[number, number]>>;
  elevation_mean_m: number;
  coastal_distance_km: number;
  hazard_level: HazardLevelType;
  hazard_score: number;
  peak_surge_depth_m: number;
  rainfall_rate_mm_h: number;
  population_exposed: DemographicExposedBreakdown;
  critical_facilities_exposed: Array<Record<string, unknown>>;
  road_segments_exposed: RoadSegmentExposureDetail[];
  power_assets_exposed: PowerAssetExposureDetail[];
  hospital_exposure: HospitalExposureDetail[];
  shelter_exposure: ShelterExposureDetail[];
  communication_assets_exposed: CommunicationAssetExposureDetail[];
  emergency_facilities_exposed: EmergencyFacilityExposureDetail[];
  total_critical_facilities_count: number;
  severed_road_km: number;
  unusable_shelter_count: number;
  degraded_power_assets_count: number;
  overall_exposure_severity: ExposureSeverityType;
}

export interface PopulationSectorSummary {
  total_population: number;
  total_exposed: number;
  total_infants_under_5: number;
  total_elderly_over_65: number;
  total_kutcha_units: number;
  total_livestock: number;
  source_attribution: string;
}

export interface InfrastructureSectorSummary {
  total_critical_assets: number;
  submerged_assets_count: number;
  degraded_assets_count: number;
  bridges_at_risk_count: number;
  source_attribution: string;
}

export interface MedicalSectorSummary {
  total_hospitals: number;
  total_beds: number;
  total_icu_beds: number;
  hospitals_at_risk: number;
  oxygen_plants_compromised: number;
  source_attribution: string;
}

export interface TransportationSectorSummary {
  total_road_km: number;
  severed_road_km: number;
  passable_corridors_km: number;
  impassable_bridges_count: number;
  source_attribution: string;
}

export interface EnergySectorSummary {
  total_substations: number;
  submerged_substations: number;
  total_population_at_blackout_risk: number;
  feeder_lines_tripped: number;
  source_attribution: string;
}

export interface EmergencyResourcesSectorSummary {
  total_certified_shelters: number;
  functional_shelters: number;
  total_shelter_capacity: number;
  current_shelter_occupancy: number;
  rescue_boats_deployed: number;
  odraf_ndrf_personnel_active: number;
  source_attribution: string;
}

export interface RegionalExposureAssessment {
  assessment_id: string;
  region_id: string;
  region_name: string;
  timestamp: string;
  hazard_scenario: string;
  total_zones: number;
  zones: GeographicZoneExposure[];
  sector_population: PopulationSectorSummary;
  sector_infrastructure: InfrastructureSectorSummary;
  sector_medical: MedicalSectorSummary;
  sector_transportation: TransportationSectorSummary;
  sector_energy: EnergySectorSummary;
  sector_emergency_resources: EmergencyResourcesSectorSummary;
  geojson_features: {
    type: string;
    features: Array<{
      type: string;
      id: string;
      geometry: {
        type: string;
        coordinates: number[][][];
      };
      properties: {
        zone_id: string;
        zone_name: string;
        hazard_level: string;
        hazard_score: number;
        severity: ExposureSeverityType;
        population_exposed: number;
        total_population: number;
        exposure_pct: number;
        critical_facilities: number;
        severed_road_km: number;
        mean_elevation_m: number;
        coastal_distance_km: number;
      };
    }>;
  };
}



export interface VulnerabilityComponentScores {
  hazard: number; // normalized 0-1
  exposure: number; // normalized 0-1
  accessibility: number; // normalized 0-1
  sensitivity: number; // normalized 0-1
  response_difficulty: number; // normalized 0-1
  infrastructure_dependency: number; // normalized 0-1
}
export * from './simulation';
export * from './resource_allocation';
export * from './hardening';
export * from './insurance_trigger';
// removed duplicate resource_allocation export

export interface VulnerabilityResponse {
  region_id: string;
  overall_score: number; // 0-1
  component_scores: VulnerabilityComponentScores;
  primary_drivers: string[];
  uncertainty?: number;
  model_version: string;
  provenance: ProvenanceMetadata;
}

export interface MultilingualAdvisoryInput {
  hazard: string;
  location: string;
  severity: string;
  time: string;
  recommended_action: string;
  destination?: string;
  route?: string;
  official_source: string;
}

export type MessageType =
  | 'authority_briefing'
  | 'general_public_warning'
  | 'simple_language_warning'
  | 'personalized_advisory';

export interface AdvisoryMessage {
  language: string;
  message_type: MessageType;
  content: string;
  timestamp: string;
  source: string;
  consistency_ok: boolean;
}

