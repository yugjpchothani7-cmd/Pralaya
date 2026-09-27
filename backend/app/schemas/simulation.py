from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class SimulationParams(BaseModel):
    """Control knobs for the disaster simulation (no side‑effects)."""
    rainfall_mm: Optional[float] = Field(0.0, description="Incremental rainfall in mm.")
    wind_kmh: Optional[float] = Field(0.0, description="Incremental wind speed in km/h.")
    storm_surge_m: Optional[float] = Field(0.0, description="Storm surge height in metres.")
    road_failure_pct: Optional[float] = Field(0.0, description="Percentage of roads that fail (0‑100).")
    shelter_capacity_factor: Optional[float] = Field(1.0, description="Multiplicative factor for shelter capacity.")
    infrastructure_availability: Optional[float] = Field(1.0, description="Factor for infrastructure availability (0‑1).")
    emergency_resources_factor: Optional[float] = Field(1.0, description="Factor for emergency resources (0‑1).")

class SimulationMetrics(BaseModel):
    """High‑level metrics derived from the simulated scenario."""
    population_exposed: int = Field(..., description="Number of people exposed under the scenario.")
    critical_assets_exposed: int = Field(..., description="Count of critical assets exposed.")
    route_accessibility: float = Field(..., description="Overall route accessibility score (0‑1).")
    shelter_utilization: float = Field(..., description="Average shelter occupancy percentage (0‑100).")
    hospital_accessibility: float = Field(..., description="Score for hospital access (0‑1).")
    resource_requirements: Dict[str, float] = Field(..., description="Required quantities of emergency resources.")
    failure_cascades: List[str] = Field(..., description="Human‑readable list of cascade failures triggered.")

class SimulationResult(BaseModel):
    """Result of a simulated disaster scenario compared to a baseline."""
    baseline: Dict  # raw baseline snapshot (kept as generic dict for flexibility)
    scenario: Dict  # simulated snapshot (same shape as baseline)
    metrics: SimulationMetrics
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    summary: Optional[str] = Field(None, description="Gemini‑generated natural‑language description (labeled as simulation).")
