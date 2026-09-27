// src/components/right/InsuranceTriggerPanel.tsx
/*
Insurance Trigger Simulator UI.
Displays sliders for rainfall, wind, and flood thresholds, a policy name input,
and a button to evaluate the parametric insurance trigger.
All results are **SIMULATION ONLY** – no real insurance decisions are made.
*/

import React, { useState } from 'react';
import { api } from '../../api/client';
import type { TriggerConfig, TriggerResult } from '../../types';

export const InsuranceTriggerPanel: React.FC = () => {
  const [policyName, setPolicyName] = useState('Demo Policy');
  const [rainfall, setRainfall] = useState(50);
  const [wind, setWind] = useState(30);
  const [flood, setFlood] = useState(70);
  const [result, setResult] = useState<TriggerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const evaluate = async () => {
    const config: TriggerConfig = {
      policy_name: policyName,
      rainfall_threshold: rainfall,
      wind_threshold: wind,
      flood_threshold: flood,
    };
    setLoading(true);
    try {
      const res = await api.evaluateInsuranceTrigger(config);
      setResult(res);
    } catch (e) {
      console.error(e);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ margin: 0, color: 'var(--accent-cyan)' }}>Parametric Insurance Trigger Simulator</h3>
      <p style={{ margin: '4px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <strong>SIMULATION ONLY</strong>: This module demonstrates how policy triggers would behave under
        simulated conditions. No real insurance decisions are taken.
      </p>
      <label style={{ fontSize: '0.85rem' }}>Policy Name</label>
      <input
        type="text"
        value={policyName}
        onChange={e => setPolicyName(e.target.value)}
        style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--border-muted)' }}
      />
      <label style={{ fontSize: '0.85rem' }}>Rainfall Threshold (mm)</label>
      <input
        type="range"
        min={0}
        max={200}
        value={rainfall}
        onChange={e => setRainfall(Number(e.target.value))}
      />
      <span>{rainfall} mm</span>
      <label style={{ fontSize: '0.85rem' }}>Wind Threshold (km/h)</label>
      <input
        type="range"
        min={0}
        max={150}
        value={wind}
        onChange={e => setWind(Number(e.target.value))}
      />
      <span>{wind} km/h</span>
      <label style={{ fontSize: '0.85rem' }}>Flood Threshold (m)</label>
      <input
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={flood}
        onChange={e => setFlood(Number(e.target.value))}
      />
      <span>{flood.toFixed(1)} m</span>
      <button
        onClick={evaluate}
        disabled={loading}
        style={{
          marginTop: '8px',
          padding: '6px 12px',
          background: 'var(--accent-blue)',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'wait' : 'pointer',
        }}
      >
        {loading ? 'Evaluating…' : 'Run Simulation'}
      </button>

      {result && (
        <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.1)', padding: '8px', borderRadius: '6px' }}>
          <h4 style={{ margin: 0, color: result.condition_met ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {result.condition_met ? 'Trigger Condition Met' : 'No Trigger'}
          </h4>
          <p><strong>Policy:</strong> {result.policy}</p>
          {result.trigger_parameter && (
            <p><strong>Parameter:</strong> {result.trigger_parameter}</p>
          )}
          {result.observed_value !== undefined && (
            <p><strong>Observed Value:</strong> {result.observed_value}</p>
          )}
          {result.threshold !== undefined && (
            <p><strong>Threshold:</strong> {result.threshold}</p>
          )}
          {result.hypothetical_payout !== undefined && (
            <p><strong>Hypothetical Payout:</strong> ${result.hypothetical_payout}</p>
          )}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Simulated at: {new Date(result.simulation_timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};
