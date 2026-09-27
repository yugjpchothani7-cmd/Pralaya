from typing import List
from ..models.safe_destination import DestinationCandidate, SafeDestinationResponse
import math
import datetime

class SafeDestinationRepository:
    """Repository providing synthetic facility data.
    In a real system this would query a database of verified shelters and facilities.
    """

    def _synthetic_facilities(self) -> List[DestinationCandidate]:
        now = datetime.datetime.utcnow()
        # Example facilities – keep IDs unique and realistic
        return [
            DestinationCandidate(
                id="shelter_001",
                name="Riverbank Community Shelter",
                facility_type="shelter",
                latitude=22.3070,
                longitude=70.7820,
                capacity=200,
                occupancy=120,
                hazard_exposure=0.3,
                elevation=5.0,
                route_accessibility=0.9,
                distance_km=0.0,  # placeholder, will be computed
                travel_time_min=0.0,
                suitability_score=0.0,
                current_availability=True,
                data_freshness_minutes=30,
                reasons=[],
            ),
            DestinationCandidate(
                id="emergency_001",
                name="City Health Clinic",
                facility_type="medical",
                latitude=22.3115,
                longitude=70.7892,
                capacity=150,
                occupancy=80,
                hazard_exposure=0.45,
                elevation=10.0,
                route_accessibility=0.8,
                distance_km=0.0,
                travel_time_min=0.0,
                suitability_score=0.0,
                current_availability=True,
                data_freshness_minutes=15,
                reasons=[],
            ),
            DestinationCandidate(
                id="shelter_002",
                name="Hilltop Emergency Shelter",
                facility_type="shelter",
                latitude=22.3200,
                longitude=70.8000,
                capacity=300,
                occupancy=250,
                hazard_exposure=0.6,
                elevation=25.0,
                route_accessibility=0.7,
                distance_km=0.0,
                travel_time_min=0.0,
                suitability_score=0.0,
                current_availability=False,
                data_freshness_minutes=45,
                reasons=[],
            ),
        ]

    def _haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        # Returns distance in kilometers between two lat/lon points.
        R = 6371.0
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    async def get_candidates(self, user_lat: float, user_lon: float) -> List[DestinationCandidate]:
        candidates = self._synthetic_facilities()
        for cand in candidates:
            dist = self._haversine(user_lat, user_lon, cand.latitude, cand.longitude)
            cand.distance_km = round(dist, 2)
            # Rough travel time assuming 60 km/h average speed, adjusted for route accessibility
            speed_kmh = 60 * cand.route_accessibility
            cand.travel_time_min = round((cand.distance_km / max(speed_kmh, 1)) * 60, 1)
        return candidates
