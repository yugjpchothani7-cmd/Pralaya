import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PRALAYA Error Boundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg-primary)'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '36px',
            textAlign: 'center',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            boxShadow: 'var(--glow-rose)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--accent-rose)'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>
              Mission Control Rendering Exception
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              A critical UI error occurred while rendering the spatial telemetry view. Deterministic backend services and data integrity remain unaffected.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '12px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--accent-rose)',
              textAlign: 'left',
              marginBottom: '24px',
              overflowX: 'auto',
              maxHeight: '120px'
            }}>
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
            >
              <RotateCcw size={16} /> Re-Initialize Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
