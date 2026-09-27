from pydantic import BaseModel
from typing import List

class ResourceAllocationParams(BaseModel):
    population_exposure: float
    vulnerability: float
    road_accessibility: float
    hospital_exposure: float
    failure_pathways: float
    response_distance: float
    resource_availability: float

class AllocationItem(BaseModel):
    resource: str
    assigned_zone: str
    assigned_facility: str
    priority: str
    reason: str
    estimated_response_time: float  # minutes

class ResourceAllocationResult(BaseModel):
    allocations: List[AllocationItem]
    generated_at: str  # ISO timestamp
    # Note: This is a decision-support recommendation, not an official authority allocation.
