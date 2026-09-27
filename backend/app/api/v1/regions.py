"""
PRALAYA API v1 - Regions Router
"""

from fastapi import APIRouter, Depends, Path
from app.schemas.models import Region
from app.services import DisasterService, get_disaster_service

router = APIRouter(prefix="/regions", tags=["Administrative Regions"])


@router.get("/{id}", response_model=Region, summary="Get Region Metadata")
async def get_region(
    id: str = Path(..., description="Unique administrative region ID, e.g. REG_GANJAM_COAST"),
    service: DisasterService = Depends(get_disaster_service),
) -> Region:
    """Retrieve administrative boundary, population, and spatial bounds for an emergency operational sector."""
    return await service.get_region_by_id(id)
