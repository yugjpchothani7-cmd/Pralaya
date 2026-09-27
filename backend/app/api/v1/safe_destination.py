from fastapi import APIRouter, HTTPException, status
from app.services.safe_destination_service import SafeDestinationService
from app.models.safe_destination import SafeDestinationResponse

router = APIRouter()

service = SafeDestinationService()

@router.get('/safe-destination', response_model=SafeDestinationResponse, summary='Find suitable safe destinations for a user location')
async def get_safe_destination(lat: float, lon: float):
    """Return the recommended safe destination and alternatives for the given latitude/longitude.
    The function uses the synthetic repository; replace with real data sources in production.
    """
    try:
        result = await service.evaluate(lat, lon)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
