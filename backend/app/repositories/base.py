"""
PRALAYA Data Architecture - Repository Interfaces
Defines abstract contracts for disaster data access, isolating data sources from business logic.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Tuple

from app.schemas.models import (
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
    Resource,
    Alert,
    SimulationScenario,
    RiskAssessment,
    FailureNode,
    FailureEdge,
    ActionRecommendation,
)


class DisasterDataRepository(ABC):
    """Abstract interface for all disaster domain queries."""

    @abstractmethod
    async def get_events(self) -> List[Event]:
        """Retrieve all active disaster events."""
        pass

    @abstractmethod
    async def get_event_by_id(self, event_id: str) -> Optional[Event]:
        """Retrieve a specific disaster event by ID."""
        pass

    @abstractmethod
    async def get_region(self, region_id: str) -> Optional[Region]:
        """Retrieve region administrative metadata."""
        pass

    @abstractmethod
    async def get_hazard_by_region(self, region_id: str) -> Optional[Hazard]:
        """Retrieve latest calculated hazard parameters for a region."""
        pass

    @abstractmethod
    async def get_weather_observations(self, region_id: str) -> List[WeatherObservation]:
        """Retrieve meteorological station readings for a region."""
        pass

    @abstractmethod
    async def get_satellite_layers(self, region_id: str) -> List[SatelliteLayer]:
        """Retrieve active satellite flood inundation rasters."""
        pass

    @abstractmethod
    async def get_population_zones(self, region_id: str) -> List[PopulationZone]:
        """Retrieve demographic sectors and population breakdown in a region."""
        pass

    @abstractmethod
    async def get_vulnerability_profile(self, region_id: str) -> Optional[VulnerabilityProfile]:
        """Retrieve aggregated vulnerability profile for a region."""
        pass

    @abstractmethod
    async def get_infrastructure_assets(self, region_id: str) -> List[InfrastructureAsset]:
        """Retrieve critical infrastructure nodes in a region."""
        pass

    @abstractmethod
    async def get_hospitals(self, region_id: str) -> List[Hospital]:
        """Retrieve hospital emergency facility capabilities."""
        pass

    @abstractmethod
    async def get_failure_graph(self, region_id: str) -> Tuple[List[FailureNode], List[FailureEdge]]:
        """Retrieve directed failure cascade DAG (nodes and dependency edges)."""
        pass

    @abstractmethod
    async def get_shelters(self, region_id: str) -> List[Shelter]:
        """Retrieve certified emergency shelters in a region."""
        pass

    @abstractmethod
    async def get_routes(self, region_id: str) -> List[EvacuationRoute]:
        """Retrieve evaluated evacuation corridors."""
        pass

    @abstractmethod
    async def get_road_segments(self, region_id: str) -> List[RoadSegment]:
        """Retrieve road network segments and flooding passability."""
        pass

    @abstractmethod
    async def get_risk_assessment(self, region_id: str) -> Optional[RiskAssessment]:
        """Retrieve multi-factor composite risk evaluation."""
        pass

    @abstractmethod
    async def get_actions(self, region_id: str) -> List[ActionRecommendation]:
        """Retrieve prioritized operational emergency orders."""
        pass

    @abstractmethod
    async def get_alerts(self, region_id: str) -> List[Alert]:
        """Retrieve active emergency broadcasts."""
        pass

    @abstractmethod
    async def get_resources(self, region_id: str) -> List[Resource]:
        """Retrieve available emergency assets and rescue supplies."""
        pass

    @abstractmethod
    async def get_simulation_scenarios(self, region_id: str) -> List[SimulationScenario]:
        """Retrieve pre-computed counterfactual simulation states."""
        pass
