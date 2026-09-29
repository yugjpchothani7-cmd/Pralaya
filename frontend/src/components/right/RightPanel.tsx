import React from 'react';
import {
  Bot,
  AlertTriangle,
  Building2,
  CheckSquare,
  Shield,
  Fingerprint
} from 'lucide-react';
import { GeminiCopilot } from './GeminiCopilot';
import { SimulationPanel } from './SimulationPanel';
import { RiskSummary } from './RiskSummary';
import { InfraShelterStats } from './InfraShelterStats';
import { ActionRecommendations } from './ActionRecommendations';
import { InsuranceTriggerPanel } from './InsuranceTriggerPanel';
import { TrustPanel } from './TrustPanel';
import type { TimelineStep } from '../../data/demoData';

export type RightPanelTab = 'copilot' | 'risk' | 'infra' | 'actions' | 'simulation' | 'insurance' | 'trust';

interface RightPanelProps {
  activeTab: RightPanelTab;
  onTabChange: (tab: RightPanelTab) => void;
  currentTimelineFrame: TimelineStep;
  surgeShock: number;
  rainShock: number;
  highTide: boolean;
  gridBlackout: boolean;
  activeLang: 'EN' | 'OD' | 'TE' | 'HI';
}

export const RightPanel: React.FC<RightPanelProps> = ({
  activeTab,
  onTabChange,
  currentTimelineFrame,
  surgeShock,
  rainShock,
  highTide,
  gridBlackout,
  activeLang,
}) => {
  return (
    <aside style={{
      width: '380px',
      minWidth: '340px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: '10px'
    }}>
      {/* Tab Navigation Ribbon */}
      <div className="glass-panel" style={{
        padding: '6px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4px',
        background: '#ffffff',
        border: '1px solid #e2e8f0'
      }}>
        {[
          { id: 'copilot', label: 'AI Helper', icon: Bot },
          { id: 'risk', label: 'Danger Map', icon: AlertTriangle },
          { id: 'infra', label: 'Safe Shelters', icon: Building2 },
          { id: 'actions', label: 'Rescue Orders', icon: CheckSquare },
          { id: 'simulation', label: 'Simulate', icon: Bot },
          { id: 'insurance', label: 'Relief Aid', icon: Shield },
          { id: 'trust', label: 'Data Audit', icon: Fingerprint },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as RightPanelTab)}
              style={{
                background: isActive ? '#2563eb' : '#f8fafc',
                color: isActive ? '#ffffff' : '#475569',
                border: isActive ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '7px 4px',
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                boxShadow: isActive ? '0 2px 4px rgba(37,99,235,0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={13} color={isActive ? '#ffffff' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content View */}
      <div className="glass-panel" style={{ flex: 1, padding: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'copilot' && <GeminiCopilot />}
        {activeTab === 'risk' && (
          <RiskSummary
            currentTimelineFrame={currentTimelineFrame}
            surgeShock={surgeShock}
            rainShock={rainShock}
            highTide={highTide}
            gridBlackout={gridBlackout}
          />
        )}
        {activeTab === 'infra' && <InfraShelterStats gridBlackout={gridBlackout} />}
        {activeTab === 'actions' && <ActionRecommendations activeLang={activeLang} />}
        {activeTab === 'simulation' && <SimulationPanel />}
        {activeTab === 'insurance' && <InsuranceTriggerPanel />}
        {activeTab === 'trust' && <TrustPanel />}
      </div>
    </aside>
  );
};
