"""
PRALAYA Exposure Engine - Unit Tests for Spatial Overlay
"""

import pytest
from exposure.engine.spatial_overlay import (
    point_in_bbox,
    point_in_polygon,
    haversine_distance_km,
    calculate_flood_depth_at_point,
)


def test_point_in_bbox():
    bbox = (84.90, 19.25, 85.10, 19.45)
    # Inside
    assert point_in_bbox(19.30, 85.00, bbox) is True
    # Outside north
    assert point_in_bbox(19.50, 85.00, bbox) is False
    # Outside west
    assert point_in_bbox(19.30, 84.80, bbox) is False


def test_point_in_polygon():
    polygon = [(0.0, 0.0), (10.0, 0.0), (10.0, 10.0), (0.0, 10.0), (0.0, 0.0)]
    assert point_in_polygon(5.0, 5.0, polygon) is True
    assert point_in_polygon(15.0, 5.0, polygon) is False
    assert point_in_polygon(5.0, 15.0, polygon) is False


def test_haversine_distance():
    # Distance between Gopalpur (19.26, 84.91) and Chhatrapur (19.35, 84.99) is ~13 km
    dist = haversine_distance_km(19.26, 84.91, 19.35, 84.99)
    assert 11.0 <= dist <= 16.0


def test_calculate_flood_depth_attenuation():
    # Coastal point (0.2km), low elevation (1.5m), surge peak 3.5m
    depth_coastal = calculate_flood_depth_at_point(
        lat=19.30, lon=85.00, elevation_m=1.5, coastal_distance_km=0.2, surge_peak_m=3.5, rainfall_rate_mm_h=50.0
    )
    assert depth_coastal > 1.5

    # Inland point (15km), high elevation (35m) -> depth must be 0
    depth_inland = calculate_flood_depth_at_point(
        lat=19.40, lon=84.90, elevation_m=35.0, coastal_distance_km=15.0, surge_peak_m=3.5, rainfall_rate_mm_h=50.0
    )
    assert depth_inland == 0.0
