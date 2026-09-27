import React from 'react';
import { TimelineScrubber } from './TimelineScrubber';
import { WhatIfSandbox } from './WhatIfSandbox';
import { SystemStatusBar } from './SystemStatusBar';

interface BottomBarProps {
  currentFrameIndex: number;
  onSelectFrame: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  surgeShock: number;
  onChangeSurgeShock: (val: number) => void;
  rainShock: number;
  onChangeRainShock: (val: number) => void;
  highTide: boolean;
  onToggleHighTide: () => void;
  gridBlackout: boolean;
  onToggleGridBlackout: () => void;
  onResetWhatIf: () => void;
  // Timeline controls (optional)
  onResetTimeline?: () => void;
  onStepForward?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentFrameIndex,
  onSelectFrame,
  isPlaying,
  onTogglePlay,
  surgeShock,
  onChangeSurgeShock,
  rainShock,
  onChangeRainShock,
  highTide,
  onToggleHighTide,
  gridBlackout,
  onToggleGridBlackout,
  onResetWhatIf,
}) => {
  return (
    <footer style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid #e2e8f0',
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
      zIndex: 40
    }}>
      {/* Upper Interactive Controls Strip: Timeline + What-If Sandbox */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Timeline Scrubber */}
        <TimelineScrubber
          currentFrameIndex={currentFrameIndex}
          onSelectFrame={onSelectFrame}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
        />

        {/* What-If Simulation Sandbox */}
        <WhatIfSandbox
          surgeShock={surgeShock}
          onChangeSurgeShock={onChangeSurgeShock}
          rainShock={rainShock}
          onChangeRainShock={onChangeRainShock}
          highTide={highTide}
          onToggleHighTide={onToggleHighTide}
          gridBlackout={gridBlackout}
          onToggleGridBlackout={onToggleGridBlackout}
          onReset={onResetWhatIf}
        />
      </div>

      {/* Lower Status Bar */}
      <SystemStatusBar />
    </footer>
  );
};
