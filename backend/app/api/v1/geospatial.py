"""
PRALAYA Geospatial API Endpoints
Serves Earth Observation layers (Elevation, SAR, Rainfall, Surface Water, Land Cover, Bi-temporal Change Detection).
Orchestrates GEE with automatic fallback to mock data, keeping secrets secure on the server.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status

from geospatial.models.roi import RegionOfInterest
from geospatial.models.layer import GeospatialLayerMetadata
from geospatial.models.comparison import TemporalComparisonResult
from geospatial.services.geospatial_service import get_geospatial_service

router = APIRouter(prefix="/geospatial", tags=["Geospatial & Earth Engine"])


@router.get("/status", summary="Geospatial provider & cache health status")
async def get_geospatial_status():
    """
    Returns Earth Observation provider health, GEE authentication status, and cache metrics.
    """
    service = get_geospatial_service()
    return service.get_service_status()


@router.get("/catalog", response_model=List[GeospatialLayerMetadata], summary="List all EO layers for region")
async def get_geospatial_catalog(
    region_id: str = Query("gopalpur-coastal-odisha", description="Target Region of Interest ID")
):
    """
    Returns full catalog of Earth Observation layers for the specified region with metadata,
    source attribution, timestamps, and visualization styling.
    """
    service = get_geospatial_service()
    try:
        layers = await service.get_all_layers_catalog(region_id=region_id)
        return layers
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate geospatial catalog: {str(e)}",
        )


@router.get("/elevation", response_model=GeospatialLayerMetadata, summary="Digital Elevation Model (DEM)")
async def get_elevation_layer(
    region_id: str = Query("gopalpur-coastal-odisha", description="Target Region of Interest ID")
):
    """
    Returns NASADEM 30m high-resolution bare-earth terrain elevation model for flood surge modeling.
    """
    service = get_geospatial_service()
    try:
        layer = await service.get_elevation(region_id=region_id)
        return layer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Elevation processing error: {str(e)}",
        )


@router.get("/sar", response_model=GeospatialLayerMetadata, summary="Sentinel-1 SAR Radar Imagery")
async def get_sar_layer(
    region_id: str = Query("gopalpur-coastal-odisha", description="Target Region of Interest ID")
):
    """
    Returns Sentinel-1 Synthetic Aperture Radar (SAR) C-band backscatter penetrating cloud cover.
    """
    service = get_geospatial_service()
    try:
        layer = await service.get_satellite_sar(region_id=region_id)
        return layer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sentinel-1 SAR processing error: {str(e)}",
        )


@router.get("/rainfall", response_model=GeospatialLayerMetadata, summary="CHIRPS Precipitation Grid")
async def get_rainfall_layer(
    region_id: str = Query("gopalpur-coastal-odisha", description="Target Region of Interest ID")
):
    """
    Returns CHIRPS / GPM satellite precipitation grid for storm intensity assessment.
    """
    service = get_geospatial_service()
    try:
        layer = await service.get_rainfall(region_id=region_id)
        return layer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Precipitation raster processing error: {str(e)}",
        )


@router.get("/surface-water", response_model=GeospatialLayerMetadata, summary="JRC Global Surface Water")
async def get_surface_water_layer(
    region_id: str = Query("gopalpur-coastal-odisha", description="Target Region of Interest ID")
):
    """
    Returns European Commission JRC 38-year global surface water occurrence and permanent waterbodies.
    """
    service = get_geospatial_service()
    try:
        layer = await service.get_surface_water(region_id=region_id)
        return layer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Surface water processing error: {str(e)}",
        )


@router.get("/land-cover", response_model=GeospatialLayerMetadata, summary="ESA WorldCover 10m LULC")
async def get_land_cover_layer(
    region_id: str = Query("gopalpur-coastal-odisha", description="Target Region of Interest ID")
):
    """
    Returns ESA WorldCover 10m global land use / land cover classification.
    """
    service = get_geospatial_service()
    try:
        layer = await service.get_land_cover(region_id=region_id)
        return layer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Land cover processing error: {str(e)}",
        )


@router.get("/comparison", response_model=TemporalComparisonResult, summary="Bi-temporal Flood Change Detection")
async def get_temporal_comparison(
    region_id: str = Query("gopalpur-coastal-odisha", description="Target Region of Interest ID")
):
    """
    Performs bi-temporal change detection comparing pre-disaster Sentinel-1 SAR baseline with
    active cyclonic inundation. Computes net inundated area, percentage expansion, and affected zones.
    """
    service = get_geospatial_service()
    try:
        comp = await service.get_temporal_comparison(region_id=region_id)
        return comp
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Temporal comparison error: {str(e)}",
        )


@router.post("/roi", summary="Configure / register custom Region of Interest")
async def register_roi(roi: RegionOfInterest):
    """
    Configures a custom geographic bounding box for real-time Earth Engine processing.
    """
    service = get_geospatial_service()
    try:
        service.register_region(roi)
        return {
            "status": "success",
            "message": f"Region '{roi.name}' ({roi.region_id}) registered successfully.",
            "roi": roi,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Region of Interest configuration: {str(e)}",
        )
