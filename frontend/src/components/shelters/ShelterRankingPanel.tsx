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
    <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="#059669" />
            Verified Safe Destinations (Cyclone Shelters)
          </h2>
          <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
            Official government relief centers ranked by flood clearance margin, dry road access, and emergency facilities.
          </p>
        </div>

        {data && (
          <span style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: '#ecfdf5',
            color: '#059669',
            border: '1px solid #a7f3d0',
            fontWeight: 700
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
          color: '#e11d48',
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
                  background: isViable ? '#f8fafc' : '#fff1f2',
                  border: `1px solid ${isViable ? '#e2e8f0' : '#fecdd3'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Left: Rank & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: idx === 0 ? 'linear-gradient(135deg, #10b981, #059669)' : '#e2e8f0',
                    color: idx === 0 ? '#ffffff' : '#334155',
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
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                      {shelter.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      Distance: <b>{shelter.distance_km} km</b> | Plinth Elevation: <b>{shelter.resilience.plinth_elevation_m}m</b> | Safety Index: <b>{(shelter.topsis_score * 100).toFixed(1)}%</b>
                    </div>
                  </div>
                </div>

                {/* Middle: Capacity */}
                <div style={{ textAlign: 'center', minWidth: '140px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Available Capacity
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: shelter.capacity.available_capacity > 0 ? '#059669' : '#e11d48' }}>
                    {shelter.capacity.available_capacity} / {shelter.capacity.certified} spots
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    ({shelter.capacity.occupancy_pct}% filled)
                  </div>
                </div>

                {/* Facilities Checklist */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '11px' }}>
                  <span title="Backup Generator" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: shelter.resilience.has_backup_generator ? '#d97706' : '#94a3b8', fontWeight: shelter.resilience.has_backup_generator ? 600 : 400 }}>
                    <Zap size={14} /> Power
                  </span>
                  <span title="Potable Water" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: shelter.resilience.has_potable_ro_plant ? '#0284c7' : '#94a3b8', fontWeight: shelter.resilience.has_potable_ro_plant ? 600 : 400 }}>
                    <Droplets size={14} /> RO Water
                  </span>
                  <span title="Medical Staff" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: shelter.resilience.medical_staff_present ? '#059669' : '#94a3b8', fontWeight: shelter.resilience.medical_staff_present ? 600 : 400 }}>
                    <Users size={14} /> Medical
                  </span>
                </div>

                {/* Right: Clearance Margin Badge */}
                <div style={{ textAlign: 'right', minWidth: '130px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: shelter.resilience.clearance_margin_m > 0 ? '#ecfdf5' : '#fee2e2',
                    color: shelter.resilience.clearance_margin_m > 0 ? '#059669' : '#dc2626',
                    border: `1px solid ${shelter.resilience.clearance_margin_m > 0 ? '#a7f3d0' : '#fca5a5'}`,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {shelter.resilience.clearance_margin_m > 0 ? `+${shelter.resilience.clearance_margin_m}m DRY CLEARANCE` : 'SUBMERGED'}
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
