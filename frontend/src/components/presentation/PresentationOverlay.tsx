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
        <button onClick={onClose} style={closeBtnStyle}>✕</button>
        <h2 style={titleStyle}>{stage.title}</h2>
        <p style={descStyle}>{stage.description}</p>
        <div style={navContainerStyle}>
          <button onClick={onBack} disabled={stageIndex === 0} style={navBtnStyle}>
            BACK
          </button>
          <button onClick={onNext} disabled={stageIndex >= 11} style={navBtnStyle}>
            NEXT
          </button>
          <button onClick={onReset} style={resetBtnStyle}>RESET DEMO</button>
        </div>
        <div style={progressStyle}>
          {stageIndex + 1} / 12
        </div>
      </div>
    </div>
  );
};

// Inline style objects – minimal, reusing design tokens from index.css
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const panelStyle: React.CSSProperties = {
  maxWidth: '600px',
  width: '90%',
  maxHeight: '80vh',
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
  marginBottom: 'var(--gap-md)',
  color: 'var(--accent-cyan)',
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 700,
};

const descStyle: React.CSSProperties = {
  color: '#fff',
  lineHeight: 1.5,
  marginBottom: 'var(--gap-lg)',
  textAlign: 'center',
};

const navContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: 'var(--gap-md)',
};

const navBtnStyle: React.CSSProperties = {
  background: 'rgba(34, 197, 94, 0.2)',
  border: '1px solid rgba(34, 197, 94, 0.4)',
  color: 'var(--accent-emerald)',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 600,
  minWidth: '80px',
};

const resetBtnStyle: React.CSSProperties = {
  background: 'rgba(244, 63, 94, 0.2)',
  border: '1px solid rgba(244, 63, 94, 0.4)',
  color: 'var(--accent-rose)',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 600,
};

const progressStyle: React.CSSProperties = {
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
};
