import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PresentationOverlay } from './components/presentation/PresentationOverlay';
import { JudgePanel } from './components/judge/JudgePanel';
import { AlertFlashBar } from './components/alerts/AlertFlashBar';
import { TopNav } from './components/top/TopNav';
import { LeftPanel, type LayerState, type ViewMode } from './components/left/LeftPanel';
import { InteractiveMap } from './components/center/InteractiveMap';
import { RightPanel, type RightPanelTab } from './components/right/RightPanel';
import { BottomBar } from './components/bottom/BottomBar';
import { HealthMonitorModal } from './components/system/HealthMonitorModal';
import { TIMELINE_FRAMES } from './data/demoData';
import { api } from './api/client';
import type { DemoStage } from './demo/demoStages';
import './App.css';

export const App: React.FC = () => {
  // Presentation Demo State
  const [showPresentation, setShowPresentation] = useState<boolean>(false);
  const [presentationStageIndex, setPresentationStageIndex] = useState<number>(0);

  const PRESENTATION_STAGES = [
    { title: 'Problem statement', description: 'Coastal cyclones cause rapid flooding, infrastructure loss, and displacement.' },
    { title: 'Live disaster map', description: 'Show the interactive map with current hazard layers.' },
    { title: 'Select vulnerable zone', description: 'Highlight a high‑risk zone on the map.' },
    { title: 'Show failure cascade', description: 'Display propagation of failures through infrastructure.' },
    { title: 'Find modeled safe destination', description: 'Identify the currently modeled suitable safe haven.' },
    { title: 'Show evacuation route', description: 'Render the optimal evacuation route.' },
    { title: 'Open PRALAYA Copilot', description: 'Open the Copilot panel for AI assistance.' },
    { title: 'Ask "Why did the route change?"', description: 'Query the Copilot for reasoning.' },
    { title: 'Increase rainfall using simulator', description: 'Apply a deterministic rain shock.' },
    { title: 'Show cascading changes', description: 'Observe updated failure cascades.' },
    { title: 'Show "What Changed?"', description: 'Summarize the impact of the rain increase.' },
    { title: 'Show final action summary', description: 'Present a concise action plan.' },
  ];

  const applyDemoStage = (idx: number) => {
    // Deterministic updates per stage
    switch (idx) {
      case 0:
        // Problem – nothing special
        break;
      case 1:
        // Live map – ensure base layers are on
        setLayers((prev) => ({ ...prev, radarSAR: true, trackCone: true }));
        break;
      case 2:
        // Select vulnerable zone – set selected region (already default)
        setSelectedRegion('gopalpur-coastal-odisha');
        break;
      case 3:
        // Failure cascade – enable shelters and evacuation routes visibility
        setLayers((prev) => ({ ...prev, shelters: true, evacuationRoutes: true }));
        break;
      case 4:
        // Safe destination – highlight shelters (already on)
        break;
      case 5:
        // Evacuation route – ensure evacuationRoutes layer active
        setLayers((prev) => ({ ...prev, evacuationRoutes: true }));
        break;
      case 6:
        // Open Copilot – switch right panel tab
        setRightTab('copilot');
        break;
      case 7:
        // Ask why route change – dummy trigger (could set a flag)
        console.log('Copilot queried: Why did the route change?');
        break;
      case 8:
        // Increase rainfall – deterministic rain shock
        setRainShock(15);
        break;
      case 9:
        // Show cascading changes – enable failure cascade visualization
        setLayers((prev) => ({ ...prev, shelters: true, evacuationRoutes: true }));
        break;
      case 10:
        // Show What Changed – could open a modal; for now, set a flag
        console.log('Displaying What Changed summary');
        break;
      case 11:
        // Final action summary – open action center (if exists) or set a flag
        console.log('Final action summary ready');
        break;
      default:
        break;
    }
  };

  const nextDemoStage = () => {
    if (presentationStageIndex < PRESENTATION_STAGES.length - 1) {
      const nextIdx = presentationStageIndex + 1;
      setPresentationStageIndex(nextIdx);
      applyDemoStage(nextIdx);
    }
  };

  const prevDemoStage = () => {
    if (presentationStageIndex > 0) {
      const prevIdx = presentationStageIndex - 1;
      setPresentationStageIndex(prevIdx);
      applyDemoStage(prevIdx);
    }
  };

  const resetDemo = () => {
    setPresentationStageIndex(0);
    applyDemoStage(0);
    // Reset any deterministic changes to initial defaults
    setRainShock(0);
    setLayers((prev) => ({
      ...prev,
      shelters: false,
      evacuationRoutes: false,
    }));
    setRightTab('copilot');
  };

  const startPresentation = () => {
    setShowPresentation(true);
    setPresentationStageIndex(0);
    applyDemoStage(0);
  };

  // 1. Timeline State
  const [timelineIndex, setTimelineIndex] = useState<number>(3);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // 2. What-If Counterfactual Sandbox Shocks
  const [surgeShock, setSurgeShock] = useState<number>(0);
  const [rainShock, setRainShock] = useState<number>(0);
  const [highTide, setHighTide] = useState<boolean>(false);
  const [gridBlackout, setGridBlackout] = useState<boolean>(false);

  // 3. Geospatial Layer Switches
  const [layers, setLayers] = useState<LayerState>({
    trackCone: true,
    radarSAR: true,
    surgeInundation: true,
    roadNetwork: true,
    infrastructure: true,
    shelters: true,
    evacuationRoutes: true,
    contours: false,
    // Phase 4 Earth Engine layers
    elevationDEM: true,
    rainfallGrid: false,
    surfaceWater: false,
    landCover: false,
    sarChange: true,
    // Phase 5 Deterministic Hazard Surface
    deterministicHazardSurface: true,
    // Phase 6 Exposure Engine
    exposureZones: true,
    populationDensity: true,
    criticalFacilities: true,
  });

  // Judge Mode overlay state
  const [showJudge, setShowJudge] = useState<boolean>(false);

  // 4. Geospatial Region of Interest & GEE Status
  const [selectedRegion, setSelectedRegion] = useState<string>('gopalpur-coastal-odisha');
  const [geoStatus, setGeoStatus] = useState<any>(null);

  // 5. View Mode (Tactical 2D, Hydrodynamic Mesh, Satellite SAR)
  const [viewMode, setViewMode] = useState<ViewMode>('tactical');

  // 6. Right Panel Tab Selector
  const [rightTab, setRightTab] = useState<RightPanelTab>('copilot');

  // 7. Multilingual & Presentation Utilities
  const [activeLang, setActiveLang] = useState<'EN' | 'OD' | 'TE' | 'HI'>('EN');
  const [audioAlert, setAudioAlert] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // 8. Backend & Demo mode flags
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [demoPaused, setDemoPaused] = useState<boolean>(false);
  const [currentDemoStage, setCurrentDemoStage] = useState<DemoStage | null>(null);

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const events = await api.getEvents();
        if (events && events.length > 0) {
          setBackendConnected(true);
        }
        // Fetch GEE and Geospatial status
        const gStatus = await api.getGeospatialStatus();
        setGeoStatus(gStatus);

        // Preload regional telemetry from backend
        await Promise.allSettled([
          api.getRegion('REG_GANJAM_COAST'),
          api.getHazards('REG_GANJAM_COAST'),
          api.getExposure('REG_GANJAM_COAST'),
          api.getInfrastructure('REG_GANJAM_COAST'),
          api.getRegionalShelters('REG_GANJAM_COAST'),
          api.getRoutes('REG_GANJAM_COAST'),
          api.getRisk('REG_GANJAM_COAST'),
          api.getActions('REG_GANJAM_COAST'),
        ]);
      } catch (err) {
        console.warn('Backend sync failed, using realistic offline cached state:', err);
      }
    };
    fetchBackendData();
  }, []);

  const toggleLayer = (layer: keyof LayerState) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const resetWhatIf = () => {
    setSurgeShock(0);
    setRainShock(0);
    setHighTide(false);
    setGridBlackout(false);
  };

  const currentTimelineFrame = TIMELINE_FRAMES[timelineIndex];
  const whatIfActive = surgeShock > 0 || rainShock > 0 || highTide || gridBlackout;

  return (
    <ErrorBoundary>
      <div className={`pralaya-eoc-root ${presentationMode ? 'presentation-mode' : ''}`}>
        {/* 1. Top Navigation & Live Event Status */}
        <TopNav
          onOpenDiagnostics={() => setIsHealthModalOpen(true)}
          onOpenJudge={() => setShowJudge(true)}
          onOpenPresentation={startPresentation}
          audioAlert={audioAlert}
          onToggleAudio={() => setAudioAlert(!audioAlert)}
          presentationMode={presentationMode}
          onTogglePresentation={() => setPresentationMode(!presentationMode)}
          activeLang={activeLang}
          onChangeLang={setActiveLang}
          whatIfActive={whatIfActive}
          backendConnected={backendConnected}
        />

        {/* Presentation Demo Overlay */}
        {showPresentation && (
          <PresentationOverlay
            stage={PRESENTATION_STAGES[presentationStageIndex]}
            stageIndex={presentationStageIndex}
            onNext={nextDemoStage}
            onBack={prevDemoStage}
            onReset={resetDemo}
            onClose={() => setShowPresentation(false)}
          />
        )}

        {/* 2. Critical Emergency Alert Flash Bar */}
        <AlertFlashBar activeLang={activeLang} />

        {/* 3. Main Command Center Canvas: LEFT | CENTER | RIGHT */}
        <main className="pralaya-eoc-workspace">
          {/* LEFT: Event & Layer Controls */}
          <div className="eoc-left-col">
            <LeftPanel
              layers={layers}
              onToggleLayer={toggleLayer}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              currentTimelineFrame={currentTimelineFrame}
              surgeShock={surgeShock}
              selectedRegion={selectedRegion}
              onChangeRegion={setSelectedRegion}
              geoStatus={geoStatus}
            />
          </div>

          {/* CENTER: Large Interactive Geospatial Map */}
          <div className="eoc-center-col">
            <InteractiveMap
              layers={layers}
              viewMode={viewMode}
              surgeShock={surgeShock}
              rainShock={rainShock}
              highTide={highTide}
              selectedRegion={selectedRegion}
            />
          </div>

          {/* RIGHT: Gemini Copilot, Risk, Infra/Shelters, Actions */}
          <div className="eoc-right-col">
            <RightPanel
              activeTab={rightTab}
              onTabChange={setRightTab}
              currentTimelineFrame={currentTimelineFrame}
              surgeShock={surgeShock}
              rainShock={rainShock}
              highTide={highTide}
              gridBlackout={gridBlackout}
              activeLang={activeLang}
            />
          </div>
        </main>

        {/* 4. Bottom Controls: Timeline Scrubber + What-If Sandbox + System Status */}
        <BottomBar
          currentFrameIndex={timelineIndex}
          onSelectFrame={setTimelineIndex}
          isPlaying={isPlayingTimeline}
          onTogglePlay={() => setIsPlayingTimeline(!isPlayingTimeline)}
          surgeShock={surgeShock}
          onChangeSurgeShock={setSurgeShock}
          rainShock={rainShock}
          onChangeRainShock={setRainShock}
          highTide={highTide}
          onToggleHighTide={() => setHighTide(!highTide)}
          gridBlackout={gridBlackout}
          onToggleGridBlackout={() => setGridBlackout(!gridBlackout)}
          onResetWhatIf={resetWhatIf}
        />

        {/* Provenance & Architecture Verification Modal */}
        <HealthMonitorModal
          isOpen={isHealthModalOpen}
          onClose={() => setIsHealthModalOpen(false)}
        />

        {/* Judge Mode Full-Screen Overlay */}
        {showJudge && <JudgePanel onClose={() => setShowJudge(false)} />}
      </div>
    </ErrorBoundary>
  );
};

export default App;

