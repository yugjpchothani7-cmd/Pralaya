// Resource allocation related TypeScript interfaces

export interface ResourceAllocationParams {
  population_exposure: number;
  vulnerability: number;
  road_accessibility: number;
  hospital_exposure: number;
  failure_pathways: number;
  response_distance: number;
  resource_availability: number;
}

export interface AllocationItem {
  resource: string;
  assigned_zone: string;
  assigned_facility: string;
  priority: string;
  reason: string;
  estimated_response_time: number; // minutes
}

export interface ResourceAllocationResult {
  allocations: AllocationItem[];
  generated_at: string; // ISO timestamp
  // Decision-support recommendation only
}
