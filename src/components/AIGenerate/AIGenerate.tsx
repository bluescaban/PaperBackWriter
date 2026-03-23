import { useState, useEffect } from 'react';
import { generatePersonas } from '../../services/aiService';
import { parseDocumentFromText } from '../../services/documentParser';
import type { ParsedDocument } from '../../types';
import styles from './AIGenerate.module.css';

const API_KEY_STORAGE = 'pbw_anthropic_api_key';

interface Props {
  onGenerated: (doc: ParsedDocument) => void;
}

export function AIGenerate({ onGenerated }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [description, setDescription] = useState('');
  const [focusHint, setFocusHint] = useState('');
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist API key in localStorage
  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE);
    if (saved) setApiKey(saved);
  }, []);

  function saveKey(value: string) {
    setApiKey(value);
    if (value) localStorage.setItem(API_KEY_STORAGE, value);
    else localStorage.removeItem(API_KEY_STORAGE);
  }

  async function handleGenerate() {
    if (!apiKey.trim()) { setError('Enter your Anthropic API key first.'); return; }
    if (!description.trim()) { setError('Describe the product or context.'); return; }
    setLoading(true);
    setError(null);
    try {
      const raw = await generatePersonas(apiKey, description, count, focusHint || undefined);
      const doc = parseDocumentFromText(raw);
      onGenerated(doc);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Generate with AI</h2>
        <span className={styles.badge}>Claude</span>
      </div>

      <label className={styles.field}>
        <span>Anthropic API Key</span>
        <div className={styles.keyRow}>
          <input
            className={styles.input}
            type={showKey ? 'text' : 'password'}
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => saveKey(e.target.value)}
          />
          <button className={styles.toggleBtn} onClick={() => setShowKey((v) => !v)}>
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <span className={styles.hint}>Stored in your browser only. Never sent anywhere except Anthropic.</span>
      </label>

      <label className={styles.field}>
        <span>Product / Context</span>
        <textarea
          className={styles.textarea}
          placeholder="e.g. A karaoke feature inside Spotify that lets users sing along solo or with friends"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <label className={styles.field}>
        <span>User types to focus on <small>(optional)</small></span>
        <input
          className={styles.input}
          placeholder="e.g. casual listener, power user, first-time user"
          value={focusHint}
          onChange={(e) => setFocusHint(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Number of personas: <strong>{count}</strong></span>
        <input
          className={styles.range}
          type="range"
          min={1}
          max={4}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <div className={styles.rangeLabels}><span>1</span><span>4</span></div>
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating…' : `Generate ${count} Persona${count > 1 ? 's' : ''}`}
      </button>
    </section>
  );
}
