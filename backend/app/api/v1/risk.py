"""
PRALAYA API v1 - Risk Router
"""

from fastapi import APIRouter, Depends, Path
from app.schemas.models import RiskAssessment
from app.services import DisasterService, get_disaster_service

router = APIRouter(prefix="/risk", tags=["Risk Intelligence"])


@router.get("/{region_id}", response_model=RiskAssessment, summary="Get Regional Risk Assessment")
async def get_regional_risk(
    region_id: str = Path(..., description="Region ID, e.g. REG_GANJAM_COAST"),
    service: DisasterService = Depends(get_disaster_service),
) -> RiskAssessment:
    """Retrieve multi-criteria composite risk evaluation, economic loss exposure, and demographic vulnerability breakdown."""
    return await service.get_risk_assessment(region_id)
