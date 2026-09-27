"""
PRALAYA API v1 - Infrastructure Router
"""

from typing import Any, Dict
from fastapi import APIRouter, Depends, Path
from app.services import DisasterService, get_disaster_service

router = APIRouter(prefix="/infrastructure", tags=["Critical Infrastructure & Cascades"])


@router.get("/{region_id}", summary="Get Infrastructure & Failure Cascade Status")
async def get_regional_infrastructure(
    region_id: str = Path(..., description="Region ID, e.g. REG_GANJAM_COAST"),
    service: DisasterService = Depends(get_disaster_service),
) -> Dict[str, Any]:
    """Retrieve operational status of substations, hospitals, pumping stations, bridges, and failure cascade DAG."""
    return await service.get_infrastructure_status(region_id)
