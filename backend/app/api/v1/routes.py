"""
PRALAYA API v1 - Routes Router
"""

from typing import Any, Dict
from fastapi import APIRouter, Depends, Path
from app.services import DisasterService, get_disaster_service

router = APIRouter(prefix="/routes", tags=["Evacuation Routing"])


@router.get("/{region_id}", summary="Get Evacuation Routes & Road Segments")
async def get_regional_routes(
    region_id: str = Path(..., description="Region ID, e.g. REG_GANJAM_COAST"),
    service: DisasterService = Depends(get_disaster_service),
) -> Dict[str, Any]:
    """Retrieve evaluated evacuation corridors (viable safe paths vs rejected submerged routes) and road network flooding states."""
    return await service.get_evacuation_routes(region_id)
