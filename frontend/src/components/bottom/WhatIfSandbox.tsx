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
      background: '#f8fafc',
      padding: '10px 14px',
      borderRadius: '8px',
      border: isShockActive ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      minWidth: '460px'
    }}>
      {/* Header & Reset Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={14} color="#d97706" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em' }}>
            WEATHER SIMULATOR (Test Worse Conditions)
          </span>
          {isShockActive && (
            <span style={{
              fontSize: '8.5px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 5px',
              borderRadius: '3px',
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
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
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '2px 8px',
              color: '#475569',
              fontSize: '10px',
              fontWeight: 600,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontWeight: 600 }}>
              <Waves size={11} color="#0284c7" />
              <span>Surge Delta:</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: surgeShock > 0 ? '#b45309' : '#0f172a' }}>
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
              accentColor: '#d97706',
              cursor: 'pointer',
              height: '4px',
              width: '100%'
            }}
          />
        </div>

        {/* Rain Shock Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontWeight: 600 }}>
              <CloudRain size={11} color="#0284c7" />
              <span>Rain Shock:</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: rainShock > 0 ? '#b45309' : '#0f172a' }}>
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
              accentColor: '#0284c7',
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
            background: highTide ? '#e0f2fe' : '#ffffff',
            border: highTide ? '1px solid #0284c7' : '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '5px 8px',
            color: highTide ? '#0369a1' : '#475569',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
          title="Simulate Astronomical High Tide Coincidence (+0.8m)"
        >
          <Moon size={11} color={highTide ? '#0284c7' : '#64748b'} />
          <span>High Tide</span>
        </button>

        {/* Grid Blackout Toggle */}
        <button
          onClick={onToggleGridBlackout}
          style={{
            background: gridBlackout ? '#fee2e2' : '#ffffff',
            border: gridBlackout ? '1px solid #dc2626' : '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '5px 8px',
            color: gridBlackout ? '#b91c1c' : '#475569',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
          title="Simulate Complete Regional Power Grid Tripping"
        >
          <ZapOff size={11} color={gridBlackout ? '#dc2626' : '#64748b'} />
          <span>Grid Cut</span>
        </button>
      </div>
    </div>
  );
};
