"""
PRALAYA Health Check Schemas
"""

from datetime import datetime, timezone
from typing import Dict
from pydantic import BaseModel, Field


class ServiceComponentStatus(BaseModel):
    status: str = Field(..., description="operational, degraded, disabled, or offline")
    latency_ms: float = Field(default=0.0, description="Component latency in milliseconds")
    details: str = Field(default="Normal operating state", description="Diagnostic detail")


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="Overall system health status: healthy, degraded, or unhealthy")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="UTC timestamp of health check")
    project_name: str = Field(..., description="Project name")
    version: str = Field(..., description="Platform version string")
    environment: str = Field(..., description="Deployment environment")
    uptime_seconds: float = Field(default=0.0, description="Seconds since application startup")
    services: Dict[str, ServiceComponentStatus] = Field(default_factory=dict, description="Status of core subsystems")
    principles: Dict[str, bool] = Field(
        default={
            "deterministic_compute_isolated": True,
            "zero_secrets_in_client": True,
            "provenance_tracking_active": True
        },
        description="Architectural safety invariants"
    )
