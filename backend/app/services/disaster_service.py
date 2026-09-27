"""
PRALAYA Service Layer
Encapsulates domain business logic, separating HTTP route handlers from repository access.
"""

from typing import List, Optional, Dict, Any, Tuple
from fastapi import HTTPException, status

from app.repositories.base import DisasterDataRepository
from app.schemas.models import (
    VulnerabilityComponentScores,
    VulnerabilityResponse,
    Event,
    Region,
    Hazard,
    WeatherObservation,
    SatelliteLayer,
    InfrastructureAsset,
    RoadSegment,
    Hospital,
    Shelter,
    PopulationZone,
    VulnerabilityProfile,
    EvacuationRoute,
    Alert,
    RiskAssessment,
    FailureNode,
    FailureEdge,
    ActionRecommendation,
)


class DisasterService:
    """Core domain service orchestrating disaster analytics across models and repositories."""

    def __init__(self, repository: DisasterDataRepository):
        self._repo = repository

    # --- 1. Events ---
    async def get_all_events(self) -> List[Event]:
        """Fetch all currently active disaster events."""
        return await self._repo.get_events()

    async def get_event_by_id(self, event_id: str) -> Event:
        """Fetch event by ID or raise 404."""
        event = await self._repo.get_event_by_id(event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Disaster event with id '{event_id}' was not found.",
            )
        return event

    # --- 2. Regions ---
    async def get_region_by_id(self, region_id: str) -> Region:
        """Fetch region by ID or raise 404."""
        region = await self._repo.get_region(region_id)
        if not region:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Region with id '{region_id}' was not found.",
            )
        return region

    # --- 3. Hazards ---
    async def get_hazard_assessment(self, region_id: str) -> Dict[str, Any]:
        """Fetch hazard parameters, meteorological observations, and satellite inundation masks."""
        # Ensure region exists
        await self.get_region_by_id(region_id)

        hazard = await self._repo.get_hazard_by_region(region_id)
        if not hazard:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No active hazard evaluation found for region '{region_id}'.",
            )

        weather = await self._repo.get_weather_observations(region_id)
        satellite = await self._repo.get_satellite_layers(region_id)

        return {
            "region_id": region_id,
            "hazard": hazard,
            "weather_observations": weather,
            "satellite_layers": satellite,
        }

    # --- 4. Exposure & Vulnerability ---
    async def get_exposure_assessment(self, region_id: str) -> Dict[str, Any]:
        """Aggregate demographic exposure and vulnerability profiles."""
        region = await self.get_region_by_id(region_id)
        zones = await self._repo.get_population_zones(region_id)
        vulnerability = await self._repo.get_vulnerability_profile(region_id)

        total_population = sum(z.total_population for z in zones)
        total_infants = sum(z.infants_under_5 for z in zones)
        total_elderly = sum(z.elderly_over_65 for z in zones)
        total_kutcha = sum(z.kutcha_structures for z in zones)
        total_livestock = sum(z.livestock_count for z in zones)

        return {
            "region_id": region_id,
            "region_name": region.name,
            "total_exposed_population": total_population,
            "demographic_breakdown": {
                "infants_under_5": total_infants,
                "elderly_over_65": total_elderly,
                "kutcha_structures": total_kutcha,
                "livestock_count": total_livestock,
            },
            "population_zones": zones,
            "vulnerability_profile": vulnerability,
        }
        

    # --- 5. Infrastructure & Cascade Graph ---
    async def get_infrastructure_status(self, region_id: str) -> Dict[str, Any]:
        """Retrieve critical infrastructure, hospital capabilities, and failure cascade DAG."""
        await self.get_region_by_id(region_id)

        assets = await self._repo.get_infrastructure_assets(region_id)
        hospitals = await self._repo.get_hospitals(region_id)
        failure_nodes, failure_edges = await self._repo.get_failure_graph(region_id)

        submerged_count = sum(1 for a in assets if a.status.value == "submerged")
        degraded_count = sum(1 for a in assets if a.status.value == "degraded")

        return {
            "region_id": region_id,
            "total_assets": len(assets),
            "submerged_assets_count": submerged_count,
            "degraded_assets_count": degraded_count,
            "assets": assets,
            "hospitals": hospitals,
            "failure_cascade": {
                "nodes": failure_nodes,
                "edges": failure_edges,
            },
        }
        

    # --- 6. Shelters ---
    async def get_shelters_status(self, region_id: str) -> Dict[str, Any]:
        """Evaluate shelter network capacity and TOPSIS suitability rankings."""
        await self.get_region_by_id(region_id)

        shelters = await self._repo.get_shelters(region_id)
        total_capacity = sum(s.certified_capacity for s in shelters)
        total_occupancy = sum(s.current_occupancy for s in shelters)
        available_capacity = max(0, total_capacity - total_occupancy)

        # Sort shelters by TOPSIS score descending
        ranked_shelters = sorted(shelters, key=lambda s: s.topsisScore, reverse=True)

        return {
            "region_id": region_id,
            "total_shelters": len(shelters),
            "total_capacity": total_capacity,
            "total_occupancy": total_occupancy,
            "available_capacity": available_capacity,
            "system_utilization_pct": round((total_occupancy / total_capacity * 100), 1) if total_capacity > 0 else 0.0,
            "shelters": ranked_shelters,
        }

    # --- 7. Routes & Transportation Network ---
    async def get_evacuation_routes(self, region_id: str) -> Dict[str, Any]:
        """Evaluate evacuation corridors and road segment flooding passability."""
        await self.get_region_by_id(region_id)

        routes = await self._repo.get_routes(region_id)
        roads = await self._repo.get_road_segments(region_id)

        viable_routes = [r for r in routes if r.is_viable]
        rejected_routes = [r for r in routes if not r.is_viable]

        return {
            "region_id": region_id,
            "total_routes_evaluated": len(routes),
            "viable_corridors": viable_routes,
            "rejected_corridors": rejected_routes,
            "road_segments": roads,
        }

    # --- 8. Risk Assessment ---
    async def get_risk_assessment(self, region_id: str) -> RiskAssessment:
        """Fetch composite risk evaluation or raise 404."""
        await self.get_region_by_id(region_id)

        risk = await self._repo.get_risk_assessment(region_id)
        if not risk:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No risk assessment found for region '{region_id}'.",
            )
        return risk


    # --- 9. Actions & Alerts ---
    async def get_operational_actions(self, region_id: str) -> Dict[str, Any]:
        """Retrieve prioritized operational directives and multilingual emergency broadcasts."""
        await self.get_region_by_id(region_id)

        actions = await self._repo.get_actions(region_id)
        alerts = await self._repo.get_alerts(region_id)

        return {
            "region_id": region_id,
            "total_actions": len(actions),
            "action_recommendations": actions,
            "active_alerts": alerts,
        }

