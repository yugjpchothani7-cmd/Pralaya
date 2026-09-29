import React from 'react';

interface PresentationStage {
  title: string;
  description: string;
}

interface PresentationOverlayProps {
  stage: PresentationStage;
  stageIndex: number;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const PresentationOverlay: React.FC<PresentationOverlayProps> = ({
  stage,
  stageIndex,
  onNext,
  onBack,
  onReset,
  onClose,
}) => {
  return (
    <div className="presentation-overlay" style={overlayStyle}>
      <div className="glass-panel responsive-panel" style={panelStyle}>
        <button onClick={onClose} style={closeBtnStyle} aria-label="Close Presentation">✕</button>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={stageBadgeStyle}>WALKTHROUGH STEP {stageIndex + 1} OF 12</span>
        </div>
        <h2 style={titleStyle}>{stage.title}</h2>
        <p style={descStyle}>{stage.description}</p>
        <div style={navContainerStyle}>
          <button onClick={onBack} disabled={stageIndex === 0} style={backBtnStyle}>
            ← PREVIOUS
          </button>
          <button onClick={onNext} disabled={stageIndex >= 11} style={nextBtnStyle}>
            NEXT STEP →
          </button>
          <button onClick={onReset} style={resetBtnStyle}>RESTART</button>
        </div>
        <div style={progressStyle}>
          Progress: Step {stageIndex + 1} / 12
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
  maxWidth: '580px',
  width: '100%',
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
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 700,
};

const stageBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#0284c7',
  background: '#e0f2fe',
  padding: '3px 10px',
  borderRadius: '12px',
  marginBottom: '6px',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '12px',
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: 800,
};

const descStyle: React.CSSProperties = {
  color: '#334155',
  lineHeight: 1.6,
  marginBottom: '22px',
  textAlign: 'center',
  fontSize: '14.5px',
  padding: '0 8px',
};

const navContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '14px',
};

const backBtnStyle: React.CSSProperties = {
  background: '#f1f5f9',
  border: '1px solid #cbd5e1',
  color: '#334155',
  borderRadius: '8px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '13px',
};

const nextBtnStyle: React.CSSProperties = {
  background: '#0284c7',
  border: '1px solid #0369a1',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '8px 18px',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '13px',
  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
};

const resetBtnStyle: React.CSSProperties = {
  background: '#fff1f2',
  border: '1px solid #fecdd3',
  color: '#e11d48',
  borderRadius: '8px',
  padding: '8px 14px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '13px',
};

const progressStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#64748b',
  fontSize: '12px',
  fontWeight: 600,
};
