import React from 'react';
import { 
  Users, 
  Home, 
  Baby, 
  HeartHandshake, 
  Coins, 
  ShieldAlert,
  Sliders
} from 'lucide-react';
import type { TimelineStep } from '../../data/demoData';

interface RiskSummaryProps {
  currentTimelineFrame: TimelineStep;
  surgeShock: number;
  rainShock: number;
  highTide: boolean;
  gridBlackout: boolean;
}

export const RiskSummary: React.FC<RiskSummaryProps> = ({
  currentTimelineFrame,
  surgeShock,
  rainShock,
  highTide,
  gridBlackout,
}) => {
  // Baseline values
  const basePop = currentTimelineFrame.exposedPop;
  
  // Dynamic recalculations based on What-If simulation shocks
  const addedSurgePop = Math.round(surgeShock * 18500);
  const addedRainPop = Math.round((rainShock / 50) * 6200);
  const addedTidePop = highTide ? 14200 : 0;
  const addedGridPop = gridBlackout ? 22000 : 0;

  const totalExposedPop = basePop + addedSurgePop + addedRainPop + addedTidePop + addedGridPop;

  // Demographics breakdown
  const infants = Math.round(totalExposedPop * 0.128);
  const elderly = Math.round(totalExposedPop * 0.169);
  const kutchaDwellings = Math.round(totalExposedPop * 0.291);
  const livestock = Math.round(totalExposedPop * 0.477);
  const economicExposureCr = (totalExposedPop * 0.00337).toFixed(1); // in Crores INR

  // Composite Risk Index calculation (0 to 100)
  const baseRisk = 88.4;
  const shockDelta = (surgeShock * 3.2) + (rainShock * 0.03) + (highTide ? 2.5 : 0) + (gridBlackout ? 3.8 : 0);
  const compositeRisk = Math.min(99.4, Number((baseRisk + shockDelta).toFixed(1)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflowY: 'auto', paddingRight: '2px' }}>
      
      {/* Primary Composite Risk Scorecard */}
      <div style={{
        padding: '14px 16px',
        background: '#fff1f2',
        border: '1.5px solid #fecdd3',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 6px rgba(225, 29, 72, 0.08)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <ShieldAlert size={18} color="#e11d48" />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.04em', color: '#9f1239', textTransform: 'uppercase' }}>
              OVERALL DANGER LEVEL
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: '#475569' }}>
            Combined Storm Surge + Flood Depth + Fragility
          </p>
          {(surgeShock > 0 || rainShock > 0 || highTide || gridBlackout) && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: '#b45309',
              background: '#fef3c7',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #fde68a',
              fontWeight: 700
            }}>
              <Sliders size={11} />
              <span>Simulated Surge: +{shockDelta.toFixed(1)}% Danger</span>
            </div>
          )}
        </div>

        {/* Circular Gauge Representation */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: '50%',
          width: '74px',
          height: '74px',
          border: '3px solid #e11d48',
          boxShadow: '0 2px 8px rgba(225, 29, 72, 0.2)'
        }}>
          <span style={{
            fontSize: '19px',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            color: '#be123c',
            lineHeight: 1
          }}>
            {compositeRisk}%
          </span>
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#e11d48', letterSpacing: '0.04em', marginTop: '2px' }}>
            CRITICAL
          </span>
        </div>
      </div>

      {/* Exposed Population Metric Banner */}
      <div style={{
        padding: '14px 16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="#0284c7" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>PEOPLE IN FLOOD PATH</span>
          </div>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            Ganjam Coastal Region
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#0f172a', letterSpacing: '-0.02em' }}>
            {totalExposedPop.toLocaleString()}
          </span>
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>citizens living in coastal danger zone</span>
        </div>

        {/* Breakdown Demographics 2x2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {/* Infants < 5 */}
          <div style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>
              <Baby size={13} color="#7c3aed" />
              <span>BABIES & INFANTS (&lt;5 YRS)</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
              {infants.toLocaleString()}
            </span>
          </div>

          {/* Elderly 65+ */}
          <div style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>
              <HeartHandshake size={13} color="#e11d48" />
              <span>SENIOR CITIZENS (65+)</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
              {elderly.toLocaleString()}
            </span>
          </div>

          {/* Kutcha Dwellings */}
          <div style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>
              <Home size={13} color="#d97706" />
              <span>MUD / THATCHED HUTS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                {kutchaDwellings.toLocaleString()}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>({livestock.toLocaleString()} cattle)</span>
            </div>
          </div>

          {/* Economic Exposure */}
          <div style={{
            background: '#f8fafc',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>
              <Coins size={13} color="#059669" />
              <span>HOMES & CROPS AT RISK</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
              ₹{economicExposureCr} Crores
            </span>
          </div>
        </div>
      </div>

      {/* Vulnerability Sub-Index Progress Bars */}
      <div style={{
        padding: '14px 16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '10px' }}>
          HAZARD BREAKDOWN BY RISK FACTOR
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Physical Inundation Hazard */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Sea Surge & Inundation Depth</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#e11d48', fontWeight: 800 }}>92% Extreme</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', background: '#e11d48', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Demographic Fragility */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Vulnerable Housing & Age</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#d97706', fontWeight: 800 }}>84% High</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '84%', height: '100%', background: '#d97706', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Critical Infrastructure Cutoff */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Road & Power Cutoff Risk</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#7c3aed', fontWeight: 800 }}>
                {gridBlackout ? '98% (Isolated)' : '89% (High)'}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: gridBlackout ? '98%' : '89%', height: '100%', background: '#7c3aed', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
