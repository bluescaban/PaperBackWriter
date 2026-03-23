import { useState } from 'react';
import styles from './SourceInput.module.css';

interface Props {
  docUrl: string;
  onUrlChange: (url: string) => void;
  onLoadUrl: (url: string) => void;
  onLoadFile: (file: File) => void;
  loading: boolean;
}

export function SourceInput({ docUrl, onUrlChange, onLoadUrl, onLoadFile, loading }: Props) {
  const [mode, setMode] = useState<'url' | 'file'>('url');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onLoadFile(file);
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>1. Source Document</h2>

      <div className={styles.tabs}>
        <button
          className={mode === 'url' ? styles.tabActive : styles.tab}
          onClick={() => setMode('url')}
        >
          URL
        </button>
        <button
          className={mode === 'file' ? styles.tabActive : styles.tab}
          onClick={() => setMode('file')}
        >
          Upload File
        </button>
      </div>

      {mode === 'url' ? (
        <div className={styles.row}>
          <input
            className={styles.input}
            type="url"
            placeholder="https://example.com/document.docx"
            value={docUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={loading}
          />
          <button
            className={styles.button}
            onClick={() => onLoadUrl(docUrl)}
            disabled={loading || !docUrl.trim()}
          >
            {loading ? 'Loading…' : 'Load'}
          </button>
        </div>
      ) : (
        <div className={styles.row}>
          <input
            className={styles.fileInput}
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            disabled={loading}
          />
          {loading && <span className={styles.hint}>Parsing…</span>}
        </div>
      )}

      <p className={styles.hint}>Accepts .docx files. The document will be parsed into sections.</p>
    </section>
  );
}
