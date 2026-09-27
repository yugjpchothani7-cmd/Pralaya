// Simulation related TypeScript interfaces

export interface SimulationParams {
  rainfall_mm?: number; // incremental rainfall in millimetres
  wind_kmh?: number; // incremental wind speed
  storm_surge_m?: number; // storm surge height in metres
  road_failure_pct?: number; // percentage of roads that fail (0‑100)
  shelter_capacity_factor?: number; // multiplicative factor for shelter capacity
  infrastructure_availability?: number; // factor (0‑1)
  emergency_resources_factor?: number; // factor (0‑1)
}

export interface SimulationMetrics {
  population_exposed: number;
  critical_assets_exposed: number;
  route_accessibility: number; // 0‑1 score
  shelter_utilization: number; // percent (0‑100)
  hospital_accessibility: number; // 0‑1 score
  resource_requirements: Record<string, number>;
  failure_cascades: string[];
}

export interface SimulationResult {
  baseline: Record<string, any>;
  scenario: Record<string, any>;
  metrics: SimulationMetrics;
  generated_at: string; // ISO timestamp
  summary?: string; // Gemini‑generated description (labeled as simulation)
}
