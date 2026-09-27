// src/types/insurance_trigger.ts
/*
TypeScript interfaces for the parametric insurance trigger simulator.
These mirror the backend Pydantic schemas.
*/

export interface TriggerConfig {
  rainfall_threshold?: number;
  wind_threshold?: number;
  flood_threshold?: number;
  policy_name: string;
}

export interface TriggerResult {
  condition_met: boolean;
  policy: string;
  trigger_parameter?: string;
  observed_value?: number;
  threshold?: number;
  simulation_timestamp: string;
  hypothetical_payout?: number;
  note: string;
}
