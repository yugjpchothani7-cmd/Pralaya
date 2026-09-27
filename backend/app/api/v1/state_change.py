from fastapi import APIRouter, HTTPException
from typing import List

from app.schemas.state_change import SystemState, StateChangeResponse
from app.services.state_change_service import StateChangeService

router = APIRouter()

@router.post('/state-change', response_model=StateChangeResponse)
async def compute_state_change(previous: SystemState, current: SystemState):
    """Compute the delta between two system snapshots.
    Returns a list of DeltaEntry objects and a natural‑language summary.
    """
    try:
        service = StateChangeService()
        response = service.compute_delta(previous, current)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
