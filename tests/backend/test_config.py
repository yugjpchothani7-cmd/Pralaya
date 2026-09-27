"""
Tests for PRALAYA Configuration System
"""

from app.config import Settings


def test_default_settings():
    s = Settings()
    assert s.API_V1_STR == "/api/v1"
    assert "http://localhost:5173" in s.CORS_ORIGINS
    assert s.ENVIRONMENT in ["development", "staging", "production"]


def test_cors_origins_string_parsing():
    s = Settings(CORS_ORIGINS="http://example.com, http://app.pralaya.ai")
    assert "http://example.com" in s.CORS_ORIGINS
    assert "http://app.pralaya.ai" in s.CORS_ORIGINS


def test_public_metadata_exclusion():
    s = Settings()
    meta = s.get_public_metadata()
    assert "project_name" in meta
    assert "version" in meta
    # Ensure sensitive settings are not included in public metadata
    assert "GEMINI_API_KEY" not in meta
    assert "DATABASE_URL" not in meta
    assert "REDIS_URL" not in meta
