# backend/app/api/v1/insurance_trigger.py
"""API router for the parametric insurance trigger simulator.
All responses are illustrative – no real insurance decisions are made.
"""

from fastapi import APIRouter, Body
from app.schemas.insurance_trigger import TriggerConfig, TriggerResult
from app.services.insurance_trigger_service import evaluate_trigger

router = APIRouter(prefix="/insurance_trigger", tags=["Parametric Insurance Trigger"])

@router.post("/evaluate", response_model=TriggerResult, summary="Evaluate a parametric insurance trigger configuration")
async def evaluate(config: TriggerConfig = Body(...)) -> TriggerResult:
    """Return a deterministic evaluation of the trigger configuration.
    The service generates mock observed conditions that exceed the thresholds
    to demonstrate a *condition met* scenario.
    """
    return evaluate_trigger(config)
