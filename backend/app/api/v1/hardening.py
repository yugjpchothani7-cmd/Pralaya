# backend/app/api/v1/hardening.py
"""API router for Infrastructure Hardening / Resilience Planning.
Provides candidate intervention points for a given region.
"""

from fastapi import APIRouter, Depends, Path
from app.services.hardening_service import compute_hardening
from app.schemas.hardening import HardeningResponse

router = APIRouter(prefix="/hardening", tags=["Infrastructure Hardening"])

@router.get("/{region_id}", response_model=HardeningResponse, summary="Get hardening candidates for a region")
async def get_hardening(region_id: str = Path(..., description="Region ID, e.g., REG_GANJAM_COAST")) -> HardeningResponse:
    """Return a list of candidate interventions based on modeled hazards and dependencies."""
    return compute_hardening(region_id)
