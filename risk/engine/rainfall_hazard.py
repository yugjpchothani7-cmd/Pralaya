"""
PRALAYA Deterministic Hazard Engine - Rainfall Hazard Component
Computes deterministic pluvial hazard index from instantaneous rate and 24h accumulation.
No LLM or stochastic approximation; uses verified physical meteorological thresholds.
"""

from datetime import datetime, timezone
from risk.models.hazard_inputs import HazardCellInput, HazardThresholdConfig
from risk.models.hazard_outputs import ComponentHazardOutput, HazardLevel


class RainfallHazard:
    """
    Deterministic precipitation hazard evaluator.
    Evaluates both flash pluvial intensity (mm/h) and macro catchment saturation (24h accumulation).
    """

    def __init__(self, thresholds: HazardThresholdConfig | None = None):
        self.thresholds = thresholds or HazardThresholdConfig()
        self.model_version = "PRALAYA-HAZARD-v1.0-DETERMINISTIC"

    def compute(self, cell: HazardCellInput) -> ComponentHazardOutput:
        cfg = cell.thresholds or self.thresholds

        # 1. Rate Intensity Component (0.0 to 1.0)
        rate = cell.rainfall_rate_mm_h
        if rate <= 0.0:
            s_rate = 0.0
        elif rate < cfg.rainfall_rate_low_mm_h:
            s_rate = (rate / cfg.rainfall_rate_low_mm_h) * 0.20
        elif rate < cfg.rainfall_rate_moderate_mm_h:
            s_rate = 0.20 + ((rate - cfg.rainfall_rate_low_mm_h) / (cfg.rainfall_rate_moderate_mm_h - cfg.rainfall_rate_low_mm_h)) * 0.30
        elif rate < cfg.rainfall_rate_extreme_mm_h:
            s_rate = 0.50 + ((rate - cfg.rainfall_rate_moderate_mm_h) / (cfg.rainfall_rate_extreme_mm_h - cfg.rainfall_rate_moderate_mm_h)) * 0.40
        else:
            s_rate = min(1.0, 0.90 + ((rate - cfg.rainfall_rate_extreme_mm_h) / 50.0) * 0.10)

        # 2. 24-hour Accumulation Component (0.0 to 1.0)
        accum = cell.accumulated_rainfall_24h_mm
        if accum <= 0.0:
            s_accum = 0.0
        elif accum < cfg.rainfall_accum_moderate_mm:
            s_accum = (accum / cfg.rainfall_accum_moderate_mm) * 0.40
        elif accum < cfg.rainfall_accum_heavy_mm:
            s_accum = 0.40 + ((accum - cfg.rainfall_accum_moderate_mm) / (cfg.rainfall_accum_heavy_mm - cfg.rainfall_accum_moderate_mm)) * 0.35
        elif accum < cfg.rainfall_accum_extreme_mm:
            s_accum = 0.75 + ((accum - cfg.rainfall_accum_heavy_mm) / (cfg.rainfall_accum_extreme_mm - cfg.rainfall_accum_heavy_mm)) * 0.20
        else:
            s_accum = min(1.0, 0.95 + ((accum - cfg.rainfall_accum_extreme_mm) / 100.0) * 0.05)

        # 3. Deterministic Superposition: 45% hourly rate + 55% antecedent accumulation
        normalized_score = round(min(1.0, max(0.0, 0.45 * s_rate + 0.55 * s_accum)), 4)

        # 4. Categorical Level
        if normalized_score < 0.25:
            level = HazardLevel.LOW
        elif normalized_score < 0.50:
            level = HazardLevel.MODERATE
        elif normalized_score < 0.75:
            level = HazardLevel.HIGH
        elif normalized_score < 0.90:
            level = HazardLevel.SEVERE
        else:
            level = HazardLevel.CATASTROPHIC

        # 5. Scientific Uncertainty: Radar gauge estimation margin ~10%
        uncertainty = (round(max(0.0, rate * 0.90), 1), round(rate * 1.10, 1))

        return ComponentHazardOutput(
            component_name="rainfall",
            value=round(rate, 2),
            normalized_score=normalized_score,
            hazard_level=level,
            unit="mm/h",
            timestamp=cell.timestamp,
            source="IMD AWS Network / CHIRPS Blended Precipitation / Doppler Radar",
            model_version=self.model_version,
            confidence=0.92,
            uncertainty_range=uncertainty,
            details={
                "rainfall_rate_mm_h": rate,
                "accumulated_24h_mm": accum,
                "rate_score": round(s_rate, 4),
                "accumulation_score": round(s_accum, 4),
                "soil_saturation_warning": accum >= cfg.rainfall_accum_moderate_mm,
                "cloudburst_trigger": rate >= cfg.rainfall_rate_extreme_mm_h,
            },
        )
