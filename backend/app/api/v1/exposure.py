"""
PRALAYA API v1 - Exposure Router
Exposes multi-sector geographic exposure assessment and granular zone evaluations.
"""

from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, Path, Query, HTTPException, status
from app.services import DisasterService, get_disaster_service

from exposure.engine.exposure_engine import ExposureEngine
from exposure.models.exposure_models import (
    RegionalExposureAssessment,
    GeographicZoneExposure,
)

router = APIRouter(prefix="/exposure", tags=["Exposure & Lifeline Lifecycles"])

# Singleton engine instance
_exposure_engine = ExposureEngine()


def get_exposure_engine() -> ExposureEngine:
    return _exposure_engine


@router.get("/assessment", summary="Get Multi-Sector Regional Exposure Assessment")
async def get_regional_exposure_assessment(
    region_id: str = Query("gopalpur-coastal-odisha", description="Region identifier"),
    surge_shock: float = Query(0.0, ge=0.0, le=5.0, description="What-If surge shock in meters"),
    rain_shock: float = Query(0.0, ge=0.0, le=200.0, description="What-If rain rate shock in mm/h"),
    high_tide: bool = Query(False, description="Simulate astronomical spring high tide coincidence"),
    engine: ExposureEngine = Depends(get_exposure_engine),
) -> RegionalExposureAssessment:
    """
    Overlay physical multi-hazard surfaces with population, hospitals, shelters,
    roads, power grids, telecom, and emergency response facilities.
    Produces comprehensive zone-level breakdowns and 6 sector summaries:
    Population, Infrastructure, Medical, Transportation, Energy, Emergency resources.
    """
    return engine.assess_regional_exposure(
        region_id=region_id,
        surge_shock=surge_shock,
        rain_shock=rain_shock,
        high_tide=high_tide,
    )


@router.get("/zone/{zone_id}", summary="Get Detailed Exposure for Specific Geographic Zone")
async def get_zone_exposure_detail(
    zone_id: str = Path(..., description="Unique zone ID, e.g. ZONE_GOPALPUR_COAST"),
    surge_shock: float = Query(0.0, ge=0.0, le=5.0),
    rain_shock: float = Query(0.0, ge=0.0, le=200.0),
    high_tide: bool = Query(False),
    engine: ExposureEngine = Depends(get_exposure_engine),
) -> GeographicZoneExposure:
    """
    Retrieve deep facility-level exposure details and source traceability for a single geographic zone.
    """
    assessment = engine.assess_regional_exposure(
        surge_shock=surge_shock,
        rain_shock=rain_shock,
        high_tide=high_tide,
    )
    for zone in assessment.zones:
        if zone.zone_id == zone_id:
            return zone

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Zone '{zone_id}' not found in evaluated region.",
    )


@router.get("/{region_id}", summary="Get Regional Exposure Breakdown (Legacy Phase 3 Compatibility)")
async def get_regional_exposure_legacy(
    region_id: str = Path(..., description="Region ID, e.g. REG_GANJAM_COAST"),
    service: DisasterService = Depends(get_disaster_service),
) -> Dict[str, Any]:
    """Legacy compatibility endpoint returning demographic breakdown and vulnerability profiles."""
    return await service.get_exposure_assessment(region_id)
