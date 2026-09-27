# backend/app/repositories/current_information_repository.py
"""Repository for current‑information intelligence.
It aggregates two data streams:
1. **Official disaster feeds** – static placeholder list representing authoritative sources.
2. **News reports** – retrieved via a web search (search_web tool).
Both are normalized into ``CurrentInfoItem`` structures defined in ``schemas/current_information.py``.
"""
import os
from datetime import datetime
from typing import List, Dict, Any

from ..schemas.current_information import CurrentInfoItem, InformationSource

# ---------------------------------------------------------------------------
# 1. Official disaster feeds (placeholder – in production this would pull from
#    government APIs, GDACS, etc.).
# ---------------------------------------------------------------------------
def _static_official_alerts() -> List[Dict[str, Any]]:
    """Return a static list of official alerts.
    Each dict mimics a payload from an authoritative disaster‑management API.
    """
    now = datetime.utcnow().isoformat() + "Z"
    return [
        {
            "title": "Cyclone Vardah – Evacuation Order",
            "description": "Authorities have issued an evacuation order for coastal districts.",
            "publication_time": now,
            "location": "Coastal Region of Gujarat",
            "event_date": now.split("T")[0],
            "confidence": 0.99,
            "raw_data": {"type": "evacuation", "severity": "high"},
        },
        {
            "title": "Severe Flood Warning",
            "description": "River flood levels exceeding danger thresholds.",
            "publication_time": now,
            "location": "Maharashtra – Pune District",
            "event_date": now.split("T")[0],
            "confidence": 0.97,
            "raw_data": {"type": "flood", "severity": "moderate"},
        },
    ]

def get_official_alerts() -> List[CurrentInfoItem]:
    """Expose official alerts as ``CurrentInfoItem`` objects.
    In a real system this would call external REST APIs with proper auth.
    """
    alerts = _static_official_alerts()
    return [
        CurrentInfoItem(
            source=InformationSource.OFFICIAL_ALERT,
            title=item["title"],
            description=item.get("description"),
            publication_time=item.get("publication_time"),
            location=item.get("location"),
            event_date=item.get("event_date"),
            confidence=item.get("confidence"),
            raw_data=item.get("raw_data"),
        )
        for item in alerts
    ]

# ---------------------------------------------------------------------------
# 2. News reports – use the search_web tool to fetch recent articles.
# ---------------------------------------------------------------------------
def _search_news(query: str) -> List[Dict[str, Any]]:
    """Perform a web search for recent news.
    This function wraps the ``search_web`` tool; if the tool fails we return an
    empty list so the service can degrade gracefully.
    """
# NOTE: In production this would call an external search API. Here we return empty list as placeholder.

    # Placeholder: no external search integration
    return []

def get_news_reports(query: str) -> List[CurrentInfoItem]:
    """Return news items wrapped as ``CurrentInfoItem`` objects with source=NEWS_REPORT.
    """
    raw_items = _search_news(query)
    return [
        CurrentInfoItem(
            source=InformationSource.NEWS_REPORT,
            title=item["title"],
            description=item.get("description"),
            publication_time=item.get("publication_time"),
            location=None,
            event_date=None,
            confidence=None,
            raw_data=item,
        )
        for item in raw_items
    ]
