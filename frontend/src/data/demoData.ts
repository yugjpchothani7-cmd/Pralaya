/**
 * PRALAYA Command Center - Realistic Emergency Operations Demo Data
 * Focus Area: Coastal Odisha (Gopalpur - Chhatrapur - Puri Corridor)
 * Scenario: Super Cyclone "KARUNA / VAJRA" Landfall ETA T-4 Hours
 */

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: 'substation' | 'hospital' | 'bridge' | 'pumping_station' | 'telecom';
  coordinates: [number, number]; // [lat, lon]
  status: 'operational' | 'degraded' | 'submerged' | 'offline';
  waterDepthM: number;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  backupPowerHours?: number;
  details: string;
  affectedPopulation: number;
}

export interface DemoShelter {
  id: string;
  name: string;
  coordinates: [number, number];
  certifiedCapacity: number;
  currentOccupancy: number;
  plinthElevationM: number;
  clearanceMarginM: number;
  topsisScore: number;
  hasPower: boolean;
  hasWater: boolean;
  hasMedical: boolean;
  roadStatus: 'CLEAR' | 'CAUTION' | 'IMPASSABLE';
}

export interface ActionRecommendation {
  id: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  title: string;
  actionText: string;
  deadlineHours: number;
  targetMandal: string;
  impactMetric: string;
  status: 'PENDING' | 'DISPATCHED' | 'COMPLETED';
}

export interface TimelineStep {
  hourOffset: number; // e.g. -48, -24, -12, -4, 0, 6, 12, 24
  label: string;
  timeStr: string;
  windSpeedKmh: number;
  pressureHpa: number;
  surgeM: number;
  exposedPop: number;
  phase: string;
  description: string;
  // Optional snapshot data for disaster replay system
  hazard?: string; // e.g., "wind", "rain", "storm surge"
  exposure?: number; // e.g., affected population at this snapshot
  routes?: string[]; // identifiers of viable routes
  shelters?: DemoShelter[]; // snapshot of shelter states
  infrastructure?: InfrastructureAsset[]; // snapshot of infrastructure states
  alerts?: string[]; // active alerts at this time
  recommendations?: ActionRecommendation[]; // recommended actions at this snapshot
}

export const INITIAL_CYCLONE_STATE = {
  id: 'CYC_KARUNA_2026',
  name: 'Cyclone KARUNA',
  category: 'Extremely Severe Cyclonic Storm (ESCS)',
  basin: 'Bay of Bengal',
  currentPosition: [19.28, 85.22] as [number, number],
  bearingDeg: 315, // NW
  forwardSpeedKmh: 14.5,
  centralPressureHpa: 938,
  maxSustainedWindsKmh: 185,
  gustsKmh: 210,
  rmwKm: 32.5,
  landfallEtaHours: 4,
  landfallLocation: 'Between Gopalpur & Chhatrapur, Odisha',
  officialBulletin: 'IMD RSMC Cyclone Bulletin #14 (Verified Level 1)',
  bulletinTime: '27-SEP-2026 11:00 IST',
};

export const DEMO_INFRASTRUCTURE: InfrastructureAsset[] = [
  {
    id: 'INFRA_SUBSTATION_01',
    name: 'Chhatrapur 132kV Main Grid Substation',
    type: 'substation',
    coordinates: [19.355, 84.995],
    status: 'submerged',
    waterDepthM: 0.65,
    criticality: 'CRITICAL',
    details: 'Transformer bay submerged 0.65m > 0.40m flood threshold. Tripped at T-5h to prevent catastrophic arc.',
    affectedPopulation: 85000,
  },
  {
    id: 'INFRA_HOSPITAL_01',
    name: 'Ganjam District Headquarter Hospital',
    type: 'hospital',
    coordinates: [19.340, 84.975],
    status: 'degraded',
    waterDepthM: 0.12,
    criticality: 'CRITICAL',
    backupPowerHours: 7.2,
    details: 'Primary grid severed from Substation 01. Operating on 750kVA diesel generator with 7.2 hours fuel remaining. 24 ICU patients.',
    affectedPopulation: 14000,
  },
  {
    id: 'INFRA_BRIDGE_01',
    name: 'Rushikulya Estuary Bridge (State Highway 14)',
    type: 'bridge',
    coordinates: [19.330, 85.040],
    status: 'offline',
    waterDepthM: 0.85,
    criticality: 'HIGH',
    details: 'Approach road washed over by 0.85m surge. Impassable for all civilian vehicles. Severed evacuation route.',
    affectedPopulation: 42000,
  },
  {
    id: 'INFRA_PUMP_01',
    name: 'North Drinking Water Booster Station',
    type: 'pumping_station',
    coordinates: [19.370, 84.980],
    status: 'offline',
    waterDepthM: 0.45,
    criticality: 'HIGH',
    details: 'Pump motors offline due to upstream power grid failure. Fresh water reservoir holding 14 hours supply.',
    affectedPopulation: 65000,
  },
  {
    id: 'INFRA_TELECOM_01',
    name: 'Chhatrapur Coastal Cellular Mast T-14',
    type: 'telecom',
    coordinates: [19.362, 85.012],
    status: 'degraded',
    waterDepthM: 0.05,
    criticality: 'MEDIUM',
    backupPowerHours: 3.5,
    details: 'Battery backup active. Wind gusts of 185 km/h degrading microwave alignment.',
    affectedPopulation: 28000,
  },
];

export const DEMO_SHELTERS: DemoShelter[] = [
  {
    id: 'SHELTER_KALYANPUR',
    name: 'Kalyanpur High School Cyclone Shelter',
    coordinates: [19.385, 84.965],
    certifiedCapacity: 1200,
    currentOccupancy: 410,
    plinthElevationM: 14.8,
    clearanceMarginM: 10.0,
    topsisScore: 0.945,
    hasPower: true,
    hasWater: true,
    hasMedical: true,
    roadStatus: 'CLEAR',
  },
  {
    id: 'SHELTER_GOVT_COLLEGE',
    name: 'Chhatrapur Autonomous College Complex',
    coordinates: [19.360, 84.950],
    certifiedCapacity: 2000,
    currentOccupancy: 1150,
    plinthElevationM: 12.2,
    clearanceMarginM: 7.4,
    topsisScore: 0.880,
    hasPower: true,
    hasWater: true,
    hasMedical: true,
    roadStatus: 'CLEAR',
  },
  {
    id: 'SHELTER_RUSHIKULYA',
    name: 'Rushikulya Primary Cyclone Shelter',
    coordinates: [19.335, 85.035],
    certifiedCapacity: 800,
    currentOccupancy: 640,
    plinthElevationM: 4.8,
    clearanceMarginM: 0.0,
    topsisScore: 0.310,
    hasPower: false,
    hasWater: false,
    hasMedical: false,
    roadStatus: 'IMPASSABLE',
  },
  {
    id: 'SHELTER_ARJIPALLI',
    name: 'Arjipalli Fishermen Community Center',
    coordinates: [19.310, 85.010],
    certifiedCapacity: 600,
    currentOccupancy: 580,
    plinthElevationM: 5.5,
    clearanceMarginM: 0.7,
    topsisScore: 0.420,
    hasPower: true,
    hasWater: true,
    hasMedical: false,
    roadStatus: 'CAUTION',
  },
  {
    id: 'SHELTER_PURUSHOTTAMPUR',
    name: 'Purushottampur Inland Polytechnic',
    coordinates: [19.420, 84.910],
    certifiedCapacity: 2500,
    currentOccupancy: 450,
    plinthElevationM: 22.0,
    clearanceMarginM: 17.2,
    topsisScore: 0.965,
    hasPower: true,
    hasWater: true,
    hasMedical: true,
    roadStatus: 'CLEAR',
  },
];

export const DEMO_RECOMMENDATIONS: ActionRecommendation[] = [
  {
    id: 'REC_01',
    priority: 'URGENT',
    title: 'Evacuate Arjipalli Fishermen Hamlet to Purushottampur',
    actionText: 'Dispatch 8 KSRTC evacuation buses along Inland Ridge Road (avoid SH-14). 420 residents in low-lying kutcha structures.',
    deadlineHours: 2.0,
    targetMandal: 'Arjipalli Coastal Sector',
    impactMetric: '420 Lives at Immediate Risk from 4.2m Surge',
    status: 'PENDING',
  },
  {
    id: 'REC_02',
    priority: 'URGENT',
    title: 'Deploy Mobile Diesel Generator & Fuel to District Hospital',
    actionText: 'Hospital generator fuel reserve at 7.2h. Dispatch 5,000L diesel tanker via unflooded National Highway 16 corridor.',
    deadlineHours: 3.5,
    targetMandal: 'Chhatrapur Urban Core',
    impactMetric: '24 ICU Patients & Life Support Continuity',
    status: 'DISPATCHED',
  },
  {
    id: 'REC_03',
    priority: 'HIGH',
    title: 'Pre-Stage NDRF 3rd Battalion Inflatable Boats at Kalyanpur',
    actionText: 'Pre-position 6 motorized Gemini boats near Rushikulya backwater breach point prior to high-tide surge peak at 15:30 IST.',
    deadlineHours: 2.5,
    targetMandal: 'Rushikulya Estuary',
    impactMetric: 'Rapid Amphibious Extraction Capability',
    status: 'PENDING',
  },
  {
    id: 'REC_04',
    priority: 'MEDIUM',
    title: 'Broadcast Multilingual Advisory (Odia / Telugu) on AIR & SMS',
    actionText: 'Broadcast warning: "State Highway 14 is closed at KM 12. Proceed exclusively via Ridge Road toward Kalyanpur High School."',
    deadlineHours: 1.0,
    targetMandal: 'All Coastal Mandals',
    impactMetric: 'Prevents Evacuation Convoy Water Trapping',
    status: 'COMPLETED',
  },
];

export const TIMELINE_FRAMES: TimelineStep[] = [
  {
    hourOffset: -48,
    label: 'T-48h',
    timeStr: '25-SEP 15:00',
    windSpeedKmh: 65,
    pressureHpa: 998,
    surgeM: 0.4,
    exposedPop: 15000,
    phase: 'Depression',
    description: 'Deep Depression identified in Central Bay of Bengal. Early coastal alert triggered.',
    hazard: 'wind',
    exposure: 15000,
    routes: ['route_a', 'route_b'],
    shelters: DEMO_SHELTERS,
    infrastructure: DEMO_INFRASTRUCTURE,
    alerts: ['Depression alert issued'],
    recommendations: DEMO_RECOMMENDATIONS,
  },
  {
    hourOffset: -24,
    label: 'T-24h',
    timeStr: '26-SEP 15:00',
    windSpeedKmh: 125,
    pressureHpa: 978,
    surgeM: 1.8,
    exposedPop: 65000,
    phase: 'VSCS',
    description: 'Intensified into Very Severe Cyclonic Storm. "What Changed" engine flagged 28km North track shift.',
    hazard: 'wind',
    exposure: 65000,
    routes: ['route_c', 'route_d'],
    shelters: DEMO_SHELTERS,
    infrastructure: DEMO_INFRASTRUCTURE,
    alerts: ['VSCS warning issued'],
    recommendations: DEMO_RECOMMENDATIONS,
  },
  {
    hourOffset: -12,
    label: 'T-12h',
    timeStr: '27-SEP 03:00',
    windSpeedKmh: 160,
    pressureHpa: 955,
    surgeM: 3.2,
    exposedPop: 110000,
    phase: 'ESCS Warning',
    description: 'Extremely Severe storm status declared. TOPSIS safe haven engine activated for 42 shelters.',
    hazard: 'wind',
    exposure: 110000,
    routes: ['route_e', 'route_f'],
    shelters: DEMO_SHELTERS,
    infrastructure: DEMO_INFRASTRUCTURE,
    alerts: ['ESCS warning issued'],
    recommendations: DEMO_RECOMMENDATIONS,
  },
  {
    hourOffset: -4,
    label: 'T-4h (NOW)',
    timeStr: '27-SEP 11:00',
    windSpeedKmh: 185,
    pressureHpa: 938,
    surgeM: 4.8,
    exposedPop: 142500,
    phase: 'Landfall Impending',
    description: 'Outer rainbands striking coast. Substation 01 submerged. SH-14 severed by 0.85m surge.',
    hazard: 'storm surge',
    exposure: 142500,
    routes: ['route_g', 'route_h'],
    shelters: DEMO_SHELTERS,
    infrastructure: DEMO_INFRASTRUCTURE,
    alerts: ['Landfall imminent'],
    recommendations: DEMO_RECOMMENDATIONS,
  },
  {
    hourOffset: 0,
    label: 'T-0h',
    timeStr: '27-SEP 15:00',
    windSpeedKmh: 195,
    pressureHpa: 934,
    surgeM: 5.2,
    exposedPop: 168000,
    phase: 'Peak Landfall',
    description: 'Eye crossing coast near Gopalpur with astronomical high tide coincidence.',
    hazard: 'storm surge',
    exposure: 168000,
    routes: ['route_i', 'route_j'],
    shelters: DEMO_SHELTERS,
    infrastructure: DEMO_INFRASTRUCTURE,
    alerts: ['Peak landfall'],
    recommendations: DEMO_RECOMMENDATIONS,
  },
  {
    hourOffset: 6,
    label: 'T+6h',
    timeStr: '27-SEP 21:00',
    windSpeedKmh: 110,
    pressureHpa: 970,
    surgeM: 2.1,
    exposedPop: 85000,
    phase: 'Inland Decay',
    description: 'Storm weakens over Eastern Ghats. Pluvial river runoff starts cresting.',
    hazard: 'rain',
    exposure: 85000,
    routes: ['route_k'],
    shelters: DEMO_SHELTERS,
    infrastructure: DEMO_INFRASTRUCTURE,
    alerts: ['Inland decay observed'],
    recommendations: DEMO_RECOMMENDATIONS,
  },
  {
    hourOffset: 18,
    label: 'T+18h',
    timeStr: '28-SEP 09:00',
    windSpeedKmh: 60,
    pressureHpa: 992,
    surgeM: 0.6,
    exposedPop: 25000,
    phase: 'Recovery & Relief',
    description: 'Parametric insurance triggers execute automatically. Relief convoys dispatched via cleared routes.',
    hazard: 'recovery',
    exposure: 25000,
    routes: ['route_l'],
    shelters: DEMO_SHELTERS,
    infrastructure: DEMO_INFRASTRUCTURE,
    alerts: ['Recovery phase'],
    recommendations: DEMO_RECOMMENDATIONS,
  },
];

export const COPILOT_SAMPLE_DIALOGUES = [
  {
    prompt: 'Why did the evacuation router reject State Highway 14?',
    toolCalled: 'compute_safe_evacuation_path',
    toolArgs: { origin: [19.33, 85.01], destination: 'SHELTER_KALYANPUR', transport: 'BUS' },
    toolResult: { rejectedEdge: 'ROAD_SH14_KM12', floodDepthM: 0.85, limitM: 0.30, alternativePath: 'RIDGE_ROAD_NORTH' },
    response: `State Highway 14 was deterministically severed because the hydrodynamic hazard engine calculated a peak flood depth of **0.85 meters** near the Rushikulya River Bridge approach (KM 12). 

Standard evacuation transport vehicles stall at water depths exceeding **0.30 meters**. 

The system routed all evacuees via **Inland Ridge Road (+14.2m elevation)**, adding 2.6 km in distance but guaranteeing zero flood immersion and maintaining an estimated 3.5-hour safe clearance window.`,
    provenance: 'PRALAYA Dynamic Dijkstra Router v1 + FABDEM 30m',
  },
  {
    prompt: 'Draft an urgent community evacuation broadcast in Odia for coastal Sarpanches.',
    toolCalled: 'generate_multilingual_alert',
    toolArgs: { template: 'NDMA_COASTAL_EVAC_V2', language: 'ODIA', zone: 'Ganjam Coast' },
    toolResult: { verifiedDigits: ['14', '12', '15:30', '165'], hash: '9b2c4e...8f1a' },
    response: `Here is the verified, panic-free emergency broadcast in **Odia** with deterministic values locked:

**ଓଡ଼ିଆ ଜରୁରୀକାଳୀନ ସୂଚନା (Emergency Alert):**
> "ସମସ୍ତ ଗ୍ରାମବାସୀଙ୍କୁ ସତର୍କ କରାଯାଉଛି: ବାତ୍ୟା କରୁଣା ଆଗାମୀ ୪ ଘଣ୍ଟା ମଧ୍ୟରେ ଉପକୂଳ ଛୁଇଁବ (ପବନର ବେଗ: ୧୬୫ କି.ମି/ଘଣ୍ଟା)। 
> ଷ୍ଟେଟ୍ ହାଇୱେ-୧୪ (SH-14) ଋଷିକୁଲ୍ୟା ବ୍ରିଜ୍ ନିକଟରେ ୦.୮୫ ମିଟର ପାଣିରେ ବୁଡ଼ି ରହିଛି, ଦୟାକରି ସେହି ରାସ୍ତା ବ୍ୟବହାର କରନ୍ତୁ ନାହିଁ। 
> ରିଜ୍ ରୋଡ୍ ଦେଇ କଲ୍ୟାଣପୁର ହାଇସ୍କୁଲ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ୧୫:୩୦ IST ସୁଦ୍ଧା ସୁରକ୍ଷିତ ଭାବେ ଚାଲିଯାଆନ୍ତୁ। ସେଠାରେ ପାନୀୟ ଜଳ, ବିଦ୍ୟୁତ୍ ଏବଂ ଡାକ୍ତରୀ ସୁବିଧା ଉପଲବ୍ଧ ଅଛି।"

**English Verification Summary:**
- Prohibited road: SH-14 (0.85m flood)
- Safe Corridor: Ridge Road to Kalyanpur Shelter
- Cutoff Deadline: 15:30 IST
- All proper nouns and numerical values cryptographically verified against PostGIS snapshot.`,
    provenance: 'Gemini 2.5 Flash + NDMA Odia Template Guardrail',
  },
  {
    prompt: 'What is the cascading failure impact if Chhatrapur Substation stays submerged for 8 hours?',
    toolCalled: 'simulate_infrastructure_cascade',
    toolArgs: { failedAssets: ['INFRA_SUBSTATION_01'], elapsedHours: 8.0 },
    toolResult: { cascadeDepth: 3, criticalRisk: 'HOSPITAL_ICU_OXYGEN', hoursRemaining: 0.8 },
    response: `Topological failure propagation across the infrastructure DAG reveals severe cascading consequences at T+8h:

1. **Ganjam District Hospital (Critical Escalation)**:
   - Hospital diesel generator reserves will be **fully exhausted** in 7.2 hours.
   - At T+7.2h, oxygen concentrators and ICU ventilators for 24 patients will cease operation unless a mobile generator or fuel replenishment tanker arrives.

2. **North Drinking Water Booster**:
   - Pumping offline. Gravity reservoir depletion will cause fresh water loss to 65,000 residents in Sector 3 by T+14h.

3. **Cellular Mast T-14**:
   - Backup batteries deplete at T+3.5h, causing an emergency communications blackout across Arjipalli village.

**Action Order Generated**: Action Recommendation #02 dispatched fuel tanker with escort.`,
    provenance: 'NetworkX Infrastructure Dependency DAG Engine',
  },
];
