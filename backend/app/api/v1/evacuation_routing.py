from fastapi import APIRouter, HTTPException, Query, status
from app.services.evacuation_routing_service import EvacuationRoutingService
from app.models.evacuation_routing import EvacuationRoutingResponse

router = APIRouter()

service = EvacuationRoutingService()

@router.get(
    "/evacuation-route",
    response_model=EvacuationRoutingResponse,
    summary="Disaster‑aware evacuation routing",
)
async def get_evacuation_route(
    origin_lat: float = Query(..., description="Origin latitude"),
    origin_lon: float = Query(..., description="Origin longitude"),
    # Expect a comma‑separated list of destination IDs (synthetic demo) – in real use you would pass richer payload
    destination_ids: str = Query(..., description="Comma‑separated destination IDs"),
):
    """Return the recommended evacuation route and alternatives.
    The demo uses a mock routing provider; replace with a real GIS‑based engine for production.
    """
    dest_ids = [d.strip() for d in destination_ids.split(",") if d]
    if not dest_ids:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one destination ID required")
    result = await service.evaluate(origin_lat, origin_lon, dest_ids)
    return result
