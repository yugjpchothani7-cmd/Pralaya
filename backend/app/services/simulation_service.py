from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel

from ..schemas.simulation import SimulationParams, SimulationResult, SimulationMetrics
from ..schemas.system_state import SystemState  # assuming existing schema for baseline


def _apply_simulation(base_state: Dict[str, Any], params: SimulationParams) -> Dict[str, Any]:
    """Deterministically modify a copy of the baseline state according to the control knobs.
    No external services are touched – this is a pure function.
    """
    # Deep copy to avoid mutating the live observation
    import copy
    scenario = copy.deepcopy(base_state)

    # Example deterministic adjustments (replace with real model later)
    if params.rainfall_mm:
        scenario.setdefault('rainfall_mm', 0)
        scenario['rainfall_mm'] += params.rainfall_mm
    if params.wind_kmh:
        scenario.setdefault('wind_kmh', 0)
        scenario['wind_kmh'] += params.wind_kmh
    if params.storm_surge_m:
        scenario.setdefault('storm_surge_m', 0)
        scenario['storm_surge_m'] += params.storm_surge_m
    if params.road_failure_pct:
        # Assume road failure is a dict road_id -> reliability (0-1)
        for rid, rel in scenario.get('road_accessibility', {}).items():
            scenario['road_accessibility'][rid] = max(0.0, rel - params.road_failure_pct / 100)
    if params.shelter_capacity_factor:
        for sid, cap in scenario.get('shelter_occupancy', {}).items():
            scenario['shelter_occupancy'][sid] = min(100.0, cap * params.shelter_capacity_factor)
    if params.infrastructure_availability is not None:
        for iid, avail in scenario.get('infrastructure_risk', {}).items():
            # Lower risk if availability improves
            scenario['infrastructure_risk'][iid] = max(0.0, avail * (1 - params.infrastructure_availability))
    if params.emergency_resources_factor is not None:
        for res, qty in scenario.get('emergency_resources', {}).items():
            scenario['emergency_resources'][res] = qty * params.emergency_resources_factor
    return scenario


def _derive_metrics(scenario: Dict[str, Any]) -> SimulationMetrics:
    """Derive high‑level metrics from the simulated snapshot.
    The calculations are deliberately simple and deterministic.
    """
    pop_exposed = int(scenario.get('population_exposed', 0))
    critical_assets = int(scenario.get('critical_assets_exposed', 0))
    route_access = float(scenario.get('route_accessibility', 0.0))
    shelter_util = float(scenario.get('shelter_utilization', 0.0))
    hospital_acc = float(scenario.get('hospital_accessibility', 0.0))
    resource_reqs = scenario.get('resource_requirements', {})
    cascades = scenario.get('failure_cascades', [])
    return SimulationMetrics(
        population_exposed=pop_exposed,
        critical_assets_exposed=critical_assets,
        route_accessibility=route_access,
        shelter_utilization=shelter_util,
        hospital_accessibility=hospital_acc,
        resource_requirements=resource_reqs,
        failure_cascades=cascades,
    )


def run_simulation(baseline: Dict[str, Any], params: SimulationParams) -> SimulationResult:
    """Public entry point used by the API router.
    Returns a `SimulationResult` containing both snapshots, derived metrics and an optional Gemini summary.
    """
    scenario = _apply_simulation(baseline, params)
    metrics = _derive_metrics(scenario)
    # Gemini summary – a thin wrapper that sends a structured prompt; here we stub it.
    summary = None  # In production this would call the Gemini service with a safe prompt.
    return SimulationResult(
        baseline=baseline,
        scenario=scenario,
        metrics=metrics,
        generated_at=datetime.utcnow(),
        summary=summary,
    )
