from fastapi import APIRouter, HTTPException
from app.schemas.simulation import SimulationParams, SimulationResult
from app.services.simulation_service import run_simulation
from app.services.state_change_service import compute_state_change

router = APIRouter()

@router.post('/simulation', response_model=SimulationResult)
async def simulate_scenario(params: SimulationParams):
    """Run a deterministic disaster simulation.
    The baseline snapshot is pulled from the current system state via the existing state‑change service.
    No live observations are altered.
    """
    # Retrieve a baseline snapshot (using the deterministic state‑change logic with zero params)
    baseline_state = await compute_state_change(previous={}, current={})  # placeholder: actually fetch live state elsewhere
    # For simplicity, assume baseline is empty dict; in production replace with real snapshot
    baseline = baseline_state.dict() if hasattr(baseline_state, 'dict') else {}
    result = run_simulation(baseline, params)
    return result
