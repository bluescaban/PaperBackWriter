import type { ParsedDocument, WriteResults } from '../../types';
import styles from './Preview.module.css';

interface Props {
  document: ParsedDocument;
  results: WriteResults | null;
}

export function Preview({ document, results }: Props) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>3. Document Preview</h2>

      <div className={styles.meta}>
        <span className={styles.badge}>{document.sections.length} sections</span>
        <strong className={styles.title}>{document.title}</strong>
      </div>

      <div className={styles.sections}>
        {document.sections.map((section) => (
          <div key={section.id} className={styles.section} style={{ '--depth': section.level } as React.CSSProperties}>
            {section.heading && (
              <p className={styles.sectionHeading}>
                {'#'.repeat(section.level || 1)} {section.heading}
              </p>
            )}
            {section.paragraphs.slice(0, 2).map((p, i) => (
              <p key={i} className={styles.paragraph}>{p}</p>
            ))}
            {section.paragraphs.length > 2 && (
              <p className={styles.more}>+{section.paragraphs.length - 2} more paragraphs…</p>
            )}
          </div>
        ))}
      </div>

      {results && (
        <div className={styles.results}>
          <h3 className={styles.resultsHeading}>Write Results</h3>
          {results.figma && (
            <div className={results.figma.success ? styles.resultOk : styles.resultErr}>
              <strong>Figma:</strong>{' '}
              {results.figma.success
                ? `Created ${results.figma.nodesCreated} nodes`
                : results.figma.errors.join(', ')}
            </div>
          )}
          {results.azureDevOps && (
            <div className={results.azureDevOps.success ? styles.resultOk : styles.resultErr}>
              <strong>Azure DevOps:</strong>{' '}
              {results.azureDevOps.success
                ? `Created ${results.azureDevOps.itemsCreated} work items`
                : results.azureDevOps.errors.join(', ')}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
