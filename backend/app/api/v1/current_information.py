from fastapi import APIRouter, HTTPException, status
from app.services.current_information_service import CurrentInformationService
from app.schemas.current_information import CurrentInformationRequest, CurrentInformationResponse

router = APIRouter()

service = CurrentInformationService()

@router.post('/current-information', response_model=CurrentInformationResponse, summary='Current‑information intelligence')
async def current_information_endpoint(request: CurrentInformationRequest):
    try:
        resp = await service.get_current_information(request)
        return resp
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
