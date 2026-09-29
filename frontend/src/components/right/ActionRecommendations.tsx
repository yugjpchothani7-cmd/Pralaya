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
        bg: '#fee2e2',
        color: '#dc2626',
        border: '#fca5a5'
      };
    }
    if (priority === 'HIGH') {
      return {
        bg: '#fef3c7',
        color: '#b45309',
        border: '#fde68a'
      };
    }
    return {
      bg: '#e0f2fe',
      color: '#0284c7',
      border: '#bae6fd'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto', paddingRight: '2px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={17} color="#e11d48" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
            RESCUE & RELIEF ORDERS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#eff6ff',
            color: '#2563eb',
            fontWeight: 700,
            border: '1px solid #bfdbfe'
          }}>
            LANG: {activeLang}
          </span>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: '#fee2e2',
            color: '#dc2626',
            fontWeight: 700,
            border: '1px solid #fca5a5'
          }}>
            4 ACTIVE ORDERS
          </span>
        </div>
      </div>

      {/* Action Order Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {recommendations.map((rec) => {
          const badge = getPriorityBadge(rec.priority);
          return (
            <div
              key={rec.id}
              style={{
                background: '#ffffff',
                border: rec.status === 'PENDING' ? '1.5px solid #fecdd3' : '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`
                  }}>
                    {rec.priority}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {rec.targetMandal}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  <Clock size={12} />
                  <span>ETA {rec.deadlineHours}h</span>
                </div>
              </div>

              {/* Title & Action Description */}
              <div>
                <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', lineHeight: 1.3 }}>
                  {rec.title}
                </h5>
                <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.45 }}>
                  {rec.actionText}
                </p>
              </div>

              {/* Impact Metric & Dispatch Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                  Impact: {rec.impactMetric}
                </span>

                <button
                  onClick={() => toggleDispatchStatus(rec.id)}
                  style={{
                    background: rec.status === 'COMPLETED'
                      ? '#ecfdf5'
                      : rec.status === 'DISPATCHED'
                      ? '#eff6ff'
                      : 'linear-gradient(135deg, #e11d48, #be123c)',
                    border: rec.status === 'COMPLETED'
                      ? '1px solid #a7f3d0'
                      : rec.status === 'DISPATCHED'
                      ? '1px solid #bfdbfe'
                      : 'none',
                    color: rec.status === 'COMPLETED' ? '#059669' : rec.status === 'DISPATCHED' ? '#2563eb' : '#ffffff',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: rec.status === 'PENDING' ? '0 2px 4px rgba(225,29,72,0.2)' : 'none'
                  }}
                >
                  {rec.status === 'COMPLETED' ? (
                    <>
                      <CheckCircle2 size={12} color="#059669" />
                      <span>COMPLETED</span>
                    </>
                  ) : rec.status === 'DISPATCHED' ? (
                    <>
                      <FileCheck size={12} color="#2563eb" />
                      <span>IN TRANSIT</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>DISPATCH NOW</span>
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
