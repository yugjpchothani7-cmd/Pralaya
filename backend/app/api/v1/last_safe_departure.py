from fastapi import APIRouter, HTTPException, status
from app.services.last_safe_departure_service import LastSafeDepartureService
from app.schemas.last_safe_departure import LastSafeDepartureRequest, LastSafeDepartureResponse

router = APIRouter()

service = LastSafeDepartureService()

@router.post('/last-safe-departure', response_model=LastSafeDepartureResponse, summary='Estimate last safe departure window')
async def estimate_last_safe_departure(request: LastSafeDepartureRequest):
    try:
        resp = await service.estimate(request)
        return resp
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
