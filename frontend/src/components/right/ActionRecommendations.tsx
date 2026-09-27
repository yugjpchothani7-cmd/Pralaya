import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { DEMO_RECOMMENDATIONS, type ActionRecommendation } from '../../data/demoData';

interface ActionRecommendationsProps {
  activeLang: 'EN' | 'OD' | 'TE' | 'HI';
}

export const ActionRecommendations: React.FC<ActionRecommendationsProps> = ({ activeLang }) => {
  const [recommendations, setRecommendations] = useState<ActionRecommendation[]>(DEMO_RECOMMENDATIONS);

  const toggleDispatchStatus = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          const nextStatus =
            rec.status === 'PENDING' ? 'DISPATCHED' : rec.status === 'DISPATCHED' ? 'COMPLETED' : 'PENDING';
          return { ...rec, status: nextStatus };
        }
        return rec;
      })
    );
  };

  const getPriorityBadge = (priority: 'URGENT' | 'HIGH' | 'MEDIUM') => {
    if (priority === 'URGENT') {
      return {
        bg: 'rgba(244, 63, 94, 0.2)',
        color: 'var(--accent-rose)',
        border: 'rgba(244, 63, 94, 0.4)'
      };
    }
    if (priority === 'HIGH') {
      return {
        bg: 'rgba(245, 158, 11, 0.2)',
        color: 'var(--accent-amber)',
        border: 'rgba(245, 158, 11, 0.4)'
      };
    }
    return {
      bg: 'rgba(56, 189, 248, 0.2)',
      color: 'var(--accent-cyan)',
      border: 'rgba(56, 189, 248, 0.4)'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={15} color="var(--accent-rose)" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
            PRIORITIZED ACTION DIRECTIVES
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '9.5px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: 'var(--accent-cyan)',
            fontWeight: 700
          }}>
            LANG: {activeLang}
          </span>
          <span style={{
            fontSize: '9.5px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            fontWeight: 700
          }}>
            4 ORDERS ACTIVE
          </span>
        </div>
      </div>

      {/* Action Order Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recommendations.map((rec) => {
          const badge = getPriorityBadge(rec.priority);
          return (
            <div
              key={rec.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: rec.status === 'PENDING' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`
                  }}>
                    {rec.priority}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {rec.targetMandal}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                  <Clock size={11} />
                  <span>ETA {rec.deadlineHours}h</span>
                </div>
              </div>

              {/* Title & Action Description */}
              <div>
                <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '3px', lineHeight: 1.3 }}>
                  {rec.title}
                </h5>
                <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {rec.actionText}
                </p>
              </div>

              {/* Impact Metric & Dispatch Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <span style={{ fontSize: '9.5px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  Impact: {rec.impactMetric}
                </span>

                <button
                  onClick={() => toggleDispatchStatus(rec.id)}
                  style={{
                    background: rec.status === 'COMPLETED'
                      ? 'rgba(16, 185, 129, 0.2)'
                      : rec.status === 'DISPATCHED'
                      ? 'rgba(56, 189, 248, 0.2)'
                      : 'linear-gradient(135deg, var(--accent-rose), #be123c)',
                    border: rec.status === 'COMPLETED'
                      ? '1px solid var(--accent-emerald)'
                      : rec.status === 'DISPATCHED'
                      ? '1px solid var(--accent-cyan)'
                      : 'none',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {rec.status === 'COMPLETED' ? (
                    <>
                      <CheckCircle2 size={11} color="var(--accent-emerald)" />
                      <span style={{ color: 'var(--accent-emerald)' }}>VERIFIED</span>
                    </>
                  ) : rec.status === 'DISPATCHED' ? (
                    <>
                      <FileCheck size={11} color="var(--accent-cyan)" />
                      <span style={{ color: 'var(--accent-cyan)' }}>IN TRANSIT</span>
                    </>
                  ) : (
                    <>
                      <Send size={11} />
                      <span>DISPATCH ORDER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
