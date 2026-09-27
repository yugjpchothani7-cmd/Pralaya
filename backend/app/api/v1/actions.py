"""
PRALAYA API v1 - Actions Router
"""

from typing import Any, Dict
from fastapi import APIRouter, Depends, Path
from app.services import DisasterService, get_disaster_service

router = APIRouter(prefix="/actions", tags=["Operational Actions & Alerts"])


@router.get("/{region_id}", summary="Get Prioritized Actions & Active Alerts")
async def get_regional_actions(
    region_id: str = Path(..., description="Region ID, e.g. REG_GANJAM_COAST"),
    service: DisasterService = Depends(get_disaster_service),
) -> Dict[str, Any]:
    """Retrieve prioritized emergency action directives with deadlines, and verified multilingual alerts."""
    return await service.get_operational_actions(region_id)
