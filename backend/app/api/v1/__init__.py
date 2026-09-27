"""
PRALAYA API v1 Router Aggregator
Mounts all versioned disaster intelligence endpoints.
"""

from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.events import router as events_router
from app.api.v1.regions import router as regions_router
from app.api.v1.hazards import router as hazards_router
from app.api.v1.exposure import router as exposure_router
from app.api.v1.infrastructure import router as infrastructure_router
from app.api.v1.shelters import router as shelters_router
from app.api.v1.routes import router as routes_router
from app.api.v1.risk import router as risk_router
from app.api.v1.actions import router as actions_router
from app.api.v1.situation import router as situation_router
from app.api.v1.hazard import router as legacy_hazard_router
from app.api.v1.routing import router as legacy_routing_router

from app.api.v1.safe_destination import router as safe_destination_router
from app.api.v1.insurance_trigger import router as insurance_trigger_router
from app.api.v1.state_change import router as state_change_router
from app.api.v1.multilingual_advisory import router as multilingual_advisory_router
from app.api.v1.simulation import router as simulation_router
from app.api.v1.copilot import router as copilot_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.current_information import router as current_information_router

api_v1_router = APIRouter()

# Primary Phase 3 & 4 Endpoints
api_v1_router.include_router(health_router)
api_v1_router.include_router(geospatial_router)
api_v1_router.include_router(events_router)
api_v1_router.include_router(regions_router)
api_v1_router.include_router(hazards_router)
api_v1_router.include_router(exposure_router)
api_v1_router.include_router(infrastructure_router)
api_v1_router.include_router(shelters_router)
api_v1_router.include_router(routes_router)
api_v1_router.include_router(risk_router)
api_v1_router.include_router(actions_router)
api_v1_router.include_router(current_information_router)
api_v1_router.include_router(state_change_router)
api_v1_router.include_router(insurance_trigger_router)
api_v1_router.include_router(simulation_router)
# Compatibility routers
api_v1_router.include_router(situation_router)
api_v1_router.include_router(legacy_hazard_router)
api_v1_router.include_router(legacy_routing_router)
