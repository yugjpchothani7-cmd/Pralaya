import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  Building2, 
  Satellite, 
  GitCompare, 
  Activity, 
  Waves, 
  Wind, 
  CloudRain, 
  Layers, 
  Users, 
  MapPin, 
  AlertTriangle,
  Info
} from 'lucide-react';
import type { LayerState, ViewMode } from '../left/LeftPanel';
import { 
  DEMO_INFRASTRUCTURE, 
  DEMO_SHELTERS, 
  INITIAL_CYCLONE_STATE, 
  type InfrastructureAsset, 
  type DemoShelter 
} from '../../data/demoData';
import { api } from '../../api/client';
import type { 
  GeospatialLayerMetadata, 
  TemporalComparisonResult,
  GeospatialHazardSurface,
  GeospatialHazardCell,
  RegionalExposureAssessment,
  GeographicZoneExposure,
} from '../../types';

interface InteractiveMapProps {
  layers: LayerState;
  viewMode: ViewMode;
  surgeShock: number;
  rainShock: number;
  highTide: boolean;
  selectedRegion?: string;
  onSelectEntity?: (entity: { type: 'asset' | 'shelter'; data: InfrastructureAsset | DemoShelter }) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  layers,
  viewMode,
  surgeShock,
  rainShock,
  highTide,
  selectedRegion = 'gopalpur-coastal-odisha',
  onSelectEntity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [mouseCoords, setMouseCoords] = useState<{ lat: string; lon: string; elev: string }>({
    lat: '19.2612° N',
    lon: '84.8624° E',
    elev: '4.8m MSL'
  });

  const [activeInspector, setActiveInspector] = useState<{
    type: 'asset' | 'shelter';
    data: InfrastructureAsset | DemoShelter;
  } | null>(null);

  // Phase 4 Earth Engine & Geospatial State
  const [activeEOLayer, setActiveEOLayer] = useState<GeospatialLayerMetadata | null>(null);
  const [sarComparison, setSarComparison] = useState<TemporalComparisonResult | null>(null);
  const [eoLoading, setEoLoading] = useState<boolean>(false);

  // Sync Earth Engine data if enabled
  useEffect(() => {
    let isMounted = true;
    const fetchGeospatialData = async () => {
      setEoLoading(true);
      try {
        if (layers.elevationDEM) {
          const elev = await api.getElevationLayer(selectedRegion);
          if (isMounted) setActiveEOLayer(elev);
        } else if (layers.radarSAR) {
          const sar = await api.getSarLayer(selectedRegion);
          if (isMounted) setActiveEOLayer(sar);
        } else if (layers.rainfallGrid) {
          const rain = await api.getRainfallLayer(selectedRegion);
          if (isMounted) setActiveEOLayer(rain);
        }
        if (layers.sarChange) {
          const comp = await api.getTemporalComparison(selectedRegion);
          if (isMounted) setSarComparison(comp);
        }
      } catch (e) {
        console.warn('Geospatial layer sync fallback:', e);
      } finally {
        if (isMounted) setEoLoading(false);
      }
    };
    fetchGeospatialData();
    return () => { isMounted = false; };
  }, [layers, selectedRegion]);

  // Strict Bay of Bengal geographic bounding box (Restricts map view solely to Bay of Bengal & coastal sectors)
  const BAY_OF_BENGAL_BOUNDS = L.latLngBounds([5.5, 78.0], [23.5, 96.0]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [18.5, 85.8], // Centered on Bay of Bengal approaching Odisha/Andhra coast
        zoom: 8,
        minZoom: 6,
        maxZoom: 16,
        maxBounds: BAY_OF_BENGAL_BOUNDS,
        maxBoundsViscosity: 1.0, // Hard stop at Bay of Bengal boundary
        zoomControl: false,
        attributionControl: false
      });

      // Default OpenStreetMap TileLayer
      const tileUrl = viewMode === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 18,
      }).addTo(map);

      tileLayerRef.current = tiles;

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        const latStr = `${e.latlng.lat.toFixed(4)}° N`;
        const lonStr = `${e.latlng.lng.toFixed(4)}° E`;
        const approxElev = Math.max(1.2, (e.latlng.lng - 84.85) * 45 + 3).toFixed(1);
        setMouseCoords({
          lat: latStr,
          lon: lonStr,
          elev: `${approxElev}m MSL`
        });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive across standard re-renders
    };
  }, []);

  // Pan to selected region within Bay of Bengal
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedRegion === 'bay-of-bengal-basin') {
      mapInstanceRef.current.setView([18.0, 86.5], 7);
    } else if (selectedRegion === 'paradip-port-estuary') {
      mapInstanceRef.current.setView([20.26, 86.67], 10);
    } else if (selectedRegion === 'puri-konark-heritage') {
      mapInstanceRef.current.setView([19.81, 85.83], 10);
    } else {
      mapInstanceRef.current.setView([19.27, 84.88], 10);
    }
  }, [selectedRegion]);

  // Update Tile Layer when viewMode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl = viewMode === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTiles = L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [viewMode]);

  // Render layers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Storm Surge Hazard Inundation Zone
    if (layers.surgeInundation) {
      const surgeExpansion = (surgeShock * 0.005) + (highTide ? 0.01 : 0);
      const inundationCoords: [number, number][] = [
        [19.18, 84.80],
        [19.23, 84.84 + surgeExpansion],
        [19.28, 84.89 + surgeExpansion],
        [19.34, 84.97 + surgeExpansion],
        [19.38, 85.05 + surgeExpansion],
        [19.30, 85.08],
        [19.20, 84.95],
        [19.15, 84.85]
      ];

      const surgePolygon = L.polygon(inundationCoords, {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.35 + (surgeShock * 0.03),
        weight: 2,
        dashArray: '4, 4'
      });
      surgePolygon.bindTooltip(`<b>Hazard: Coastal Surge Inundation</b><br/>Surge Height: ${(3.2 + (surgeShock * 0.3)).toFixed(1)}m MSL`, { sticky: true });
      group.addLayer(surgePolygon);
    }

    // 2. Cyclone Eye & Predicted Cone
    if (layers.trackCone) {
      const cycloneEyeLatLng: [number, number] = [19.12, 85.12];

      // Track Cone
      const coneCoords: [number, number][] = [
        [18.90, 85.35],
        [19.12, 85.12],
        [19.27, 84.88], // Projected landfall
        [19.42, 84.65],
        [19.60, 84.85],
        [19.35, 85.25]
      ];

      const conePolygon = L.polygon(coneCoords, {
        color: '#f59e0b',
        fillColor: '#fbbf24',
        fillOpacity: 0.20,
        weight: 1.5
      });
      group.addLayer(conePolygon);

      // Track center line
      const trackLine = L.polyline([
        [18.80, 85.45],
        [19.00, 85.28],
        [19.12, 85.12],
        [19.27, 84.88],
        [19.45, 84.62]
      ], {
        color: '#ea580c',
        weight: 3,
        dashArray: '6, 6'
      });
      group.addLayer(trackLine);

      // Eye Circle
      const eyeCircle = L.circle(cycloneEyeLatLng, {
        radius: 28000,
        color: '#dc2626',
        fillColor: '#f87171',
        fillOpacity: 0.25,
        weight: 2
      });
      eyeCircle.bindTooltip('<b>Cyclone Eye Center (ESCS)</b><br/>Max Sustained Winds: 185 km/h', { permanent: false });
      group.addLayer(eyeCircle);
    }

    // 3. Evacuation Routes
    if (layers.evacuationRoutes) {
      // Safe Route (NH-16 Inland Bypass)
      const safeRoute = L.polyline([
        [19.262, 84.865], // Gopalpur
        [19.285, 84.830],
        [19.315, 84.794], // Berhampur safe hub
        [19.360, 84.780]
      ], {
        color: '#10b981',
        weight: 5,
        opacity: 0.9
      });
      safeRoute.bindTooltip('<b>RECOMMENDED EVACUATION CORRIDOR</b><br/>Route: NH-16 Bypass (High Ground +14m MSL)<br/>Status: 100% CLEAR', { sticky: true });
      group.addLayer(safeRoute);

      // Blocked / Inundated Route (SH-14 Coastal)
      const blockedRoute = L.polyline([
        [19.262, 84.865],
        [19.290, 84.910],
        [19.330, 84.960],
        [19.355, 84.990]
      ], {
        color: '#ef4444',
        weight: 4,
        dashArray: '6, 6',
        opacity: 0.85
      });
      blockedRoute.bindTooltip('<b>REJECTED CORRIDOR: SH-14</b><br/>Reason: Inundation Depth > 1.85m at Culvert km-14.2<br/>STATUS: CLOSED', { sticky: true });
      group.addLayer(blockedRoute);
    }

    // 4. Cyclone Shelters
    if (layers.shelters) {
      const shelters = [
        { id: 'sh-1', name: 'Gopalpur Multipurpose Cyclone Shelter', lat: 19.262, lng: 84.865, cap: 1000, occ: 880, elev: 6.8, status: 'Active (88% Full)' },
        { id: 'sh-2', name: 'Brahmapur Engineering College Haven', lat: 19.315, lng: 84.794, cap: 2500, occ: 1050, elev: 18.2, status: 'Recommended (42% Full)' },
        { id: 'sh-3', name: 'Chatrapur Cyclone Center', lat: 19.355, lng: 84.990, cap: 1200, occ: 720, elev: 8.5, status: 'Active (60% Full)' },
        { id: 'sh-4', name: 'Rangeilunda Coastal Safe Hub', lat: 19.290, lng: 84.820, cap: 800, occ: 510, elev: 11.4, status: 'Active (64% Full)' }
      ];

      shelters.forEach(sh => {
        const markerIcon = L.divIcon({
          className: 'custom-shelter-pin',
          html: `<div style="
            background: #ffffff;
            border: 2px solid #059669;
            color: #059669;
            font-weight: 800;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            white-space: nowrap;
          ">
            <span>🛡️</span>
            <span>${sh.name.split(' ')[0]} (${sh.occ}/${sh.cap})</span>
          </div>`,
          iconSize: [140, 30],
          iconAnchor: [70, 15]
        });

        const marker = L.marker([sh.lat, sh.lng], { icon: markerIcon });
        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">${sh.name}</div>
            <div style="font-size: 11px; color: #059669; font-weight: 700; margin-bottom: 6px;">${sh.status}</div>
            <div style="font-size: 11px; color: #475569; display: grid; gap: 2px;">
              <div>• Capacity: <b>${sh.cap} persons</b> (Occupancy: ${sh.occ})</div>
              <div>• Elevation: <b>+${sh.elev}m MSL</b> (Safe from surge)</div>
              <div>• Power: <b>Diesel Gen + Solar Microgrid</b></div>
              <div>• Medical Station: <b>Equipped & Staffed</b></div>
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 5. Critical Infrastructure
    if (layers.infrastructure) {
      const infra = [
        { name: 'Gopalpur 132kV Primary Substation', lat: 19.275, lng: 84.850, type: 'Power Grid', status: 'Threatened by Surge' },
        { name: 'District Civil Hospital', lat: 19.310, lng: 84.805, type: 'Healthcare', status: 'Operational (Microgrid)' },
        { name: 'Coastal VHF Communications Mast', lat: 19.255, lng: 84.880, type: 'Telemetry', status: 'Active (Broadcasting)' }
      ];

      infra.forEach(item => {
        const infraIcon = L.divIcon({
          className: 'custom-shelter-pin',
          html: `<div style="
            background: #ffffff;
            border: 2px solid #2563eb;
            color: #1e40af;
            font-weight: 700;
            font-size: 10px;
            padding: 3px 6px;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.12);
            white-space: nowrap;
          ">
            ⚡ ${item.name.split(' ')[0]}
          </div>`,
          iconSize: [110, 26],
          iconAnchor: [55, 13]
        });

        const marker = L.marker([item.lat, item.lng], { icon: infraIcon });
        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <div style="font-size: 12px; font-weight: 800; color: #0f172a;">${item.name}</div>
            <div style="font-size: 10px; color: #2563eb; font-weight: 700;">Type: ${item.type}</div>
            <div style="font-size: 10px; color: #dc2626; margin-top: 4px;">Status: ${item.status}</div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

  }, [layers, surgeShock, highTide, rainShock]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    mapInstanceRef.current?.setView([18.5, 85.8], 8);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8fafc',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      {/* Top Map HUD Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#0f172a'
        }}>
          <span className="pulsing-beacon" style={{ width: '6px', height: '6px' }} />
          <span>BAY OF BENGAL BASIN // LIVE SAFETY MAP</span>
          <span style={{
            fontSize: '9px',
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 800,
            letterSpacing: '0.04em'
          }}>
            BAY OF BENGAL ONLY
          </span>
        </div>

        <div style={{ width: '1px', height: '16px', background: '#cbd5e1' }} />

        <div style={{
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          padding: '2px 8px',
          borderRadius: '4px',
          background: '#eff6ff',
          color: '#2563eb',
          border: '1px solid #bfdbfe',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          VIEW: {viewMode}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#475569'
        }}>
          <span>{mouseCoords.lat}</span>
          <span>{mouseCoords.lon}</span>
          <span style={{ color: '#0284c7', fontWeight: 600 }}>{mouseCoords.elev}</span>
        </div>
      </div>

      {/* Floating Earth Engine Intelligence HUD */}
      {(activeEOLayer || sarComparison) && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          zIndex: 1000,
          maxWidth: '320px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Satellite size={14} color="#0284c7" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>
                EARTH ENGINE HUD
              </span>
            </div>
            <span style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: '4px',
              background: '#dcfce7',
              color: '#15803d',
              fontWeight: 700,
            }}>
              LIVE SATELLITE
            </span>
          </div>

          {activeEOLayer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '10.5px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{activeEOLayer.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '10px' }}>
                <span>Source:</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{activeEOLayer.source_dataset}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '10px' }}>
                <span>Resolution:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{activeEOLayer.resolution_meters}m</span>
              </div>
            </div>
          )}

          {sarComparison && layers.sarChange && (
            <div style={{
              marginTop: '4px',
              paddingTop: '6px',
              borderTop: '1px dashed #fca5a5',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontWeight: 700, fontSize: '10px' }}>
                <GitCompare size={12} />
                <span>SAR INUNDATION CHANGE</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px' }}>
                <div style={{ background: '#f0f9ff', padding: '4px', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                  <div style={{ color: '#64748b', fontSize: '9px' }}>Base Water</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284c7' }}>
                    {sarComparison.baseline_water_area_sq_km} km²
                  </div>
                </div>
                <div style={{ background: '#fef2f2', padding: '4px', borderRadius: '4px', border: '1px solid #fecdd3' }}>
                  <div style={{ color: '#dc2626', fontSize: '9px' }}>Newly Submerged</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#dc2626' }}>
                    +{sarComparison.newly_submerged_area_sq_km} km²
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Zoom & Center Map Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '18px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155'
          }}
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155'
          }}
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleReset}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155'
          }}
          title="Center on Gopalpur"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Main Real Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          flex: 1 
        }} 
      />
    </div>
  );
};
