"""PRALAYA Services Package"""

from fastapi import Depends
from app.repositories import DisasterDataRepository, get_disaster_repository
from app.services.disaster_service import DisasterService


def get_disaster_service(
    repo: DisasterDataRepository = Depends(get_disaster_repository),
) -> DisasterService:
    """FastAPI Dependency Injection provider for DisasterService."""
    return DisasterService(repository=repo)


__all__ = ["DisasterService", "get_disaster_service"]
