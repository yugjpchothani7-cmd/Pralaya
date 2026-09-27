"""
PRALAYA Backend Configuration System
Separates public operational configuration from server-only private secrets.
"""

from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Public & Operational Server Configuration
    PROJECT_NAME: str = "PRALAYA Disaster Intelligence"
    VERSION: str = "1.0.0-phase1"
    DESCRIPTION: str = "Predictive Resilience & Adaptive Local Action AI - Coastal Cyclone & Flood Intelligence"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = Field(default="development", description="development, staging, or production")
    DEBUG: bool = Field(default=False, description="Enable debug logging and diagnostic details")
    
    SERVER_HOST: str = "127.0.0.1"
    SERVER_PORT: int = 8000
    
    # Safe CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
        description="Allowed CORS origins"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Server-Only Configuration (Private / Not exposed to clients)
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API Key (Server Only)")
    GEMINI_MODEL: str = Field(default="gemini-2.5-flash", description="Gemini Model Identifier")
    
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://pralaya_user:pralaya_pass@localhost:5432/pralaya",
        description="PostgreSQL / PostGIS connection string (Server Only)"
    )
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL for caching and pub/sub (Server Only)"
    )

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    def get_public_metadata(self) -> dict:
        """
        Returns only safe, non-sensitive system metadata suitable for client consumption.
        Never includes secrets, API keys, or database credentials.
        """
        return {
            "project_name": self.PROJECT_NAME,
            "version": self.VERSION,
            "api_v1_prefix": self.API_V1_STR,
            "environment": self.ENVIRONMENT,
        }


settings = Settings()
