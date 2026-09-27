from typing import List, Optional
import uuid
from ..models.incident import IncidentReport

class IncidentRepository:
    """In‑memory repository for incident reports (mock for hackathon).
    Replace with a real database implementation when moving to production.
    """

    def __init__(self) -> None:
        self._incidents: List[IncidentReport] = []

    async def create(self, incident: IncidentReport) -> IncidentReport:
        # Assign a unique ID if not provided
        if not incident.id:
            incident.id = str(uuid.uuid4())
        self._incidents.append(incident)
        return incident

    async def list(self, verified: Optional[bool] = None) -> List[IncidentReport]:
        if verified is None:
            return list(self._incidents)
        return [inc for inc in self._incidents if inc.verified == verified]

    async def get(self, incident_id: str) -> Optional[IncidentReport]:
        for inc in self._incidents:
            if inc.id == incident_id:
                return inc
        return None
