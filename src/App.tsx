import { useAppStore } from './store/appStore';
import { SourceInput } from './components/SourceInput/SourceInput';
import { TargetSelector } from './components/TargetSelector/TargetSelector';
import { TemplateSelector } from './components/TemplateSelector/TemplateSelector';
import { AIGenerate } from './components/AIGenerate/AIGenerate';
import { FigmaConfig } from './components/FigmaConfig/FigmaConfig';
import { AzureDevOpsConfig } from './components/AzureDevOpsConfig/AzureDevOpsConfig';
import { Preview } from './components/Preview/Preview';
import styles from './App.module.css';

export default function App() {
  const store = useAppStore();

  const isLoading = store.status === 'loading-doc';
  const isWriting = store.status === 'writing';
  const hasDoc = store.document !== null;
  const anyTargetSelected = store.targets.figma || store.targets.azureDevOps;
  const canWrite = hasDoc && anyTargetSelected && !isWriting;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>PaperBackWriter</h1>
        <p className={styles.tagline}>Turn documents into Figma designs &amp; Azure DevOps work items</p>
      </header>

      <main className={styles.main}>
        {/* Left column: source + targets + config */}
        <div className={styles.sidebar}>
          <SourceInput
            docUrl={store.docUrl}
            onUrlChange={store.setDocUrl}
            onLoadUrl={store.loadFromUrl}
            onLoadFile={store.loadFromFile}
            loading={isLoading}
          />

          <TargetSelector
            targets={store.targets}
            onChange={store.setTargets}
            overwrite={store.overwrite}
            onOverwriteChange={store.setOverwrite}
          />

          {store.targets.figma && (
            <TemplateSelector value={store.template} onChange={store.setTemplate} />
          )}

          {store.targets.figma && store.template === 'persona-cards' && (
            <AIGenerate
              sourceDocument={store.document}
              onGenerated={store.loadFromGeneratedText}
            />
          )}

          {store.targets.figma && (
            <FigmaConfig config={store.figmaConfig} onChange={store.setFigmaConfig} />
          )}

          {store.targets.azureDevOps && (
            <AzureDevOpsConfig config={store.azureConfig} onChange={store.setAzureConfig} />
          )}

          <div className={styles.actions}>
            <button
              className={styles.writeButton}
              onClick={store.write}
              disabled={!canWrite}
            >
              {isWriting ? 'Writing…' : 'Write to Targets'}
            </button>

            {hasDoc && (
              <button className={styles.resetButton} onClick={store.reset}>
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Right column: document preview + results */}
        <div className={styles.content}>
          {store.error && (
            <div className={styles.errorBanner}>
              {store.error}
            </div>
          )}

          {hasDoc ? (
            <Preview document={store.document!} results={store.results} />
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📄</div>
              <p>Load a Word document to get started.</p>
              <p className={styles.emptyHint}>
                The document will be parsed into sections, which you can then push to Figma,
                Azure DevOps, or both.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
