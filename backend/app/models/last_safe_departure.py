from pydantic import BaseModel
from typing import Literal, Optional, List

class LastSafeDepartureResponse(BaseModel):
    """Model‑derived estimate of the last safe departure window for an evacuation route."""
    recommended_departure_state: Literal['prepare', 'depart', 'review']
    estimated_degradation_window_minutes: float  # minutes until conditions degrade beyond threshold
    route_reliability_trend: Literal['improving', 'stable', 'degrading']
    assumptions: List[str]
    uncertainty: Optional[float] = None  # 0‑1 normalized confidence interval
    disclaimer: str = "This is a model‑derived estimate, not an official evacuation order."
