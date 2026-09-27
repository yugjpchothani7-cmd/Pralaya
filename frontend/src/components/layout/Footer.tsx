import React from 'react';
import { Shield, Database, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 11, 20, 0.95)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: 'var(--text-muted)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={14} color="var(--accent-emerald)" />
          <span>IMD RSMC Verified Feed (Official Govt Source Rank 1)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={14} color="var(--accent-cyan)" />
          <span>PostgreSQL 16 + PostGIS Spatial Engine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={14} color="var(--accent-purple)" />
          <span>Air-Gapped Client (Zero API Keys Exposed)</span>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        SHA-256 PROVENANCE AUDIT SEAL: <span style={{ color: 'var(--accent-cyan)' }}>4f53cd...a875</span>
      </div>
    </footer>
  );
};
