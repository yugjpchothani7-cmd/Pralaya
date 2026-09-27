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

  const getRiskColor = (score: number) => {
    if (score >= 85) return 'var(--color-simulated)';
    if (score >= 65) return 'var(--color-modeled)';
    return 'var(--color-observed)';
  };

  const riskColor = getRiskColor(compositeRisk);

  return (
    <div className="responsive-panel glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-md)', height: '100%', overflowY: 'auto', padding: 'var(--gap-md)' }}>
      {/* Primary Composite Risk Scorecard */}
      <div style={{
        padding: '14px',
        background: 'linear-gradient(135deg, rgba(30, 15, 25, 0.9), rgba(15, 23, 42, 0.95))',
        border: `1px solid ${riskColor}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: `0 0 20px rgba(244, 63, 94, 0.2)`
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <ShieldAlert size={16} color={riskColor} />
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', color: '#fff', textTransform: 'uppercase' }}>
              COMPOSITE RISK INDEX
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>
            Physical Hazard × Exposure × Socio-Demographic Vulnerability
          </p>
          {(surgeShock > 0 || rainShock > 0 || highTide || gridBlackout) && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              fontSize: '9.5px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-amber)',
              background: 'rgba(245, 158, 11, 0.15)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <Sliders size={10} />
              <span>Simulated Delta: +{shockDelta.toFixed(1)} pts</span>
            </div>
          )}
        </div>

        {/* Circular Gauge Representation */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '50%',
          width: '72px',
          height: '72px',
          border: `2px solid ${riskColor}`,
          boxShadow: `0 0 14px ${riskColor}`
        }}>
          <span className="badge" style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: '#fff',
            lineHeight: 1
          }}>
            {compositeRisk}%
          </span>
          <span style={{ fontSize: '8.5px', fontWeight: 800, color: riskColor, letterSpacing: '0.04em', marginTop: '2px' }}>
            EXTREME
          </span>
        </div>
      </div>

      {/* Exposed Population Metric Banner */}
      <div className="glass-panel responsive-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--gap-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-sm)' }}>
            <Users size={15} color="var(--accent-cyan)" />
            <span className="badge badge-observed">EXPOSED POPULATION</span>
          </div>
          <span className="badge" style={{ fontFamily: 'var(--font-mono)' }}>Ganjam Coastal AOI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#fff' }}>
            {totalExposedPop.toLocaleString()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>individuals in inundation path</span>
        </div>

        {/* Breakdown Demographics 2x2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {/* Infants < 5 */}
          <div style={{
            background: 'rgba(10, 16, 30, 0.6)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <Baby size={12} color="var(--accent-purple)" />
              <span>INFANTS (&lt;5 YRS)</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
              {infants.toLocaleString()}
            </span>
          </div>

          {/* Elderly 65+ */}
          <div style={{
            background: 'rgba(10, 16, 30, 0.6)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <HeartHandshake size={12} color="var(--accent-rose)" />
              <span>ELDERLY (65+)</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
              {elderly.toLocaleString()}
            </span>
          </div>

          {/* Kutcha Dwellings */}
          <div style={{
            background: 'rgba(10, 16, 30, 0.6)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <Home size={12} color="var(--accent-amber)" />
              <span>KUTCHA / LIVESTOCK</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {kutchaDwellings.toLocaleString()}
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>({livestock.toLocaleString()} cattle)</span>
            </div>
          </div>

          {/* Economic Exposure */}
          <div style={{
            background: 'rgba(10, 16, 30, 0.6)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <Coins size={12} color="var(--accent-emerald)" />
              <span>ASSET EXPOSURE</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
              ₹{economicExposureCr} Cr
            </span>
          </div>
        </div>
      </div>

      {/* Vulnerability Sub-Index Progress Bars */}
      <div style={{
        padding: '12px 14px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
          VULNERABILITY VECTOR DECOMPOSITION
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Physical Inundation Hazard */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Physical Inundation Depth</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 700 }}>92%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '92%', height: '100%', background: 'var(--accent-rose)', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Demographic Fragility */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Demographic Fragility (Age & Housing)</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 700 }}>84%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '84%', height: '100%', background: 'var(--accent-amber)', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Critical Infrastructure Cutoff */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Road & Power Isolation Risk</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 700 }}>
                {gridBlackout ? '98%' : '89%'}
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: gridBlackout ? '98%' : '89%', height: '100%', background: 'var(--accent-purple)', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
