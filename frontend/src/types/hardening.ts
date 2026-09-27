// src/types/hardening.ts
/*
TypeScript interfaces for Infrastructure Hardening / Resilience Planning.
These mirror the backend Pydantic schemas.
*/

export interface HardeningCandidate {
  asset_id: string;
  asset_type: string;
  hazard_exposure: number; // 0-1 normalized
  criticality: number; // 0-1 normalized
  dependent_population: number;
  dependent_facilities: string[];
  failure_consequences: string;
  possible_intervention: string;
  expected_benefit: number; // 0-1 normalized
  uncertainty?: number;
  data_timestamp: string; // ISO
  source: string;
}

export interface HardeningResponse {
  region_id: string;
  candidates: HardeningCandidate[];
  generated_at: string;
  note?: string;
}
