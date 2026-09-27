import React from 'react';
import { 
  ShieldCheck, 
  Fuel, 
  ArrowRight, 
  Zap
} from 'lucide-react';
import { DEMO_SHELTERS } from '../../data/demoData';

interface InfraShelterStatsProps {
  gridBlackout: boolean;
}

export const InfraShelterStats: React.FC<InfraShelterStatsProps> = ({ gridBlackout }) => {
  const totalShelterCapacity = DEMO_SHELTERS.reduce((acc, s) => acc + s.certifiedCapacity, 0);
  const totalShelterOccupancy = DEMO_SHELTERS.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const remainingCapacity = totalShelterCapacity - totalShelterOccupancy;
  const occupancyPercent = ((totalShelterOccupancy / totalShelterCapacity) * 100).toFixed(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto' }}>
      {/* Infrastructure Failure Cascade Tracker */}
      <div style={{
        padding: '12px 14px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color="var(--accent-amber)" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
              FAILURE CASCADE PROPAGATION (DAG)
            </span>
          </div>
          <span style={{
            fontSize: '9.5px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 5px',
            borderRadius: '3px',
            background: 'rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            fontWeight: 700
          }}>
            {gridBlackout ? 'TOTAL BLACKOUT' : 'CASCADE ACTIVE'}
          </span>
        </div>

        {/* Visual Cascade Pipeline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(10, 16, 30, 0.6)',
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Node 1: Substation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>Chhatrapur 132kV Substation</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              SUBMERGED (0.65m)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '12px', color: 'var(--text-muted)' }}>
            <ArrowRight size={12} />
            <span style={{ fontSize: '9.5px', color: 'var(--accent-rose)' }}>Tripped 11kV lines ──&gt; Grid severed</span>
          </div>

          {/* Node 2: District Hospital */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>Ganjam District Hospital</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Fuel size={12} color="var(--accent-amber)" />
              <span style={{ fontSize: '10px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                7.2h DIESEL LEFT
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '12px', color: 'var(--text-muted)' }}>
            <ArrowRight size={12} />
            <span style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>Water pumps lost upstream power</span>
          </div>

          {/* Node 3: Water Booster */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>North Drinking Water Booster</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              OFFLINE (14h reserve)
            </span>
          </div>
        </div>
      </div>

      {/* Shelter Network Statistics */}
      <div style={{
        padding: '12px 14px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} color="var(--accent-emerald)" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
              SHELTER NETWORK OCCUPANCY
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            5 SITES CERTIFIED
          </span>
        </div>

        {/* Global Capacity Meter */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total System Utilization:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff' }}>
              {totalShelterOccupancy.toLocaleString()} / {totalShelterCapacity.toLocaleString()} ({occupancyPercent}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${occupancyPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #f59e0b)',
              borderRadius: '4px'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
            <span>Available Capacity: {remainingCapacity.toLocaleString()}</span>
            <span>Surge Headroom: Active</span>
          </div>
        </div>

        {/* Shelter List with TOPSIS Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {DEMO_SHELTERS.map((s) => {
            const isAtRisk = s.roadStatus === 'IMPASSABLE' || s.clearanceMarginM <= 0;
            return (
              <div
                key={s.id}
                style={{
                  background: isAtRisk ? 'rgba(244, 63, 94, 0.1)' : 'rgba(10, 16, 30, 0.6)',
                  border: isAtRisk ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{s.name}</span>
                    <span style={{
                      fontSize: '8.5px',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      background: isAtRisk ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.2)',
                      color: isAtRisk ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                      fontWeight: 800
                    }}>
                      TOPSIS {(s.topsisScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                    Plinth: +{s.plinthElevationM}m MSL | Margin: +{s.clearanceMarginM}m
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>
                    {s.currentOccupancy}/{s.certifiedCapacity}
                  </div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: s.roadStatus === 'CLEAR' ? 'var(--accent-emerald)' : s.roadStatus === 'CAUTION' ? 'var(--accent-amber)' : 'var(--accent-rose)'
                  }}>
                    {s.roadStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
