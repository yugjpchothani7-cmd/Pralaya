"""
PRALAYA Deterministic Hazard Engine - Geospatial Surface Generator
Generates discretized 2D spatial grid evaluations across an evaluated Region of Interest.
Produces GeoJSON FeatureCollections for direct rendering in GIS map viewers.
"""

from datetime import datetime, timezone
import hashlib
from typing import List, Dict, Any, Optional

from risk.models.hazard_inputs import HazardCellInput, HazardThresholdConfig
from risk.models.hazard_outputs import ComponentHazardOutput, HazardLevel
from risk.models.hazard_explanation import HazardExplanation
from risk.models.hazard_surface import GeospatialHazardCell, GeospatialHazardSurface
from risk.engine.combined_hazard import CombinedHazard


class HazardSurfaceGenerator:
    """
    Generates multi-hazard spatial surfaces across geographic zones.
    Evaluates each grid cell through the deterministic CombinedHazard engine.
    """

    def __init__(self, combined_engine: Optional[CombinedHazard] = None):
        self.engine = combined_engine or CombinedHazard()
        self.model_version = "PRALAYA-HAZARD-v1.0-DETERMINISTIC"

    def evaluate_cell(self, cell_input: HazardCellInput) -> GeospatialHazardCell:
        """Evaluates a single cell across all hazard dimensions."""
        rain_out, wind_out, surge_out, exp_out, combined_out, explanation = self.engine.compute(cell_input)

        return GeospatialHazardCell(
            cell_id=cell_input.cell_id,
            latitude=cell_input.latitude,
            longitude=cell_input.longitude,
            elevation_m=cell_input.elevation_m,
            coastal_proximity_m=cell_input.coastal_proximity_m,
            rainfall_hazard=rain_out,
            wind_hazard=wind_out,
            surge_hazard=surge_out,
            flood_exposure=exp_out,
            combined_hazard=combined_out,
            explanation=explanation,
        )

    def generate_surface(
        self,
        region_id: str,
        cell_inputs: List[HazardCellInput],
        grid_resolution_km: float = 2.0,
    ) -> GeospatialHazardSurface:
        """
        Executes hazard evaluations across all cell inputs and builds the comprehensive surface.
        """
        now = datetime.now(timezone.utc)
        evaluated_cells: List[GeospatialHazardCell] = []
        geojson_features: List[Dict[str, Any]] = []

        scores: List[float] = []
        high_hazard_count = 0

        for inp in cell_inputs:
            cell = self.evaluate_cell(inp)
            evaluated_cells.append(cell)

            score = cell.combined_hazard.normalized_score
            scores.append(score)
            if cell.combined_hazard.hazard_level in [HazardLevel.HIGH, HazardLevel.SEVERE, HazardLevel.CATASTROPHIC]:
                high_hazard_count += 1

            # Construct GeoJSON Polygon representing cell area (half-width delta ~ grid_resolution_km)
            d_lat = (grid_resolution_km / 111.0) / 2.0
            d_lon = (grid_resolution_km / (111.0 * 0.95)) / 2.0

            poly_coords = [
                [
                    [round(cell.longitude - d_lon, 4), round(cell.latitude - d_lat, 4)],
                    [round(cell.longitude + d_lon, 4), round(cell.latitude - d_lat, 4)],
                    [round(cell.longitude + d_lon, 4), round(cell.latitude + d_lat, 4)],
                    [round(cell.longitude - d_lon, 4), round(cell.latitude + d_lat, 4)],
                    [round(cell.longitude - d_lon, 4), round(cell.latitude - d_lat, 4)],
                ]
            ]

            geojson_features.append({
                "type": "Feature",
                "id": cell.cell_id,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": poly_coords,
                },
                "properties": {
                    "cell_id": cell.cell_id,
                    "latitude": cell.latitude,
                    "longitude": cell.longitude,
                    "hazard_level": cell.combined_hazard.hazard_level.value,
                    "combined_score": cell.combined_hazard.normalized_score,
                    "surge_depth_m": cell.surge_hazard.value,
                    "surge_score": cell.surge_hazard.normalized_score,
                    "rainfall_rate_mm_h": cell.rainfall_hazard.value,
                    "rainfall_score": cell.rainfall_hazard.normalized_score,
                    "wind_speed_kmh": cell.wind_hazard.value,
                    "wind_score": cell.wind_hazard.normalized_score,
                    "elevation_m": cell.elevation_m,
                    "coastal_distance_km": round(cell.coastal_proximity_m / 1000.0, 1),
                    "primary_driver": cell.explanation.primary_drivers[0] if cell.explanation.primary_drivers else "Normal",
                }
            })

        mean_score = round(sum(scores) / len(scores), 4) if scores else 0.0
        max_score = round(max(scores), 4) if scores else 0.0
        high_pct = round((high_hazard_count / len(scores)) * 100.0, 1) if scores else 0.0

        if mean_score < 0.25:
            reg_level = HazardLevel.LOW
        elif mean_score < 0.50:
            reg_level = HazardLevel.MODERATE
        elif mean_score < 0.75:
            reg_level = HazardLevel.HIGH
        elif mean_score < 0.90:
            reg_level = HazardLevel.SEVERE
        else:
            reg_level = HazardLevel.CATASTROPHIC

        reg_explanation = HazardExplanation(
            hazard_level=reg_level.value,
            primary_drivers=[
                f"Peak localized hazard score reaches {max_score} with {high_pct}% of area at HIGH or greater severity.",
                "Compounding coastal storm surge inundation converging with pluvial rainfall runoff.",
            ],
            contributing_factors=[
                f"Evaluated across {len(cell_inputs)} discrete spatial grid points with {grid_resolution_km} km resolution.",
                "Bare-earth elevation plinth margins heavily constrained along estuary corridors.",
            ],
            timestamp=now,
            sources=[
                "IMD Doppler Radar / Automatic Weather Stations",
                "Holland Radial Wind Profile Parameterization",
                "1D Shallow Water Wind-Stress & Inverse Barometer Surge Equilibrium",
                "Copernicus FABDEM 30m / EC JRC Global Surface Water",
            ],
        )

        surface_id = f"SURFACE_{region_id.upper()}_{now.strftime('%Y%m%d%H%M')}"

        return GeospatialHazardSurface(
            surface_id=surface_id,
            region_id=region_id,
            timestamp=now,
            grid_resolution_km=grid_resolution_km,
            model_version=self.model_version,
            total_cells=len(evaluated_cells),
            cells=evaluated_cells,
            mean_hazard_score=mean_score,
            max_hazard_score=max_score,
            overall_hazard_level=reg_level,
            high_hazard_area_pct=high_pct,
            geojson_features={
                "type": "FeatureCollection",
                "features": geojson_features,
            },
            regional_explanation=reg_explanation,
        )

    def generate_regional_scenario_surface(
        self,
        region_id: str = "gopalpur-coastal-odisha",
        surge_shock: float = 0.0,
        rain_shock: float = 0.0,
        high_tide: bool = False,
    ) -> GeospatialHazardSurface:
        """
        Convenience builder generating realistic spatial hazard surface for Gopalpur coastal corridor
        with support for What-If shocks (surge shock, rainfall shock, astronomical high tide).
        Discretizes key geographic sub-zones from shoreline to inland foothills.
        """
        now = datetime.now(timezone.utc)

        # Baseline storm surge: 3.8m + shocks
        base_surge = 3.8 + surge_shock + (0.8 if high_tide else 0.0)
        # Baseline rainfall: 35 mm/h rate, 180 mm 24h accum + shocks
        base_rain_rate = 35.0 + rain_shock * 0.4
        base_rain_accum = 180.0 + rain_shock * 2.0
        # Sustained wind speed: 140 km/h
        base_wind = 140.0

        # Define 12 representative spatial grid cells spanning coastline, estuary, lowlands, and inland ridge
        grid_specs = [
            # Coastal Shoreline / Lowland Cells
            ("CELL_GOPALPUR_BEACH", 19.260, 84.910, 1.8, 150.0, 85.0),
            ("CELL_ARJIPALLI_COAST", 19.310, 85.010, 2.2, 350.0, 90.0),
            ("CELL_RUSHIKULYA_MOUTH", 19.335, 85.045, 1.2, 200.0, 95.0),
            ("CELL_PRAYAGI_INLET", 19.375, 85.090, 1.5, 400.0, 80.0),
            # River Estuary & Low-Lying Agriculture (0.5km - 2.5km inland)
            ("CELL_CHHATRAPUR_LOWLAND", 19.355, 84.990, 4.2, 1800.0, 45.0),
            ("CELL_GOPALPUR_PORT_HINTER", 19.290, 84.950, 4.8, 2200.0, 30.0),
            ("CELL_HUMMA_SALT_PANS", 19.410, 85.060, 2.5, 1200.0, 75.0),
            ("CELL_KALYANPUR_FLOODPLAIN", 19.380, 84.965, 6.5, 3500.0, 20.0),
            # Inland Corridor & Safe Highlands (> 5km inland)
            ("CELL_BERHAMPUR_URBAN", 19.315, 84.790, 28.5, 12500.0, 5.0),
            ("CELL_INLAND_RIDGE_KALYAN", 19.395, 84.920, 42.0, 8500.0, 0.0),
            ("CELL_PURUSHOTTAMPUR_NORTH", 19.520, 84.880, 32.0, 18000.0, 10.0),
            ("CELL_GANJAM_TERRACE", 19.385, 84.850, 24.0, 11000.0, 2.0),
        ]

        cell_inputs: List[HazardCellInput] = []

        for cid, lat, lon, elev, coast_dist, water_pct in grid_specs:
            # Inland wind decays slightly with distance from eye / coast
            dist_factor = max(0.65, 1.0 - (coast_dist / 60000.0))
            w_speed = base_wind * dist_factor

            # Pluvial rain pooling in low elevations
            r_rate = base_rain_rate * (1.15 if elev < 5.0 else 0.95)
            r_accum = base_rain_accum * (1.20 if elev < 5.0 else 0.90)

            inp = HazardCellInput(
                cell_id=cid,
                latitude=lat,
                longitude=lon,
                rainfall_rate_mm_h=round(r_rate, 1),
                accumulated_rainfall_24h_mm=round(r_accum, 1),
                wind_speed_kmh=round(w_speed, 1),
                wind_gust_kmh=round(w_speed * 1.25, 1),
                coastal_proximity_m=coast_dist,
                elevation_m=elev,
                surface_water_occurrence_pct=water_pct,
                storm_surge_peak_m=base_surge,
                timestamp=now,
            )
            cell_inputs.append(inp)

        return self.generate_surface(region_id=region_id, cell_inputs=cell_inputs, grid_resolution_km=2.5)
