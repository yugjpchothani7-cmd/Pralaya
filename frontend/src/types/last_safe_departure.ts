// Last Safe Departure Types
export interface LastSafeDepartureRequest {
  current_route_state: string;
  hazard_trend: number; // per hour
  predicted_degradation: number; // incremental hazard score
  travel_time_minutes: number;
  safety_threshold: number; // max acceptable combined hazard
}

export interface LastSafeDepartureResponse {
  recommended_departure_state: 'prepare' | 'depart' | 'review';
  estimated_degradation_window_minutes: number;
  route_reliability_trend: 'improving' | 'stable' | 'degrading';
  assumptions: string[];
  uncertainty?: number;
  disclaimer: string;
}
