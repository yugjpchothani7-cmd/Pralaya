"""
PRALAYA API v1 - Hazards Router
Deterministic multi-hazard computation for cyclonic winds, storm surge, pluvial rainfall,
and terrain flood exposure. Generates geospatial hazard surfaces and transparent diagnostic explanations.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Path, Query, status

from app.services import DisasterService, get_disaster_service
from risk.models.hazard_inputs import HazardCellInput
from risk.models.hazard_surface import GeospatialHazardSurface, GeospatialHazardCell
from risk.models.hazard_explanation import HazardExplanation
from risk.models.hazard_outputs import ComponentHazardOutput
from risk.engine.hazard_surface_generator import HazardSurfaceGenerator
from risk.engine.combined_hazard import CombinedHazard

router = APIRouter(prefix="/hazards", tags=["Hazard Intelligence"])

_surface_generator = HazardSurfaceGenerator()
_combined_engine = CombinedHazard()


@router.get("/surface", response_model=GeospatialHazardSurface, summary="Deterministic Geospatial Hazard Surface")
async def get_geospatial_hazard_surface(
    region_id: str = Query("gopalpur-coastal-odisha", description="Region of Interest ID"),
    surge_shock: float = Query(0.0, ge=0.0, le=5.0, description="What-If surge elevation shock in meters"),
    rain_shock: float = Query(0.0, ge=0.0, le=100.0, description="What-If pluvial rainfall shock in %"),
    high_tide: bool = Query(False, description="Simulate astronomical spring high tide (+0.8m)"),
) -> GeospatialHazardSurface:
    """
    Computes deterministic 2D multi-hazard surface across the region of interest.
    Synthesizes pluvial rainfall runoff, Holland cyclonic wind decay, and coastal storm surge penetration.
    """
    surface = _surface_generator.generate_regional_scenario_surface(
        region_id=region_id,
        surge_shock=surge_shock,
        rain_shock=rain_shock,
        high_tide=high_tide,
    )
    return surface


@router.post("/evaluate-cell", summary="Deterministic Point/Cell Hazard Evaluation")
async def evaluate_hazard_cell(cell_input: HazardCellInput) -> Dict[str, Any]:
    """
    Evaluates a specific geographic point or sensor observation across all 4 deterministic hazard components.
    Returns individual component outputs, composite score, and the verified human-interpretable Explanation Object.
    """
    rain_out, wind_out, surge_out, exp_out, combined_out, explanation = _combined_engine.compute(cell_input)

    return {
        "cell_id": cell_input.cell_id,
        "latitude": cell_input.latitude,
        "longitude": cell_input.longitude,
        "components": {
            "rainfall": rain_out,
            "wind": wind_out,
            "surge": surge_out,
            "flood_exposure": exp_out,
            "combined": combined_out,
        },
        "explanation": explanation,
    }


@router.post("/compute-surface", response_model=GeospatialHazardSurface, summary="Compute Custom Hazard Surface")
async def compute_custom_hazard_surface(
    region_id: str = Query("custom-roi", description="Target region ID"),
    grid_resolution_km: float = Query(2.0, ge=0.1, le=20.0, description="Spatial resolution in km"),
    cells: List[HazardCellInput] = ...,
) -> GeospatialHazardSurface:
    """
    Runs deterministic multi-hazard physics across a custom array of grid cell inputs.
    Returns complete geospatial hazard surface with GeoJSON boundaries and regional summary.
    """
    return _surface_generator.generate_surface(
        region_id=region_id,
        cell_inputs=cells,
        grid_resolution_km=grid_resolution_km,
    )


@router.get("/{region_id}", summary="Get Regional Hazard Evaluation (Legacy)")
async def get_regional_hazard(
    region_id: str = Path(..., description="Region ID, e.g. REG_GANJAM_COAST"),
    service: DisasterService = Depends(get_disaster_service),
) -> Dict[str, Any]:
    """Retrieve hydrodynamic storm surge depth, flood inundation footprints, weather AWS stations, and satellite SAR layers."""
    return await service.get_hazard_assessment(region_id)
