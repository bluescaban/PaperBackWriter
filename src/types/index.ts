// ─── Document ────────────────────────────────────────────────────────────────

export interface ParsedDocument {
  title: string;
  sections: DocumentSection[];
  rawText: string;
}

export interface DocumentSection {
  id: string;
  heading: string;
  level: number; // 1 = H1, 2 = H2, etc.
  content: string;
  paragraphs: string[];
}

// ─── Targets ─────────────────────────────────────────────────────────────────

export type Target = 'figma' | 'azure-devops';

export interface TargetSelection {
  figma: boolean;
  azureDevOps: boolean;
}

// ─── Figma ────────────────────────────────────────────────────────────────────

export interface FigmaConfig {
  pageId?: string;    // optional: target a specific page (populated from plugin)
  frameName?: string; // optional: name for the root frame
}

export interface FigmaWriteResult {
  success: boolean;
  nodesCreated: number;
  errors: string[];
}

// ─── Azure DevOps ─────────────────────────────────────────────────────────────

export interface AzureDevOpsConfig {
  organization: string;
  project: string;
  personalAccessToken: string;
  workItemType: 'Epic' | 'Feature' | 'User Story' | 'Task';
  areaPath?: string;
}

export interface AzureDevOpsWriteResult {
  success: boolean;
  itemsCreated: number;
  errors: string[];
}

// ─── App State ────────────────────────────────────────────────────────────────

export type AppStatus =
  | 'idle'
  | 'loading-doc'
  | 'doc-ready'
  | 'writing'
  | 'done'
  | 'error';

export interface WriteResults {
  figma?: FigmaWriteResult;
  azureDevOps?: AzureDevOpsWriteResult;
}
