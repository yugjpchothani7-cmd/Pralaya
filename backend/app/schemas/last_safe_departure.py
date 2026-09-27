from pydantic import BaseModel
from typing import Literal, List, Optional

class LastSafeDepartureRequest(BaseModel):
    """Input parameters for the last safe departure estimator."""
    current_route_state: str  # identifier or serialized state
    hazard_trend: float  # positive = worsening hazard per hour
    predicted_degradation: float  # expected increase in route hazard score
    travel_time_minutes: float
    safety_threshold: float  # maximum acceptable combined hazard score
    # Additional optional contextual fields can be added as needed

class LastSafeDepartureResponse(BaseModel):
    """Model‑derived estimate of the last safe departure window for an evacuation route."""
    recommended_departure_state: Literal['prepare', 'depart', 'review']
    estimated_degradation_window_minutes: float  # minutes until conditions degrade beyond threshold
    route_reliability_trend: Literal['improving', 'stable', 'degrading']
    assumptions: List[str]
    uncertainty: Optional[float] = None  # 0‑1 normalized confidence interval
    disclaimer: str = "This is a model‑derived estimate, not an official evacuation order."
