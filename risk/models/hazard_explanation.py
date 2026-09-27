"""
PRALAYA Deterministic Hazard Engine - Explanation Model
Deterministic diagnostic explanation for human decision-makers and EOC commanders.
"""

from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel, Field, ConfigDict


class HazardExplanation(BaseModel):
    """
    Transparent explanation object detailing primary causal drivers and contributing factors.
    Directly answers why a location received its computed hazard level.
    """
    model_config = ConfigDict(extra="forbid")

    hazard_level: str = Field(..., description="Overall severity rating: LOW, MODERATE, HIGH, SEVERE, or CATASTROPHIC")
    primary_drivers: List[str] = Field(..., description="Key physical factors driving severe risk (e.g. surge exceedance, extreme wind)")
    contributing_factors: List[str] = Field(..., description="Secondary factors aggravating hazard (e.g. low elevation, saturated soil, high water permanence)")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Generation timestamp in UTC"
    )
    sources: List[str] = Field(..., description="List of verified data sources and physical formulations")
