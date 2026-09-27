"""
PRALAYA Common Schemas & Envelopes
Adheres to RFC 7807 Problem Details and strict data provenance requirements.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ProvenanceMetadata(BaseModel):
    source_id: str = Field(..., description="Unique upstream bulletin or sensor identifier")
    source_authority: str = Field(..., description="Issuing authority (e.g. IMD, NDMA, CWC, ESA)")
    verification_level: str = Field(
        default="OFFICIAL_GOVERNMENT_FEED",
        description="OFFICIAL_GOVERNMENT_FEED, SCIENTIFIC_SURROGATE_MODEL, OPEN_COMMUNITY_BASEMAP, or UNVERIFIED_CROWD_DATA"
    )
    fetched_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp when data was ingested into PRALAYA"
    )
    confidence_score: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Algorithm or source confidence score (0.0 to 1.0)"
    )
    is_synthetic_simulation: bool = Field(
        default=False,
        description="Flag indicating if value is from a counterfactual simulation or real observation"
    )


class ErrorDetail(BaseModel):
    loc: List[str] = Field(default_factory=list, description="Field path causing validation error")
    msg: str = Field(..., description="Validation error message")
    type: str = Field(..., description="Error type identifier")


class ProblemDetails(BaseModel):
    """RFC 7807 Problem Details for HTTP APIs"""
    type: str = Field(default="https://pralaya.ai/errors/system-error", description="URI reference identifying the problem type")
    title: str = Field(..., description="Short, human-readable summary of problem")
    status: int = Field(..., description="HTTP status code")
    detail: str = Field(..., description="Detailed human-readable explanation of error")
    instance: Optional[str] = Field(default=None, description="URI reference identifying the specific occurrence of problem")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="UTC timestamp of error event")
    error_code: str = Field(default="ERR_INTERNAL_FAULT", description="Machine-readable application error code")
    invalid_params: Optional[List[ErrorDetail]] = Field(default=None, description="Detailed validation breakdown")
