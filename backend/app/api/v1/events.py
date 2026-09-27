"""
PRALAYA API v1 - Events Router
"""

from typing import List
from fastapi import APIRouter, Depends, Path
from app.schemas.models import Event
from app.services import DisasterService, get_disaster_service

router = APIRouter(prefix="/events", tags=["Disaster Events"])


@router.get("", response_model=List[Event], summary="List Active Disaster Events")
async def list_events(
    service: DisasterService = Depends(get_disaster_service),
) -> List[Event]:
    """Retrieve all currently active natural hazard events being tracked by PRALAYA."""
    return await service.get_all_events()


@router.get("/{id}", response_model=Event, summary="Get Event Details")
async def get_event(
    id: str = Path(..., description="Unique event identifier, e.g. CYC_KARUNA_2026"),
    service: DisasterService = Depends(get_disaster_service),
) -> Event:
    """Retrieve meteorological telemetry and official status for a specific disaster event."""
    return await service.get_event_by_id(id)
