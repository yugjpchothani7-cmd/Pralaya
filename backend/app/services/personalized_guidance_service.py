import re
from typing import List
from ..schemas.personalized_guidance import HouseholdProfile, GuidanceAssumption, PersonalizedGuidanceResponse
from ..services.safe_destination_service import SafeDestinationService
from ..services.evacuation_routing_service import EvacuationRoutingService

class PersonalizedGuidanceService:
    """Engine that combines safe‑destination and routing results with a household profile
    to produce a human‑readable, language‑aware guidance message.
    No personal data is persisted – the profile is used only for the duration of the request.
    """

    def __init__(self) -> None:
        self._safe_service = SafeDestinationService()
        self._routing_service = EvacuationRoutingService()

    def _parse_location(self, loc: str):
        """Parse a 'lat,lon' string or fallback to a named region (stub)."""
        m = re.match(r"\s*([0-9.+-]+)\s*,\s*([0-9.+-]+)\s*", loc)
        if m:
            return float(m.group(1)), float(m.group(2))
        # In a real system we would resolve the named region to coordinates.
        raise ValueError("selected_location must be 'lat,lon' for the demo")

    async def get_guidance(self, profile: HouseholdProfile) -> PersonalizedGuidanceResponse:
        # 1. Resolve location
        user_lat, user_lon = self._parse_location(profile.selected_location)

        # 2. Obtain safe destination recommendation
        safe_resp = await self._safe_service.evaluate(user_lat, user_lon)
        recommended_dest = safe_resp.recommended
        # 3. Obtain route recommendation to that destination
        route_resp = await self._routing_service.evaluate(
            origin_lat=user_lat,
            origin_lon=user_lon,
            destination_ids=[recommended_dest.id],
        )
        recommended_route = route_resp.recommended_route

        # 4. Build assumptions list (transparent provenance)
        assumptions: List[GuidanceAssumption] = []
        assumptions.append(GuidanceAssumption(key="language", description=f"User prefers language {profile.language}"))
        assumptions.append(GuidanceAssumption(key="vehicle_access", description=f"Vehicle access = {profile.vehicle_access}"))
        assumptions.append(GuidanceAssumption(key="mobility_needs", description=f"Mobility needs = {profile.mobility_needs}"))
        assumptions.append(GuidanceAssumption(key="preferred_facility_type", description=f"Preferred facility = {profile.preferred_facility_type}"))
        assumptions.append(GuidanceAssumption(key="household_size", description=f"Household size = {profile.household_size}"))

        # 5. Create a simple guidance message (placeholder for Gemini conversion)
        msg = (
            f"Based on your household profile, the recommended destination is {recommended_dest.name} "
            f"(capacity {recommended_dest.capacity}, currently {recommended_dest.occupancy} occupied). "
            f"The suggested route takes approximately {recommended_route.estimated_travel_time_minutes} minutes "
            f"and follows a {recommended_route.strategy} strategy. "
            f"Assumptions: {', '.join(a.key for a in assumptions)}."
        )

        # 6. Assemble response
        response = PersonalizedGuidanceResponse(
            language=profile.language,
            recommended_destination=recommended_dest.dict(),
            recommended_route=recommended_route.dict(),
            assumptions=assumptions,
            message=msg,
            data_freshness_minutes=min(recommended_dest.data_freshness_minutes or 9999, recommended_route.data_freshness_minutes or 9999),
        )
        return response
