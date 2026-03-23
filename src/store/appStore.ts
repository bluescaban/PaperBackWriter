import { useState, useCallback } from 'react';
import type {
  AppStatus,
  ParsedDocument,
  FigmaConfig,
  AzureDevOpsConfig,
  TargetSelection,
  TemplateType,
  WriteResults,
} from '../types';
import { parseDocumentFromUrl, parseDocumentFromBuffer } from '../services/documentParser';
import { writeDocumentToFigma } from '../services/figmaService';
// Note: accessToken / fileKey are no longer needed — the plugin runs inside Figma
import { writeDocumentToAzureDevOps } from '../services/azureDevOpsService';

// Default configs — populated from form inputs
const defaultFigmaConfig: FigmaConfig = {
  pageId: '',
  frameName: 'PaperBackWriter',
};

const defaultAzureConfig: AzureDevOpsConfig = {
  organization: '',
  project: '',
  personalAccessToken: '',
  workItemType: 'User Story',
  areaPath: '',
};

export function useAppStore() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [docUrl, setDocUrl] = useState('');
  const [document, setDocument] = useState<ParsedDocument | null>(null);
  const [targets, setTargets] = useState<TargetSelection>({ figma: true, azureDevOps: false });
  const [figmaConfig, setFigmaConfig] = useState<FigmaConfig>(defaultFigmaConfig);
  const [azureConfig, setAzureConfig] = useState<AzureDevOpsConfig>(defaultAzureConfig);
  const [template, setTemplate] = useState<TemplateType>('project-summary');
  const [overwrite, setOverwrite] = useState(false);
  const [results, setResults] = useState<WriteResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFromUrl = useCallback(async (url: string) => {
    setStatus('loading-doc');
    setError(null);
    setDocument(null);
    try {
      const parsed = await parseDocumentFromUrl(url);
      setDocument(parsed);
      setStatus('doc-ready');
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }, []);

  const loadFromFile = useCallback(async (file: File) => {
    setStatus('loading-doc');
    setError(null);
    setDocument(null);
    try {
      const buffer = await file.arrayBuffer();
      const parsed = await parseDocumentFromBuffer(buffer);
      setDocument(parsed);
      setStatus('doc-ready');
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }, []);

  const write = useCallback(async () => {
    if (!document) return;
    setStatus('writing');
    setResults(null);
    setError(null);

    const writeResults: WriteResults = {};

    try {
      if (targets.figma) {
        writeResults.figma = await writeDocumentToFigma(figmaConfig.pageId, figmaConfig.frameName, document, template, overwrite);
      }
      if (targets.azureDevOps) {
        writeResults.azureDevOps = await writeDocumentToAzureDevOps(azureConfig, document, overwrite);
      }
      setResults(writeResults);
      setStatus('done');
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }, [document, targets, figmaConfig, azureConfig, overwrite]);

  const reset = useCallback(() => {
    setStatus('idle');
    setDocument(null);
    setResults(null);
    setError(null);
  }, []);

  return {
    // State
    status, docUrl, document, targets, figmaConfig, azureConfig, template, overwrite, results, error,
    // Actions
    setDocUrl, setTargets, setFigmaConfig, setAzureConfig, setTemplate, setOverwrite,
    loadFromUrl, loadFromFile, write, reset,
  };
}
