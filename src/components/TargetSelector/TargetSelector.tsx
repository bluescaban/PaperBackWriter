import type { TargetSelection } from '../../types';
import styles from './TargetSelector.module.css';

interface Props {
  targets: TargetSelection;
  onChange: (targets: TargetSelection) => void;
  overwrite: boolean;
  onOverwriteChange: (v: boolean) => void;
}

export function TargetSelector({ targets, onChange, overwrite, onOverwriteChange }: Props) {
  function toggle(key: keyof TargetSelection) {
    onChange({ ...targets, [key]: !targets[key] });
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>2. Targets</h2>

      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="checkbox"
            checked={targets.figma}
            onChange={() => toggle('figma')}
          />
          <span className={styles.label}>
            <strong>Figma</strong>
            <span>Generate frames &amp; text nodes in a Figma file</span>
          </span>
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            checked={targets.azureDevOps}
            onChange={() => toggle('azureDevOps')}
          />
          <span className={styles.label}>
            <strong>Azure DevOps</strong>
            <span>Create work items in an Azure DevOps project</span>
          </span>
        </label>
      </div>

      <div className={styles.divider} />

      <label className={styles.overwrite}>
        <input
          type="checkbox"
          checked={overwrite}
          onChange={(e) => onOverwriteChange(e.target.checked)}
        />
        <span>
          <strong>Overwrite existing</strong>
          <span className={styles.hint}> — replace items from a previous run instead of appending</span>
        </span>
      </label>
    </section>
  );
}
