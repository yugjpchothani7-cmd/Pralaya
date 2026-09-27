# PRALAYA: Gemini AI Copilot & Reasoning Tier

This module implements the Google Gemini AI incident copilot, strict Pydantic tool schemas, post-generation hallucination guardrails, and multilingual advisory synthesis.

## Core Rules
- **No Hallucinated Safety Data**: Gemini never invents coordinates, shelters, or wind speeds
- **Deterministic Tools First**: All factual queries invoke backend tools (`query_live_hazard_status`, `get_safe_shelter_destinations`, `compute_safe_evacuation_path`)
- **Guardrail Cross-Check**: Post-generation verification filters intercept synthetic names before streaming to client
- **Dynamic Model Resolution**: Respects `GEMINI_MODEL` environment variable with fallback hierarchy
