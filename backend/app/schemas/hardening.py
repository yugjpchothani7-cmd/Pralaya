# backend/app/schemas/hardening.py
"""Infrastructure Hardening / Resilience Planning schemas.
These define candidate intervention points and their assessment metrics.
"""

from pydantic import BaseModel, Field
from typing import List, Optional

class HardeningCandidate(BaseModel):
    asset_id: str = Field(..., description="Unique identifier of the asset (e.g., road ID, shelter ID).")
    asset_type: str = Field(..., description="Category of asset: power, roads, bridges, drainage, shelters, hospitals, communication.")
    hazard_exposure: float = Field(..., ge=0, le=1, description="Normalized exposure to modeled hazards (0‑1).")
    criticality: float = Field(..., ge=0, le=1, description="Importance of the asset to the community (0‑1).")
    dependent_population: int = Field(..., description="Number of people whose safety depends on this asset.")
    dependent_facilities: List[str] = Field(default_factory=list, description="IDs of facilities that rely on this asset.")
    failure_consequences: str = Field(..., description="Human‑readable description of what fails if the asset is compromised.")
    possible_intervention: str = Field(..., description="Suggested mitigation or reinforcement action.")
    expected_benefit: float = Field(..., ge=0, le=1, description="Estimated reduction in overall risk if intervention succeeds (0‑1).")
    uncertainty: Optional[float] = Field(None, ge=0, le=1, description="Uncertainty of the benefit estimate.")
    data_timestamp: str = Field(..., description="ISO timestamp of the underlying model data.")
    source: str = Field(..., description="Provenance of the data (e.g., model name, version).")

class HardeningResponse(BaseModel):
    region_id: str
    candidates: List[HardeningCandidate]
    generated_at: str = Field(..., description="ISO timestamp when the response was generated.")
    note: Optional[str] = Field(None, description="Disclaimer that interventions are recommendations, not guarantees.")
