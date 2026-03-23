import type { FigmaConfig as FigmaConfigType } from '../../types';
import { useFigmaPlugin } from '../../hooks/useFigmaPlugin';
import styles from './FigmaConfig.module.css';

interface Props {
  config: FigmaConfigType;
  onChange: (config: FigmaConfigType) => void;
}

export function FigmaConfig({ config, onChange }: Props) {
  const plugin = useFigmaPlugin();

  function set<K extends keyof FigmaConfigType>(key: K, value: FigmaConfigType[K]) {
    onChange({ ...config, [key]: value });
  }

  return (
    <section className={styles.card}>
      <h3 className={styles.heading}>Figma Settings</h3>

      {/* Plugin context — auto-connected */}
      {plugin.inPluginContext ? (
        <div className={styles.pluginStatus}>
          {plugin.connected ? (
            <span className={styles.ok}>Connected to &ldquo;{plugin.fileName}&rdquo;</span>
          ) : (
            <span className={styles.hint}>Waiting for plugin connection…</span>
          )}
          <button className={styles.refreshBtn} onClick={plugin.refresh}>Refresh</button>
        </div>
      ) : (
        <p className={styles.notice}>
          Open this app inside the <strong>PaperBackWriter</strong> Figma plugin to enable writing to Figma.
        </p>
      )}

      {/* Target page selector */}
      {plugin.pages.length > 0 && (
        <label className={styles.field}>
          <span>Target Page</span>
          <select
            className={styles.input}
            value={config.pageId}
            onChange={(e) => set('pageId', e.target.value)}
          >
            <option value="">Current page</option>
            {plugin.pages.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
      )}

      {/* Frame name */}
      <label className={styles.field}>
        <span>Root Frame Name</span>
        <input
          className={styles.input}
          placeholder="PaperBackWriter"
          value={config.frameName}
          onChange={(e) => set('frameName', e.target.value)}
        />
      </label>
    </section>
  );
}
