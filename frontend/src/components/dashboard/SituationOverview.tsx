import React from 'react';
import { 
  Wind, 
  Gauge, 
  Users, 
  Waves, 
  Compass, 
  Building2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import type { SituationSummaryResponse } from '../../types';
import { MetricCard } from '../common/MetricCard';

interface SituationOverviewProps {
  situation: SituationSummaryResponse | null;
  loading: boolean;
}

export const SituationOverview: React.FC<SituationOverviewProps> = ({ situation, loading }) => {
  if (loading || !situation) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  const { current_status, impact_summary, provenance } = situation;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Threat Ribbon */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: '4px solid var(--accent-rose)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={22} color="var(--accent-rose)" />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              {situation.name} — {situation.category}
            </div>
            <div style={{ fontSize: '12px', color: '#475569' }}>
              Eye Location: {current_status.center_lat.toFixed(2)}°N, {current_status.center_lon.toFixed(2)}°E | Heading {current_status.bearing_deg}° NW at {current_status.movement_speed_kmh} km/h
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Landfall Projected Window
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            {new Date(current_status.landfall_eta).toLocaleTimeString()} IST (T-4 Hours)
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <MetricCard
          label="Max Sustained Winds"
          value={`${current_status.max_sustained_wind_kmh} km/h`}
          subtext={`Gusts up to ${current_status.gusts_kmh} km/h`}
          icon={Wind}
          badge="Cat 4 Equiv"
          badgeColor="rose"
        />

        <MetricCard
          label="Central Pressure"
          value={`${current_status.central_pressure_hpa} hPa`}
          subtext="Deficit: -61.25 hPa from ambient"
          icon={Gauge}
          badge="Deep Core"
          badgeColor="amber"
        />

        <MetricCard
          label="Population at Risk"
          value={impact_summary.population_in_danger_zone.toLocaleString()}
          subtext={`${impact_summary.evacuation_completed_count.toLocaleString()} safely relocated (${impact_summary.evacuation_progress_pct}%)`}
          icon={Users}
          badge="Urgent Evac"
          badgeColor="rose"
        />

        <MetricCard
          label="Predicted Peak Surge"
          value="4.82 m"
          subtext="Inland breach depth: 2.1m - 3.4m"
          icon={Waves}
          badge="Extreme"
          badgeColor="rose"
        />

        <MetricCard
          label="Cyclone Shelters"
          value={`${impact_summary.active_shelters_count} Active`}
          subtext={`Occupancy: ${impact_summary.shelter_current_occupancy.toLocaleString()} / ${impact_summary.shelter_total_capacity.toLocaleString()}`}
          icon={Building2}
          badge="30,600 Open"
          badgeColor="emerald"
        />

        <MetricCard
          label="Critical Assets at Risk"
          value={`${impact_summary.critical_assets_at_risk_count} Assets`}
          subtext="Substations, Hospitals, Bridges"
          icon={Compass}
          badge="Cascade Risk"
          badgeColor="purple"
        />
      </div>

      {/* Provenance Box */}
      <div className="glass-panel" style={{ padding: '16px 20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
            <span>Telemetry Provenance: <strong style={{ color: '#0f172a' }}>{provenance.source_id}</strong></span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Authority: {provenance.source_authority} | Confidence: {(((provenance.confidence_score ?? 1)) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};
