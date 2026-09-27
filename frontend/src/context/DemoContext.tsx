// src/context/DemoContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_STAGES, type DemoStage } from '../demo/demoStages';

interface DemoContextProps {
  demoActive: boolean;
  demoPaused: boolean;
  startDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  resetDemo: () => void;
  currentStage: DemoStage | null;
}

const DemoContext = createContext<DemoContextProps | undefined>(undefined);

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoActive, setDemoActive] = useState(false);
  const [demoPaused, setDemoPaused] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState<DemoStage | null>(null);

  // Advance stage when active and not paused
  useEffect(() => {
    if (!demoActive || demoPaused) return;
    const stage = DEMO_STAGES[stageIndex];
    if (!stage) return;
    setCurrentStage(stage);
    const timer = setTimeout(() => {
      setStageIndex((i) => Math.min(i + 1, DEMO_STAGES.length - 1));
    }, stage.timeOffsetMinutes * 60 * 1000);
    return () => clearTimeout(timer);
  }, [demoActive, demoPaused, stageIndex]);

  const startDemo = () => {
    setDemoActive(true);
    setDemoPaused(false);
    setStageIndex(0);
  };
  const pauseDemo = () => setDemoPaused(true);
  const resumeDemo = () => setDemoPaused(false);
  const resetDemo = () => {
    setDemoActive(false);
    setDemoPaused(false);
    setStageIndex(0);
    setCurrentStage(null);
  };

  return (
    <DemoContext.Provider
      value={{ demoActive, demoPaused, startDemo, pauseDemo, resumeDemo, resetDemo, currentStage }}
    >
      {children}
    </DemoContext.Provider>
  );
};
