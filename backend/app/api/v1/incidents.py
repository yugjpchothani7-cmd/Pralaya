from fastapi import APIRouter, HTTPException, Query, status
from app.services.incident_service import IncidentService
from app.models.incident import IncidentReport, IncidentResponse

router = APIRouter()

service = IncidentService()

@router.post('/incidents', response_model=IncidentReport, summary='Submit a crowd‑sourced incident')
async def submit_incident(incident: IncidentReport):
    try:
        created = await service.submit_incident(incident)
        return created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get('/incidents', response_model=IncidentResponse, summary='List incidents (optional filter)')
async def list_incidents(verified: Optional[bool] = Query(None, description='Filter by verification status')):
    try:
        resp = await service.list_incidents(verified)
        return resp
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
