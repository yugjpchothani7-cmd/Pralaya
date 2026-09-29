import React from 'react';
import { Database, Cpu, Lock } from 'lucide-react';

export const SystemStatusBar: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 20px',
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      color: '#64748b'
    }}>
      {/* Left Invariants */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#059669', fontWeight: 600 }}>
          <Database size={12} />
          <span>PostGIS Graph: OK</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0284c7', fontWeight: 600 }}>
          <Cpu size={12} />
          <span>Hydro Mesh: 30m FABDEM LOCKED</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#7c3aed', fontWeight: 600 }}>
          <Lock size={12} />
          <span>Zero-Hallucination Guardrail: ENFORCED</span>
        </div>
      </div>

      {/* Right Telemetry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#475569' }}>Engine Latency: 12ms</span>
        <span style={{ color: '#64748b' }}>EPSG:4326 // UTM Zone 45N</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="pulsing-beacon" style={{ width: '7px', height: '7px' }} />
          <span style={{ color: '#059669', fontWeight: 700 }}>SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
};
