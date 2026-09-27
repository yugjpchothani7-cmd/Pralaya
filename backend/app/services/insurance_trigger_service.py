# backend/app/services/insurance_trigger_service.py
"""Service for the parametric insurance trigger simulator.
All outcomes are illustrative – no real insurance decisions are made.
"""

from datetime import datetime
from typing import Optional

from app.schemas.insurance_trigger import TriggerConfig, TriggerResult, ObservedConditions

def evaluate_trigger(config: TriggerConfig) -> TriggerResult:
    """Deterministically evaluate the trigger configuration.
    For each non‑null threshold we generate an observed value equal to
    threshold + 5 (simulating a condition that exceeds the threshold).
    If any observed value meets or exceeds its threshold, the trigger is met.
    """
    observed = ObservedConditions(
        rainfall=config.rainfall_threshold + 5 if config.rainfall_threshold is not None else None,
        wind=config.wind_threshold + 5 if config.wind_threshold is not None else None,
        flood=config.flood_threshold + 5 if config.flood_threshold is not None else None,
    )

    # Determine which parameter (if any) meets the condition
    trigger_param: Optional[str] = None
    observed_value: Optional[float] = None
    threshold: Optional[float] = None
    condition_met = False

    if config.rainfall_threshold is not None and observed.rainfall >= config.rainfall_threshold:
        condition_met = True
        trigger_param = "rainfall"
        observed_value = observed.rainfall
        threshold = config.rainfall_threshold
    elif config.wind_threshold is not None and observed.wind >= config.wind_threshold:
        condition_met = True
        trigger_param = "wind"
        observed_value = observed.wind
        threshold = config.wind_threshold
    elif config.flood_threshold is not None and observed.flood >= config.flood_threshold:
        condition_met = True
        trigger_param = "flood"
        observed_value = observed.flood
        threshold = config.flood_threshold

    # Simple deterministic payout: 1000 * (observed_value - threshold) if condition met
    hypothetical_payout = None
    if condition_met and observed_value is not None and threshold is not None:
        hypothetical_payout = round(1000 * (observed_value - threshold), 2)

    return TriggerResult(
        condition_met=condition_met,
        policy=config.policy_name,
        trigger_parameter=trigger_param,
        observed_value=observed_value,
        threshold=threshold,
        simulation_timestamp=datetime.utcnow().isoformat() + "Z",
        hypothetical_payout=hypothetical_payout,
    )
