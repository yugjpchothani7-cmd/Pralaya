import React from 'react';
import { Fingerprint, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ProvenanceMetadata } from '../../types/index';

interface TrustPanelProps {
  // Accept an optional provenance object; fallback to example data
  provenance?: ProvenanceMetadata;
}

export const TrustPanel: React.FC<TrustPanelProps> = ({ provenance }) => {
  // Example provenance if none supplied
  const example = provenance ?? {
    source_id: 'rainfall + elevation + water data',
    source_authority: 'National Weather Service',
    verification_level: 'high',
    fetched_at: new Date().toISOString(),
    dataset: 'rainfall + elevation + water data',
    processing_stage: 'MODELED',
    model_version: 'v1.2.3',
    classification: 'MODELED',
    confidence_score: 0.92,
    uncertainty: 0.08,
    is_synthetic_simulation: false,
  } as ProvenanceMetadata;

  const statusIcon = example.verification_level === 'high' ? CheckCircle : AlertTriangle;
  const statusColor = example.verification_level === 'high' ? 'var(--accent-green)' : 'var(--accent-rose)';

  return (
    <section style={{
      background: 'rgba(15, 23, 42, 0.85)',
      border: `2px solid ${statusColor}`,
      borderRadius: '8px',
      padding: '14px',
      color: '#fff',
      boxShadow: `0 0 12px ${statusColor}`,
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <Fingerprint size={18} color={statusColor} />
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Data Provenance & Trust</h3>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 8px' }}>
        <span>DATA SOURCE</span>
        <span>{example.dataset}</span>
        <span>LAST UPDATED</span>
        <span>{new Date(example.fetched_at).toLocaleString()}</span>
        <span>MODEL</span>
        <span>{example.model_version}</span>
        <span>STATUS</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {React.createElement(statusIcon, { size: 14, color: statusColor })}
          {example.verification_level.toUpperCase()}
        </span>
        <span>CONFIDENCE / UNCERTAINTY</span>
        <span>{example.confidence_score ? `${(example.confidence_score * 100).toFixed(0)}%` : 'N/A'}{example.uncertainty ? ` ± ${(example.uncertainty * 100).toFixed(0)}%` : ''}</span>
      </div>
    </section>
  );
};
