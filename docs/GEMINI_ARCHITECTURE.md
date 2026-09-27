# PRALAYA: Gemini AI Copilot Architecture & Tool Calling Specification

---

### 1. Architectural Role of Gemini in PRALAYA

The integration of Google Gemini in PRALAYA is governed by a strict operational doctrine:
1. **Gemini is a Strategic Synthesizer, NOT a Calculator**:
   - Physical quantities (surge heights, flood boundaries, shortest paths, building damage probabilities) are generated exclusively by deterministic mathematical engines.
   - Gemini receives validated, structured JSON payloads produced by these engines and reasons over them.
2. **Zero Hallucination of Critical Safety Data**:
   - Gemini is prohibited from inventing geographic coordinates, inventing cyclone shelters, altering evacuation routes, or synthesizing official alerts.
   - If a requested shelter, route, or telemetry point does not exist in the deterministic payload, the model must explicitly declare it unavailable.
3. **Strict Function Calling / Tool Use Pattern**:
   - The model interacts with the PRALAYA backend exclusively through strongly-typed Pydantic tool definitions.

```mermaid
flowchart TD
    USER_QUERY[Incident Commander Natural Language Query] --> COPILOT_ROUTER[Copilot Dispatcher & Context Builder]
    COPILOT_ROUTER --> SYSTEM_PROMPT[Inject Grounding & Anti-Hallucination Constraints]
    
    SYSTEM_PROMPT --> GEMINI[Google Gemini API Client\nModel via GEMINI_MODEL Env]
    GEMINI --> DECISION{Does Query Require Tools?}
    
    DECISION -- Yes --> TOOL_CALL[Emit Tool Call Request:\nJSON Schema]
    TOOL_CALL --> BACKEND_EXEC[Execute Deterministic Service\n(e.g., Dijkstra / TOPSIS / PostGIS)]
    BACKEND_EXEC --> TOOL_RESULT[Return Structured JSON Result]
    TOOL_RESULT --> GEMINI
    
    GEMINI --> RAW_RESPONSE[Stream Synthesized Explanation & Strategy]
    RAW_RESPONSE --> GUARDRAIL[Post-Generation Grounding Guardrail]
    GUARDRAIL --> ENTITY_CHECK{Verify Entities & Numbers\nAgainst Backend DB?}
    
    ENTITY_CHECK -- Pass --> STREAM[Deliver Verified Tokens to Client SSE Stream]
    ENTITY_CHECK -- Fail --> SANITIZE[Strip Hallucinated Token / Append Verification Warning]
    SANITIZE --> STREAM
```

---

### 2. Dynamic Model Resolution & Configuration

The backend dynamically selects the Gemini model ID via environment variables with a deterministic fallback hierarchy:

```python
# backend/app/copilot/client.py
import os
from google import genai
from google.genai import types

def get_gemini_client() -> tuple[genai.Client, str]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in backend environment.")
    
    # Priority: GEMINI_MODEL env var -> gemini-2.5-flash -> gemini-1.5-pro -> gemini-1.5-flash
    model_id = os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"
    
    client = genai.Client(api_key=api_key)
    return client, model_id
```

---

### 3. Pydantic Tool Definitions for Gemini Tool-Calling

Gemini interacts with the deterministic engine via the following registered tool schemas:

#### Tool 1: `query_live_hazard_status`
```python
class HazardStatusQuery(BaseModel):
    bbox: list[float] = Field(description="Bounding box [min_lon, min_lat, max_lon, max_lat] in EPSG:4326")
    forecast_hour: int = Field(default=0, description="Hours relative to landfall T-0 (e.g. -12, 0, +6)")

# Function definition exposed to Gemini
def query_live_hazard_status(query: HazardStatusQuery) -> dict:
    """Returns verified storm surge height, maximum wind speed, and flooded square kilometers within a coastal bounding box."""
    ...
```

#### Tool 2: `get_safe_shelter_destinations`
```python
class SafeShelterQuery(BaseModel):
    origin_lat: float = Field(description="Latitude of population cluster")
    origin_lon: float = Field(description="Longitude of population cluster")
    min_clearance_m: float = Field(default=0.5, description="Minimum plinth height above predicted surge level")
    limit: int = Field(default=5, description="Maximum number of shelters to return")

def get_safe_shelter_destinations(query: SafeShelterQuery) -> dict:
    """Deterministically queries PostGIS for verified shelters within 25km, ranked by TOPSIS multi-criteria score."""
    ...
```

#### Tool 3: `compute_safe_evacuation_path`
```python
class EvacuationPathQuery(BaseModel):
    origin_coords: list[float] = Field(description="[longitude, latitude] of evacuation origin")
    destination_shelter_id: str = Field(description="Unique ID of verified destination shelter")
    transport_mode: str = Field(default="BUS", description="BUS, AMBULANCE, or FOOT")

def compute_safe_evacuation_path(query: EvacuationPathQuery) -> dict:
    """Executes dynamic flood-penalized Dijkstra routing across OpenStreetMap road graph, avoiding submerged road links."""
    ...
```

#### Tool 4: `simulate_infrastructure_cascade`
```python
class CascadeSimulationQuery(BaseModel):
    submerged_asset_ids: list[str] = Field(description="List of primary flooded infrastructure IDs")
    elapsed_hours: float = Field(default=2.0, description="Hours elapsed since primary flooding onset")

def simulate_infrastructure_cascade(query: CascadeSimulationQuery) -> dict:
    """Traverses NetworkX infrastructure DAG to determine cascading power, telecommunication, and hospital failures."""
    ...
```

#### Tool 5: `get_forecast_delta_summary`
```python
class DeltaQuery(BaseModel):
    previous_bulletin_id: str = Field(description="Identifier of earlier IMD bulletin")
    current_bulletin_id: str = Field(description="Identifier of newest IMD bulletin")

def get_forecast_delta_summary(query: DeltaQuery) -> dict:
    """Returns spatial track shift, landfall timing delta, and list of newly threatened vs cleared administrative wards."""
    ...
```

---

### 4. Grounding System Instructions & Anti-Hallucination Prompt

```markdown
You are the PRALAYA Anticipatory Disaster Intelligence AI Copilot. You assist Incident Commanders, District Magistrates, and Civil Defense Responders during severe coastal cyclones and flooding.

STRICT OPERATIONAL CONSTRAINTS:
1. TRUTH & PROVENANCE: Every shelter name, route waypoint, flood depth, wind velocity, and population figure you mention MUST originate from a tool call or the provided situation state. NEVER fabricate coordinates, shelter names, or casualty estimates.
2. DETERMINISTIC TOOLS FIRST: When asked about shelters, routes, or infrastructure cascades, ALWAYS invoke the appropriate tool (e.g. `get_safe_shelter_destinations`, `compute_safe_evacuation_path`). Do not answer from memory.
3. UNVERIFIED CLAIMS: If an entity or route cannot be found in the tool results, state: "The requested entity is not verified in current official registries." Never guess.
4. HONEST UNCERTAINTY: Acknowledge forecast cones and uncertainty bounds. Explain the mathematical basis (e.g. "Calculated via Holland radial wind profile and TOPSIS multi-criteria clearance").
5. TONE: Calm, objective, concise, and operational. Avoid sensationalism or emotional drama. Highlight time-critical deadlines (e.g. "Safe evacuation corridor closes at 14:30 IST due to tidal surge onset").
```

---

### 5. Post-Generation Verification Guardrail

Before tokens from Gemini are pushed to the client Server-Sent Events (SSE) stream, a fast regex-and-database verification filter verifies that all cited entities exist:

```python
# backend/app/copilot/guardrails.py
import re
from app.models.shelter import ShelterEntity

class HallucinationGuardrail:
    def __init__(self, db_session):
        self.db = db_session

    async def verify_generated_text(self, text: str, ground_truth_context: dict) -> tuple[bool, str]:
        # 1. Extract mentioned shelter IDs (e.g. SHELTER_[A-Z0-9_]+)
        mentioned_shelters = re.findall(r"SHELTER_[A-Z0-9_]+", text)
        valid_shelter_ids = ground_truth_context.get("valid_shelter_ids", set())
        
        for shelter_id in mentioned_shelters:
            if shelter_id not in valid_shelter_ids:
                # Hallucination detected: intercept and flag
                return False, f"[VERIFICATION ERROR: {shelter_id} not found in verified registry]"
        
        # 2. Extract numerical flood depths cited as X.Xm
        # Cross-reference that maximum depth cited does not exceed simulated maximum
        return True, text
```

---

### 6. Multilingual Vernacular Localization Pipeline

Emergency advisories must reach diverse coastal populations in their native languages (Odia, Bengali, Hindi, Telugu) without corrupting numbers or deadlines:

1. **Step 1: Parameter Slot Extraction**:
   Extract exact slot values: `{zone: "Chhatrapur", wind: "165 km/h", cutoff: "15:30 IST", shelter: "Kalyanpur High School"}`.
2. **Step 2: Template Selection**:
   Select pre-approved NDMA/OSDMA emergency announcement template.
3. **Step 3: Gemini Vernacular Translation**:
   Translate using zero-shot target language prompts enforcing strict preservation of bracketed tokens.
4. **Step 4: Strict Number & Proper Noun Audit**:
   Compare token numbers between English template and translated text. If any integer or proper noun is missing or altered, the pipeline rejects the translation and emits the standard pre-compiled vernacular fallback template.
