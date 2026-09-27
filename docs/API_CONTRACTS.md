# PRALAYA: REST API Contracts & Schema Specifications

---

### 1. API Architecture & Common Conventions

- **Base URL**: `/api/v1`
- **Protocol**: HTTPS / HTTP/2 + Server-Sent Events (SSE) for real-time telemetry streaming
- **Data Serialization**: JSON (UTF-8) / GeoJSON (RFC 7946) for spatial geometries
- **Authentication**: Bearer JWT tokens in `Authorization` header or cryptographically signed session cookies
- **Error Standard**: RFC 7807 Problem Details for HTTP APIs

#### Standard Error Response Envelope:
```json
{
  "type": "https://pralaya.ai/errors/FLOOD_ROUTE_IMPASSABLE",
  "title": "Evacuation Route Impassable",
  "status": 422,
  "detail": "All ground corridors to shelter SH-09 exceed maximum safe vehicle immersion depth of 0.30m.",
  "instance": "/api/v1/routing/evacuation",
  "timestamp": "2026-09-27T08:45:10Z",
  "error_code": "ERR_ROUTE_FLOOD_SEVERED",
  "metadata": {
    "submerged_edge_id": "ROAD_SH14_KM12",
    "max_detected_depth_m": 0.74,
    "recommended_action": "DISPATCH_AMPHIBIOUS_RESCUE"
  }
}
```

---

### 2. Endpoints Specification

#### 2.1 Live Situation & Timeline Scrubber
##### `GET /api/v1/situation/summary`
Returns high-level situational metrics, active cyclone track, affected population counts, and active alert summaries.
- **Query Parameters**:
  - `scenario_id` (optional, string): Scenario identifier (defaults to active live event).
  - `timestamp` (optional, ISO 8601): Target point in time for historical/forecast query.
- **Response 200 OK**:
```json
{
  "event_id": "CYC_KARUNA_2026",
  "name": "Cyclone Karuna",
  "category": "Extremely Severe Cyclonic Storm (ESCS)",
  "current_status": {
    "center_lat": 19.34,
    "center_lon": 85.12,
    "central_pressure_hpa": 952.0,
    "max_sustained_wind_kmh": 165.0,
    "gusts_kmh": 185.0,
    "movement_speed_kmh": 14.0,
    "bearing_deg": 315.0,
    "landfall_eta": "2026-09-27T16:00:00Z"
  },
  "impact_summary": {
    "population_in_danger_zone": 142500,
    "evacuation_completed_count": 89400,
    "evacuation_progress_pct": 62.7,
    "submerged_area_sqkm": 284.5,
    "critical_assets_at_risk_count": 18,
    "active_shelters_count": 42,
    "shelter_total_capacity": 120000,
    "shelter_current_occupancy": 89400
  },
  "provenance": {
    "source_id": "IMD_BULLETIN_KARUNA_14",
    "fetched_at": "2026-09-27T08:15:00Z",
    "confidence_score": 0.96,
    "verification_level": "OFFICIAL_GOVERNMENT_FEED"
  }
}
```

##### `GET /api/v1/situation/timeline`
Retrieves time-indexed snapshot frames from $T-48\text{h}$ to $T+24\text{h}$ for the 4D replay scrubber.
- **Query Parameters**: `interval_hours` (default `3`)
- **Response 200 OK**:
```json
{
  "scenario_id": "CYC_KARUNA_2026",
  "frames": [
    {
      "time_offset_hours": -48,
      "valid_time": "2026-09-25T16:00:00Z",
      "eye_coordinates": [88.50, 16.20],
      "wind_speed_kmh": 65,
      "pressure_hpa": 998,
      "exposed_population": 0,
      "inundation_geojson_url": "/api/v1/layers/inundation/t-48.geojson"
    },
    {
      "time_offset_hours": 0,
      "valid_time": "2026-09-27T16:00:00Z",
      "eye_coordinates": [85.05, 19.45],
      "wind_speed_kmh": 165,
      "pressure_hpa": 952,
      "exposed_population": 142500,
      "inundation_geojson_url": "/api/v1/layers/inundation/t0.geojson"
    }
  ]
}
```

---

#### 2.2 Hazard & Hydrodynamic Surges
##### `GET /api/v1/hazard/surge-inundation`
Returns predicted coastal storm surge water level and spatial flood depth contours.
- **Query Parameters**:
  - `bbox` (string, comma-separated: `min_lon,min_lat,max_lon,max_lat`)
  - `format` (string: `geojson` or `cog_url`, default `geojson`)
- **Response 200 OK**:
```json
{
  "type": "FeatureCollection",
  "properties": {
    "model": "SLOSH_SURROGATE_HOLLAND_V2",
    "peak_surge_height_m": 4.82,
    "coastal_reach_km": 142.0,
    "calculation_timestamp": "2026-09-27T08:30:00Z"
  },
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[85.01, 19.35], [85.08, 19.39], [85.05, 19.32], [85.01, 19.35]]]
      },
      "properties": {
        "depth_range_m": "2.0-3.0",
        "mean_depth_m": 2.45,
        "hazard_category": "EXTREME",
        "flow_velocity_mps": 1.85
      }
    }
  ]
}
```

##### `GET /api/v1/hazard/wind-field`
Returns radial Holland wind field vector grid and gale-force isotachs.
- **Response 200 OK**:
```json
{
  "eye": [85.12, 19.34],
  "rmw_km": 32.5,
  "holland_b": 1.42,
  "isotachs_geojson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "isotach_knots": 64, "label": "Hurricane Force (>118 km/h)" },
        "geometry": { "type": "Polygon", "coordinates": [...] }
      }
    ]
  }
}
```

---

#### 2.3 Exposure, Vulnerability & Failure Cascades
##### `GET /api/v1/risk/exposure-vulnerability`
Returns multi-dimensional vulnerability and population exposure breakdown across administrative units.
- **Query Parameters**: `district_id` (string, optional)
- **Response 200 OK**:
```json
{
  "units": [
    {
      "unit_id": "MANDAL_CHHATRAPUR",
      "name": "Chhatrapur Coastal Block",
      "demographics": {
        "total_population": 48200,
        "infants_under_5": 3800,
        "elderly_over_65": 5400,
        "differently_abled": 720
      },
      "housing_fragility": {
        "kutcha_pct": 42.5,
        "semi_pucca_pct": 31.0,
        "pucca_pct": 26.5,
        "fragility_score": 0.74
      },
      "composite_vulnerability_index": 0.81,
      "vulnerability_tier": "HIGH_PRIORITY",
      "primary_risk_drivers": ["HIGH_KUTCHA_RATIO", "LOW_ELEVATION_ESTUARY", "RESTRICTED_ROAD_OUTLET"]
    }
  ]
}
```

##### `POST /api/v1/cascades/simulate`
Executes topological failure propagation across the infrastructure dependency DAG given primary asset failures or flood depths.
- **Request Body**:
```json
{
  "submerged_asset_ids": ["SUBSTATION_CHHATRAPUR_01", "BRIDGE_RUSHIKULYA_SH14"],
  "elapsed_hours": 4
}
```
- **Response 200 OK**:
```json
{
  "simulation_id": "CASCADE_SIM_8819",
  "primary_failures": [
    { "asset_id": "SUBSTATION_CHHATRAPUR_01", "type": "POWER_SUBSTATION", "reason": "FLOOD_SUBMERGENCE_DEPTH_1.1M" }
  ],
  "cascading_failures": [
    {
      "asset_id": "HOSPITAL_DISTRICT_02",
      "type": "HOSPITAL",
      "cascade_depth": 1,
      "failed_dependencies": ["SUBSTATION_CHHATRAPUR_01"],
      "operational_state": "DEGRADED",
      "generator_fuel_remaining_hours": 6.0,
      "icu_patients_at_risk": 24,
      "criticality": "URGENT_EVACUATION_RECOMMENDED"
    },
    {
      "asset_id": "CELL_TOWER_T14",
      "type": "TELECOMMUNICATION",
      "cascade_depth": 2,
      "operational_state": "OFFLINE",
      "isolated_zones": ["WARD_04_FISHERMAN_COLONY"]
    }
  ]
}
```

---

#### 2.4 Safe Destination Ranking & Disaster-Aware Evacuation Routing
##### `GET /api/v1/shelters/ranking`
Deterministically evaluates and ranks certified cyclone shelters using TOPSIS multi-criteria scoring.
- **Query Parameters**:
  - `origin_lat` (float, required)
  - `origin_lon` (float, required)
  - `max_distance_km` (float, default 20.0)
- **Response 200 OK**:
```json
{
  "candidate_count": 14,
  "ranked_shelters": [
    {
      "shelter_id": "SHELTER_KALYANPUR_HS",
      "name": "Kalyanpur High School Cyclone Shelter",
      "topsis_score": 0.912,
      "coordinates": [85.045, 19.382],
      "distance_km": 4.8,
      "capacity": {
        "certified": 1200,
        "current_occupancy": 410,
        "available_capacity": 790,
        "occupancy_pct": 34.2
      },
      "resilience_metrics": {
        "plinth_elevation_m": 12.4,
        "predicted_water_level_m": 3.1,
        "clearance_margin_m": 9.3,
        "has_backup_generator": true,
        "has_potable_ro_plant": true,
        "medical_staff_present": true
      },
      "corridor_status": "ACCESSIBLE_NO_FLOOD"
    }
  ]
}
```

##### `POST /api/v1/routing/evacuation`
Calculates an optimal, disaster-aware evacuation route penalizing submerged roads and severed bridges.
- **Request Body**:
```json
{
  "origin": [85.012, 19.335],
  "destination_shelter_id": "SHELTER_KALYANPUR_HS",
  "transport_mode": "FOUR_WHEEL_BUS",
  "avoid_submerged_edges": true,
  "max_allowable_immersion_m": 0.20
}
```
- **Response 200 OK**:
```json
{
  "route_id": "ROUTE_EVAC_9921",
  "status": "SAFE_ROUTE_COMPUTED",
  "metrics": {
    "total_distance_km": 7.42,
    "estimated_travel_time_minutes": 22.5,
    "max_flood_depth_on_path_m": 0.04,
    "safe_clearance_window_hours": 3.5
  },
  "turn_by_turn": [
    { "step": 1, "instruction": "Head North on Coastal Access Rd toward Village Junction", "distance_m": 1200, "flood_depth_m": 0.0 },
    { "step": 2, "instruction": "Turn RIGHT onto Ridge Road (AVOID State Highway 14 - Submerged 0.65m)", "distance_m": 4100, "flood_depth_m": 0.04 },
    { "step": 3, "instruction": "Arrive at Kalyanpur Cyclone Shelter elevated ramp", "distance_m": 2120, "flood_depth_m": 0.0 }
  ],
  "geojson_path": {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [[85.012, 19.335], [85.021, 19.349], [85.038, 19.368], [85.045, 19.382]]
    },
    "properties": {
      "route_color": "#10B981",
      "safety_rating": "OPTIMAL_HIGH_ELEVATION"
    }
  },
  "provenance": {
    "routing_engine": "FLOOD_PENALIZED_DIJKSTRA_V1",
    "road_network_source": "OSM_OVERPASS_2026_09",
    "hazard_water_grid_timestamp": "2026-09-27T08:30:00Z"
  }
}
```

---

#### 2.5 Gemini Copilot Streaming Endpoint
##### `POST /api/v1/copilot/chat`
Server-Sent Events (SSE) stream endpoint powering the AI Incident Commander Copilot with native tool-calling.
- **Request Body**:
```json
{
  "conversation_id": "SESSION_EOC_PURI_01",
  "messages": [
    { "role": "user", "content": "Which shelters near Chhatrapur still have capacity and are safe from the 3m storm surge?" }
  ],
  "active_filters": { "district": "Ganjam", "mandal": "Chhatrapur" }
}
```
- **SSE Stream Sequence**:
```text
event: tool_call_start
data: {"tool": "get_safe_shelter_destinations", "arguments": {"origin_lat": 19.35, "origin_lon": 85.02, "min_clearance_m": 0.5}}

event: tool_call_complete
data: {"tool": "get_safe_shelter_destinations", "result_summary": "Found 3 verified shelters with clearance > 1.2m and 1,840 open spots."}

event: text_delta
data: {"delta": "Based on official IMD storm surge calculations and verified district shelter databases:\n\n"}

event: text_delta
data: {"delta": "1. **Kalyanpur High School Shelter** is currently the safest option (Clearance margin: **9.3m above peak surge**, 790 free spaces, equipped with operational generator and medical staff).\n"}

event: text_delta
data: {"delta": "2. Avoid **Arjipalli Community Center**; while unflooded, its direct access road (SH-14) is currently impassable due to 0.74m water accumulation near Rushikulya Bridge."}

event: done
data: {"citations": [{"source_id": "IMD_BULLETIN_14", "entity_type": "SURGE_GRID"}, {"source_id": "DISTRICT_SHELTER_DB", "entity_type": "SHELTERS"}]}
```

---

#### 2.6 Simulation Sandbox & Forecast Delta
##### `POST /api/v1/simulation/what-if`
Sandboxed counterfactual disaster simulator.
- **Request Body**:
```json
{
  "surge_height_delta_m": 1.5,
  "precipitation_delta_mm": 100.0,
  "high_tide_coincidence": true,
  "power_grid_blackout_t_minus_hours": 2
}
```
- **Response 200 OK**:
```json
{
  "simulation_id": "SIM_COUNTERFACTUAL_401",
  "is_synthetic_simulation": true,
  "comparative_deltas": {
    "additional_flooded_area_sqkm": 82.4,
    "newly_exposed_population": 34800,
    "newly_compromised_shelters": ["SHELTER_COASTAL_PRY_03"],
    "additional_cascading_failures": [
      { "asset_id": "WATER_TREATMENT_PLANT_W1", "failure_trigger": "GENERATOR_FLOODED" }
    ]
  }
}
```

##### `GET /api/v1/delta/what-changed`
Computes the vector delta between the two most recent official cyclone forecast advisories.
- **Response 200 OK**:
```json
{
  "advisory_previous": "IMD_BULLETIN_13",
  "advisory_current": "IMD_BULLETIN_14",
  "time_delta_hours": 3.0,
  "deltas": {
    "track_deviation_km": 28.4,
    "track_direction": "NORTH_NORTH_WEST",
    "landfall_time_shift_hours": 2.5,
    "landfall_status": "DELAYED",
    "central_pressure_change_hpa": -6.0,
    "intensity_change": "INTENSIFIED",
    "newly_threatened_wards": ["WARD_12_PURI_BEACH", "WARD_14_LIGHTHOUSE"],
    "cleared_wards": ["WARD_01_MALUD"]
  }
}
```

---

#### 2.7 Parametric Insurance & Infrastructure Hardening
##### `POST /api/v1/insurance/parametric-triggers`
Evaluates automated liquidity payout criteria against verified station sensors and satellite flood masks.
- **Request Body**:
```json
{
  "policy_id": "PARAM_COASTAL_FISHERIES_PURI_2026",
  "district": "Puri"
}
```
- **Response 200 OK**:
```json
{
  "policy_id": "PARAM_COASTAL_FISHERIES_PURI_2026",
  "status": "TRIGGER_CRITERIA_MET",
  "triggers_evaluated": [
    { "parameter": "STATION_WIND_SPEED", "threshold": ">= 140 km/h", "measured_value": "165 km/h", "station_id": "PURI_IMD_AWS", "triggered": true },
    { "parameter": "SAR_FLOOD_INUNDATION", "threshold": ">= 20% agricultural area", "measured_value": "26.4%", "satellite": "SENTINEL-1_SAR", "triggered": true }
  ],
  "payout_amount_inr": 25000000.0,
  "target_beneficiary_households": 1250,
  "cryptographic_verification_hash": "a8f34bc...e912"
}
```

##### `GET /api/v1/hardening/recommendations`
Returns Benefit-Cost Ratio (BCR) ranked resilience projects.
- **Response 200 OK**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "project_type": "MOBILE_FLOOD_BARRIER_DEPLOYMENT",
      "target_asset_id": "SUBSTATION_CHHATRAPUR_01",
      "estimated_cost_inr": 450000,
      "avoided_cascade_losses_inr": 18500000,
      "bcr_ratio": 41.1,
      "implementation_window_hours": 4.0
    }
  ]
}
```
