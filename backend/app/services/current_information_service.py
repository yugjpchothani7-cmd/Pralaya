import os
from datetime import datetime
from typing import List

from ..schemas.current_information import (
    CurrentInformationRequest,
    CurrentInformationResponse,
    CurrentInfoItem,
    InformationSource,
)
from ..repositories.current_information_repository import (
    get_official_alerts,
    get_news_reports,
)

class CurrentInformationService:
    """Orchestrates data gathering for the Copilot's current‑information queries.
    The workflow is:
    1. Detect whether the user asks for *official* alerts → use ``get_official_alerts``.
    2. Otherwise perform a web search for recent news using ``get_news_reports``.
    3. (Placeholder) Model inference could be added later.
    4. Combine results, sort by publication_time (newest first), and return a ``CurrentInformationResponse``.
    """

    def __init__(self) -> None:
        pass

    def _is_official_query(self, query: str) -> bool:
        lowered = query.lower()
        return any(keyword in lowered for keyword in ["official", "warning", "alert", "evacuation order", "government"]) 

    async def get_current_information(self, request: CurrentInformationRequest) -> CurrentInformationResponse:
        items: List[CurrentInfoItem] = []
        # Official alerts take priority when asked explicitly
        if self._is_official_query(request.query):
            items.extend(get_official_alerts())
        else:
            # Use the query as search term for recent news
            items.extend(get_news_reports(request.query))
        # Ensure items are sorted newest first (by publication_time if present)
        def _sort_key(item: CurrentInfoItem):
            return item.publication_time or ""
        items.sort(key=_sort_key, reverse=True)
        response = CurrentInformationResponse(
            items=items,
            generated_at=datetime.utcnow().isoformat() + "Z",
        )
        return response
