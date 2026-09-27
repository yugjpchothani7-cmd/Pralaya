"""PRALAYA Repositories Package"""

from app.repositories.base import DisasterDataRepository
from app.repositories.mock_repository import MockDisasterRepository

# Global singleton repository instance for dependency injection
_repository_instance: DisasterDataRepository = MockDisasterRepository()


def get_disaster_repository() -> DisasterDataRepository:
    """FastAPI Dependency Injection provider for DisasterDataRepository."""
    return _repository_instance


__all__ = [
    "DisasterDataRepository",
    "MockDisasterRepository",
    "get_disaster_repository",
]
