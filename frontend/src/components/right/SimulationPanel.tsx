// src/components/right/SimulationPanel.tsx
import React, { useState } from 'react';
import { api } from '../../api/client';
import type { SimulationParams, SimulationResult } from '../../types/simulation';

// Simple slider component
const Slider = ({ label, name, min, max, step, value, onChange }: {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div style={{ marginBottom: '12px' }}>
    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>{label}: {value}</label>
    <input
      type="range"
      name={name}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      style={{ width: '100%' }}
    />
  </div>
);

export const SimulationPanel: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    rainfall_mm: 0,
    wind_kmh: 0,
    storm_surge_m: 0,
    road_failure_pct: 0,
    shelter_capacity_factor: 1,
    infrastructure_availability: 1,
    emergency_resources_factor: 1,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: Number(value) }));
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.computeSimulation(params);
      setResult(res);
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '12px', overflowY: 'auto' }}>
      <h3 style={{ marginBottom: '12px', color: 'var(--accent-blue)' }}>Scenario Simulation</h3>
      <Slider label="Rainfall (mm)" name="rainfall_mm" min={0} max={500} step={10} value={params.rainfall_mm ?? 0} onChange={handleChange} />
      <Slider label="Wind (km/h)" name="wind_kmh" min={0} max={200} step={5} value={params.wind_kmh ?? 0} onChange={handleChange} />
      <Slider label="Storm Surge (m)" name="storm_surge_m" min={0} max={10} step={0.5} value={params.storm_surge_m ?? 0} onChange={handleChange} />
      <Slider label="Road Failure (%)" name="road_failure_pct" min={0} max={100} step={5} value={params.road_failure_pct ?? 0} onChange={handleChange} />
      <Slider label="Shelter Capacity Factor" name="shelter_capacity_factor" min={0.5} max={2} step={0.1} value={params.shelter_capacity_factor ?? 1} onChange={handleChange} />
      <Slider label="Infrastructure Availability" name="infrastructure_availability" min={0} max={1} step={0.1} value={params.infrastructure_availability ?? 1} onChange={handleChange} />
      <Slider label="Emergency Resources Factor" name="emergency_resources_factor" min={0} max={1} step={0.1} value={params.emergency_resources_factor ?? 1} onChange={handleChange} />
      <button
        onClick={runSimulation}
        disabled={loading}
        style={{
          marginTop: '12px',
          width: '100%',
          padding: '8px',
          background: 'var(--accent-cyan)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Running...' : 'Run Simulation'}
      </button>

      {result && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ color: 'var(--accent-blue)' }}>Results</h4>
          <pre style={{ background: '#111', color: '#0f0', padding: '8px', borderRadius: '4px', overflowX: 'auto' }}>
{JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
