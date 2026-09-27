import React, { useState } from 'react';
import { 
  Navigation2, 
  Waves,
  Zap
} from 'lucide-react';

interface LayerState {
  trackCone: boolean;
  surgeInundation: boolean;
  infrastructure: boolean;
  shelters: boolean;
  evacuationRoutes: boolean;
}

export const MapViewer: React.FC = () => {
  const [layers, setLayers] = useState<LayerState>({
    trackCone: true,
    surgeInundation: true,
    infrastructure: true,
    shelters: true,
    evacuationRoutes: true,
  });

  const toggleLayer = (key: keyof LayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="glass-panel" style={{
      position: 'relative',
      height: '520px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid var(--border-accent)',
      boxShadow: 'var(--glow-cyan)'
    }}>
      {/* Top Map Header & Controls */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10, 16, 30, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulsing-beacon" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
            GEOSPATIAL SITUATION RADAR (COASTAL ODISHA AOI)
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            EPSG:4326 | 30m FABDEM / Sentinel-1 SAR
          </span>
        </div>

        {/* Quick Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => toggleLayer('surgeInundation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: `1px solid ${layers.surgeInundation ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
              background: layers.surgeInundation ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: layers.surgeInundation ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Waves size={12} /> Surge Layer
          </button>

          <button
            onClick={() => toggleLayer('evacuationRoutes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: `1px solid ${layers.evacuationRoutes ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
              background: layers.evacuationRoutes ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: layers.evacuationRoutes ? 'var(--accent-emerald)' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Navigation2 size={12} /> Evacuation Corridors
          </button>

          <button
            onClick={() => toggleLayer('infrastructure')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: `1px solid ${layers.infrastructure ? 'rgba(245, 158, 11, 0.4)' : 'transparent'}`,
              background: layers.infrastructure ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: layers.infrastructure ? 'var(--accent-amber)' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Zap size={12} /> Critical Assets
          </button>
        </div>
      </div>

      {/* Map Graphic Canvas / Visual Surface */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: 'radial-gradient(ellipse at 75% 65%, #0b192e 0%, #050b16 100%)',
        overflow: 'hidden'
      }}>
        {/* Synthetic Map Background Grid */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Coastal Contour & Bay of Bengal Water Body Graphic */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {/* Coastline Polygon */}
          <path
            d="M 0,0 L 280,0 Q 320,180 420,300 T 600,420 L 720,520 L 0,520 Z"
            fill="#091426"
            stroke="#1e3a5f"
            strokeWidth="1.5"
          />

          {/* Sea / Bay of Bengal */}
          <path
            d="M 280,0 Q 320,180 420,300 T 600,420 L 720,520 L 1200,520 L 1200,0 Z"
            fill="rgba(2, 44, 80, 0.4)"
          />

          {/* Storm Surge Inundation Envelope (Orange/Blue gradient) */}
          {layers.surgeInundation && (
            <g opacity="0.65">
              <path
                d="M 260,20 Q 300,190 395,310 T 560,430 L 620,460 L 590,400 Q 420,290 310,140 Z"
                fill="url(#surgeGrad)"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <defs>
                <linearGradient id="surgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </g>
          )}

          {/* Cyclone Eye & Track Cone */}
          {layers.trackCone && (
            <g>
              {/* Uncertainty Cone */}
              <path
                d="M 850,380 L 520,220 L 460,280 Z"
                fill="rgba(244, 63, 94, 0.15)"
                stroke="rgba(244, 63, 94, 0.4)"
                strokeDasharray="3 3"
              />
              {/* Track Line */}
              <line x1="850" y1="380" x2="480" y2="245" stroke="#f43f5e" strokeWidth="2.5" />
              {/* Cyclone Eye Center */}
              <circle cx="680" cy="315" r="16" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="680" cy="315" r="4" fill="#f43f5e" />
              <text x="705" y="320" fill="#fff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                Eye T-4h (165 km/h)
              </text>
            </g>
          )}

          {/* Evacuation Route (Glowing Green Line) */}
          {layers.evacuationRoutes && (
            <g>
              <path
                d="M 230,340 Q 250,290 280,270 T 360,230"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))"
              />
              {/* Submerged Highway Red Mark (Avoided) */}
              <line x1="230" y1="340" x2="310" y2="350" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
              <text x="240" y="370" fill="var(--accent-rose)" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                SH-14 Submerged (0.65m) - AVOIDED
              </text>
            </g>
          )}

          {/* Infrastructure Markers */}
          {layers.infrastructure && (
            <g>
              {/* Substation */}
              <circle cx="310" cy="350" r="6" fill="#f43f5e" />
              <text x="320" y="348" fill="#f87171" fontSize="10" fontWeight="700" fontFamily="sans-serif">
                Substation S-1 (Submerged 0.65m)
              </text>

              {/* Hospital */}
              <circle cx="210" cy="270" r="6" fill="#38bdf8" />
              <text x="140" y="260" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="sans-serif">
                District Hospital (Gen Active)
              </text>
            </g>
          )}

          {/* Shelter Pins */}
          {layers.shelters && (
            <g>
              <circle cx="360" cy="230" r="7" fill="#10b981" />
              <circle cx="360" cy="230" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
              <text x="380" y="235" fill="#34d399" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                Kalyanpur High School Shelter (790 Beds Open)
              </text>
            </g>
          )}
        </svg>

        {/* Floating Map HUD Legend */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          background: 'rgba(7, 11, 20, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '11px',
          zIndex: 10
        }}>
          <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '2px', textTransform: 'uppercase' }}>
            Mission Map Legend
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '3px', background: '#10b981', display: 'inline-block' }} />
            <span>Optimal Highland Ridge Evacuation Route</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '3px', background: '#f43f5e', borderTop: '1px dashed #fff', display: 'inline-block' }} />
            <span>Submerged Roadway (&gt;0.30m Vehicle Stall)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>Certified Safe Haven (Clearance &gt; 7.5m)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
