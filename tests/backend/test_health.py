"""
Tests for PRALAYA Health Check Endpoints & Security Checks
"""

import pytest


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert "version" in data
    assert "platform" in data


def test_root_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "uptime_seconds" in data
    assert data["principles"]["deterministic_compute_isolated"] is True
    assert data["principles"]["zero_secrets_in_client"] is True


def test_api_v1_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "services" in data
    assert data["services"]["api_gateway"]["status"] == "operational"


def test_no_secrets_exposed_in_health_response(client):
    """Verify that sensitive database credentials or API keys are never leaked in API outputs"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    raw_text = response.text
    
    assert "GEMINI_API_KEY" not in raw_text
    assert "pralaya_pass" not in raw_text
    assert "postgresql://" not in raw_text
    assert "redis://" not in raw_text
