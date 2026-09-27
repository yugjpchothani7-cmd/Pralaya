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
      <div className="glass-panel" style={{
        padding: '14px 16px',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        background: 'linear-gradient(180deg, rgba(30, 20, 35, 0.8) 0%, rgba(15, 23, 42, 0.85) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} color="var(--accent-rose)" />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.04em', color: '#fff' }}>
              CYCLONE TELEMETRY
            </span>
          </div>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            fontWeight: 700
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
            background: 'rgba(10, 16, 30, 0.7)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <Wind size={12} color="var(--accent-cyan)" />
              <span>MAX WINDS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {currentTimelineFrame.windSpeedKmh}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>km/h</span>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              Gusts: {currentTimelineFrame.windSpeedKmh + 25} km/h
            </span>
          </div>

          {/* Central Pressure */}
          <div style={{
            background: 'rgba(10, 16, 30, 0.7)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <Gauge size={12} color="var(--accent-rose)" />
              <span>PRESSURE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {currentTimelineFrame.pressureHpa}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>hPa</span>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
              Δ -{1013 - currentTimelineFrame.pressureHpa} hPa
            </span>
          </div>

          {/* Peak Storm Surge */}
          <div style={{
            background: 'rgba(10, 16, 30, 0.7)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <Waves size={12} color="var(--accent-cyan)" />
              <span>PEAK SURGE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: surgeShock > 0 ? '#fbbf24' : '#38bdf8' }}>
                {effectiveSurge}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>m MSL</span>
            </div>
            <span style={{ fontSize: '9px', color: surgeShock > 0 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
              {surgeShock > 0 ? `+${surgeShock.toFixed(1)}m Shock` : 'High Tide Sync'}
            </span>
          </div>

          {/* Storm Bearing & Motion */}
          <div style={{
            background: 'rgba(10, 16, 30, 0.7)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '2px' }}>
              <Compass size={12} color="var(--accent-purple)" />
              <span>BEARING</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                315° NW
              </span>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Speed: {INITIAL_CYCLONE_STATE.forwardSpeedKmh} km/h
            </span>
          </div>
        </div>

        {/* Eye Details */}
        <div style={{
          padding: '6px 10px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Eye Radius (RMW):</span>
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#fff' }}>32.5 km</span>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="glass-panel" style={{ padding: '12px 14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
          GEOSPATIAL DISPLAY MODE
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          {[
            { id: 'tactical', label: 'Tactical 2D', icon: Maximize2 },
            { id: 'hydrodynamic', label: 'Hydrodynamic', icon: Waves },
            { id: 'satellite', label: 'SAR Radar', icon: Radar },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeViewMode(mode.id as ViewMode)}
                style={{
                  background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 4px',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isActive ? 'var(--accent-cyan)' : 'currentColor'} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Region of Interest (ROI) Selector */}
      <div className="glass-panel" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe2 size={14} color="var(--accent-cyan)" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              REGION OF INTEREST (ROI)
            </span>
          </div>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 5px',
            borderRadius: '4px',
            background: geoStatus?.primary_gee_available ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
            color: geoStatus?.primary_gee_available ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
            fontWeight: 700
          }}>
            {geoStatus?.primary_gee_available ? '● GEE LIVE' : '○ GEE FALLBACK'}
          </span>
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => onChangeRegion && onChangeRegion(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            color: '#fff',
            padding: '7px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="gopalpur-coastal-odisha">Gopalpur & Ganjam Coastal Corridor (19.15°N - 19.45°N)</option>
          <option value="paradip-port-estuary">Paradip Port & Mahanadi Estuary (20.15°N - 20.40°N)</option>
          <option value="puri-konark-heritage">Puri-Konark Coastal Belt (19.70°N - 20.00°N)</option>
        </select>
      </div>

      {/* Geospatial Layer Switchboard */}
      <div className="glass-panel" style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={15} color="var(--accent-cyan)" />
            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.04em', color: '#fff' }}>
              LAYER SWITCHBOARD
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            EO & HAZARDS
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
              background: layers.surgeInundation ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.surgeInundation ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Waves size={15} color={layers.surgeInundation ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.surgeInundation ? '#fff' : 'var(--text-secondary)' }}>
                  Surge Inundation Depth
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>0.5m - 4.8m Surface Mesh</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: 'rgba(56, 189, 248, 0.2)',
                color: 'var(--accent-cyan)',
                fontWeight: 700
              }}>
                88.4 km²
              </span>
              {layers.surgeInundation ? <Eye size={13} color="var(--accent-cyan)" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.roadNetwork ? 'rgba(244, 63, 94, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.roadNetwork ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Route size={15} color={layers.roadNetwork ? 'var(--accent-rose)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.roadNetwork ? '#fff' : 'var(--text-secondary)' }}>
                  Road Network & Cutoffs
                </span>
                <span style={{ fontSize: '9px', color: 'var(--accent-rose)' }}>SH-14 Impassable (0.85m)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: 'rgba(244, 63, 94, 0.2)',
                color: 'var(--accent-rose)',
                fontWeight: 700
              }}>
                14 CUT
              </span>
              {layers.roadNetwork ? <Eye size={13} color="var(--accent-rose)" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.infrastructure ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.infrastructure ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={15} color={layers.infrastructure ? 'var(--accent-amber)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.infrastructure ? '#fff' : 'var(--text-secondary)' }}>
                  Critical Infrastructure
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Grid, Hospital, Pumps, Telecom</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                fontWeight: 700
              }}>
                5 NODES
              </span>
              {layers.infrastructure ? <Eye size={13} color="var(--accent-amber)" /> : <EyeOff size={13} color="var(--text-muted)" />}
            </div>
          </div>

          {/* Safe Haven Shelters (TOPSIS Ranked) */}
          <div
            onClick={() => onToggleLayer('shelters')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.shelters ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.shelters ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={15} color={layers.shelters ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.shelters ? '#fff' : 'var(--text-secondary)' }}>
                  Certified Shelters
                </span>
                <span style={{ fontSize: '9px', color: 'var(--accent-emerald)' }}>TOPSIS Plinth Verified</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--accent-emerald)',
                fontWeight: 700
              }}>
                5 SITES
              </span>
              {layers.shelters ? <Eye size={13} color="var(--accent-emerald)" /> : <EyeOff size={13} color="var(--text-muted)" />}
            </div>
          </div>

          {/* Dynamic Evacuation Corridors */}
          <div
            onClick={() => onToggleLayer('evacuationRoutes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.evacuationRoutes ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.evacuationRoutes ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Route size={15} color={layers.evacuationRoutes ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.evacuationRoutes ? '#fff' : 'var(--text-secondary)' }}>
                  Evacuation Corridors
                </span>
                <span style={{ fontSize: '9px', color: 'var(--accent-emerald)' }}>Inland Ridge Safe Corridor</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 5px',
                borderRadius: '3px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--accent-emerald)',
                fontWeight: 700
              }}>
                ACTIVE
              </span>
              {layers.evacuationRoutes ? <Eye size={13} color="var(--accent-cyan)" /> : <EyeOff size={13} color="var(--text-muted)" />}
            </div>
          </div>

          {/* Cyclone Track & Cone of Uncertainty */}
          <div
            onClick={() => onToggleLayer('trackCone')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              background: layers.trackCone ? 'rgba(168, 85, 247, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.trackCone ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={15} color={layers.trackCone ? 'var(--accent-purple)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.trackCone ? '#fff' : 'var(--text-secondary)' }}>
                  Track & Cone of Uncertainty
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>JTWC / IMD Ensemble Cone</span>
              </div>
            </div>
            {layers.trackCone ? <Eye size={13} color="var(--accent-purple)" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.radarSAR ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.radarSAR ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radar size={15} color={layers.radarSAR ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.radarSAR ? '#fff' : 'var(--text-secondary)' }}>
                  Sentinel-1 SAR Radar Inundation
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>10m | ESA Copernicus (dB)</span>
              </div>
            </div>
            {layers.radarSAR ? <Eye size={13} color="var(--accent-cyan)" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.elevationDEM ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.elevationDEM ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mountain size={15} color={layers.elevationDEM ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.elevationDEM ? '#fff' : 'var(--text-secondary)' }}>
                  NASADEM 30m Elevation DEM
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>30m | NASA JPL / USGS (meters MSL)</span>
              </div>
            </div>
            {layers.elevationDEM ? <Eye size={13} color="var(--accent-emerald)" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.rainfallGrid ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.rainfallGrid ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudRain size={15} color={layers.rainfallGrid ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.rainfallGrid ? '#fff' : 'var(--text-secondary)' }}>
                  CHIRPS Daily Precipitation Grid
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>5.5km | UCSB / USGS (mm/24h)</span>
              </div>
            </div>
            {layers.rainfallGrid ? <Eye size={13} color="var(--accent-cyan)" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.surfaceWater ? 'rgba(2, 132, 199, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.surfaceWater ? '1px solid rgba(2, 132, 199, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={15} color={layers.surfaceWater ? '#38bdf8' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.surfaceWater ? '#fff' : 'var(--text-secondary)' }}>
                  JRC Global Surface Water
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>30m | EC JRC (38-yr Occurrence %)</span>
              </div>
            </div>
            {layers.surfaceWater ? <Eye size={13} color="#38bdf8" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.landCover ? 'rgba(34, 197, 94, 0.12)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.landCover ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trees size={15} color={layers.landCover ? '#4ade80' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.landCover ? '#fff' : 'var(--text-secondary)' }}>
                  ESA WorldCover 10m LULC
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>10m | ESA WorldCover (11 Classes)</span>
              </div>
            </div>
            {layers.landCover ? <Eye size={13} color="#4ade80" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.sarChange ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.sarChange ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitCompare size={15} color={layers.sarChange ? '#f87171' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.sarChange ? '#fff' : 'var(--text-secondary)' }}>
                  Bi-Temporal Flood Change
                </span>
                <span style={{ fontSize: '9px', color: 'var(--accent-rose)' }}>+54.2 km² Inundation Expansion</span>
              </div>
            </div>
            {layers.sarChange ? <Eye size={13} color="#f87171" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.deterministicHazardSurface ? 'rgba(234, 88, 12, 0.18)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.deterministicHazardSurface ? '1px solid rgba(234, 88, 12, 0.6)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} color={layers.deterministicHazardSurface ? '#fb923c' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.deterministicHazardSurface ? '#fff' : 'var(--text-secondary)' }}>
                  Deterministic Hazard Surface
                </span>
                <span style={{ fontSize: '9px', color: '#fb923c' }}>Compound Pluvial + Surge + Wind Mesh</span>
              </div>
            </div>
            {layers.deterministicHazardSurface ? <Eye size={13} color="#fb923c" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.exposureZones ? 'rgba(56, 189, 248, 0.16)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.exposureZones ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={15} color={layers.exposureZones ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.exposureZones ? '#fff' : 'var(--text-secondary)' }}>
                  Geographic Exposure Zones
                </span>
                <span style={{ fontSize: '9px', color: 'var(--accent-cyan)' }}>Multi-Sector Lifeline Overlay (Pralaya v6.0)</span>
              </div>
            </div>
            {layers.exposureZones ? <Eye size={13} color="var(--accent-cyan)" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.populationDensity ? 'rgba(168, 85, 247, 0.16)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.populationDensity ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={15} color={layers.populationDensity ? '#c084fc' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.populationDensity ? '#fff' : 'var(--text-secondary)' }}>
                  WorldPop Density Heatmap
                </span>
                <span style={{ fontSize: '9px', color: '#c084fc' }}>100m Demographic Density & Kutcha Housing</span>
              </div>
            </div>
            {layers.populationDensity ? <Eye size={13} color="#c084fc" /> : <EyeOff size={13} color="var(--text-muted)" />}
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
              background: layers.criticalFacilities ? 'rgba(245, 158, 11, 0.16)' : 'rgba(15, 23, 42, 0.5)',
              border: layers.criticalFacilities ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={15} color={layers.criticalFacilities ? 'var(--accent-amber)' : 'var(--text-muted)'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: layers.criticalFacilities ? '#fff' : 'var(--text-secondary)' }}>
                  Critical Facility Lifelines
                </span>
                <span style={{ fontSize: '9px', color: 'var(--accent-amber)' }}>Hospitals, Substations, Masts, ODRAF Bases</span>
              </div>
            </div>
            {layers.criticalFacilities ? <Eye size={13} color="var(--accent-amber)" /> : <EyeOff size={13} color="var(--text-muted)" />}
          </div>
        </div>
      </div>
    </aside>
  );
};
