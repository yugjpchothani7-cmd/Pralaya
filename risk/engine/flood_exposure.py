"""
PRALAYA Deterministic Hazard Engine - Flood Exposure & Terrain Susceptibility Component
Evaluates static and baseline physical vulnerability of the terrain:
elevation plinth clearance, coastal proximity, and satellite surface water occurrence.
"""

from datetime import datetime, timezone
import math
from risk.models.hazard_inputs import HazardCellInput, HazardThresholdConfig
from risk.models.hazard_outputs import ComponentHazardOutput, HazardLevel


class FloodExposure:
    """
    Deterministic terrain susceptibility & flood exposure component.
    Evaluates topographic depression vulnerability, coastal exposure, and baseline drainage convergence.
    """

    def __init__(self, thresholds: HazardThresholdConfig | None = None):
        self.thresholds = thresholds or HazardThresholdConfig()
        self.model_version = "PRALAYA-HAZARD-v1.0-DETERMINISTIC"

    def compute(self, cell: HazardCellInput) -> ComponentHazardOutput:
        cfg = cell.thresholds or self.thresholds

        elev_m = cell.elevation_m
        dist_km = max(0.0, cell.coastal_proximity_m / 1000.0)
        water_pct = cell.surface_water_occurrence_pct

        # 1. Elevation Susceptibility Component (0.0 to 1.0)
        # Below 0m (coastal depression) = 1.0
        # 0m to 5m = 0.70 to 1.0 (Critical zone)
        # 5m to 25m = 0.20 to 0.70 (Moderate zone)
        # Above 25m = < 0.20 (Safe natural highland)
        if elev_m <= 0.0:
            s_elev = 1.0
        elif elev_m < cfg.elevation_critical_m:
            s_elev = 0.70 + (1.0 - (elev_m / cfg.elevation_critical_m)) * 0.30
        elif elev_m < cfg.elevation_safe_m:
            s_elev = 0.20 + (1.0 - ((elev_m - cfg.elevation_critical_m) / (cfg.elevation_safe_m - cfg.elevation_critical_m))) * 0.50
        else:
            s_elev = max(0.02, 0.20 * math.exp(-0.05 * (elev_m - cfg.elevation_safe_m)))

        # 2. Coastal Proximity Factor (0.0 to 1.0)
        # Maximal directly on coastline, decaying with distance
        s_coast = math.exp(-0.25 * dist_km)

        # 3. Surface Water Baseline Permanence Factor (0.0 to 1.0)
        # Areas with high natural water occurrence (lakes, estuaries, wetlands) have zero infiltration capacity
        s_water = min(1.0, max(0.0, water_pct / 100.0))

        # 4. Multi-criteria Deterministic Synthesis:
        # 50% Topographic Elevation + 30% Coastal Proximity + 20% Baseline Surface Water
        normalized_score = round(min(1.0, max(0.0, 0.50 * s_elev + 0.30 * s_coast + 0.20 * s_water)), 4)

        # 5. Categorical Rating
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

        # 6. Uncertainty: +/- 0.5m DEM vertical RMSE uncertainty
        uncertainty = (round(max(-2.0, elev_m - 0.5), 1), round(elev_m + 0.5, 1))

        return ComponentHazardOutput(
            component_name="flood_exposure",
            value=round(elev_m, 1),
            normalized_score=normalized_score,
            hazard_level=level,
            unit="meters MSL",
            timestamp=cell.timestamp,
            source="NASADEM 30m / FABDEM Copernicus DEM / EC JRC Global Surface Water",
            model_version=self.model_version,
            confidence=0.91,
            uncertainty_range=uncertainty,
            details={
                "elevation_m": elev_m,
                "coastal_distance_km": round(dist_km, 2),
                "surface_water_pct": water_pct,
                "elevation_susceptibility": round(s_elev, 4),
                "coastal_proximity_factor": round(s_coast, 4),
                "hydrological_convergence_factor": round(s_water, 4),
                "critical_lowland_flag": elev_m < cfg.elevation_critical_m,
            },
        )
