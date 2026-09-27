import React from 'react';
import { Sliders, RotateCcw, Waves, CloudRain, Moon, ZapOff } from 'lucide-react';

interface WhatIfSandboxProps {
  surgeShock: number;
  onChangeSurgeShock: (val: number) => void;
  rainShock: number;
  onChangeRainShock: (val: number) => void;
  highTide: boolean;
  onToggleHighTide: () => void;
  gridBlackout: boolean;
  onToggleGridBlackout: () => void;
  onReset: () => void;
}

export const WhatIfSandbox: React.FC<WhatIfSandboxProps> = ({
  surgeShock,
  onChangeSurgeShock,
  rainShock,
  onChangeRainShock,
  highTide,
  onToggleHighTide,
  gridBlackout,
  onToggleGridBlackout,
  onReset,
}) => {
  const isShockActive = surgeShock > 0 || rainShock > 0 || highTide || gridBlackout;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      background: 'rgba(15, 23, 42, 0.85)',
      padding: '10px 14px',
      borderRadius: '8px',
      border: isShockActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
      minWidth: '460px'
    }}>
      {/* Header & Reset Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={14} color="var(--accent-amber)" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
            WHAT-IF COUNTERFACTUAL ENGINE
          </span>
          {isShockActive && (
            <span style={{
              fontSize: '8.5px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 5px',
              borderRadius: '3px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--accent-amber)',
              fontWeight: 800
            }}>
              LIVE RECALC
            </span>
          )}
        </div>

        {isShockActive && (
          <button
            onClick={onReset}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '2px 8px',
              color: 'var(--text-secondary)',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={10} />
            <span>Reset Baseline</span>
          </button>
        )}
      </div>

      {/* Slider & Toggle Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '12px', alignItems: 'center' }}>
        {/* Surge Shock Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
              <Waves size={11} color="var(--accent-cyan)" />
              <span>Surge Delta:</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: surgeShock > 0 ? 'var(--accent-amber)' : '#fff' }}>
              +{surgeShock.toFixed(1)}m
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.2"
            value={surgeShock}
            onChange={(e) => onChangeSurgeShock(parseFloat(e.target.value))}
            style={{
              accentColor: 'var(--accent-amber)',
              cursor: 'pointer',
              height: '4px',
              width: '100%'
            }}
          />
        </div>

        {/* Rain Shock Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
              <CloudRain size={11} color="var(--accent-cyan)" />
              <span>Rain Shock:</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: rainShock > 0 ? 'var(--accent-amber)' : '#fff' }}>
              +{rainShock}mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="25"
            value={rainShock}
            onChange={(e) => onChangeRainShock(parseInt(e.target.value, 10))}
            style={{
              accentColor: 'var(--accent-cyan)',
              cursor: 'pointer',
              height: '4px',
              width: '100%'
            }}
          />
        </div>

        {/* High Tide Toggle */}
        <button
          onClick={onToggleHighTide}
          style={{
            background: highTide ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: highTide ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '5px 8px',
            color: highTide ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Simulate Astronomical High Tide Coincidence (+0.8m)"
        >
          <Moon size={11} />
          <span>High Tide</span>
        </button>

        {/* Grid Blackout Toggle */}
        <button
          onClick={onToggleGridBlackout}
          style={{
            background: gridBlackout ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.05)',
            border: gridBlackout ? '1px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '5px 8px',
            color: gridBlackout ? 'var(--accent-rose)' : 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Simulate Complete Regional Power Grid Tripping"
        >
          <ZapOff size={11} />
          <span>Grid Cut</span>
        </button>
      </div>
    </div>
  );
};
