import React from 'react';

// Judge Mode panel with high-contrast readable styling and plain-language explanations
export const JudgePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="judge-overlay" style={overlayStyle}>
      <div className="glass-panel responsive-panel" style={panelStyle}>
        <button onClick={onClose} style={closeBtnStyle} aria-label="Close Judge Panel">✕</button>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={badgeStyle}>EXECUTIVE & JUDGE OVERVIEW</span>
          <h2 style={titleStyle}>PRALAYA System Architecture & Innovation</h2>
          <p style={{ color: '#475569', fontSize: '14px', marginTop: '6px' }}>
            A plain-language guide to how PRALAYA protects coastal lives during Bay of Bengal cyclones
          </p>
        </div>

        <section style={cardStyle}>
          <h3 style={headingStyle}>1. THE PROBLEM (Why This Matters)</h3>
          <p style={textStyle}>
            When severe cyclones strike the Bay of Bengal coast (such as Odisha and Andhra Pradesh), seawater rushes inland within minutes. Roads drown, electricity cuts out, and families get trapped because traditional weather alerts only give rain forecasts—not specific, street-level escape routes.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>2. WHY CURRENT DISASTER RESPONSE FALLS SHORT</h3>
          <p style={textStyle}>
            Existing alerts are static PDF maps and broadcast warnings that don't tell a citizen or district magistrate: <em>"Can a rescue bus cross Highway 14 right now?"</em> or <em>"Is the nearest shelter running on generator power, or is it already flooded?"</em>
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>3. THE PRALAYA SOLUTION (Plain English)</h3>
          <p style={textStyle}>
            PRALAYA is a real-time smart command platform. It tracks approaching cyclones, predicts exactly which streets and buildings will flood, checks which roads are still safe to drive on, and guides people to the nearest safe shelter with verified power, drinking water, and high elevation.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>4. LIVE SATELLITE & RADAR DATA</h3>
          <p style={textStyle}>
            We combine European Space Agency Sentinel-1 radar satellites (which can see through thick cyclone storm clouds), Google Earth Engine elevation models, and Indian Meteorological Department (IMD) cyclone bulletins into one unified map. Every single data point shows its exact origin and timestamp.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>5. SMART FLOOD PREDICTION ENGINE</h3>
          <p style={textStyle}>
            Instead of guessing, PRALAYA calculates sea surge height + high astronomical tide + rainfall accumulation to generate an accurate 3D flood map showing water depth from 0.5m up to 4.8m.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>6. CHAIN-REACTION FAILURE TRACKING</h3>
          <p style={textStyle}>
            Disasters cause domino effects: if an electrical substation drowns, nearby mobile towers die within 6 hours, which cuts off emergency calls to shelters. PRALAYA models these chain reactions in advance so backup generators can be dispatched before power is lost.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>7. SAFE ESCAPE ROUTE FINDER</h3>
          <p style={textStyle}>
            Just like Google Maps finds the fastest driving route, PRALAYA finds the <strong>safest route above water</strong>. If Highway 14 is flooded with 1.8m of water, it automatically reroutes evacuation buses through high-elevation National Highway 16 bypass.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>8. GROUNDED AI ASSISTANT (Gemini Copilot)</h3>
          <p style={textStyle}>
            A built-in AI copilot answers questions from citizens and disaster officials in simple words or local languages (English, Odia, Hindi). Crucially, the AI is restricted to verified data so it never hallucinates fake safety information.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>9. "WHAT-IF" SIMULATION SANDBOX</h3>
          <p style={textStyle}>
            Commanders can slide controls at the bottom of the screen to simulate worst-case scenarios: <em>"What if rainfall increases by 30mm/hour?"</em> or <em>"What if high tide arrives 2 hours early?"</em> The map and routes instantly adapt.
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={headingStyle}>10. TECH STACK & ARCHITECTURE</h3>
          <p style={textStyle}>
            Built with modern, responsive React + TypeScript, Vite, high-performance Leaflet geospatial mapping, and a FastAPI Python backend with strict data verification and real-time computation.
          </p>
        </section>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7', marginBottom: '8px' }}>
            OPERATIONAL LIFECYCLE
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0f172a'
          }}>
            <span style={stepBadgeStyle}>1. Satellite Prediction</span>
            <span>➔</span>
            <span style={stepBadgeStyle}>2. Flood Consequence</span>
            <span>➔</span>
            <span style={stepBadgeStyle}>3. Life-Saving Action</span>
            <span>➔</span>
            <span style={stepBadgeStyle}>4. Long-Term Adaptation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.75)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  padding: '16px',
};

const panelStyle: React.CSSProperties = {
  maxWidth: '820px',
  width: '100%',
  maxHeight: '88vh',
  overflowY: 'auto',
  padding: '28px',
  position: 'relative',
  background: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
  border: '1px solid #cbd5e1',
  color: '#0f172a',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  color: '#334155',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontWeight: 700,
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#0284c7',
  background: '#e0f2fe',
  padding: '4px 10px',
  borderRadius: '20px',
  marginBottom: '8px',
};

const titleStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: '22px',
  fontWeight: 800,
  lineHeight: 1.3,
  margin: 0,
};

const cardStyle: React.CSSProperties = {
  marginBottom: '14px',
  padding: '14px 16px',
  background: '#f8fafc',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
};

const headingStyle: React.CSSProperties = {
  marginBottom: '6px',
  color: '#0369a1',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.02em',
};

const textStyle: React.CSSProperties = {
  color: '#334155',
  fontSize: '13.5px',
  lineHeight: 1.6,
  margin: 0,
};

const stepBadgeStyle: React.CSSProperties = {
  background: '#e0f2fe',
  color: '#0369a1',
  padding: '6px 12px',
  borderRadius: '8px',
  border: '1px solid #bae6fd',
};
