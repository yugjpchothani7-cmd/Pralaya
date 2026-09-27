import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Globe, 
  Clock, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { INITIAL_CYCLONE_STATE } from '../../data/demoData';

interface TopNavProps {
  onOpenDiagnostics?: () => void;
  onOpenJudge?: () => void;
  onOpenPresentation?: () => void;
  audioAlert: boolean;
  onToggleAudio: () => void;
  presentationMode: boolean;
  onTogglePresentation: () => void;
  activeLang: 'EN' | 'OD' | 'TE' | 'HI';
  onChangeLang: (lang: 'EN' | 'OD' | 'TE' | 'HI') => void;
  whatIfActive: boolean;
  backendConnected?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenDiagnostics,
  onOpenJudge,
  onOpenPresentation,
  audioAlert,
  onToggleAudio,
  presentationMode,
  onTogglePresentation,
  activeLang,
  onChangeLang,
  whatIfActive,
  backendConnected = false,
}) => {
  // Live ticking countdown to landfall (T-4h)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4 * 3600 - 98); // 3h 58m 22s
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('27-SEP-2026 11:01:38 IST');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const clockTimer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`27-SEP-2026 ${hrs}:${mins}:${secs} IST`);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(clockTimer);
    };
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `T - ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 24px',
      background: '#ffffff',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      zIndex: 50,
      position: 'relative'
    }}>
      {/* Brand & Mission Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(37, 99, 235, 0.25)',
          border: '1px solid #bfdbfe'
        }}>
          <Zap size={20} color="#ffffff" />
        </div>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '18px',
              fontWeight: 900,
              letterSpacing: '0.06em',
              color: '#0f172a',
              fontFamily: 'var(--font-sans)',
            }}>
              PRALAYA
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              background: '#eff6ff',
              color: 'var(--accent-blue)',
              border: '1px solid #bfdbfe',
              padding: '2px 6px',
              borderRadius: '4px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              Command Center v2.0
            </span>
            {backendConnected && (
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--accent-emerald)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span className="pulsing-beacon" style={{ width: '5px', height: '5px' }} />
                <span>API SYNCED</span>
              </span>
            )}
            {whatIfActive && (
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                animation: 'beacon-pulse 2s infinite'
              }}>
                SIMULATION ACTIVE
              </span>
            )}
          </div>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            margin: 0
          }}>
            Predictive Resilience & Adaptive Local Action AI // Coastal Odisha Sector
          </p>
        </div>
      </div>

      {/* Center Live Event Status Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '6px 18px',
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(225, 29, 72, 0.08)'
      }}>
        {/* Pulsing Alert Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulsing-beacon-danger" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--accent-rose)',
                letterSpacing: '0.04em'
              }}>
                {INITIAL_CYCLONE_STATE.name.toUpperCase()}
              </span>
              <span style={{
                fontSize: '10px',
                padding: '1px 5px',
                background: '#ffe4e6',
                border: '1px solid #fecdd3',
                borderRadius: '3px',
                color: '#e11d48',
                fontWeight: 700
              }}>
                ESCS // CAT-4 EQUIV
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Landfall: {INITIAL_CYCLONE_STATE.landfallLocation}
            </span>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: '#fecdd3' }} />

        {/* Live Landfall Countdown */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            ETA Landfall Eye
          </span>
          <span style={{
            fontSize: '15px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: '#be123c',
            letterSpacing: '0.06em'
          }}>
            {formatCountdown(secondsRemaining)}
          </span>
        </div>

        <div style={{ width: '1px', height: '24px', background: '#fecdd3' }} />

        {/* IMD RSMC Verified Bulletin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} color="#d97706" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '9px', color: '#b45309', fontWeight: 700, letterSpacing: '0.04em' }}>
              IMD BULLETIN #14
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Winds: 185 km/h | 938 hPa
            </span>
          </div>
        </div>
      </div>

      {/* Right Utility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Real-time Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: '#f8fafc',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#334155'
        }}>
          <Clock size={12} color="var(--accent-blue)" />
          <span>{currentTimeStr}</span>
        </div>

        {/* Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#f8fafc', padding: '2px 4px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <Globe size={13} color="#64748b" style={{ marginLeft: '4px', marginRight: '2px' }} />
          {(['EN', 'OD', 'TE', 'HI'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onChangeLang(lang)}
              style={{
                background: activeLang === lang ? 'var(--accent-blue)' : 'transparent',
                color: activeLang === lang ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={lang === 'OD' ? 'Odia (ଓଡ଼ିଆ)' : lang === 'TE' ? 'Telugu (తెలుగు)' : lang === 'HI' ? 'Hindi (हिन्दी)' : 'English'}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Audio Alert Toggle */}
        <button
          onClick={onToggleAudio}
          style={{
            background: audioAlert ? '#fee2e2' : '#f8fafc',
            border: audioAlert ? '1px solid #fca5a5' : '1px solid #e2e8f0',
            color: audioAlert ? '#e11d48' : '#64748b',
            borderRadius: '6px',
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600
          }}
          title={audioAlert ? 'Mute Siren Feed' : 'Unmute Siren Feed'}
        >
          {audioAlert ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>

        {/* Presentation Fullscreen Toggle */}
        <button
          onClick={onTogglePresentation}
          style={{
            background: presentationMode ? '#e0f2fe' : '#f8fafc',
            border: presentationMode ? '1px solid #7dd3fc' : '1px solid #e2e8f0',
            color: presentationMode ? '#0284c7' : '#64748b',
            borderRadius: '6px',
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600
          }}
          title="Toggle Hackathon Presentation Mode"
        >
          {presentationMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          <span style={{ display: 'none' }}>Fullscreen</span>
        </button>

        {/* Architecture & Provenance Verification Badge */}
        {onOpenDiagnostics && (
          <button
            onClick={onOpenDiagnostics}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: 'var(--accent-emerald)',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700
            }}
            title="Inspect Verification Guardrails & PostGIS Posture"
          >
            <ShieldCheck size={14} />
            <span>VERIFIED L1</span>
          </button>
        )}
        {onOpenJudge && (
          <button
            onClick={onOpenJudge}
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: 'var(--accent-rose)',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700
            }}
            title="Open Judge Mode"
          >
            <Zap size={14} />
            <span>JUDGE MODE</span>
          </button>
        )}
        {onOpenPresentation && (
          <button
            onClick={onOpenPresentation}
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              color: 'var(--accent-emerald)',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700
            }}
            title="Start Presentation Mode"
          >
            <Zap size={14} />
            <span>PRESENTATION</span>
          </button>
        )}
      </div>
    </header>
  );
};
