"""
PRALAYA Exposure Engine - Spatial Overlay Utilities
Performs deterministic spatial intersection and point-in-polygon / distance-buffer lookups
between physical hazard surfaces and geographic asset layers.
"""

from typing import List, Tuple, Dict, Any
import math


def point_in_bbox(lat: float, lon: float, bbox: Tuple[float, float, float, float]) -> bool:
    """
    Check if a point (lat, lon) falls inside a bounding box [min_lon, min_lat, max_lon, max_lat].
    """
    min_lon, min_lat, max_lon, max_lat = bbox
    return min_lat <= lat <= max_lat and min_lon <= lon <= max_lon


def point_in_polygon(lat: float, lon: float, polygon: List[Tuple[float, float]]) -> bool:
    """
    Standard Ray-Casting algorithm to check if (lat, lon) is inside a polygon ring of (lon, lat) tuples.
    """
    inside = False
    n = len(polygon)
    if n < 3:
        return False

    p1_lon, p1_lat = polygon[0]
    for i in range(1, n + 1):
        p2_lon, p2_lat = polygon[i % n]
        if lat > min(p1_lat, p2_lat):
            if lat <= max(p1_lat, p2_lat):
                if lon <= max(p1_lon, p2_lon):
                    if p1_lat != p2_lat:
                        xinters = (lat - p1_lat) * (p2_lon - p1_lon) / (p2_lat - p1_lat) + p1_lon
                    if p1_lon == p2_lon or lon <= xinters:
                        inside = not inside
        p1_lon, p1_lat = p2_lon, p2_lat

    return inside


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Great Circle distance in kilometers between two geographic points."""
    r = 6371.0  # Earth's radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c


def calculate_flood_depth_at_point(
    lat: float,
    lon: float,
    elevation_m: float,
    coastal_distance_km: float,
    surge_peak_m: float,
    rainfall_rate_mm_h: float,
    attenuation_per_km: float = 0.35,
) -> float:
    """
    Deterministic hydrodynamic water depth estimation at an asset location:
    Water Depth = max(0, (Surge_at_point + Pluvial_ponding) - Elevation)
    """
    local_surge = max(0.0, surge_peak_m - attenuation_per_km * coastal_distance_km)
    
    # Pluvial ponding factor: significant heavy rainfall adds local surface ponding
    pluvial_ponding_m = (rainfall_rate_mm_h / 100.0) * 0.40

    effective_water_level = local_surge + pluvial_ponding_m
    depth = max(0.0, effective_water_level - elevation_m)
    return round(depth, 2)
