import type { AzureDevOpsConfig, AzureDevOpsWriteResult, ParsedDocument, DocumentSection } from '../types';

/**
 * Azure DevOps REST API service.
 * Docs: https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items
 */

function apiBase(config: AzureDevOpsConfig) {
  return `https://dev.azure.com/${encodeURIComponent(config.organization)}/${encodeURIComponent(config.project)}/_apis`;
}

function authHeader(config: AzureDevOpsConfig) {
  const token = btoa(`:${config.personalAccessToken}`);
  return { Authorization: `Basic ${token}` };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export async function validateAzureDevOpsConfig(
  config: AzureDevOpsConfig,
): Promise<{ valid: boolean; projectName?: string; error?: string }> {
  try {
    const res = await fetch(
      `https://dev.azure.com/${encodeURIComponent(config.organization)}/_apis/projects/${encodeURIComponent(config.project)}?api-version=7.1`,
      { headers: { ...authHeader(config), 'Content-Type': 'application/json' } },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { valid: false, error: body.message || `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { valid: true, projectName: data.name };
  } catch (err) {
    return { valid: false, error: String(err) };
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Creates work items in Azure DevOps from parsed document sections.
 * Each top-level section becomes one work item of the configured type.
 * Sub-sections can be nested as child items (future enhancement).
 */
export async function writeDocumentToAzureDevOps(
  config: AzureDevOpsConfig,
  document: ParsedDocument,
  overwrite = false,
): Promise<AzureDevOpsWriteResult> {
  const errors: string[] = [];
  let itemsCreated = 0;

  const { valid, error } = await validateAzureDevOpsConfig(config);
  if (!valid) {
    return { success: false, itemsCreated: 0, errors: [error || 'Invalid Azure DevOps config'] };
  }

  // Only top-level sections for now (level 1 headings → one work item each)
  const topLevelSections = document.sections.filter((s) => s.level <= 1);

  for (const section of topLevelSections) {
    try {
      await createWorkItem(config, section, overwrite);
      itemsCreated++;
    } catch (err) {
      errors.push(`Failed to create item "${section.heading}": ${err}`);
    }
  }

  return { success: errors.length === 0, itemsCreated, errors };
}

async function createWorkItem(
  config: AzureDevOpsConfig,
  section: DocumentSection,
  _overwrite: boolean,
): Promise<void> {
  const patchDocument = [
    { op: 'add', path: '/fields/System.Title', value: section.heading || 'Untitled' },
    { op: 'add', path: '/fields/System.Description', value: section.content },
    ...(config.areaPath
      ? [{ op: 'add', path: '/fields/System.AreaPath', value: config.areaPath }]
      : []),
  ];

  const url = `${apiBase(config)}/wit/workitems/$${encodeURIComponent(config.workItemType)}?api-version=7.1`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...authHeader(config),
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(patchDocument),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
}
