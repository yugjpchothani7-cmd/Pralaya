import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, Users, Droplets, Zap } from 'lucide-react';
import { api } from '../../api/client';
import type { ShelterListResponse, ShelterItem } from '../../types';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export const ShelterRankingPanel: React.FC = () => {
  const [data, setData] = useState<ShelterListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        setLoading(true);
        const result = await api.getShelters();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch shelters');
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--accent-emerald)" />
            Verified Safe Destinations (TOPSIS Ranking Engine)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Ranked deterministically using multi-criteria clearance margin, road viability, and operational readiness.
          </p>
        </div>

        {data && (
          <span style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--accent-emerald)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            {data.candidate_count} Regional Havens Analyzed
          </span>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} height="88px" borderRadius="10px" />
          ))}
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--accent-rose)',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} />
          <span>Error loading shelter data from backend: {error}</span>
        </div>
      )}

      {!loading && !error && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.ranked_shelters.map((shelter: ShelterItem, idx: number) => {
            const isViable = shelter.resilience.clearance_margin_m > 0 && shelter.corridor_status !== 'IMPASSABLE_SUBMERGED';
            return (
              <div
                key={shelter.shelter_id}
                style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  background: isViable ? 'rgba(255, 255, 255, 0.03)' : 'rgba(244, 63, 94, 0.06)',
                  border: `1px solid ${isViable ? 'var(--border-subtle)' : 'rgba(244, 63, 94, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Left: Rank & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: idx === 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    #{idx + 1}
                  </div>

                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                      {shelter.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Distance: {shelter.distance_km} km | Plinth Elevation: {shelter.resilience.plinth_elevation_m}m | TOPSIS Index: {(shelter.topsis_score * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Middle: Capacity */}
                <div style={{ textAlign: 'center', minWidth: '140px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Available Capacity
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: shelter.capacity.available_capacity > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {shelter.capacity.available_capacity} / {shelter.capacity.certified} spots
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    ({shelter.capacity.occupancy_pct}% filled)
                  </div>
                </div>

                {/* Facilities Checklist */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '11px' }}>
                  <span title="Backup Generator" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: shelter.resilience.has_backup_generator ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                    <Zap size={14} /> Power
                  </span>
                  <span title="Potable Water" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: shelter.resilience.has_potable_ro_plant ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    <Droplets size={14} /> RO Water
                  </span>
                  <span title="Medical Staff" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: shelter.resilience.medical_staff_present ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                    <Users size={14} /> Medical
                  </span>
                </div>

                {/* Right: Clearance Margin Badge */}
                <div style={{ textAlign: 'right', minWidth: '130px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: shelter.resilience.clearance_margin_m > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.2)',
                    color: shelter.resilience.clearance_margin_m > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    border: `1px solid ${shelter.resilience.clearance_margin_m > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.4)'}`,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {shelter.resilience.clearance_margin_m > 0 ? `+${shelter.resilience.clearance_margin_m}m CLEARANCE` : 'SUBMERGED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
