"""
PRALAYA Geospatial Unit Tests - Domain Models
Validates RegionOfInterest bounding box constraints, Layer metadata, and TemporalComparison models.
"""

import pytest
from datetime import datetime, timezone
from pydantic import ValidationError

from geospatial.models.roi import RegionOfInterest
from geospatial.models.layer import GeospatialLayerMetadata, GeospatialLayerType
from geospatial.models.comparison import TemporalComparisonResult


def test_roi_valid_bounding_box():
    roi = RegionOfInterest(
        id="ROI_TEST_01",
        name="Test Coastal Zone",
        min_lat=19.0,
        min_lon=84.0,
        max_lat=20.0,
        max_lon=85.0,
    )
    assert roi.region_id == "ROI_TEST_01"
    assert roi.bbox == (19.0, 84.0, 20.0, 85.0)
    assert roi.centroid == (19.5, 84.5)
    assert roi.ee_bounds == (84.0, 19.0, 85.0, 20.0)


def test_roi_invalid_latitude_ordering():
    with pytest.raises(ValidationError):
        RegionOfInterest(
            id="ROI_BAD_LAT",
            name="Bad Lat",
            min_lat=20.0,
            min_lon=84.0,
            max_lat=19.0,  # min > max
            max_lon=85.0,
        )


def test_roi_invalid_longitude_ordering():
    with pytest.raises(ValidationError):
        RegionOfInterest(
            id="ROI_BAD_LON",
            name="Bad Lon",
            min_lat=19.0,
            min_lon=86.0,
            max_lat=20.0,
            max_lon=85.0,  # min > max
        )


def test_layer_metadata_serialization():
    layer = GeospatialLayerMetadata(
        layer_id="LAYER_ELEV_01",
        layer_type=GeospatialLayerType.ELEVATION,
        name="NASADEM Elevation",
        description="NASA SRTM 30m Digital Elevation Model",
        timestamp=datetime(2026, 9, 27, 10, 0, 0, tzinfo=timezone.utc),
        source_dataset="NASA/NASADEM_HGT/001",
        source_attribution="NASA JPL / USGS",
        resolution_meters=30.0,
        bands=["elevation"],
        units="meters MSL",
        min_value=0.0,
        max_value=120.0,
        palette=["#006600", "#ffff99", "#993300"],
        is_live_gee=False,
        provenance_hash="a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    )
    data = layer.model_dump()
    assert data["layer_type"] == "elevation"
    assert data["resolution_meters"] == 30.0
    assert data["source_attribution"] == "NASA JPL / USGS"
    assert data["is_live_gee"] is False
    assert data["provenance_hash"] == "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"


def test_temporal_comparison_calculation():
    comp = TemporalComparisonResult(
        comparison_id="COMP_01",
        roi_id="REG_01",
        sensor_name="Sentinel-1 SAR",
        baseline_window=(datetime(2026, 9, 1), datetime(2026, 9, 10)),
        event_window=(datetime(2026, 9, 20), datetime(2026, 9, 25)),
        baseline_layer_id="BASE_S1",
        event_layer_id="EVENT_S1",
        baseline_water_area_sq_km=25.0,
        event_water_area_sq_km=75.0,
        newly_submerged_area_sq_km=50.0,
        delta_percentage=200.0,
        significant_change_detected=True,
        source_attribution="ESA Copernicus Sentinel-1",
        is_live_gee=False,
        provenance_hash="e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    )
    assert comp.newly_submerged_area_sq_km == 50.0
    assert comp.significant_change_detected is True
    assert comp.delta_percentage == 200.0
