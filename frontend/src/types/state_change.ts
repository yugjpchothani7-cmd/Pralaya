// Phase 16 – State‑Change TypeScript interfaces

export interface SystemState {
  timestamp: string; // ISO‑8601 UTC
  rainfall_mm?: number;
  wind_kmh?: number;
  hazard?: string;
  population_exposure?: number;
  road_accessibility?: Record<string, number>; // road_id → reliability (0‑1)
  shelter_occupancy?: Record<string, number>; // shelter_id → occupancy %
  infrastructure_risk?: Record<string, string>; // infra_id → risk level
  recommended_destination?: string;
  recommended_route?: string;
  alerts?: string[];
}

export type ChangeIndicator = '↑' | '↓' | '=' | '⊕' | '⊖';

export interface DeltaEntry {
  metric: string;
  previous?: string;
  current?: string;
  change_indicator: ChangeIndicator;
  timestamp: string; // ISO‑8601 UTC
  reason?: string;
  source?: string;
}

export interface StateChangeResponse {
  deltas: DeltaEntry[];
  summary?: string;
  generated_at: string;
}
