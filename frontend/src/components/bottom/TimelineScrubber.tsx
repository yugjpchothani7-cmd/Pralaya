import React, { useEffect } from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { TIMELINE_FRAMES } from '../../data/demoData';

interface TimelineScrubberProps {
  currentFrameIndex: number;
  onSelectFrame: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentFrameIndex,
  onSelectFrame,
  isPlaying,
  onTogglePlay,
}) => {
  // Automated playback loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onSelectFrame((currentFrameIndex + 1) % TIMELINE_FRAMES.length);
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentFrameIndex, onSelectFrame]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: 1,
      minWidth: '420px'
    }}>
      {/* Timeline Controls Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onTogglePlay}
            style={{
              background: isPlaying ? 'rgba(244, 63, 94, 0.2)' : 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
              border: isPlaying ? '1px solid var(--accent-rose)' : 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'PAUSE' : 'REPLAY'}</span>
          </button>

          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
            CYCLONE TIMELINE (Before, During & After Landfall)
          </span>
        </div>

        {/* Current Active Timestamp */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#0284c7',
          background: '#eff6ff',
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid #bfdbfe'
        }}>
          <Clock size={12} color="#0284c7" />
          <span>{TIMELINE_FRAMES[currentFrameIndex].timeStr}</span>
          <span style={{ color: '#94a3b8' }}>|</span>
          <span style={{ color: '#0f172a', fontWeight: 700 }}>{TIMELINE_FRAMES[currentFrameIndex].phase}</span>
        </div>
      </div>

      {/* Scrubber Track Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${TIMELINE_FRAMES.length}, 1fr)`,
        gap: '4px',
        background: '#f1f5f9',
        padding: '4px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        {TIMELINE_FRAMES.map((step, idx) => {
          const isActive = idx === currentFrameIndex;
          const isLandfall = step.hourOffset === 0;
          const isNow = step.hourOffset === -4;

          return (
            <button
              key={step.hourOffset}
              onClick={() => onSelectFrame(idx)}
              style={{
                background: isActive
                  ? isNow
                    ? '#e11d48'
                    : isLandfall
                    ? '#d97706'
                    : '#2563eb'
                  : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                border: isActive
                  ? isNow ? '1px solid #be123c' : isLandfall ? '1px solid #b45309' : '1px solid #1d4ed8'
                  : '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '6px 4px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)'
              }}>
                {step.label}
              </span>
              <span style={{
                fontSize: '8.5px',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: isActive ? 600 : 500,
                whiteSpace: 'nowrap'
              }}>
                {step.windSpeedKmh} km/h
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
