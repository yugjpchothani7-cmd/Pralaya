from fastapi import APIRouter, HTTPException, status
from app.services.copilot_service import process_copilot
from app.schemas.copilot import CopilotRequest, CopilotResponse

router = APIRouter()

@router.post('/copilot', response_model=CopilotResponse, summary='PRALAYA AI Copilot')
async def copilot_endpoint(request: CopilotRequest):
    try:
        resp = await process_copilot(request)
        return resp
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
