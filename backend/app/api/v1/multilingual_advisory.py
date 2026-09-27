from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List

from app.schemas.multilingual_advisory import AdvisoryInput, AdvisoryMessage
from app.services.multilingual_advisory_service import MultilingualAdvisoryService

router = APIRouter()

@router.post('/multilingual-advisory', response_model=List[AdvisoryMessage])
async def generate_advisory(input_data: AdvisoryInput):
    """Generate multilingual advisory messages from a single structured input.
    Returns a list of AdvisoryMessage objects, one per language per message type.
    """
    try:
        service = MultilingualAdvisoryService()
        messages = service.generate(input_data)
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
