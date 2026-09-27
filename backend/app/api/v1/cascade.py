from fastapi import APIRouter, Depends, HTTPException, status
from app.services.disaster_service import DisasterService
from app.schemas.cascade import CascadeScenario
from app.repositories.cascade_repository import CascadeRepository

router = APIRouter()

# Dependency injection placeholder – in real code you might use Depends to get a service instance
cascade_repo = CascadeRepository()

def get_disaster_service() -> DisasterService:
    # Simple factory – in real app you would retrieve from DI container
    from app.services.disaster_service import DisasterService
    return DisasterService()

@router.get("/cascade/{region_id}", response_model=CascadeScenario, summary="Get failure cascade scenario for a region")
async def get_cascade_scenario(region_id: str):
    """Return the cascade graph (nodes, edges, impacts) for the specified region.
    The data is currently synthetic; replace with real graph DB queries.
    """
    scenario = await cascade_repo.get_cascade_scenario(region_id)
    if not scenario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No cascade scenario for region '{region_id}'.")
    return scenario
