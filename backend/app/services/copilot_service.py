import os
import json
from typing import Any, Dict, List, Optional

from ..schemas.copilot import CopilotRequest, CopilotResponse
from ..tools.copilot_tools import TOOL_REGISTRY

# In a real deployment you would import the Gemini SDK. Here we use a lightweight HTTP wrapper.
# The Gemini endpoint is constructed from the model name env var.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable is required for the Copilot service")

BASE_URL = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL}:generateContent"

def _call_gemini(messages: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Call the Gemini API with a list of message dicts.
    Returns the raw JSON response.
    """
    import requests
    payload = {"contents": messages}
    params = {"key": GEMINI_API_KEY}
    response = requests.post(BASE_URL, params=params, json=payload, timeout=30)
    response.raise_for_status()
    return response.json()

def _detect_needed_tool(user_message: str) -> Optional[str]:
    """Very naive keyword‑based tool selection.
    In a full implementation Gemini would request function calls itself.
    """
    lowered = user_message.lower()
    if "risk" in lowered:
        return "get_current_risk"
    if "hazard" in lowered:
        return "get_hazard_breakdown"
    if "exposed" in lowered or "asset" in lowered:
        return "get_exposed_assets"
    if "destination" in lowered or "where should" in lowered:
        return "find_safe_destinations"
    if "route" in lowered and "change" in lowered:
        return "get_evacuation_routes"
    if "failure" in lowered or "cascade" in lowered:
        return "get_failure_pathways"
    if "alert" in lowered:
        return "get_current_alerts"
    if "bulletin" in lowered or "disaster" in lowered:
        return "get_recent_disaster_information"
    if "simulation" in lowered:
        return "run_simulation"
    if "resource" in lowered or "plan" in lowered:
        return "get_resource_plan"
    return None

async def process_copilot(request: CopilotRequest) -> CopilotResponse:
    """Main entry point for the Copilot.
    1. Detect if a backend tool can satisfy the query.
    2. If a tool is found, call it, embed its result in the prompt and ask Gemini to generate a response.
    3. If no tool matches or data is missing, refuse gracefully.
    """
    # Step 1 – find a suitable tool
    tool_name = _detect_needed_tool(request.user_message)
    tool_result: Optional[Dict[str, Any]] = None
    tool_calls: List[Dict] = []
    provenance: List[Dict] = []

    if tool_name:
        tool_func = TOOL_REGISTRY.get(tool_name)
        if tool_func:
            tool_result = tool_func()
            if tool_result is None:
                # Data unavailable – refuse
                answer = (
                    "I’m unable to provide a reliable answer because the required data is currently unavailable."
                )
                return CopilotResponse(answer=answer, provenance=[])
            # Record a fake tool call payload for transparency
            tool_calls.append({"name": tool_name, "arguments": {}})
            provenance.append({"source": tool_result["source"], "timestamp": tool_result["data"].get("timestamp")})
    # Build the message payload for Gemini
    system_msg = {
        "role": "system",
        "parts": [
            {
                "text": (
                    "You are the PRALAYA AI Copilot. Answer the user using ONLY verified data obtained from backend tools. "
                    "Never fabricate weather, satellite, shelter, route, official warning, infrastructure condition, or risk scores. "
                    "When you use a tool, embed its result in your answer and cite its provenance. "
                    "Classify each piece of information as OBSERVED, MODELED, SIMULATED, or OFFICIAL as provided by the tool."
                )
            }
        ],
    }
    user_msg = {"role": "user", "parts": [{"text": request.user_message}]}
    # If we have tool data, prepend it as a separate user message to give the model context.
    messages = [system_msg]
    if tool_result:
        tool_context = json.dumps(tool_result, indent=2)
        messages.append({"role": "user", "parts": [{"text": f"Tool data:\n{tool_context}"}]})
    messages.append(user_msg)
    # Call Gemini
    try:
        gemini_resp = _call_gemini(messages)
        # Extract the generated text
        answer = gemini_resp.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    except Exception as e:
        answer = f"I encountered an error while generating a response: {str(e)}"
    return CopilotResponse(answer=answer, tool_calls=tool_calls or None, provenance=provenance or None)
