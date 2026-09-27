# backend/app/schemas/insurance_trigger.py
"""Pydantic schemas for the parametric insurance trigger simulator.
All outputs are purely illustrative – no real insurance decisions are made.
"""

from pydantic import BaseModel, Field
from typing import Optional

class TriggerConfig(BaseModel):
    """User‑defined thresholds for a hypothetical policy."""
    rainfall_threshold: Optional[float] = Field(None, description="Rainfall (mm) threshold that triggers the policy.")
    wind_threshold: Optional[float] = Field(None, description="Wind speed (km/h) threshold.")
    flood_threshold: Optional[float] = Field(None, description="Flood level (m) threshold.")
    policy_name: str = Field(..., description="Name or identifier of the simulated policy.")

class ObservedConditions(BaseModel):
    """Simulated or modeled observed values during a scenario."""
    rainfall: Optional[float] = None
    wind: Optional[float] = None
    flood: Optional[float] = None

class TriggerResult(BaseModel):
    """Result of evaluating the trigger configuration against observed conditions.
    The module is labeled **SIMULATION ONLY** – no real claim processing occurs.
    """
    condition_met: bool = Field(..., description="Whether any configured threshold was satisfied.")
    policy: str = Field(..., description="Policy identifier.")
    trigger_parameter: Optional[str] = Field(None, description="Which parameter caused the condition to be met, if any.")
    observed_value: Optional[float] = Field(None, description="Value that met (or approached) the threshold.")
    threshold: Optional[float] = Field(None, description="Configured threshold value.")
    simulation_timestamp: str = Field(..., description="ISO timestamp of the simulation run.")
    hypothetical_payout: Optional[float] = Field(None, description="Illustrative payout amount if the trigger were real.")
    note: str = Field("SIMULATION ONLY – this does not represent an actual insurance claim.", description="Disclaimer label.")
