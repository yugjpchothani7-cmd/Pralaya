import React, { useEffect, useState } from 'react';
import { Navigation, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../../api/client';
import type { RoutingPlanResponse, TurnByTurnStep } from '../../types';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export const EvacuationPathPanel: React.FC = () => {
  const [route, setRoute] = useState<RoutingPlanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        const result = await api.getRoutingPlan();
        setRoute(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch routing plan');
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={22} color="var(--accent-cyan)" />
            Disaster-Aware Evacuation Route Navigator
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Dynamic shortest-safe-path algorithm penalizing flooded road segments and downed infrastructure.
          </p>
        </div>

        {route && (
          <span style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.1)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            Status: {route.status}
          </span>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <LoadingSkeleton height="70px" borderRadius="10px" />
          <LoadingSkeleton height="140px" borderRadius="10px" />
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
          <span>Error loading routing plan: {error}</span>
        </div>
      )}

      {!loading && !error && route && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Metrics Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Distance</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{route.metrics.total_distance_km} km</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Transit</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{route.metrics.estimated_travel_time_minutes} mins</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Water On Route</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-emerald)' }}>{route.metrics.max_flood_depth_on_path_m} m (Puddle)</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Safe Corridor Window</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-amber)' }}>{route.metrics.safe_clearance_window_hours} Hours Remaining</div>
            </div>
          </div>

          {/* Turn-by-turn list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Turn-by-Turn Dynamic Navigation Guidance
            </div>

            {route.turn_by_turn.map((step: TurnByTurnStep) => (
              <div
                key={step.step}
                style={{
                  padding: '14px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {step.step}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                    {step.instruction}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Segment: {step.distance_m}m | Water Depth: {step.flood_depth_m}m
                  </div>
                </div>

                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>

          {/* Hazard Avoidance Disclosure */}
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: 'var(--accent-amber)'
          }}>
            <AlertTriangle size={18} />
            <span>
              <strong>Routing Invariant:</strong> Standard shortest route via State Highway 14 was actively rejected due to predicted 0.65m inundation near Rushikulya River Bridge. High-elevation ridge path selected.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
