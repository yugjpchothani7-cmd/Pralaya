from pydantic import BaseModel
from typing import Optional

class CopilotRequest(BaseModel):
    """User query forwarded to the AI copilot."""
    user_message: str
    # Optional context can be added later (e.g., region_id, zone_id)

class CopilotResponse(BaseModel):
    """Response from the copilot.
    `answer` is the final textual reply.
    `tool_calls` (optional) contains raw tool call payloads performed by the model.
    `provenance` lists sources used in the answer.
    """
    answer: str
    tool_calls: Optional[list[dict]] = None
    provenance: Optional[list[dict]] = None
