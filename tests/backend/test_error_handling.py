"""
Tests for PRALAYA Error Handling & RFC 7807 Compliance
"""


def test_404_not_found_rfc7807(client):
    response = client.get("/api/v1/non-existent-endpoint")
    assert response.status_code == 404
    data = response.json()
    assert "type" in data
    assert "title" in data
    assert data["status"] == 404
    assert data["error_code"] == "ERR_HTTP_404"
    assert "timestamp" in data


def test_request_id_and_timing_headers(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "x-request-id" in response.headers
    assert "x-response-time" in response.headers
