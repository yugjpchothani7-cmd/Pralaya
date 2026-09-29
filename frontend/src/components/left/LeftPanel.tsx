import React from 'react';
import { 
  Layers, 
  Wind, 
  Compass, 
  Gauge, 
  Eye, 
  EyeOff, 
  Shield, 
  Building2, 
  Route, 
  Waves, 
  Radar, 
  Activity,
  Maximize2,
  Mountain,
  CloudRain,
  Droplets,
  Trees,
  GitCompare,
  Globe2,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { INITIAL_CYCLONE_STATE, type TimelineStep } from '../../data/demoData';
import type { GeospatialStatusResponse } from '../../types';

export interface LayerState {
  trackCone: boolean;
  radarSAR: boolean;
  surgeInundation: boolean;
  roadNetwork: boolean;
  infrastructure: boolean;
  shelters: boolean;
  evacuationRoutes: boolean;
  contours: boolean;
  // Phase 4 Earth Engine & Geospatial Layers
  elevationDEM: boolean;
  rainfallGrid: boolean;
  surfaceWater: boolean;
  landCover: boolean;
  sarChange: boolean;
  // Phase 5 Deterministic Hazard Engine
  deterministicHazardSurface: boolean;
  // Phase 6 Exposure Engine
  exposureZones: boolean;
  populationDensity: boolean;
  criticalFacilities: boolean;
}

export type ViewMode = 'tactical' | 'hydrodynamic' | 'satellite';

interface LeftPanelProps {
  layers: LayerState;
  onToggleLayer: (layer: keyof LayerState) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  currentTimelineFrame: TimelineStep;
  surgeShock: number;
  selectedRegion?: string;
  onChangeRegion?: (regionId: string) => void;
  geoStatus?: GeospatialStatusResponse | null;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  layers,
  onToggleLayer,
  viewMode,
  onChangeViewMode,
  currentTimelineFrame,
  surgeShock,
  selectedRegion = 'gopalpur-coastal-odisha',
  onChangeRegion,
  geoStatus,
}) => {
  // Effective surge including What-If shock
  const effectiveSurge = (currentTimelineFrame.surgeM + surgeShock).toFixed(1);

  return (
    <aside style={{
      width: '320px',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      height: '100%',
      overflowY: 'auto',
      paddingRight: '4px'
    }}>
      {/* Active Cyclone Telemetry Card */}
      {/* Active Cyclone Telemetry Card */}
      <div className="glass-panel" style={{
        padding: '14px 16px',
        border: '1.5px solid #fed7aa',
        background: '#fffaf5',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} color="#e11d48" />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.04em', color: '#9f1239' }}>
              LIVE CYCLONE STATUS • BAY OF BENGAL
            </span>
          </div>
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
            {currentTimelineFrame.label}
          </span>
        </div>

        {/* 2x2 Primary Met Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '10px'
        }}>
          {/* Sustained Winds */}
          <div style={{
            background: '#ffffff',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '2px' }}>
              <Wind size={12} color="#0284c7" />
              <span>WIND SPEED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                {currentTimelineFrame.windSpeedKmh}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>km/h</span>
            </div>
            <span style={{ fontSize: '9px', color: '#d97706', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              Gusts: {currentTimelineFrame.windSpeedKmh + 25} km/h
            </span>
          </div>

          {/* Central Pressure */}
          <div style={{
            background: '#ffffff',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '2px' }}>
              <Gauge size={12} color="#e11d48" />
              <span>AIR PRESSURE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                {currentTimelineFrame.pressureHpa}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>hPa</span>
            </div>
            <span style={{ fontSize: '9px', color: '#e11d48', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              Drop: -{1013 - currentTimelineFrame.pressureHpa} hPa
            </span>
          </div>

          {/* Peak Storm Surge */}
          <div style={{
            background: '#ffffff',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '2px' }}>
              <Waves size={12} color="#0284c7" />
              <span>SEA SURGE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: surgeShock > 0 ? '#b45309' : '#0284c7' }}>
                {effectiveSurge}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>meters</span>
            </div>
            <span style={{ fontSize: '9px', color: surgeShock > 0 ? '#b45309' : '#64748b', fontWeight: 600 }}>
              {surgeShock > 0 ? `+${surgeShock.toFixed(1)}m Sim Surge` : 'Tide Synchronized'}
            </span>
          </div>

          {/* Storm Bearing & Motion */}
          <div style={{
            background: '#ffffff',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '2px' }}>
              <Compass size={12} color="#7c3aed" />
              <span>DIRECTION</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                315° NW
              </span>
            </div>
            <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              Speed: {INITIAL_CYCLONE_STATE.forwardSpeedKmh} km/h
            </span>
          </div>
        </div>

        {/* Eye Details */}
        <div style={{
          padding: '8px 10px',
          background: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #fed7aa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px'
        }}>
          <span style={{ color: '#475569', fontWeight: 600 }}>Cyclone Eye Diameter:</span>
          <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>32.5 km across</span>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="glass-panel" style={{ padding: '12px 14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
          MAP DISPLAY VIEW
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {[
            { id: 'tactical', label: 'Standard Map', icon: Maximize2 },
            { id: 'hydrodynamic', label: 'Flood Zones', icon: Waves },
            { id: 'satellite', label: 'Satellite', icon: Radar },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeViewMode(mode.id as ViewMode)}
                style={{
                  background: isActive ? '#0284c7' : '#f8fafc',
                  border: isActive ? '1px solid #0369a1' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 4px',
                  color: isActive ? '#ffffff' : '#334155',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isActive ? '#ffffff' : '#0284c7'} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Region of Interest (ROI) Selector */}
      <div className="glass-panel" style={{ padding: '12px 14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe2 size={14} color="var(--accent-cyan)" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BAY OF BENGAL SECTORS
            </span>
          </div>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 5px',
            borderRadius: '4px',
            background: '#e0f2fe',
            color: '#0369a1',
            fontWeight: 700
          }}>
            BAY OF BENGAL
          </span>
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => onChangeRegion && onChangeRegion(e.target.value)}
          style={{
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            color: '#0f172a',
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="bay-of-bengal-basin">🌊 Bay of Bengal Basin (Entire Cyclone Region)</option>
          <option value="gopalpur-coastal-odisha">Gopalpur & Ganjam Coastal Corridor (19.15°N - 19.45°N)</option>
          <option value="paradip-port-estuary">Paradip Port & Mahanadi Estuary (20.15°N - 20.40°N)</option>
          <option value="puri-konark-heritage">Puri-Konark Coastal Belt (19.70°N - 20.00°N)</option>
        </select>
      </div>

      {/* Geospatial Layer Switchboard */}
      <div className="glass-panel" style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={15} color="var(--accent-cyan)" />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.04em', color: '#0f172a' }}>
              SAFETY MAP LAYERS
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
            CLICK TO TOGGLE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Storm Surge Inundation Polygon */}
          <div
            onClick={() => onToggleLayer('surgeInundation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.surgeInundation ? '#eff6ff' : '#f8fafc',
              border: layers.surgeInundation ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Waves size={15} color={layers.surgeInundation ? '#0284c7' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Flooded Areas (Sea Surge)
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>0.5m - 4.8m water depth prediction</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: '#dbeafe',
                color: '#1d4ed8',
                fontWeight: 700
              }}>
                88.4 km²
              </span>
              {layers.surgeInundation ? <Eye size={13} color="#0284c7" /> : <EyeOff size={13} color="#94a3b8" />}
            </div>
          </div>

          {/* Road Network & Severed Bridges */}
          <div
            onClick={() => onToggleLayer('roadNetwork')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.roadNetwork ? '#fff1f2' : '#f8fafc',
              border: layers.roadNetwork ? '1px solid #fca5a5' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Route size={15} color={layers.roadNetwork ? '#e11d48' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Flooded & Cut-Off Roads
                </span>
                <span style={{ fontSize: '10px', color: '#e11d48' }}>Highway 14 Blocked (0.85m water)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: '#ffe4e6',
                color: '#e11d48',
                fontWeight: 700
              }}>
                14 CUT
              </span>
              {layers.roadNetwork ? <Eye size={13} color="#e11d48" /> : <EyeOff size={13} color="#94a3b8" />}
            </div>
          </div>

          {/* Critical Infrastructure */}
          <div
            onClick={() => onToggleLayer('infrastructure')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.infrastructure ? '#fffbeb' : '#f8fafc',
              border: layers.infrastructure ? '1px solid #fcd34d' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={15} color={layers.infrastructure ? '#d97706' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Hospitals & Power Stations
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Hospital, Substation & Water Pumps</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: '#fef3c7',
                color: '#b45309',
                fontWeight: 700
              }}>
                5 SITES
              </span>
              {layers.infrastructure ? <Eye size={13} color="#d97706" /> : <EyeOff size={13} color="#94a3b8" />}
            </div>
          </div>

          {/* Safe Haven Shelters */}
          <div
            onClick={() => onToggleLayer('shelters')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.shelters ? '#ecfdf5' : '#f8fafc',
              border: layers.shelters ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={15} color={layers.shelters ? '#059669' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Safe Shelters & Relief Camps
                </span>
                <span style={{ fontSize: '10px', color: '#059669' }}>High Elevation, Food & Generators</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: '#d1fae5',
                color: '#047857',
                fontWeight: 700
              }}>
                5 CAMPS
              </span>
              {layers.shelters ? <Eye size={13} color="#059669" /> : <EyeOff size={13} color="#94a3b8" />}
            </div>
          </div>

          {/* Safe Evacuation Corridors */}
          <div
            onClick={() => onToggleLayer('evacuationRoutes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.evacuationRoutes ? '#eff6ff' : '#f8fafc',
              border: layers.evacuationRoutes ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Route size={15} color={layers.evacuationRoutes ? '#0284c7' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Safe Evacuation Routes
                </span>
                <span style={{ fontSize: '10px', color: '#059669' }}>High Ridge Roads Away From Flood</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: '#dbeafe',
                color: '#1d4ed8',
                fontWeight: 700
              }}>
                OPEN
              </span>
              {layers.evacuationRoutes ? <Eye size={13} color="#0284c7" /> : <EyeOff size={13} color="#94a3b8" />}
            </div>
          </div>

          {/* Cyclone Track & Eye Location */}
          <div
            onClick={() => onToggleLayer('trackCone')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.trackCone ? '#faf5ff' : '#f8fafc',
              border: layers.trackCone ? '1px solid #d8b4fe' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={15} color={layers.trackCone ? '#7c3aed' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Cyclone Path & Eye Location
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Forecast direction toward coast</span>
              </div>
            </div>
            {layers.trackCone ? <Eye size={13} color="#7c3aed" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* Sentinel-1 SAR Radar */}
          <div
            onClick={() => onToggleLayer('radarSAR')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.radarSAR ? '#eff6ff' : '#f8fafc',
              border: layers.radarSAR ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radar size={15} color={layers.radarSAR ? '#0284c7' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Satellite Live Flood Radar (SAR)
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Sees water through thick cyclone clouds</span>
              </div>
            </div>
            {layers.radarSAR ? <Eye size={13} color="#0284c7" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* Earth Engine NASADEM 30m Elevation */}
          <div
            onClick={() => onToggleLayer('elevationDEM')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.elevationDEM ? '#ecfdf5' : '#f8fafc',
              border: layers.elevationDEM ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mountain size={15} color={layers.elevationDEM ? '#059669' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Ground Height Above Sea Level
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Identifies safe hills vs low floodplains</span>
              </div>
            </div>
            {layers.elevationDEM ? <Eye size={13} color="#059669" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* CHIRPS Daily Precipitation Grid */}
          <div
            onClick={() => onToggleLayer('rainfallGrid')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.rainfallGrid ? '#eff6ff' : '#f8fafc',
              border: layers.rainfallGrid ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudRain size={15} color={layers.rainfallGrid ? '#0284c7' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Rainfall Forecast & Cloudbursts
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Heavy rain accumulation (mm/day)</span>
              </div>
            </div>
            {layers.rainfallGrid ? <Eye size={13} color="#0284c7" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* JRC Global Surface Water Baseline */}
          <div
            onClick={() => onToggleLayer('surfaceWater')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.surfaceWater ? '#eff6ff' : '#f8fafc',
              border: layers.surfaceWater ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={15} color={layers.surfaceWater ? '#0284c7' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Natural Rivers & Lakes
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Permanent water bodies and channels</span>
              </div>
            </div>
            {layers.surfaceWater ? <Eye size={13} color="#0284c7" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* ESA WorldCover 10m Land Cover */}
          <div
            onClick={() => onToggleLayer('landCover')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.landCover ? '#f0fdf4' : '#f8fafc',
              border: layers.landCover ? '1px solid #86efac' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trees size={15} color={layers.landCover ? '#16a34a' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Farms, Towns & Mangroves
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Land use and coastal tree barrier</span>
              </div>
            </div>
            {layers.landCover ? <Eye size={13} color="#16a34a" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* Bi-temporal SAR Flood Change Detection */}
          <div
            onClick={() => onToggleLayer('sarChange')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.sarChange ? '#fff1f2' : '#f8fafc',
              border: layers.sarChange ? '1px solid #fca5a5' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitCompare size={15} color={layers.sarChange ? '#e11d48' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Newly Submerged Land
                </span>
                <span style={{ fontSize: '10px', color: '#e11d48' }}>+54.2 km² new water in last 6 hours</span>
              </div>
            </div>
            {layers.sarChange ? <Eye size={13} color="#e11d48" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* Phase 5 Deterministic Multi-Hazard Surface */}
          <div
            onClick={() => onToggleLayer('deterministicHazardSurface')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.deterministicHazardSurface ? '#fff7ed' : '#f8fafc',
              border: layers.deterministicHazardSurface ? '1px solid #fdba74' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} color={layers.deterministicHazardSurface ? '#ea580c' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Combined Hazard Threat Surface
                </span>
                <span style={{ fontSize: '10px', color: '#ea580c' }}>Rain + Storm Surge + Wind Risk Combined</span>
              </div>
            </div>
            {layers.deterministicHazardSurface ? <Eye size={13} color="#ea580c" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* Phase 6 Geographic Exposure Zones */}
          <div
            onClick={() => onToggleLayer('exposureZones')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.exposureZones ? '#eff6ff' : '#f8fafc',
              border: layers.exposureZones ? '1px solid #93c5fd' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={15} color={layers.exposureZones ? '#0284c7' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  High-Risk Coastal Zones
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Vulnerable sectors near shoreline</span>
              </div>
            </div>
            {layers.exposureZones ? <Eye size={13} color="#0284c7" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* Phase 6 Population Density Heatmap */}
          <div
            onClick={() => onToggleLayer('populationDensity')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.populationDensity ? '#faf5ff' : '#f8fafc',
              border: layers.populationDensity ? '1px solid #d8b4fe' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={15} color={layers.populationDensity ? '#9333ea' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Population at Risk (WorldPop)
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Residents & vulnerable housing density</span>
              </div>
            </div>
            {layers.populationDensity ? <Eye size={13} color="#9333ea" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>

          {/* Phase 6 Critical Facility Lifelines */}
          <div
            onClick={() => onToggleLayer('criticalFacilities')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.criticalFacilities ? '#fffbeb' : '#f8fafc',
              border: layers.criticalFacilities ? '1px solid #fcd34d' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={15} color={layers.criticalFacilities ? '#d97706' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Emergency First-Aid & Lifelines
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Hospitals, generators, and cell masts</span>
              </div>
            </div>
            {layers.criticalFacilities ? <Eye size={13} color="#d97706" /> : <EyeOff size={13} color="#94a3b8" />}
          </div>
        </div>
      </div>
    </aside>
  );
};
