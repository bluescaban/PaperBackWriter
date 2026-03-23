import { useState, useEffect } from 'react';
import {
  generatePersonasFromDocument,
  getApiKey,
  getEnvProvider,
  saveApiKeyOverride,
  type AIProvider,
} from '../../services/aiService';
import { parseDocumentFromText } from '../../services/documentParser';
import type { ParsedDocument } from '../../types';
import styles from './AIGenerate.module.css';

interface Props {
  sourceDocument: ParsedDocument | null;
  onGenerated: (doc: ParsedDocument) => void;
}

export function AIGenerate({ sourceDocument, onGenerated }: Props) {
  const [provider, setProvider] = useState<AIProvider>('anthropic');
  const [keyOverride, setKeyOverride] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const envProvider = getEnvProvider();
  const keyFromEnv = envProvider === provider;

  useEffect(() => {
    if (!keyFromEnv) {
      const saved = getApiKey(provider);
      setKeyOverride(saved);
    } else {
      setKeyOverride('');
    }
  }, [provider, keyFromEnv]);

  function handleKeySave(value: string) {
    setKeyOverride(value);
    saveApiKeyOverride(provider, value);
  }

  async function handleGenerate() {
    if (!sourceDocument) { setError('Load a document first.'); return; }
    setLoading(true);
    setError(null);
    try {
      const raw = await generatePersonasFromDocument(
        sourceDocument.rawText,
        count,
        provider,
        keyFromEnv ? undefined : keyOverride || undefined,
      );
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
        <h2 className={styles.heading}>Generate Personas with AI</h2>
        <span className={styles.badge}>{provider === 'anthropic' ? 'Claude' : 'ChatGPT'}</span>
      </div>

      <p className={styles.description}>
        AI reads your uploaded document and generates structured persona cards from its content.
      </p>

      {/* Provider toggle */}
      <label className={styles.field}>
        <span>AI Provider</span>
        <div className={styles.providerRow}>
          <button
            className={`${styles.providerBtn} ${provider === 'anthropic' ? styles.providerActive : ''}`}
            onClick={() => setProvider('anthropic')}
          >
            Anthropic (Claude)
          </button>
          <button
            className={`${styles.providerBtn} ${provider === 'openai' ? styles.providerActive : ''}`}
            onClick={() => setProvider('openai')}
          >
            OpenAI (ChatGPT)
          </button>
        </div>
      </label>

      {/* API key input — only shown if not set in .env for this provider */}
      {keyFromEnv ? (
        <p className={styles.keyStatus}>
          {provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API key loaded from .env
        </p>
      ) : (
        <label className={styles.field}>
          <span>{provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API Key</span>
          <div className={styles.keyRow}>
            <input
              className={styles.input}
              type={showKey ? 'text' : 'password'}
              placeholder={provider === 'anthropic' ? 'sk-ant-… (or add to .env)' : 'sk-… (or add to .env)'}
              value={keyOverride}
              onChange={(e) => handleKeySave(e.target.value)}
            />
            <button className={styles.toggleBtn} onClick={() => setShowKey((v) => !v)}>
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
      )}

      <label className={styles.field}>
        <span>Personas to generate: <strong>{count}</strong></span>
        <input
          className={styles.range}
          type="range" min={1} max={4} value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
        <div className={styles.rangeLabels}><span>1</span><span>4</span></div>
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={loading || !sourceDocument}
      >
        {loading
          ? 'Generating…'
          : sourceDocument
            ? `Generate ${count} Persona${count > 1 ? 's' : ''} from Document`
            : 'Load a document first'}
      </button>
    </section>
  );
}
