"""
PRALAYA Deterministic Hazard Engine - Storm Surge Hazard Component
Evaluates coastal storm surge propagation, hydrodynamic friction dissipation,
and terrain clearance margin to compute net inundation hazard.
"""

from datetime import datetime, timezone
import math
from risk.models.hazard_inputs import HazardCellInput, HazardThresholdConfig
from risk.models.hazard_outputs import ComponentHazardOutput, HazardLevel


class SurgeHazard:
    """
    Deterministic hydrodynamic storm surge component.
    Models coastal surge attenuation with inland distance and bare-earth elevation clearance.
    """

    def __init__(self, thresholds: HazardThresholdConfig | None = None):
        self.thresholds = thresholds or HazardThresholdConfig()
        self.model_version = "PRALAYA-HAZARD-v1.0-DETERMINISTIC"

    def compute(self, cell: HazardCellInput) -> ComponentHazardOutput:
        cfg = cell.thresholds or self.thresholds

        h_surge_coastal = cell.storm_surge_peak_m
        dist_km = max(0.0, cell.coastal_proximity_m / 1000.0)
        elev_m = cell.elevation_m

        # 1. Inland Hydrodynamic Dissipation
        # Surge loses energy as it pushes over land surface and vegetation friction
        # Loss ~ 0.35m per km inland (configurable)
        attenuation = dist_km * cfg.coastal_attenuation_per_km
        h_surge_local = max(0.0, h_surge_coastal - attenuation)

        # 2. Net Overland Inundation Depth over Terrain
        # If elevation is positive, it reduces water depth; if negative (coastal depression), depth increases
        if h_surge_local <= 0.0:
            net_surge_depth_m = 0.0
        else:
            net_surge_depth_m = max(0.0, h_surge_local - max(0.0, elev_m))

        # 3. Normalized Hazard Score [0.0, 1.0]
        # Benchmark catastrophic surge depth: 4.0m above ground
        if net_surge_depth_m <= 0.0:
            # Even if dry, proximity to high coastal surge poses residual barrier breach risk
            if dist_km < 1.0 and h_surge_coastal > 2.0:
                normalized_score = min(0.20, (h_surge_coastal / 10.0) * (1.0 / (dist_km + 0.2)))
            else:
                normalized_score = 0.0
        elif net_surge_depth_m < cfg.surge_moderate_m:
            normalized_score = 0.20 + (net_surge_depth_m / cfg.surge_moderate_m) * 0.30
        elif net_surge_depth_m < cfg.surge_severe_m:
            normalized_score = 0.50 + ((net_surge_depth_m - cfg.surge_moderate_m) / (cfg.surge_severe_m - cfg.surge_moderate_m)) * 0.30
        elif net_surge_depth_m < cfg.surge_extreme_m:
            normalized_score = 0.80 + ((net_surge_depth_m - cfg.surge_severe_m) / (cfg.surge_extreme_m - cfg.surge_severe_m)) * 0.15
        else:
            normalized_score = 1.0

        normalized_score = round(min(1.0, max(0.0, normalized_score)), 4)

        # 4. Categorical Rating
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

        # 5. Scientific Uncertainty: +/- 0.35m hydrodynamic bathymetric setup uncertainty
        uncertainty = (
            round(max(0.0, net_surge_depth_m - 0.35), 2),
            round(net_surge_depth_m + 0.35, 2),
        )

        return ComponentHazardOutput(
            component_name="surge",
            value=round(net_surge_depth_m, 2),
            normalized_score=normalized_score,
            hazard_level=level,
            unit="meters",
            timestamp=cell.timestamp,
            source="1D Bathymetric Wind-Stress Setup / Inverse Barometer Formulation",
            model_version=self.model_version,
            confidence=0.88,
            uncertainty_range=uncertainty,
            details={
                "offshore_surge_peak_m": h_surge_coastal,
                "inland_distance_km": round(dist_km, 2),
                "local_water_level_m": round(h_surge_local, 2),
                "net_overland_depth_m": round(net_surge_depth_m, 2),
                "terrain_clearance_m": round(elev_m - h_surge_local, 2),
                "severe_inundation_warning": net_surge_depth_m >= cfg.surge_severe_m,
            },
        )
