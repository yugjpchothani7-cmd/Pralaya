import React, { useEffect, useState } from 'react';
import { ShieldAlert, Wifi, WifiOff, Clock, Server } from 'lucide-react';
import { api } from '../../api/client';
import type { HealthResponse } from '../../types';

interface NavbarProps {
  onOpenHealthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHealthModal }) => {
  const [time, setTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latency, setLatency] = useState<number>(0);
  const [, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const runCheck = async () => {
      const t0 = performance.now();
      try {
        const data = await api.getHealth();
        if (isMounted) {
          setLatency(Math.round(performance.now() - t0));
          setHealth(data);
          setIsConnected(true);
        }
      } catch {
        if (isMounted) {
          setIsConnected(false);
          setHealth(null);
        }
      }
    };

    void runCheck();
    const interval = setInterval(runCheck, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'var(--glow-cyan)'
        }}>
          <ShieldAlert size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              PRALAYA
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontFamily: 'var(--font-mono)'
            }}>
              MISSION CONTROL
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Predictive Resilience & Adaptive Local Action AI
          </span>
        </div>
      </div>

      {/* Threat Level Live Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 16px',
        background: 'rgba(244, 63, 94, 0.12)',
        borderRadius: '999px',
        border: '1px solid rgba(244, 63, 94, 0.35)'
      }}>
        <div className="pulsing-beacon-danger" />
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-rose)', letterSpacing: '0.03em' }}>
          ALERT T-4H: CYCLONE KARUNA (ESCS)
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          PEAK WINDS 165 KM/H | SURGE 4.8M
        </span>
      </div>

      {/* Right Controls: Clock & Subsystem Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          <Clock size={14} color="var(--accent-cyan)" />
          <span>{time.toLocaleTimeString()} IST</span>
        </div>

        {/* Backend Connection Badge */}
        <button
          onClick={onOpenHealthModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: isConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Click to view full subsystem diagnostic health"
        >
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isConnected ? `BACKEND ONLINE (${latency}ms)` : 'BACKEND DISCONNECTED'}</span>
          <Server size={13} style={{ marginLeft: '4px', opacity: 0.7 }} />
        </button>
      </div>
    </header>
  );
};
