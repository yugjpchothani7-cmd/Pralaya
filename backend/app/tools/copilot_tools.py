# backend/app/tools/copilot_tools.py
"""Utility functions that expose verified data to the AI Copilot.
These functions are *the only* source of truth for the model – it must never fabricate
weather, satellite, shelter, route, official warning, infrastructure condition, or risk
scores on its own.

Each function returns a dict with a ``source`` field indicating the provenance
(OBSERVED, MODELED, SIMULATED, OFFICIAL) and a ``data`` field containing the payload.
If data cannot be fetched, ``None`` is returned and the copilot will refuse or fall back.
"""
import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

# NOTE: In a full implementation these would call the real services/repositories.
# For this prototype we return static examples that satisfy the contract.

def _timestamp() -> str:
    return datetime.utcnow().isoformat() + "Z"

def get_current_risk() -> Optional[Dict[str, Any]]:
    """Return the latest composite risk index for the region.
    Source: OBSERVED (derived from sensor data & model aggregation).
    """
    # Placeholder static data
    return {
        "source": "OBSERVED",
        "data": {
            "region_id": "R001",
            "composite_risk_index": 0.68,
            "timestamp": _timestamp(),
        },
    }

def get_hazard_breakdown() -> Optional[Dict[str, Any]]:
    """Return a detailed hazard breakdown (wind, flood, surge, etc.).
    Source: MODELED.
    """
    return {
        "source": "MODELED",
        "data": {
            "hazard": {
                "wind_speed_kmh": 85,
                "max_flood_depth_m": 2.3,
                "storm_surge_m": 1.1,
            },
            "timestamp": _timestamp(),
        },
    }

def get_exposed_assets() -> Optional[Dict[str, Any]]:
    """Return a list of critical assets currently exposed.
    Source: OBSERVED.
    """
    return {
        "source": "OBSERVED",
        "data": {
            "assets": [
                {"id": "bridge-12", "type": "bridge", "status": "at_risk"},
                {"id": "hospital-5", "type": "hospital", "status": "operational"},
            ],
            "timestamp": _timestamp(),
        },
    }

def find_safe_destinations() -> Optional[Dict[str, Any]]:
    """Return a ranked list of safe evacuation destinations.
    Source: OFFICIAL (derived from government shelter data) combined with model suitability.
    """
    return {
        "source": "OFFICIAL",
        "data": {
            "destinations": [
                {"id": "shelter-A", "name": "Community Center A", "distance_km": 4.2, "capacity": 250},
                {"id": "shelter-B", "name": "School Gym B", "distance_km": 7.1, "capacity": 180},
            ],
            "timestamp": _timestamp(),
        },
    }

def get_evacuation_routes() -> Optional[Dict[str, Any]]:
    """Return currently viable evacuation routes.
    Source: MODELED (routing engine with real‑time hazard layers).
    """
    return {
        "source": "MODELED",
        "data": {
            "routes": [
                {"id": "R17", "distance_km": 12.5, "estimated_time_min": 25, "hazard_score": 0.42},
                {"id": "R23", "distance_km": 15.0, "estimated_time_min": 30, "hazard_score": 0.35},
            ],
            "timestamp": _timestamp(),
        },
    }

def get_failure_pathways() -> Optional[Dict[str, Any]]:
    """Return probable cascade failure paths for critical infrastructure.
    Source: SIMULATED (Monte‑Carlo cascade model).
    """
    return {
        "source": "SIMULATED",
        "data": {
            "pathways": [
                {"origin": "bridge-12", "affected": ["road-7", "power-substation-3"]},
                {"origin": "power-substation-3", "affected": ["hospital-5"]},
            ],
            "timestamp": _timestamp(),
        },
    }

def get_current_alerts() -> Optional[Dict[str, Any]]:
    """Return any official alerts issued by authorities.
    Source: OFFICIAL.
    """
    return {
        "source": "OFFICIAL",
        "data": {
            "alerts": [
                {"id": "alert-101", "type": "evacuation", "message": "Evacuate low‑lying zones immediately."},
            ],
            "timestamp": _timestamp(),
        },
    }

def get_recent_disaster_information() -> Optional[Dict[str, Any]]:
    """Return the latest verified disaster bulletin.
    Source: OFFICIAL.
    """
    return {
        "source": "OFFICIAL",
        "data": {
            "bulletin": "Cyclone Vardah intensified to Category 4.",
            "timestamp": _timestamp(),
        },
    }

def run_simulation(scenario: str) -> Optional[Dict[str, Any]]:
    """Run a quick deterministic simulation for a given scenario name.
    Source: SIMULATED.
    """
    # In a real system this would launch a background job; here we return a stub.
    return {
        "source": "SIMULATED",
        "data": {
            "scenario": scenario,
            "result": "Simulation complete – increased flood risk in zone 7.",
            "timestamp": _timestamp(),
        },
    }

def get_resource_plan() -> Optional[Dict[str, Any]]:
    """Return a resource allocation plan for the current emergency.
    Source: OFFICIAL.
    """
    return {
        "source": "OFFICIAL",
        "data": {
            "plan": {
                "food_kg": 5000,
                "water_liters": 20000,
                "medical_kits": 120,
            },
            "timestamp": _timestamp(),
        },
    }

# Mapping of tool names to callables for dynamic dispatch
TOOL_REGISTRY = {
    "get_current_risk": get_current_risk,
    "get_hazard_breakdown": get_hazard_breakdown,
    "get_exposed_assets": get_exposed_assets,
    "find_safe_destinations": find_safe_destinations,
    "get_evacuation_routes": get_evacuation_routes,
    "get_failure_pathways": get_failure_pathways,
    "get_current_alerts": get_current_alerts,
    "get_recent_disaster_information": get_recent_disaster_information,
    "run_simulation": run_simulation,
    "get_resource_plan": get_resource_plan,
}
