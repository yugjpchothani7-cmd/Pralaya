from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime

class AdvisoryInput(BaseModel):
    """Structured risk/action data that drives all multilingual messages."""
    hazard: str = Field(..., description="Hazard type, e.g., 'Cyclone', 'Flood'.")
    location: str = Field(..., description="Human‑readable location description.")
    severity: str = Field(..., description="Severity level, e.g., 'Severe', 'Moderate'.")
    time: datetime = Field(..., description="Timestamp of the advisory (UTC).")
    recommended_action: str = Field(..., description="Action to take, e.g., 'Evacuate'.")
    destination: Optional[str] = Field(None, description="Suggested safe destination, if any.")
    route: Optional[str] = Field(None, description="Recommended evacuation route identifier.")
    official_source: str = Field(..., description="Provenance, e.g., 'NDMA Bulletin #12'.")

MessageType = Literal[
    "authority_briefing",
    "general_public_warning",
    "simple_language_warning",
    "personalized_advisory",
]

class AdvisoryMessage(BaseModel):
    """A single advisory message in a target language."""
    language: str = Field(..., description="ISO 639‑1 language code (en, hi, te, or, gu).")
    message_type: MessageType = Field(..., description="Category of the message.")
    content: str = Field(..., description="Full text of the advisory.")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="When the message was generated.")
    source: str = Field(..., description="Verified source identifier from the input.")
    consistency_ok: bool = Field(..., description="Result of the consistency check between source data and generated text.")
