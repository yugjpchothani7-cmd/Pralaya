import React from 'react';
import { 
  Radar, 
  ShieldCheck, 
  Navigation, 
  Activity, 
  Waves, 
  Network, 
  Bot, 
  Sliders, 
  FileCheck2 
} from 'lucide-react';
import type { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; phase: string }[] = [
    { id: 'situation', label: 'Situation Center', icon: Radar, phase: 'Phase 1' },
    { id: 'shelters', label: 'Safe Shelters (TOPSIS)', icon: ShieldCheck, phase: 'Phase 1' },
    { id: 'routing', label: 'Disaster Routing', icon: Navigation, phase: 'Phase 1' },
    { id: 'health', label: 'Subsystem Health', icon: Activity, phase: 'Phase 1' },
  ];

  const futureModules = [
    { label: 'Surge Inundation (GEE)', icon: Waves, phase: 'Phase 2' },
    { label: 'Failure Cascade (DAG)', icon: Network, phase: 'Phase 2' },
    { label: 'Gemini Copilot Agent', icon: Bot, phase: 'Phase 3' },
    { label: 'What-If Sandbox', icon: Sliders, phase: 'Phase 5' },
    { label: 'Parametric Insurance', icon: FileCheck2, phase: 'Phase 5' },
  ];

  return (
    <aside style={{
      width: '260px',
      borderRight: '1px solid var(--border-subtle)',
      background: 'rgba(7, 11, 20, 0.65)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      minHeight: 'calc(100vh - 68px)'
    }}>
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 10px 12px'
        }}>
          Active Operational Modules
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                <span style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {item.phase}
                </span>
              </button>
            );
          })}
        </nav>

        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '24px 10px 10px'
        }}>
          Planned Expansion Modules
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {futureModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  opacity: 0.7
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)' }}>{item.phase}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Box */}
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          Zero-Hallucination Core
        </div>
        Deterministic PostGIS and Python mathematical engines active.
      </div>
    </aside>
  );
};
