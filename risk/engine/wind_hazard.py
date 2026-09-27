"""
PRALAYA Deterministic Hazard Engine - Wind Hazard Component
Evaluates cyclonic wind hazard using kinetic dynamic pressure scaling (v^2).
Incorporates sustained speeds, gust buffeting, and structural damage thresholds.
"""

from datetime import datetime, timezone
from risk.models.hazard_inputs import HazardCellInput, HazardThresholdConfig
from risk.models.hazard_outputs import ComponentHazardOutput, HazardLevel


class WindHazard:
    """
    Deterministic cyclonic wind hazard component.
    Models structural destructive force using kinetic dynamic pressure scaling (E ~ v^2).
    """

    def __init__(self, thresholds: HazardThresholdConfig | None = None):
        self.thresholds = thresholds or HazardThresholdConfig()
        self.model_version = "PRALAYA-HAZARD-v1.0-DETERMINISTIC"

    def compute(self, cell: HazardCellInput) -> ComponentHazardOutput:
        cfg = cell.thresholds or self.thresholds

        v_sustained = cell.wind_speed_kmh
        v_gust = cell.wind_gust_kmh if cell.wind_gust_kmh is not None else v_sustained * 1.25

        # 1. Effective dynamic pressure wind speed: 75% sustained + 25% peak gust
        v_eff = 0.75 * v_sustained + 0.25 * v_gust

        # 2. Kinetic Energy Scaling: Structural destruction scales with v^2
        # Normalize against catastrophic benchmark (165 km/h)
        v_cat = cfg.wind_catastrophic_kmh
        if v_eff <= 0.0:
            normalized_score = 0.0
        elif v_eff < cfg.wind_gale_kmh:
            # Below gale: minor hazard
            normalized_score = (v_eff / cfg.wind_gale_kmh) ** 2 * 0.25
        elif v_eff < cfg.wind_destructive_kmh:
            # Gale to destructive: intermediate exponential climb
            normalized_score = 0.25 + ((v_eff - cfg.wind_gale_kmh) / (cfg.wind_destructive_kmh - cfg.wind_gale_kmh)) ** 1.5 * 0.50
        else:
            # Destructive to catastrophic
            fraction = min(1.0, (v_eff - cfg.wind_destructive_kmh) / (v_cat - cfg.wind_destructive_kmh))
            normalized_score = 0.75 + fraction * 0.25

        normalized_score = round(min(1.0, max(0.0, normalized_score)), 4)

        # 3. Categorical Rating
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

        # 4. Uncertainty: Anemometer / Holland model approximation margin +/- 6 km/h
        uncertainty = (round(max(0.0, v_sustained - 6.0), 1), round(v_sustained + 6.0, 1))

        # Dynamic pressure (P = 0.5 * rho * v^2) in Pascals (N/m^2)
        v_ms = v_eff / 3.6
        dynamic_pressure_pa = round(0.5 * 1.225 * (v_ms ** 2), 1)

        return ComponentHazardOutput(
            component_name="wind",
            value=round(v_sustained, 1),
            normalized_score=normalized_score,
            hazard_level=level,
            unit="km/h",
            timestamp=cell.timestamp,
            source="IMD Cyclone Warning Centre / Holland Radial Wind Model",
            model_version=self.model_version,
            confidence=0.94,
            uncertainty_range=uncertainty,
            details={
                "sustained_wind_kmh": v_sustained,
                "gust_wind_kmh": round(v_gust, 1),
                "effective_wind_kmh": round(v_eff, 1),
                "dynamic_pressure_pa": dynamic_pressure_pa,
                "tree_uprooting_danger": v_sustained >= cfg.wind_storm_kmh,
                "structural_roof_failure_danger": v_sustained >= cfg.wind_destructive_kmh,
            },
        )
