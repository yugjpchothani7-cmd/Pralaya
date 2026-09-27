"""
PRALAYA Deterministic Hazard Engine - Output Models
Normalized hazard components, physical values, provenance, and uncertainty metadata.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Tuple, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class HazardLevel(str, Enum):
    """Categorical classification of compound disaster hazard severity."""
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    SEVERE = "SEVERE"
    CATASTROPHIC = "CATASTROPHIC"


class ComponentHazardOutput(BaseModel):
    """
    Standardized payload for every hazard component.
    Preserves raw physical values alongside documented [0.0, 1.0] normalized scores.
    Includes data source, model version, timestamp, and scientific uncertainty boundaries.
    """
    model_config = ConfigDict(extra="forbid")

    component_name: str = Field(..., description="Name of the component: rainfall, wind, surge, flood_exposure, combined")
    value: float = Field(..., description="Raw deterministic physical metric")
    normalized_score: float = Field(..., ge=0.0, le=1.0, description="Normalized hazard intensity score bounded in [0.0, 1.0]")
    hazard_level: HazardLevel = Field(..., description="Categorical rating based on defined physical thresholds")
    unit: str = Field(..., description="Physical measurement unit (e.g. mm/h, km/h, meters, index)")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Computation timestamp in UTC"
    )
    source: str = Field(..., description="Primary observation or hydrodynamic formulation source")
    model_version: str = Field(
        default="PRALAYA-HAZARD-v1.0-DETERMINISTIC",
        description="Engine algorithm release version"
    )
    confidence: float = Field(
        default=0.90, ge=0.0, le=1.0, description="Confidence score reflecting sensor quality & spatial proximity"
    )
    uncertainty_range: Tuple[float, float] = Field(
        ..., description="Lower and upper scientific uncertainty bounds for the raw physical value [min_val, max_val]"
    )
    details: Dict[str, Any] = Field(
        default_factory=dict, description="Component-specific diagnostics and threshold exceedance data"
    )
