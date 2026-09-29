import React from 'react';
import { 
  ShieldCheck, 
  Fuel, 
  ArrowRight, 
  Zap,
  Building2,
  CheckCircle,
  AlertOctagon
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflowY: 'auto', paddingRight: '2px' }}>
      
      {/* 1. Shelter Network Occupancy & Capacity */}
      <div style={{
        padding: '14px 16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="#059669" />
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                RESCUE SHELTER AVAILABILITY
              </h4>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Live Bay of Bengal Cyclone Havens</span>
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            color: '#059669',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            background: '#ecfdf5',
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #a7f3d0'
          }}>
            5 SITES OPEN
          </span>
        </div>

        {/* Global Capacity Meter */}
        <div style={{ marginBottom: '14px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: '#475569', fontWeight: 600 }}>Total Shelter Space Taken:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0f172a' }}>
              {totalShelterOccupancy.toLocaleString()} / {totalShelterCapacity.toLocaleString()} ({occupancyPercent}% filled)
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${occupancyPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981 0%, #059669 70%, #d97706 100%)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: 500 }}>
            <span>Available Beds: <strong style={{ color: '#059669' }}>{remainingCapacity.toLocaleString()} open spots</strong></span>
            <span>Food & Water: Stocked</span>
          </div>
        </div>

        {/* Shelter List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DEMO_SHELTERS.map((s) => {
            const isAtRisk = s.roadStatus === 'IMPASSABLE' || s.clearanceMarginM <= 0;
            const occupancyRatio = (s.currentOccupancy / s.certifiedCapacity) * 100;
            const isRecommended = s.topsisScore > 0.85 && !isAtRisk;

            return (
              <div
                key={s.id}
                style={{
                  background: isRecommended ? '#f0fdf4' : isAtRisk ? '#fff1f2' : '#ffffff',
                  border: isRecommended ? '1.5px solid #86efac' : isAtRisk ? '1.5px solid #fecdd3' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{s.name}</span>
                    {isRecommended && (
                      <span style={{
                        fontSize: '9px',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: '#10b981',
                        color: '#ffffff',
                        fontWeight: 800
                      }}>
                        TOP PICK
                      </span>
                    )}
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: isAtRisk ? '#ffe4e6' : '#dcfce7',
                      color: isAtRisk ? '#e11d48' : '#15803d',
                      fontWeight: 700
                    }}>
                      Safety: {(s.topsisScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span>Elevation: <b>+{s.plinthElevationM}m</b></span>
                    <span>Flood Clearance: <b style={{ color: s.clearanceMarginM > 0 ? '#059669' : '#e11d48' }}>+{s.clearanceMarginM}m dry</b></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '95px' }}>
                  <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0f172a' }}>
                    {s.currentOccupancy} / {s.certifiedCapacity}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    marginTop: '2px',
                    color: s.roadStatus === 'CLEAR' ? '#15803d' : s.roadStatus === 'CAUTION' ? '#b45309' : '#e11d48',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '3px'
                  }}>
                    {s.roadStatus === 'CLEAR' ? <CheckCircle size={10} /> : <AlertOctagon size={10} />}
                    <span>{s.roadStatus === 'CLEAR' ? 'Road Open' : s.roadStatus === 'CAUTION' ? 'Water on Road' : 'Road Flooded'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Critical Lifeline & Power Infrastructure */}
      <div style={{
        padding: '14px 16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={17} color="#d97706" />
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                POWER & HOSPITAL LIFELINES
              </h4>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Flood Damage Cascade Chain</span>
            </div>
          </div>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            padding: '3px 7px',
            borderRadius: '5px',
            background: gridBlackout ? '#fee2e2' : '#fef3c7',
            color: gridBlackout ? '#dc2626' : '#b45309',
            fontWeight: 700,
            border: `1px solid ${gridBlackout ? '#fca5a5' : '#fde68a'}`
          }}>
            {gridBlackout ? 'TOTAL BLACKOUT' : 'GRID THREATENED'}
          </span>
        </div>

        {/* Visual Cascade Pipeline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: '#f8fafc',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {/* Node 1: Substation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#e11d48' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Chhatrapur 132kV Substation</span>
            </div>
            <span style={{ fontSize: '11px', color: '#e11d48', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
              FLOODED (0.65m deep)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '17px', color: '#64748b' }}>
            <ArrowRight size={12} color="#e11d48" />
            <span style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 600 }}>11kV feeder lines tripped ──&gt; Coastal power cut</span>
          </div>

          {/* Node 2: District Hospital */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#d97706' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Ganjam District Hospital</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Fuel size={12} color="#d97706" />
              <span style={{ fontSize: '11px', color: '#b45309', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                7.2h DIESEL LEFT
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '17px', color: '#64748b' }}>
            <ArrowRight size={12} />
            <span style={{ fontSize: '11px', color: '#475569' }}>Running on emergency generators for ICU & surgical wards</span>
          </div>

          {/* Node 3: Water Booster */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>North Drinking Water Booster</span>
            </div>
            <span style={{ fontSize: '11px', color: '#b45309', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
              OFFLINE (14h reserve remaining)
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
