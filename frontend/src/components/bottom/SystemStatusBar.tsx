import React from 'react';
import { Database, Cpu, Lock } from 'lucide-react';

export const SystemStatusBar: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 16px',
      background: 'rgba(7, 11, 20, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      fontSize: '10px',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)'
    }}>
      {/* Left Invariants */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-emerald)' }}>
          <Database size={11} />
          <span>PostGIS Graph: OK</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-cyan)' }}>
          <Cpu size={11} />
          <span>Hydro Mesh: 30m FABDEM LOCKED</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-purple)' }}>
          <Lock size={11} />
          <span>Zero-Hallucination Guardrail: ENFORCED</span>
        </div>
      </div>

      {/* Right Telemetry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span>Engine Latency: 12ms</span>
        <span style={{ color: 'var(--text-secondary)' }}>EPSG:4326 // UTM Zone 45N</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div className="pulsing-beacon" style={{ width: '6px', height: '6px' }} />
          <span style={{ color: '#fff' }}>SYSTEM NORMAL</span>
        </div>
      </div>
    </div>
  );
};
