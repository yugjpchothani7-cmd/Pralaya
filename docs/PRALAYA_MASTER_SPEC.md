# PRALAYA: Predictive Resilience & Adaptive Local Action AI
## Master System Specification & Product Requirements Document (PRD)

---

### 1. Executive Summary & Mission

**PRALAYA** (*Predictive Resilience & Adaptive Local Action AI*) is an anticipatory disaster intelligence platform engineered for coastal cyclone and flood emergencies. 

Traditional disaster response paradigms operate reactively: sirens sound when floodwaters breach embankments, blanket evacuation orders are issued across sprawling administrative districts without hyper-local topographical awareness, and critical infrastructure dependencies fail in opaque, cascading domino chains.

**PRALAYA transforms reactive emergency response into anticipatory resilience engineering:**
$$\text{Weather + Satellite + Terrain + Infrastructure + Demographics + Official Alerts}$$
$$\Downarrow$$
$$\text{Hazard Prediction} \longrightarrow \text{Exposure} \longrightarrow \text{Vulnerability} \longrightarrow \text{Cascade Failures} \longrightarrow \text{Safe Havens} \longrightarrow \text{Dynamic Evacuation} \longrightarrow \text{Continuous Re-planning}$$

PRALAYA synthesizes high-resolution earth observations (Sentinel-1 SAR, digital elevation models), real-time meteorological observations, physics-based storm surge and flood models, and graph-theoretic infrastructure dependencies into deterministic decision surfaces. It layers a securely grounded, non-hallucinating Gemini AI Copilot over this deterministic core to equip incident commanders, local administrators, and vulnerable coastal communities with verifiable, actionable, and explainable intelligence.

---

### 2. Core Architectural Non-Negotiables & Operational Principles

1. **Strict Separation of Deterministic Compute and LLM Reasoning**:
   - Deterministic calculations (hydrological runoffs, storm surge heights, shortest safe evacuation paths, capacity constraints, building fragility curves) are computed exclusively by Python/C-level mathematical algorithms and spatial database engines (PostGIS).
   - Generative AI (Gemini) is **never** permitted to calculate flood depths, generate coordinates, fabricate shelters, alter routing graphs, or hallucinate alerts.
   - Gemini operates strictly as an **explainer, synthesizer, multilingual translator, and tool-calling orchestrator** working over validated, deterministic JSON facts.

2. **Zero Hallucination of Critical Safety Data**:
   - Every shelter, safe destination, road segment, and hospital status exposed to the user must originate from a verified, cryptographically audited database record.
   - If a requested route or safe shelter cannot be computed deterministically, the system returns an explicit `UNVERIFIED_STATE` error rather than a synthesized approximation.

3. **Data Provenance, Timestamping & Verification Hierarchy**:
   - Every metric displayed on the dashboard or returned by the API contains an immutable metadata envelope:
     ```json
     {
       "source_id": "IMD_CYCLONE_BULLETIN_28",
       "fetched_at": "2026-09-27T10:45:00Z",
       "confidence_score": 0.94,
       "verification_level": "OFFICIAL_GOVERNMENT_FEED"
     }
     ```
   - Official national meteorological agencies (e.g., IMD, NOAA) maintain strict hierarchy over scraping or crowd-sourced reports.
   - External web information is tagged as unverified until cross-referenced against authoritative bulletins.

4. **Honest Operational Claims & Rigorous Metrics**:
   - Never claim an unsupported accuracy percentage (e.g., "99.9% flood prediction accuracy"). State specific validation metrics (e.g., "Validated against Sentinel-1 SAR flood extent with an Intersection-over-Union (IoU) of 0.81 on 2024 Cyclone Remal").
   - Never claim "PRALAYA has saved lives." It is an anticipatory decision-support platform designed for civil defense commanders and vulnerable populations.

5. **Security, Air-Gapped Secrets & Autonomous Offline Operation**:
   - Zero API keys, database credentials, or LLM tokens in frontend bundles. All external third-party calls (Google Earth Engine, Gemini API, Maps/Routes API, Open-Meteo) are routed through authenticated FastAPI backend proxies.
   - The platform includes high-fidelity pre-seeded deterministic scenario replay packages, allowing full functionality in air-gapped emergency response centres during telecommunication blackouts.

---

### 3. Detailed Specification: The 20 Core Modules

| Module ID | Module Name | Primary Responsibility | Input Data | Deterministic Engine | Primary Outputs |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MOD-01** | **Live Situation Center** | Real-time mission control geospatial dashboard showing track, surge cone, affected assets, and active advisories. | Cyclone track GeoJSON, Inundation rasters, Asset status | GeoJSON vector layer compositor, WebGL/deck.gl pipeline | Interactive 2D/3D map, metric summary cards, live event feed |
| **MOD-02** | **GEE Geospatial Intelligence** | Planetary-scale raster ingestion: Sentinel-1 SAR flood inundation, Sentinel-2 NDWI, SRTM/FABDEM digital elevation models. | Copernicus Sentinel-1 GRD, Copernicus GLO-30 / FABDEM, Sentinel-2 MSI | Otsu bimodal thresholding, backscatter calibration, DEM hydrological correction | Inundation extent mask (COG/GeoTIFF), terrain elevation contours |
| **MOD-03** | **Weather Intelligence Engine** | Ingestion of cyclone tracks, central barometric pressure, max sustained winds, radius of maximum winds (RMW), and rainfall grids. | IMD Cyclone Bulletins, ECMWF Open Data, NOAA GFS, Open-Meteo API | Parsing, temporal interpolation, radial Holland wind-field parameterization | Wind speed vector grid, barometric pressure surface, precipitation accumulation |
| **MOD-04** | **Hazard Engine** | Physics-based storm surge prediction (SLOSH/Holland wind-pressure hydrodynamic surrogate) and hydrodynamic flood accumulation. | Wind field, pressure deficit, bathymetry, DEM plinths, tidal constituents | Hydrodynamic surge surrogate (Inverse Barometer + Wu drag equilibrium) + pluvial accumulation | Water depth surface ($D_{\text{flood}}(x,y)$), velocity vectors, flood polygons |
| **MOD-05** | **Exposure Engine** | Spatial overlay of predicted hazard footprint against human population clusters and built assets. | WorldPop 100m grid, OSM building footprints, Critical infrastructure layer | PostGIS spatial intersection (`ST_Intersects`, `ST_Intersection`), zonal statistics | Population exposed count, inundated infrastructure asset IDs, exposed asset value |
| **MOD-06** | **Vulnerability Engine** | Multi-dimensional vulnerability indexing combining structural fragility (kutcha vs pucca houses) with socioeconomic vulnerability (SoVI). | Housing census data (Census/SECC), socio-demographic indicators, elevation buffer | Weighted linear combination, vulnerability fragility curves | Composite Vulnerability Index ($V \in [0, 1]$), high-risk cluster polygons |
| **MOD-07** | **Failure Cascade Engine** | Directed Acyclic Graph (DAG) simulating inter-infrastructure cascading collapse (Power Substation flood $\to$ Hospital generator fails $\to$ Oxygen pump failure). | Infrastructure dependency graph, asset inundation state, backup runtime parameters | NetworkX topological traversal, threshold-based state transitions | Cascade path sequence, time-to-failure estimates, isolated nodes |
| **MOD-08** | **Safe Destination Engine** | Deterministic multi-criteria scoring algorithm identifying resilient storm shelters, high-elevation public schools, and staging grounds. | Certified cyclone shelters database, DEM plinth elevation, road connectivity status | TOPSIS / Analytic Hierarchy Process (AHP) multi-criteria ranking | Ranked shelter list, clearance margins ($M_{\text{clearance}}$), capacity availability |
| **MOD-09** | **Disaster-Aware Evacuation Routing** | Real-time evacuation routing penalizing flooded road segments, fallen high-voltage lines, and bottleneck congestion. | OpenStreetMap road network, flood depth surface, bridge impassability status | Dynamic Cost Dijkstra / $A^*$ algorithm with exponential flood depth penalty function | Safe waypoint coordinates, turn-by-turn geometry, safe travel window (hours) |
| **MOD-10** | **Emergency Resource Optimizer** | Allocation of rescue boats, NDRF/SDRF battalions, emergency generators, and medical stockpiles based on predicted marginal risk reduction. | Available depot inventory, predicted vulnerable population clusters, transit times | Mixed-Integer Linear Programming (MILP via SciPy / PuLP) | Optimal dispatch dispatch schedule, resource shortfall alerts |
| **MOD-11** | **Gemini AI Copilot** | Conversational decision-support agent for incident commanders, ground responders, and public queries. | Natural language prompts, system state snapshots, registered tool schema | Gemini API (configurable model ID), strict Tool Calling, zero-temperature fact lookup | Structured decision briefings, tool execution triggers, grounded answers |
| **MOD-12** | **Recent Disaster & Current Info** | Real-time ingestion and validation of breaking disaster bulletins, NDMA/SDMA advisories, and river gauge telemetry. | Official RSS/JSON feeds, CWC river gauge data, INCOIS ocean buoy telemetry | Pydantic schema validation, semantic deduplication, cryptographic hashing | Verified event stream, threshold breach alerts, telemetry time series |
| **MOD-13** | **Personalized Community Advisories** | Hyper-local guidance tailored to specific demographic micro-clusters (e.g., coastal fisherfolk, elderly in low-lying kutcha houses). | Location coordinate, household vulnerability profile, localized hazard forecast | Rule-based action matrix + Gemini natural language synthesis | Hyper-targeted action checklists ("Move boats to jetty 3 by 14:00", "Elevate medicines") |
| **MOD-14** | **Multilingual Alerts Engine** | Generation of clear, panic-free emergency alerts in vernacular languages (Odia, Bengali, Hindi, Telugu, English). | Deterministic alert templates, validated hazard numbers, target ISO language code | Deterministic parametric slots + Gemini localized vernacular verification | Verified multilingual SMS/WhatsApp/PA broadcast text and audio scripts |
| **MOD-15** | **"What Changed?" Engine** | Delta computation between sequential cyclone forecast advisories (e.g., track shifted 28km North, landfall delayed 3h, surge increased 0.8m). | Consecutive cyclone advisory snapshots ($T_{n-1}$ vs $T_n$) | Spatial and scalar vector diffing algorithm, JSON Patch calculation | Human-readable delta briefing, newly threatened vs cleared asset diff |
| **MOD-16** | **What-If Disaster Simulator** | Interactive sandbox allowing commanders to simulate counterfactuals (+1.5m sea surge, 100mm extra rain, power grid failure at T-2h). | Base scenario state, commander parameter overrides | In-memory sandbox state clone, fast hydrodynamic surrogate re-run | Comparative delta maps, differential casualty/asset risk metrics |
| **MOD-17** | **Infrastructure Hardening Planner** | Pre-disaster investment optimization recommending seawall reinforcement, mobile flood barrier deployments, and tree-trimming corridors. | Long-term asset vulnerability, hazard return periods, mitigation unit costs | Benefit-Cost Ratio (BCR) optimization, spatial priority ranking | Ranked mitigation project portfolio, risk reduction per dollar invested |
| **MOD-18** | **Parametric Insurance Trigger Simulator** | Instantaneous financial liquidity trigger evaluator calculating payouts when physical thresholds (wind speed, flood depth) are breached. | IMD certified station wind speeds, satellite SAR verified flood masks, policy terms | Smart contract / deterministic algorithmic parametric payout matrices | Certified payout triggers, beneficiary payout schedule, audit proof |
| **MOD-19** | **Disaster Replay & Timeline** | Interactive 4D timeline player capable of scrubbing backward and forward through event evolution (T-48h to T+24h). | Time-stamped historical & forecast scenario vectors | Temporal PostGIS queries, time-indexed GeoJSON sequence player | Interpolated timestep frames, timeline scrubbing scrubber state |
| **MOD-20** | **Trust, Provenance & Explainability** | Transparent audit trails detailing why a specific route was rejected, why a shelter was de-prioritized, and confidence bounds. | Algorithm intermediate logs, data provenance metadata, feature weights | Mathematical proof traces, feature attribution, SHA-256 chain log | Explainability card ("Route SH-14 rejected: 0.72m water expected at KM 12"), confidence intervals |

---

### 4. Target Project Folder Structure

```
pralaya/
├── .env.example                     # Standardized environment template (no secrets committed)
├── .gitignore                       # Git exclusions (node_modules, venv, caches, secret files)
├── README.md                        # Project overview, quickstart, and demo guide
├── docker-compose.yml               # Local orchestration (PostgreSQL/PostGIS, Redis, Backend, Frontend)
│
├── docs/                            # Master Architectural Specifications
│   ├── PRALAYA_MASTER_SPEC.md       # Product Requirements & Module Specifications (this doc)
│   ├── ARCHITECTURE.md              # System Architecture, Pipelines, Component Boundaries
│   ├── DATA_SOURCES.md              # Ingestion Specs, GEE, Satellite, IMD, DEM
│   ├── API_CONTRACTS.md             # Complete OpenAPI 3.1 Schemas & JSON Specifications
│   ├── DATABASE_SCHEMA.md           # PostgreSQL/PostGIS DDL, Spatial Indices, Relational Design
│   ├── RISK_MODEL.md                # Mathematical Formulations, Surge, Cascade DAG, TOPSIS, Routing
│   ├── GEMINI_ARCHITECTURE.md       # Gemini Tool Calling, Guardrails, Prompts, Multilingual Spec
│   ├── SECURITY.md                  # STRIDE Analysis, Secret Isolation, Provenance Hashing, RBAC
│   ├── TEST_STRATEGY.md             # Testing Pyramid, Unit, Integration, Playwright E2E
│   └── DEMO_SCENARIO.md             # Step-by-Step "Operation Sagar Raksha" Walkthrough & Offline Fallbacks
│
├── backend/                         # FastAPI Python Backend
│   ├── Dockerfile                   # Production Python 3.11 container definition
│   ├── requirements.txt             # Direct dependencies (FastAPI, Pydantic, GeoPandas, NetworkX, etc.)
│   ├── pyproject.toml               # Tooling configuration (Ruff, Mypy, Pytest)
│   └── app/
│       ├── __init__.py
│       ├── main.py                  # FastAPI app factory, middleware, SSE hub, lifespan handler
│       ├── config.py                # Pydantic BaseSettings (GEMINI_MODEL, DB_URL, REDIS_URL)
│       ├── api/                     # REST API Route Handlers
│       │   ├── __init__.py
│       │   ├── situation.py         # /api/v1/situation/* (Summary, timeline, layers)
│       │   ├── hazard.py            # /api/v1/hazard/* (Surge, pluvial, wind field)
│       │   ├── risk.py              # /api/v1/risk/* (Exposure, vulnerability)
│       │   ├── cascades.py          # /api/v1/cascades/* (Failure DAG simulation)
│       │   ├── shelters.py          # /api/v1/shelters/* (Safe destination TOPSIS ranking)
│       │   ├── routing.py           # /api/v1/routing/* (Disaster-aware evacuation path)
│       │   ├── resources.py         # /api/v1/resources/* (MILP resource allocation)
│       │   ├── copilot.py           # /api/v1/copilot/* (Gemini tool-augmented SSE stream)
│       │   ├── simulation.py        # /api/v1/simulation/* (What-If parameter sandbox)
│       │   ├── delta.py             # /api/v1/delta/* (What Changed advisory diff)
│       │   ├── hardening.py         # /api/v1/hardening/* (Infrastructure investment ROI)
│       │   ├── insurance.py         # /api/v1/insurance/* (Parametric trigger simulator)
│       │   └── alerts.py            # /api/v1/alerts/* (Multilingual notifications)
│       ├── core/                    # Core Infrastructure
│       │   ├── database.py          # Async SQLAlchemy engine & session factory
│       │   ├── redis.py             # Redis client and Pub/Sub manager
│       │   ├── security.py          # JWT, API key validation, rate limiter
│       │   └── logging.py           # Structured JSON logger with trace IDs
│       ├── models/                  # SQLAlchemy ORM Models (PostGIS entities)
│       │   ├── __init__.py
│       │   ├── cyclone.py           # CycloneEvent, CycloneTrackPoint
│       │   ├── hazard.py            # InundationZone, WindContour
│       │   ├── infrastructure.py    # InfrastructureAsset, AssetDependency
│       │   ├── shelter.py           # ShelterEntity, ShelterOccupancyLog
│       │   ├── population.py        # DemographicGrid, VulnerabilityZone
│       │   ├── resource.py          # EmergencyDepot, EmergencyResource
│       │   └── audit.py             # ProvenanceAuditLog, SimulationRun
│       ├── schemas/                 # Pydantic v2 Request/Response DTOs
│       │   ├── situation_schema.py
│       │   ├── hazard_schema.py
│       │   ├── cascade_schema.py
│       │   ├── routing_schema.py
│       │   ├── copilot_schema.py
│       │   └── common.py            # ProvenanceMetadata, GeoJSONEnvelope
│       ├── services/                # Deterministic Business Logic & Computational Engines
│       │   ├── hazard_engine.py     # Holland wind field + SLOSH surrogate surge math
│       │   ├── vulnerability.py     # Exposure calculation & SoVI indexer
│       │   ├── cascade_engine.py    # NetworkX DAG infrastructure propagation
│       │   ├── shelter_engine.py    # Multi-criteria TOPSIS shelter scoring
│       │   ├── routing_engine.py    # Flood-penalized Dijkstra / A* over OSM road network
│       │   ├── resource_engine.py   # PuLP / SciPy MILP emergency resource distributor
│       │   ├── gee_service.py       # Google Earth Engine SAR/DEM ingestion & caching
│       │   ├── delta_engine.py      # State vector diffing between sequential bulletins
│       │   └── simulation_engine.py # In-memory what-if scenario forking
│       ├── copilot/                 # Gemini LLM Orchestration Tier
│       │   ├── client.py            # Google GenAI SDK wrapper with dynamic model resolution
│       │   ├── tools.py             # Pydantic schemas of backend deterministic tools
│       │   ├── tool_executor.py     # Secure dispatcher mapping LLM calls to services
│       │   ├── prompts.py           # System prompts, anti-hallucination constraints
│       │   └── guardrails.py        # Post-generation fact cross-checker & verifier
│       └── data/                    # Pre-seeded Scenario Fixtures (Air-Gapped Offline Mode)
│           ├── cyclone_karuna.json  # Reference Odisha/Andhra coast cyclone scenario
│           ├── road_graph_odisha.json# NetworkX serialized road network
│           ├── shelters_odisha.json # Pre-verified shelter records
│           └── assets_odisha.json   # Infrastructure nodes and dependency edges
│
├── frontend/                        # React 19 + TypeScript + Vite Application
│   ├── package.json
│   ├── tsconfig.json                # TypeScript strict configuration
│   ├── vite.config.ts               # Vite configuration with proxy to backend
│   ├── public/                      # Static assets, favicon, offline fallback maps
│   └── src/
│       ├── main.tsx                 # Application entry point
│       ├── App.tsx                  # Root layout, navigation bar, view coordinator
│       ├── index.css                # Design system tokens, glassmorphism, dark theme
│       ├── api/                     # Backend API Client Layer
│       │   ├── client.ts            # Axios/Fetch wrapper with standard error handling
│       │   ├── situationApi.ts
│       │   ├── routingApi.ts
│       │   ├── copilotApi.ts        # SSE streaming consumer
│       │   └── simulationApi.ts
│       ├── components/              # Modular UI Components
│       │   ├── common/              # Buttons, Cards, Badges, Modals, Sliders
│       │   ├── map/                 # MapLibre GL map instance, deck.gl layer overlays
│       │   │   ├── MapContainer.tsx
│       │   │   ├── SurgeLayer.tsx
│       │   │   ├── EvacuationPathLayer.tsx
│       │   │   ├── InfrastructureNodesLayer.tsx
│       │   │   └── ShelterMarkers.tsx
│       │   ├── situation/           # Mission Control KPIs, Track Forecast, Timeline scrubber
│       │   ├── copilot/             # Gemini Incident Commander chat interface
│       │   ├── simulation/          # What-If scenario parameter controls
│       │   ├── cascade/             # Interactive infrastructure failure graph visualizer
│       │   ├── routing/             # Turn-by-turn safe evacuation route panel
│       │   └── alerts/              # Multilingual alert broadcaster preview
│       ├── hooks/                   # Custom React Hooks
│       │   ├── useSituationData.ts  # TanStack Query polling & caching
│       │   ├── useSSEStream.ts      # Server-Sent Events listener
│       │   ├── useSimulation.ts     # What-If state manager
│       │   └── useCopilotStream.ts  # Streaming LLM response reader
│       ├── store/                   # Global Client State (Zustand)
│       │   ├── useMapStore.ts       # Viewport, active layers, selected asset
│       │   ├── useScenarioStore.ts  # Active cyclone, timestamp T-minus
│       │   └── useCopilotStore.ts   # Chat history, tool execution state
│       └── types/                   # TypeScript interfaces matching backend Pydantic schemas
│           ├── situation.ts
│           ├── hazard.ts
│           ├── routing.ts
│           └── copilot.ts
│
└── tests/                           # Unified Test Suite
    ├── backend/
    │   ├── unit/                    # Unit tests for mathematical formulas
    │   │   ├── test_holland_surge.py
    │   │   ├── test_cascade_dag.py
    │   │   ├── test_topsis_shelters.py
    │   │   └── test_flood_routing.py
    │   ├── integration/             # FastAPI endpoint integration tests
    │   │   ├── test_situation_api.py
    │   │   ├── test_routing_api.py
    │   │   └── test_copilot_tool_calling.py
    │   └── fixtures/                # Mock GEE, IMD, and Gemini payloads
    └── frontend/
        ├── unit/                    # Vitest component tests
        └── e2e/                     # Playwright browser end-to-end scenarios
            └── test_evacuation_flow.spec.ts
```

---

### 5. Quantitative System Objectives & Key Performance Indicators (KPIs)

To establish mathematical rigor and prevent qualitative ambiguity, PRALAYA targets the following performance and safety metrics:

1. **Deterministic Latency Budgets**:
   - **Hazard Footprint Evaluation**: $< 600\text{ ms}$ for a $100 \times 100\text{ km}$ coastal bounding box on 30m grid resolution.
   - **Disaster-Aware Evacuation Route**: $< 200\text{ ms}$ for path calculation across an OpenStreetMap road sub-graph of 20,000 nodes and 35,000 edges.
   - **Safe Shelter Multi-Criteria Ranking**: $< 120\text{ ms}$ for ranking 500 shelters against dynamic flood depth surfaces.
   - **Infrastructure Cascade DAG Evaluation**: $< 80\text{ ms}$ for 1,000 nodes and 2,500 dependency edges.

2. **Gemini AI Copilot Safety & Grounding**:
   - **First Token Streaming Latency**: $< 1.1\text{ s}$ over SSE stream.
   - **Zero Hallucinated Safety Entity**: $100\%$ pass rate on entity validation tests (every shelter ID, route waypoint, or flood depth returned in chat must match an existing database record).
   - **Tool Calling Precision**: $\ge 98\%$ correct parameter instantiation on standard command prompts.

3. **Data Provenance & Audit Integrity**:
   - **Provenance Tagging Coverage**: $100\%$ of entity payloads returned via REST/SSE must contain `source_id`, `fetched_at`, `confidence_score`, and `verification_level`.
   - **Cryptographic Audit**: All incoming official bulletins hashed with SHA-256 upon ingestion to detect upstream feed tampering or corruption.

4. **Fault Tolerance & Offline Resilience**:
   - **Air-Gapped Operation**: $100\%$ of demo and situation control functionality operable without public internet access via pre-seeded scenario vectors.
   - **Graceful Degradation**: If live satellite/GEE feeds time out, the system automatically falls back to cached baseline rasters with an explicit `DEGRADED_PROVENANCE` warning flag.

---

### 6. Phased Implementation Roadmap & Explicit Acceptance Criteria

#### Phase 1: Specifications, Architecture & Contract Design (Current Phase)
- **Deliverables**: The 10 master architectural artifacts, comprehensive OpenAPI contracts, PostGIS database DDL, mathematical formulation documents, security policies, and verified demo scripts.
- **Acceptance Criteria**:
  1. Complete specification of all 20 modules without unspecified components.
  2. Formal sign-off on the strict separation of deterministic computation from generative AI.
  3. All data contracts verified against Pydantic v2 and TypeScript strict typing standards.

#### Phase 2: Core Backend Engine & Deterministic Spatial Models
- **Deliverables**: FastAPI application scaffold, async SQLAlchemy database models, PostGIS migrations, Holland wind field + SLOSH surrogate surge math, dynamic cost Dijkstra routing engine, TOPSIS shelter scorer, and NetworkX cascade DAG.
- **Acceptance Criteria**:
  1. 100% passing unit tests for Holland wind radial profiles against analytical values.
  2. Evacuation routing algorithm demonstrably rejects road segments submerged $> 0.3\text{ m}$ (standard passenger vehicle stall threshold).
  3. Cascade DAG correctly propagates secondary and tertiary failures upon primary substation submergence.
  4. Response latencies meet target KPI thresholds under automated pytest benchmarks.

#### Phase 3: Gemini AI Copilot & Tool Calling Integration
- **Deliverables**: Google GenAI client wrapper, dynamic model resolution (`GEMINI_MODEL`), registered tool calling schemas (`query_hazard`, `route_evacuation`, `simulate_cascade`), grounding and anti-hallucination verification guardrails, multilingual advisory generator.
- **Acceptance Criteria**:
  1. Gemini Copilot successfully invokes backend tools with valid JSON arguments.
  2. Post-generation guardrails intercept and reject synthetic shelter names or hallucinated coordinates.
  3. Multilingual alert pipeline generates accurate Odia, Bengali, and Hindi alerts with zero loss of critical numerical values (times, surge depths, shelter names).

#### Phase 4: Frontend Situation Center & Interactive Geospatial Visualizations
- **Deliverables**: React 19 + TypeScript frontend, MapLibre GL map container, deck.gl 3D storm surge and flood layer overlays, dynamic evacuation path animator, Gemini streaming chat panel, What-If simulation slider controls, responsive mission control layout.
- **Acceptance Criteria**:
  1. Map renders 50,000+ points and complex polygons at steady 60 FPS without UI freezing.
  2. Evacuation routes and flood boundaries update responsively when What-If sliders are adjusted.
  3. Copilot responses stream seamlessly with live markdown rendering, tool call execution indicators, and clickable map focus actions.

#### Phase 5: Advanced Simulation, Replay & Resilience Optimization
- **Deliverables**: "What Changed?" advisory delta diff engine, Parametric Insurance trigger simulator, Infrastructure Hardening ROI optimizer, 4D Disaster Replay timeline scrubber, and PuLP MILP emergency resource allocator.
- **Acceptance Criteria**:
  1. "What Changed?" correctly highlights spatial track deviations and newly threatened assets between consecutive advisory files.
  2. Parametric insurance module triggers payouts instantaneously when station wind speed $\ge 120\text{ km/h}$.
  3. Timeline scrubber allows bidirectional scrubbing from T-48h to T+24h with synchronized map layers and metric summaries.

#### Phase 6: System Hardening, End-to-End Testing & Hackathon Showcase Readiness
- **Deliverables**: Playwright automated E2E browser tests, Docker Compose one-command deployment, air-gapped offline scenario package, security audit, and polished 3-minute hackathon demo walkthrough.
- **Acceptance Criteria**:
  1. Single command `docker compose up` brings up complete functioning platform with database, backend, and frontend.
  2. Disconnecting network interface allows full demo execution using pre-seeded `cyclone_karuna` scenario data.
  3. 100% of Playwright E2E smoke tests pass without console errors or unhandled rejections.
