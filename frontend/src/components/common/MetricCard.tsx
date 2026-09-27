import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeColor = 'cyan',
  onClick
}) => {
  const badgeColors = {
    emerald: { bg: 'rgba(16, 185, 129, 0.15)', text: 'var(--accent-emerald)', border: 'rgba(16, 185, 129, 0.3)' },
    amber: { bg: 'rgba(245, 158, 11, 0.15)', text: 'var(--accent-amber)', border: 'rgba(245, 158, 11, 0.3)' },
    rose: { bg: 'rgba(244, 63, 94, 0.15)', text: 'var(--accent-rose)', border: 'rgba(244, 63, 94, 0.3)' },
    cyan: { bg: 'rgba(56, 189, 248, 0.15)', text: 'var(--accent-cyan)', border: 'rgba(56, 189, 248, 0.3)' },
    purple: { bg: 'rgba(168, 85, 247, 0.15)', text: 'var(--accent-purple)', border: 'rgba(168, 85, 247, 0.3)' },
  };

  const selectedBadge = badgeColors[badgeColor];

  return (
    <div
      className="glass-panel"
      onClick={onClick}
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: selectedBadge.text
        }}>
          <Icon size={18} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '26px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {badge && (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            background: selectedBadge.bg,
            color: selectedBadge.text,
            border: `1px solid ${selectedBadge.border}`,
            fontFamily: 'var(--font-mono)'
          }}>
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {subtext}
        </span>
      )}
    </div>
  );
};
