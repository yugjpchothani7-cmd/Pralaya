import React, { useState } from 'react';
import { getMultilingualAdvisory, downloadJson } from '../api/client';
import type { MultilingualAdvisoryInput, AdvisoryMessage } from '../types';
import styles from './MultilingualAdvisoryPanel.module.css';

/**
 * Phase 15 UI – Multilingual Advisory Generator
 *
 * Renders a form for the structured advisory input, calls the backend,
 * displays the generated messages grouped by language and type, and provides
 * a "Copy / Export" button that downloads the full payload as JSON.
 *
 * The component follows the premium design language of PRALAYA:
 *   • Glass‑morphism card with backdrop blur
 *   • Subtle gradient borders
 *   • Smooth fade‑in transitions for result rows
 *   • Responsive layout – column on mobile, grid on larger screens
 */
const MultilingualAdvisoryPanel: React.FC = () => {
  const [payload, setPayload] = useState<MultilingualAdvisoryInput>({
    hazard: '',
    location: '',
    severity: '',
    time: new Date().toISOString(),
    recommended_action: '',
    destination: '',
    route: '',
    official_source: '',
  });

  const [messages, setMessages] = useState<AdvisoryMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPayload((prev: MultilingualAdvisoryInput) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await getMultilingualAdvisory(payload);
      setMessages(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to generate advisory');
    } finally {
      setLoading(false);
    }
  };

  const groupedByLang = messages.reduce((acc, msg) => {
    (acc[msg.language] = acc[msg.language] || []).push(msg);
    return acc;
  }, {} as Record<string, AdvisoryMessage[]>);

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Multilingual Advisory Generator</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <label className={styles.field}>
            Hazard
            <input name="hazard" value={payload.hazard} onChange={handleChange} required />
          </label>
          <label className={styles.field}>
            Location
            <input name="location" value={payload.location} onChange={handleChange} required />
          </label>
          <label className={styles.field}>
            Severity
            <input name="severity" value={payload.severity} onChange={handleChange} required />
          </label>
          <label className={styles.field}>
            Time (UTC)
            <input name="time" type="datetime-local" value={payload.time.slice(0, 16)} onChange={handleChange} required />
          </label>
          <label className={styles.field}>
            Recommended Action
            <input name="recommended_action" value={payload.recommended_action} onChange={handleChange} required />
          </label>
          <label className={styles.field}>
            Destination
            <input name="destination" value={payload.destination ?? ''} onChange={handleChange} />
          </label>
          <label className={styles.field}>
            Route
            <input name="route" value={payload.route ?? ''} onChange={handleChange} />
          </label>
          <label className={styles.field}>
            Official Source
            <input name="official_source" value={payload.official_source} onChange={handleChange} required />
          </label>
        </div>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Generating…' : 'Generate Advisory'}
        </button>
        {error && <p className={styles.error}>❗ {error}</p>}
      </form>

      {messages.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h3>Generated Messages</h3>
            <button className={styles.exportBtn} onClick={() => downloadJson(messages)}>
              📥 Export JSON
            </button>
          </div>
          {Object.entries(groupedByLang).map(([lang, msgs]) => (
            <details key={lang} className={styles.langSection} open>
              <summary className={styles.langHeader}>Language: {lang.toUpperCase()}</summary>
              <ul className={styles.msgList}>
                {(msgs as AdvisoryMessage[]).map((msg: AdvisoryMessage, idx: number) => (
                  <li key={idx} className={styles.msgItem}>
                    <strong>{msg.message_type.replace('_', ' ')}</strong>
                    <pre className={styles.msgContent}>{msg.content}</pre>
                    <span className={styles.meta}>
                      Generated {new Date(msg.timestamp).toLocaleTimeString()} –
                      Consistency: {msg.consistency_ok ? '✅' : '⚠️'}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </section>
  );
};

export default MultilingualAdvisoryPanel;
