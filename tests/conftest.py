"""
PRALAYA Test Configuration & Fixtures
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
backend_path = Path(__file__).parent.parent / "backend"
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from app.main import app


@pytest.fixture
def client():
    """Synchronous test client for FastAPI endpoints"""
    with TestClient(app) as test_client:
        yield test_client
