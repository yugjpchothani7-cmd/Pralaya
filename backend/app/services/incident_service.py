from ..repositories.incident_repository import IncidentRepository
from ..models.incident import IncidentReport, IncidentResponse
from typing import List, Optional

class IncidentService:
    """Business logic for incident handling.
    Currently very thin – it forwards to the repository and computes basic aggregates.
    In production you would add validation, moderation, notification, and linkage to other engines.
    """

    def __init__(self) -> None:
        self._repo = IncidentRepository()

    async def submit_incident(self, incident: IncidentReport) -> IncidentReport:
        return await self._repo.create(incident)

    async def list_incidents(self, verified: Optional[bool] = None) -> IncidentResponse:
        incidents: List[IncidentReport] = await self._repo.list(verified)
        total = len(incidents)
        unverified = len([i for i in incidents if not i.verified])
        severity_summary = None
        if incidents:
            verified_sevs = [i.severity for i in incidents if i.verified]
            if verified_sevs:
                severity_summary = sum(verified_sevs) / len(verified_sevs)
        return IncidentResponse(
            incidents=incidents,
            total=total,
            unverified_count=unverified,
            severity_summary=severity_summary,
        )
