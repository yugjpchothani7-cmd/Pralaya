import React from 'react';

// Simple Judge Mode panel displaying innovation sections
export const JudgePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="judge-overlay" style={overlayStyle}>
      <div className="glass-panel responsive-panel" style={panelStyle}>
        <button onClick={onClose} style={closeBtnStyle}>✕</button>
        <h2 style={titleStyle}>PRALAYA JUDGE MODE</h2>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>PROBLEM</h3>
          <p>Coastal cyclones cause rapid flooding, infrastructure loss, and displacement.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>WHY EXISTING RESPONSE IS NOT ENOUGH</h3>
          <p>Traditional forecasts are static, lack provenance, and do not link hazard to actionable mitigation.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>PRALAYA APPROACH</h3>
          <p>Integrated data‑provenance layer, hazard engine, failure cascade modeling, and AI‑driven safe‑destination recommendation.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>DATA LAYER</h3>
          <p>All outputs expose source, dataset, timestamp, processing stage, model version, and confidence.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>HAZARD ENGINE</h3>
          <p>Deterministic cyclone surge, rain‑induced inundation, and tide‑driven flood extents.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>FAILURE CASCADES</h3>
          <p>Automatic propagation of road, power, and shelter failures through the exposure model.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>SAFE DESTINATION ENGINE</h3>
          <p>Optimizes routes to certified safe‑havens, respecting real‑time infrastructure status.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>GEMINI REASONING</h3>
          <p>LLM interprets provenance metadata to answer "why" queries and suggests mitigation.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>WHAT‑IF SIMULATION</h3>
          <p>Interactive sandbox lets analysts vary surge, rain, tide, and grid shocks.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>EARLY ACTION</h3>
          <p>Triggers alerts, pre‑positioning of resources, and evacuation orders before impact.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>RESILIENCE PLANNING</h3>
          <p>Feeds post‑event analysis back into infrastructure hardening and policy cycles.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>TECHNICAL ARCHITECTURE</h3>
          <p>FastAPI backend, Vite+React frontend, Geospatial Engine, and Gemini Copilot integration.</p>
        </section>
        <section style={sectionStyle}>
          <h3 style={headingStyle}>LIMITATIONS</h3>
          <p>Model accuracy depends on data freshness; deterministic demo mode abstracts live APIs.</p>
        </section>
        <pre className="mermaid" style={{ marginTop: 'var(--gap-md)' }}>
          {`graph LR
  P[Prediction] --> C[Consequence]
  C --> A[Action]
  A --> D[Adaptation]`}
        </pre>
      </div>
    </div>
  );
};

// Inline style objects – keep them minimal for clarity
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const panelStyle: React.CSSProperties = {
  maxWidth: '800px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: 'var(--gap-lg)',
  position: 'relative',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'var(--gap-sm)',
  right: 'var(--gap-sm)',
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 'var(--gap-lg)',
  color: 'var(--accent-cyan)',
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 700,
};

const headingStyle: React.CSSProperties = {
  marginBottom: 'var(--gap-xs)',
  color: 'var(--accent-amber)',
  fontSize: 'var(--font-size-xl)',
  fontWeight: 600,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 'var(--gap-md)',
  color: '#fff',
  lineHeight: 1.5,
};
