from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, List

class InformationSource(str, Enum):
    OFFICIAL_ALERT = "official_alert"
    NEWS_REPORT = "news_report"
    MODEL_INFERENCE = "model_inference"
    USER_PROVIDED = "user_provided"

class CurrentInfoItem(BaseModel):
    """A single piece of current information with provenance metadata."""
    source: InformationSource = Field(..., description="Origin of the information")
    title: str = Field(..., description="Short human‑readable title or summary")
    description: Optional[str] = Field(None, description="Longer description if needed")
    publication_time: Optional[str] = Field(None, description="ISO‑8601 timestamp of the source publication/update")
    location: Optional[str] = Field(None, description="Geographic location string or identifier")
    event_date: Optional[str] = Field(None, description="Date of the event, if known (ISO‑8601)")
    confidence: Optional[float] = Field(None, description="0‑1 confidence/provenance score")
    raw_data: Optional[dict] = Field(None, description="Original payload from the source (optional)")

class CurrentInformationRequest(BaseModel):
    query: str = Field(..., description="User question about recent disasters or events")
    # Optional context (region, user location) can be added later

class CurrentInformationResponse(BaseModel):
    items: List[CurrentInfoItem]
    generated_at: str = Field(..., description="Timestamp when the response was produced")
    disclaimer: str = Field(
        "This information is synthesized from verified sources and recent web content. It is not an official emergency directive unless marked as such.",
        description="Static disclaimer appended to every response",
    )
