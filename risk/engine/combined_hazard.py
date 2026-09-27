"""
PRALAYA Deterministic Hazard Engine - Combined Multi-Hazard Component
Synthesizes Rainfall, Wind, Storm Surge, and Terrain Flood Exposure.
Models non-linear compound interactions (surge backwater blockage + pluvial flooding).
Generates the verified diagnostic Explanation Object with primary drivers and contributing factors.
"""

from datetime import datetime, timezone
from typing import Tuple, List, Dict, Any, Optional

from risk.models.hazard_inputs import HazardCellInput, HazardThresholdConfig
from risk.models.hazard_outputs import ComponentHazardOutput, HazardLevel
from risk.models.hazard_explanation import HazardExplanation
from risk.engine.rainfall_hazard import RainfallHazard
from risk.engine.wind_hazard import WindHazard
from risk.engine.surge_hazard import SurgeHazard
from risk.engine.flood_exposure import FloodExposure


class CombinedHazard:
    """
    Deterministic compound multi-hazard evaluator.
    Synthesizes meteorology, surge hydrodynamics, and terrain physics.
    Produces documented [0.0, 1.0] normalized scores and diagnostic explanation objects.
    """

    def __init__(
        self,
        thresholds: Optional[HazardThresholdConfig] = None,
        rainfall_engine: Optional[RainfallHazard] = None,
        wind_engine: Optional[WindHazard] = None,
        surge_engine: Optional[SurgeHazard] = None,
        exposure_engine: Optional[FloodExposure] = None,
    ):
        self.thresholds = thresholds or HazardThresholdConfig()
        self.rainfall_engine = rainfall_engine or RainfallHazard(self.thresholds)
        self.wind_engine = wind_engine or WindHazard(self.thresholds)
        self.surge_engine = surge_engine or SurgeHazard(self.thresholds)
        self.exposure_engine = exposure_engine or FloodExposure(self.thresholds)
        self.model_version = "PRALAYA-HAZARD-v1.0-DETERMINISTIC"

    def compute(
        self, cell: HazardCellInput
    ) -> Tuple[
        ComponentHazardOutput,
        ComponentHazardOutput,
        ComponentHazardOutput,
        ComponentHazardOutput,
        ComponentHazardOutput,
        HazardExplanation,
    ]:
        """
        Executes deterministic multi-hazard evaluation.
        Returns:
            (rainfall_out, wind_out, surge_out, exposure_out, combined_out, explanation)
        """
        # 1. Evaluate Individual Physics Components
        rain_out = self.rainfall_engine.compute(cell)
        wind_out = self.wind_engine.compute(cell)
        surge_out = self.surge_engine.compute(cell)
        exp_out = self.exposure_engine.compute(cell)

        s_rain = rain_out.normalized_score
        s_wind = wind_out.normalized_score
        s_surge = surge_out.normalized_score
        s_exp = exp_out.normalized_score

        # 2. Compound Interaction Mechanics:
        # In coastal river mouths (e.g. Rushikulya, Mahanadi), pluvial runoff cannot drain when surge is high (Backwater Effect).
        # We apply a deterministic compounding multiplier:
        compound_multiplier = 1.0 + 0.20 * (s_surge * s_rain) + 0.10 * (s_surge * s_wind)

        # Baseline weighted synthesis:
        # 35% Storm Surge Inundation + 30% Rainfall + 20% Wind + 15% Terrain Exposure
        base_hazard = (0.35 * s_surge) + (0.30 * s_rain) + (0.20 * s_wind) + (0.15 * s_exp)
        combined_score = round(min(1.0, max(0.0, base_hazard * compound_multiplier)), 4)

        # 3. Categorical Multi-Hazard Level
        if combined_score < 0.25:
            level = HazardLevel.LOW
        elif combined_score < 0.50:
            level = HazardLevel.MODERATE
        elif combined_score < 0.75:
            level = HazardLevel.HIGH
        elif combined_score < 0.90:
            level = HazardLevel.SEVERE
        else:
            level = HazardLevel.CATASTROPHIC

        # 4. Generate Deterministic Explanation Object
        primary_drivers: List[str] = []
        contributing_factors: List[str] = []

        # Identify primary drivers (scores >= 0.50 or dominant components)
        components = [
            ("surge", s_surge, surge_out.value, f"Overland coastal storm surge inundation of {surge_out.value}m MSL"),
            ("rainfall", s_rain, cell.accumulated_rainfall_24h_mm, f"Extreme pluvial rainfall intensity ({cell.rainfall_rate_mm_h} mm/h, {cell.accumulated_rainfall_24h_mm} mm/24h)"),
            ("wind", s_wind, cell.wind_speed_kmh, f"Destructive cyclonic wind forces ({cell.wind_speed_kmh} km/h, gusts {cell.wind_gust_kmh or round(cell.wind_speed_kmh * 1.25, 1)} km/h)"),
            ("exposure", s_exp, cell.elevation_m, f"Critical low-elevation terrain vulnerability ({cell.elevation_m}m MSL)"),
        ]

        # Sort by severity
        sorted_components = sorted(components, key=lambda x: x[1], reverse=True)

        for comp_name, score, val, desc in sorted_components:
            if score >= 0.50:
                primary_drivers.append(desc)
            elif score >= 0.25:
                contributing_factors.append(desc)

        # Add physical context triggers
        if cell.coastal_proximity_m <= 1500.0:
            contributing_factors.append(f"Immediate coastal shoreline proximity ({round(cell.coastal_proximity_m)}m)")
        if cell.surface_water_occurrence_pct >= 50.0:
            contributing_factors.append(f"High historical baseline water occurrence ({round(cell.surface_water_occurrence_pct)}% permanence)")
        if s_surge > 0.3 and s_rain > 0.3:
            contributing_factors.append("Compound backwater effect: coastal surge impedes gravity drainage of pluvial runoff")

        if not primary_drivers:
            primary_drivers.append("All physical hazards remain below immediate emergency warning thresholds.")

        sources = sorted(list({rain_out.source, wind_out.source, surge_out.source, exp_out.source}))

        explanation = HazardExplanation(
            hazard_level=level.value,
            primary_drivers=primary_drivers,
            contributing_factors=contributing_factors,
            timestamp=cell.timestamp,
            sources=sources,
        )

        # Combined scientific uncertainty interval
        min_u = min(rain_out.confidence, wind_out.confidence, surge_out.confidence, exp_out.confidence)
        confidence = round(min_u, 2)
        uncertainty = (
            round(max(0.0, combined_score * 0.92), 4),
            round(min(1.0, combined_score * 1.08), 4),
        )

        combined_out = ComponentHazardOutput(
            component_name="combined",
            value=combined_score,
            normalized_score=combined_score,
            hazard_level=level,
            unit="composite_index",
            timestamp=cell.timestamp,
            source="PRALAYA Multi-Hazard Synthesis / Hydrodynamic Compound Model",
            model_version=self.model_version,
            confidence=confidence,
            uncertainty_range=uncertainty,
            details={
                "base_hazard_score": round(base_hazard, 4),
                "compound_multiplier": round(compound_multiplier, 3),
                "component_weights": {"surge": 0.35, "rainfall": 0.30, "wind": 0.20, "exposure": 0.15},
                "scientific_notice": "Deterministic diagnostic model calibrated against IMD/CWC historical hazard matrices. Not a standalone Numerical Weather Prediction solver.",
            },
        )

        return (rain_out, wind_out, surge_out, exp_out, combined_out, explanation)
