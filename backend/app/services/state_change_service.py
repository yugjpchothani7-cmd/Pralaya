import os
from datetime import datetime
from typing import List, Dict, Any

from google.generativeai import GenerativeModel

from ..schemas.state_change import SystemState, DeltaEntry, StateChangeResponse

class StateChangeService:
    """Compute a delta between two SystemState snapshots.
    The engine performs a deterministic diff and optionally calls Gemini to
    generate a natural‑language summary. Gemini is never allowed to fabricate
    changes – the summary is built strictly from the generated DeltaEntry list.
    """

    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY")
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set")
        self.model = GenerativeModel(model_name)

    def _compare_scalar(self, name: str, prev: Any, curr: Any, source: str | None = None) -> List[DeltaEntry]:
        if prev == curr:
            return []
        indicator = "="
        if isinstance(prev, (int, float)) and isinstance(curr, (int, float)):
            indicator = "↑" if curr > prev else "↓"
        # Fallback arrow for non‑numeric changes
        else:
            indicator = "⊕" if curr and not prev else "⊖" if prev and not curr else "="
        return [
            DeltaEntry(
                metric=name,
                previous=str(prev) if prev is not None else "N/A",
                current=str(curr) if curr is not None else "N/A",
                change_indicator=indicator,
                timestamp=datetime.utcnow(),
                reason=None,
                source=source,
            )
        ]

    def _diff_dict(self, name: str, prev: Dict[str, Any] | None, curr: Dict[str, Any] | None, source: str | None = None) -> List[DeltaEntry]:
        prev = prev or {}
        curr = curr or {}
        entries: List[DeltaEntry] = []
        all_keys = set(prev.keys()) | set(curr.keys())
        for key in sorted(all_keys):
            p_val = prev.get(key)
            c_val = curr.get(key)
            if p_val == c_val:
                continue
            metric = f"{name}[{key}]"
            entries.extend(self._compare_scalar(metric, p_val, c_val, source))
        return entries

    def _diff_list(self, name: str, prev: List[Any] | None, curr: List[Any] | None, source: str | None = None) -> List[DeltaEntry]:
        prev_set = set(prev or [])
        curr_set = set(curr or [])
        added = curr_set - prev_set
        removed = prev_set - curr_set
        entries: List[DeltaEntry] = []
        for item in sorted(added):
            entries.append(
                DeltaEntry(
                    metric=name,
                    previous="N/A",
                    current=str(item),
                    change_indicator="↑",
                    timestamp=datetime.utcnow(),
                    reason=None,
                    source=source,
                )
            )
        for item in sorted(removed):
            entries.append(
                DeltaEntry(
                    metric=name,
                    previous=str(item),
                    current="N/A",
                    change_indicator="↓",
                    timestamp=datetime.utcnow(),
                    reason=None,
                    source=source,
                )
            )
        return entries

    def _generate_summary(self, deltas: List[DeltaEntry]) -> str:
        # Build a concise bullet list for Gemini to turn into prose.
        bullet_lines = [f"- {d.metric}: {d.previous} → {d.current} ({d.change_indicator})" for d in deltas]
        prompt = (
            "You are a concise disaster‑intelligence summariser. Using the bullet list below, "
            "produce a short natural‑language paragraph that describes what changed. "
            "Do NOT invent any information that is not present in the list.\n" +
            "\n".join(bullet_lines)
        )
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def compute_delta(self, previous: SystemState, current: SystemState) -> StateChangeResponse:
        deltas: List[DeltaEntry] = []
        # Simple scalar fields
        scalar_fields = [
            ("rainfall_mm", previous.rainfall_mm, current.rainfall_mm, "rainfall_sensor"),
            ("wind_kmh", previous.wind_kmh, current.wind_kmh, "wind_sensor"),
            ("hazard", previous.hazard, current.hazard, "hazard_model"),
            ("population_exposure", previous.population_exposure, current.population_exposure, "exposure_service"),
            ("recommended_destination", previous.recommended_destination, current.recommended_destination, "destination_engine"),
            ("recommended_route", previous.recommended_route, current.recommended_route, "routing_engine"),
        ]
        for name, p, c, src in scalar_fields:
            deltas.extend(self._compare_scalar(name, p, c, src))

        # Dict‑based metrics
        deltas.extend(self._diff_dict("road_accessibility", previous.road_accessibility, current.road_accessibility, "road_sensor"))
        deltas.extend(self._diff_dict("shelter_occupancy", previous.shelter_occupancy, current.shelter_occupancy, "shelter_monitor"))
        deltas.extend(self._diff_dict("infrastructure_risk", previous.infrastructure_risk, current.infrastructure_risk, "infra_risk_model"))

        # Alerts list diff
        deltas.extend(self._diff_list("alerts", previous.alerts, current.alerts, "alert_feed"))

        # Generate natural‑language summary via Gemini (no invention allowed)
        summary = self._generate_summary(deltas) if deltas else "No changes detected."

        return StateChangeResponse(deltas=deltas, summary=summary, generated_at=datetime.utcnow())
