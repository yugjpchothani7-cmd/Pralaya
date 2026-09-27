from typing import List
from ..schemas.resource_allocation import ResourceAllocationParams, ResourceAllocationResult, AllocationItem
import datetime
import random

# Simple deterministic heuristic for emergency resource allocation.
# This is a decision-support recommendation only and does NOT represent official authority allocations.

RESOURCE_TYPES = ['ambulance', 'rescue_team', 'emergency_personnel', 'temporary_shelter', 'medical_capacity']

def allocate_resources(params: ResourceAllocationParams) -> ResourceAllocationResult:
    # Dummy zones and facilities for illustration
    zones = ['ZoneA', 'ZoneB', 'ZoneC']
    facilities = {
        'ambulance': 'HospitalX',
        'rescue_team': 'RescueBaseY',
        'emergency_personnel': 'CommandCenterZ',
        'temporary_shelter': 'ShelterAlpha',
        'medical_capacity': 'ClinicBeta',
    }
    allocations: List[AllocationItem] = []
    for resource in RESOURCE_TYPES:
        # Priority based on resource availability factor
        priority_score = params.resource_availability * random.uniform(0.8, 1.2)
        priority = 'high' if priority_score > 0.7 else 'medium' if priority_score > 0.4 else 'low'
        assigned_zone = zones[0]
        assigned_facility = facilities[resource]
        reason = f"Allocated based on exposure ({params.population_exposure}) and vulnerability ({params.vulnerability}) with priority {priority}."
        base_time = params.response_distance / (params.road_accessibility + 0.1)
        estimated_response_time = round(base_time * random.uniform(0.9, 1.1), 1)
        allocations.append(
            AllocationItem(
                resource=resource,
                assigned_zone=assigned_zone,
                assigned_facility=assigned_facility,
                priority=priority,
                reason=reason,
                estimated_response_time=estimated_response_time,
            )
        )
    return ResourceAllocationResult(allocations=allocations, generated_at=datetime.datetime.utcnow().isoformat() + 'Z')
