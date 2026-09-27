"""
PRALAYA Deterministic Hazard Engine - Input Models
Strongly-typed schemas for hydro-meteorological and terrain observations.
No LLM or stochastic approximation in numerical hazard processing.
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class HazardThresholdConfig(BaseModel):
    """Configurable physical thresholds for multi-hazard classification."""
    model_config = ConfigDict(extra="forbid")

    # Rainfall rate thresholds (mm/h)
    rainfall_rate_low_mm_h: float = Field(default=5.0, description="Light rainfall threshold")
    rainfall_rate_moderate_mm_h: float = Field(default=15.0, description="Moderate precipitation threshold")
    rainfall_rate_heavy_mm_h: float = Field(default=35.0, description="Heavy rainfall threshold")
    rainfall_rate_extreme_mm_h: float = Field(default=65.0, description="Extreme cloudburst threshold")

    # Accumulated 24h rainfall thresholds (mm/24h)
    rainfall_accum_moderate_mm: float = Field(default=100.0, description="Warning level 24h accumulation")
    rainfall_accum_heavy_mm: float = Field(default=200.0, description="Danger level 24h accumulation")
    rainfall_accum_extreme_mm: float = Field(default=300.0, description="Catastrophic pluvial accumulation")

    # Wind speed thresholds (km/h)
    wind_gale_kmh: float = Field(default=62.0, description="Gale force wind threshold")
    wind_storm_kmh: float = Field(default=88.0, description="Severe storm wind threshold")
    wind_destructive_kmh: float = Field(default=118.0, description="Very severe cyclonic storm threshold")
    wind_catastrophic_kmh: float = Field(default=165.0, description="Extremely severe / Super cyclonic threshold")

    # Storm surge depth thresholds (meters above ground level)
    surge_moderate_m: float = Field(default=1.0, description="Moderate coastal inundation")
    surge_severe_m: float = Field(default=2.5, description="Severe inundation threshold")
    surge_extreme_m: float = Field(default=4.0, description="Catastrophic storm surge depth")

    # Terrain elevation and coastal attenuation
    elevation_critical_m: float = Field(default=5.0, description="Critical coastal low-lying elevation contour")
    elevation_safe_m: float = Field(default=25.0, description="Safe inland terrain clearance margin")
    coastal_attenuation_per_km: float = Field(
        default=0.35, description="Surge attenuation dissipation rate (meters lost per km inland)"
    )


class HazardCellInput(BaseModel):
    """
    Physical point or grid-cell observation/forecast input into the Deterministic Hazard Engine.
    Combines meteorological observations, terrain DEM, and satellite water information.
    """
    model_config = ConfigDict(extra="forbid")

    cell_id: str = Field(..., description="Unique cell or sensor point identifier")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")

    # Precipitation inputs
    rainfall_rate_mm_h: float = Field(..., ge=0.0, description="Instantaneous or 1h rainfall rate (mm/h)")
    accumulated_rainfall_24h_mm: float = Field(..., ge=0.0, description="24-hour antecedent rainfall accumulation (mm)")

    # Wind inputs
    wind_speed_kmh: float = Field(..., ge=0.0, description="10m sustained surface wind speed (km/h)")
    wind_gust_kmh: Optional[float] = Field(None, ge=0.0, description="Peak instantaneous wind gust (km/h)")

    # Geography and terrain inputs
    coastal_proximity_m: float = Field(..., ge=0.0, description="Euclidean distance to coastline in meters")
    elevation_m: float = Field(..., description="Bare-earth terrain elevation above Mean Sea Level (m MSL)")
    surface_water_occurrence_pct: float = Field(
        default=0.0, ge=0.0, le=100.0, description="Baseline surface water presence from JRC (0-100%)"
    )

    # Hydrodynamic storm surge inputs
    storm_surge_peak_m: float = Field(
        default=0.0, ge=0.0, description="Astronomical tide + surge peak level at nearest coastal boundary (m)"
    )

    # Temporal context
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Observation or forecast valid time in UTC"
    )
    forecast_lead_hours: float = Field(
        default=0.0, ge=0.0, description="Forecast lead time in hours (0.0 = live analysis)"
    )

    # Optional customized thresholds
    thresholds: Optional[HazardThresholdConfig] = Field(
        default=None, description="Custom thresholds; defaults applied if omitted"
    )
