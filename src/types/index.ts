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

// ─── Templates ───────────────────────────────────────────────────────────────

export type TemplateType = 'project-summary' | 'persona-cards';

export interface TemplateDef {
  id: TemplateType;
  label: string;
  description: string;
  docHint: string;
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'project-summary',
    label: 'Project Summary',
    description: 'Visualizes goals, personas, requirements, user flows, and more as a color-coded blueprint.',
    docHint: 'Document should have ALL-CAPS section headers: CONTEXT, PERSONAS, GOALS, REQUIREMENTS, USER FLOW NOTES, EDGE CASES, OPEN QUESTIONS.',
  },
  {
    id: 'persona-cards',
    label: 'Persona Cards',
    description: 'Generates a two-part persona card for each persona: a behavioral profile and a user profile.',
    docHint: 'Each persona starts with an ALL-CAPS name heading. Sub-sections: INTENT, MY GOALS, MY UX HABITS, HOW I USE TOOLS, WHAT BRINGS ME HERE, RISK TOLERANCE, WHAT FRUSTRATES ME, I DONT WANT TO, NAME, AGE, OCCUPATION, CHARACTERISTICS, QUOTE, MOTIVATIONS, GOALS, FRUSTRATIONS.',
  },
];

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
