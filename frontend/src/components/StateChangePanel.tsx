import { computeStateChange } from '../api/client';
import type { SystemState, StateChangeResponse, DeltaEntry } from '../types/state_change';
import React, { useState } from 'react';
import styles from './StateChangePanel.module.css';

/**
 * Phase 16 – "WHAT CHANGED?" panel.
 * Allows the user to supply two SystemState JSON snapshots, computes the delta via the backend,
 * and renders a list of DeltaEntry items together with a Gemini‑generated natural‑language summary.
 * Includes a "Copy / Export" button to download the full response as JSON.
 */
const StateChangePanel: React.FC = () => {
  const [prevInput, setPrevInput] = useState<string>('{}');
  const [currInput, setCurrInput] = useState<string>('{}');
  const [response, setResponse] = useState<StateChangeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const previous: SystemState = JSON.parse(prevInput);
      const current: SystemState = JSON.parse(currInput);
      const resp = await computeStateChange(previous, current);
      setResponse(resp);
    } catch (err) {
      setError((err as Error).message || 'Failed to compute state change');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!response) return;
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state_change.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>What Changed?</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputs}>
          <label className={styles.field}>
            Previous State (JSON)
            <textarea
              value={prevInput}
              onChange={(e) => setPrevInput(e.target.value)}
              rows={8}
              required
            />
          </label>
          <label className={styles.field}>
            Current State (JSON)
            <textarea
              value={currInput}
              onChange={(e) => setCurrInput(e.target.value)}
              rows={8}
              required
            />
          </label>
        </div>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Computing…' : 'Compute Δ'}
        </button>
        {error && <p className={styles.error}>❗ {error}</p>}
      </form>

      {response && (
        <div className={styles.results}>
          <div className={styles.header}>
            <h3>Changes</h3>
            <button className={styles.exportBtn} onClick={download}>
              📥 Export JSON
            </button>
          </div>
          <ul className={styles.deltaList}>
            {response.deltas.map((d: DeltaEntry, idx) => (
              <li key={idx} className={styles.deltaItem}>
                <strong>{d.metric} {d.change_indicator}</strong>
                <div className={styles.values}>
                  <span>Prev: {d.previous ?? '—'}</span>
                  <span>Curr: {d.current ?? '—'}</span>
                </div>
                <small className={styles.meta}>
                  {new Date(d.timestamp).toLocaleTimeString()} | source: {d.source ?? '—'}
                </small>
                {d.reason && <p className={styles.reason}>Reason: {d.reason}</p>}
              </li>
            ))}
          </ul>
          {response.summary && (
            <blockquote className={styles.summary}>"{response.summary}"</blockquote>
          )}
        </div>
      )}
    </section>
  );
};

export default StateChangePanel;
