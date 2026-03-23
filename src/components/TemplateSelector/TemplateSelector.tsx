import type { TemplateType } from '../../types';
import { TEMPLATES } from '../../types';
import styles from './TemplateSelector.module.css';

interface Props {
  value: TemplateType;
  onChange: (t: TemplateType) => void;
}

export function TemplateSelector({ value, onChange }: Props) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>3. Template</h2>
      <div className={styles.options}>
        {TEMPLATES.map((t) => (
          <label
            key={t.id}
            className={value === t.id ? styles.optionActive : styles.option}
          >
            <input
              type="radio"
              name="template"
              value={t.id}
              checked={value === t.id}
              onChange={() => onChange(t.id)}
            />
            <div className={styles.optionBody}>
              <strong>{t.label}</strong>
              <span>{t.description}</span>
              {value === t.id && (
                <p className={styles.hint}>{t.docHint}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
