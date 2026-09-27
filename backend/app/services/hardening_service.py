# backend/app/services/hardening_service.py
"""Service for infrastructure hardening / resilience planning.
Generates candidate intervention points based on modeled hazards and dependencies.
This is a deterministic stub for demonstration – real logic would integrate models.
"""

from typing import List
from datetime import datetime

from ..schemas.hardening import HardeningCandidate, HardeningResponse

CATEGORIES = ["power", "roads", "bridges", "drainage", "shelters", "hospitals", "communication"]

def _mock_candidate(asset_type: str, idx: int) -> HardeningCandidate:
    """Create a deterministic mock candidate for a given asset type."""
    return HardeningCandidate(
        asset_id=f"{asset_type}_{idx}",
        asset_type=asset_type,
        hazard_exposure=0.4 + 0.05 * idx,
        criticality=0.6,
        dependent_population=1000 + 200 * idx,
        dependent_facilities=[f"facility_{idx}"],
        failure_consequences=f"Loss of {asset_type} would disrupt transport and services.",
        possible_intervention=f"Reinforce {asset_type} {idx} with resilient design.",
        expected_benefit=0.2 + 0.03 * idx,
        uncertainty=0.1,
        data_timestamp=datetime.utcnow().isoformat() + "Z",
        source="HardeningModel v1.0",
    )

def compute_hardening(region_id: str) -> HardeningResponse:
    """Generate a list of candidate interventions for the region.
    In a real system this would analyse hazard exposure, criticality, and dependencies.
    """
    candidates: List[HardeningCandidate] = []
    for asset_type in CATEGORIES:
        for i in range(1, 3):
            candidates.append(_mock_candidate(asset_type, i))
    return HardeningResponse(
        region_id=region_id,
        candidates=candidates,
        generated_at=datetime.utcnow().isoformat() + "Z",
        note="These are decision‑support recommendations; actual effectiveness may vary.",
    )
