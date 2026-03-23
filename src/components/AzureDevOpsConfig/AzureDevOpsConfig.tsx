import { useState } from 'react';
import type { AzureDevOpsConfig as AzureConfigType } from '../../types';
import { validateAzureDevOpsConfig } from '../../services/azureDevOpsService';
import styles from './AzureDevOpsConfig.module.css';

const WORK_ITEM_TYPES: AzureConfigType['workItemType'][] = [
  'Epic', 'Feature', 'User Story', 'Task',
];

interface Props {
  config: AzureConfigType;
  onChange: (config: AzureConfigType) => void;
}

export function AzureDevOpsConfig({ config, onChange }: Props) {
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<{ ok?: boolean; msg?: string } | null>(null);

  function set<K extends keyof AzureConfigType>(key: K, value: AzureConfigType[K]) {
    onChange({ ...config, [key]: value });
    setValidation(null);
  }

  async function validate() {
    setValidating(true);
    setValidation(null);
    const result = await validateAzureDevOpsConfig(config);
    setValidation(result.valid
      ? { ok: true, msg: `Connected: "${result.projectName}"` }
      : { ok: false, msg: result.error });
    setValidating(false);
  }

  return (
    <section className={styles.card}>
      <h3 className={styles.heading}>Azure DevOps Settings</h3>

      <label className={styles.field}>
        <span>Organization</span>
        <input
          className={styles.input}
          placeholder="my-org"
          value={config.organization}
          onChange={(e) => set('organization', e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Project</span>
        <input
          className={styles.input}
          placeholder="my-project"
          value={config.project}
          onChange={(e) => set('project', e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Personal Access Token</span>
        <input
          type="password"
          className={styles.input}
          placeholder="PAT with Work Items (read/write) scope"
          value={config.personalAccessToken}
          onChange={(e) => set('personalAccessToken', e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Work Item Type</span>
        <select
          className={styles.input}
          value={config.workItemType}
          onChange={(e) => set('workItemType', e.target.value as AzureConfigType['workItemType'])}
        >
          {WORK_ITEM_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Area Path <small>(optional)</small></span>
        <input
          className={styles.input}
          placeholder="my-project\\Team A"
          value={config.areaPath}
          onChange={(e) => set('areaPath', e.target.value)}
        />
      </label>

      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={validate}
          disabled={validating || !config.organization || !config.project || !config.personalAccessToken}
        >
          {validating ? 'Checking…' : 'Validate Connection'}
        </button>
        {validation && (
          <span className={validation.ok ? styles.ok : styles.err}>{validation.msg}</span>
        )}
      </div>
    </section>
  );
}
