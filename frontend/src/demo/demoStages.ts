// src/demo/demoStages.ts
// Deterministic data for the demo mode cyclonic scenario.
// Each stage defines the timestamp offset (relative to demo start) and the
// changes that should be applied to the application state.

export type DemoStage = {
  label: string; // Human readable label (e.g., "T-6h")
  timeOffsetMinutes: number; // Minutes from demo start
  description: string; // Short description for UI alerts
  // Partial updates to the global state slices used throughout the app.
  // The actual state shape is simplified; the demo engine will merge
  // these values into the corresponding pieces of the App's state.
  hazardLevel?: number; // 0‑100 scale
  exposureIncrease?: number; // additional exposed population
  routeDegradation?: number; // 0‑1 factor indicating route quality drop
  landfall?: boolean;
  floodPeak?: boolean;
  recovery?: boolean;
  shelterOccupancy?: number; // 0‑1 occupancy factor
  resourcesFactor?: number; // 0‑1 multiplier for emergency resource availability
};

export const DEMO_STAGES: DemoStage[] = [
  {
    label: 'T-6h',
    timeOffsetMinutes: 0,
    description: 'Early warning issued',
    hazardLevel: 10,
    exposureIncrease: 0,
    routeDegradation: 0,
    shelterOccupancy: 0.2,
    resourcesFactor: 1,
  },
  {
    label: 'T-4h',
    timeOffsetMinutes: 5,
    description: 'Hazard intensifies',
    hazardLevel: 30,
    exposureIncrease: 5000,
    shelterOccupancy: 0.3,
  },
  {
    label: 'T-2h',
    timeOffsetMinutes: 10,
    description: 'Exposure grows as people move',
    hazardLevel: 45,
    exposureIncrease: 12000,
    shelterOccupancy: 0.5,
  },
  {
    label: 'T-1h',
    timeOffsetMinutes: 15,
    description: 'Routes begin degrading',
    hazardLevel: 60,
    routeDegradation: 0.4,
    shelterOccupancy: 0.6,
  },
  {
    label: 'T0',
    timeOffsetMinutes: 20,
    description: 'Landfall',
    hazardLevel: 80,
    landfall: true,
    routeDegradation: 0.7,
    shelterOccupancy: 0.8,
    resourcesFactor: 0.9,
  },
  {
    label: 'T+1h',
    timeOffsetMinutes: 25,
    description: 'Flood peak',
    hazardLevel: 95,
    floodPeak: true,
    routeDegradation: 0.9,
    shelterOccupancy: 0.95,
    resourcesFactor: 0.7,
  },
  {
    label: 'T+4h',
    timeOffsetMinutes: 40,
    description: 'Recovery phase begins',
    hazardLevel: 30,
    recovery: true,
    routeDegradation: 0.3,
    shelterOccupancy: 0.4,
    resourcesFactor: 1,
  },
];
