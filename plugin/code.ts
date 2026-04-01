/// <reference types="@figma/plugin-typings" />

// ─── Shared types ─────────────────────────────────────────────────────────────

interface DocumentSection {
  id: string;
  heading: string;
  level: number;
  content: string;
  paragraphs: string[];
}

interface ParsedDocument {
  title: string;
  sections: DocumentSection[];
}

type TemplateType = 'project-summary' | 'persona-cards';

type IncomingMessage =
  | { type: 'OPEN_UI' }
  | { type: 'VALIDATE_FILE' }
  | { type: 'GET_PAGES' }
  | { type: 'WRITE_DOCUMENT'; document: ParsedDocument; pageId?: string; frameName?: string; template?: TemplateType; overwrite?: boolean }
  | { type: 'CLOSE' };

type OutgoingMessage =
  | { type: 'VALIDATED'; fileName: string; fileKey: string; pages: Array<{ id: string; name: string }> }
  | { type: 'PAGES'; pages: Array<{ id: string; name: string }> }
  | { type: 'WRITE_SUCCESS'; nodesCreated: number }
  | { type: 'WRITE_ERROR'; error: string };

// ─── Persona types ────────────────────────────────────────────────────────────

interface PersonaData {
  // Part 1 — Behavioral profile
  name: string;
  intent: string;
  behavioralGoals: string[];
  uxHabits: string[];
  toolUsage: string[];
  bringsHere: string[];
  riskTolerance: string;
  frustrations: string[];
  dontWant: string[];
  // Part 2 — User profile
  profileName: string;
  age: string;
  occupation: string;
  characteristics: string[];
  quote: string;
  motivations: string;
  profileGoals: string[];
  profileFrustrations: string[];
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  canvasBg:   { r: 0.08, g: 0.08, b: 0.10 },
  headerBg:   { r: 0.11, g: 0.11, b: 0.15 },
  legendBg:   { r: 0.13, g: 0.13, b: 0.17 },
  white:      { r: 1.00, g: 1.00, b: 1.00 },
  bodyText:   { r: 0.18, g: 0.18, b: 0.22 },
  mutedText:  { r: 0.50, g: 0.50, b: 0.55 },
  lightText:  { r: 1.00, g: 1.00, b: 1.00 },
  divider:    { r: 0.88, g: 0.88, b: 0.91 },
  colBg:      { r: 0.96, g: 0.96, b: 0.98 },
};

interface SectionDef {
  type: string;
  label: string;
  code: string;
  fullName: string;
  color: RGB;
}

const SECTIONS: SectionDef[] = [
  { type: 'CONTEXT',        label: 'Context',       code: 'CTX', fullName: 'Project Context',  color: { r: 0.13, g: 0.35, b: 0.80 } },
  { type: 'PERSONAS',       label: 'Personas',       code: 'P',   fullName: 'User Persona',     color: { r: 0.45, g: 0.18, b: 0.75 } },
  { type: 'GOALS',          label: 'Goals',          code: 'G',   fullName: 'Product Goal',     color: { r: 0.07, g: 0.52, b: 0.35 } },
  { type: 'REQUIREMENTS',   label: 'Requirements',   code: 'R',   fullName: 'Requirement',      color: { r: 0.75, g: 0.38, b: 0.08 } },
  { type: 'USER_FLOW',      label: 'User Flow',      code: 'S',   fullName: 'Flow Step',        color: { r: 0.07, g: 0.48, b: 0.58 } },
  { type: 'EDGE_CASES',     label: 'Edge Cases',     code: 'E',   fullName: 'Edge Case',        color: { r: 0.72, g: 0.16, b: 0.22 } },
  { type: 'OPEN_QUESTIONS', label: 'Open Questions', code: 'Q',   fullName: 'Open Question',    color: { r: 0.58, g: 0.40, b: 0.05 } },
];

const SECTION_MAP = new Map(SECTIONS.map((s) => [s.type, s]));

const COLUMN_W   = 300;
const COLUMN_GAP = 20;
const H_PADDING  = 48;
const NUM_COLS   = SECTIONS.length;
const ROOT_W     = H_PADDING * 2 + COLUMN_W * NUM_COLS + COLUMN_GAP * (NUM_COLS - 1);

// Persona card dimensions
const P1_W = 580;
const P2_W = 380;
const P_GAP = 28;
const PERSONA_ROOT_W = H_PADDING * 2 + P1_W + P_GAP + P2_W;

// ── Glass morphism pastel palette ──────────────────────────────────────────────
const G = {
  // Canvas
  canvas:       { r: 0.90, g: 0.94, b: 0.99 }, // soft sky blue

  // Glass card
  cardFill:     { r: 1.00, g: 1.00, b: 1.00 }, // white @ 0.82 opacity
  cardBorder:   { r: 1.00, g: 1.00, b: 1.00 }, // white @ 0.55 opacity

  // Tinted section blocks
  headerTint:   { r: 0.84, g: 0.92, b: 1.00 }, // pastel blue
  intentTint:   { r: 0.93, g: 0.97, b: 1.00 }, // near-white ice blue
  quoteTint:    { r: 0.90, g: 0.95, b: 1.00 }, // soft sky
  profileTint:  { r: 0.91, g: 0.96, b: 1.00 }, // pale blue

  // Divider
  divider:      { r: 0.72, g: 0.84, b: 0.96 }, // blue divider

  // Text
  heading:      { r: 0.08, g: 0.16, b: 0.32 }, // deep navy
  body:         { r: 0.24, g: 0.36, b: 0.54 }, // medium blue-gray
  label:        { r: 0.30, g: 0.50, b: 0.76 }, // soft blue label
  muted:        { r: 0.52, g: 0.66, b: 0.82 }, // muted steel blue
  white:        { r: 1.00, g: 1.00, b: 1.00 },

  // Accent
  accent:       { r: 0.18, g: 0.46, b: 0.88 }, // vivid blue
  accentPastel: { r: 0.60, g: 0.78, b: 0.98 }, // light pastel blue
  accentPill:   { r: 0.88, g: 0.94, b: 1.00 }, // pill background
  riskActive:   { r: 0.18, g: 0.46, b: 0.88 }, // active risk pill
  riskInactive: { r: 0.88, g: 0.93, b: 0.98 }, // inactive risk pill
};

// ─── Plugin entry ─────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 960, height: 680, title: 'PaperBackWriter' });
sendToUI({ type: 'VALIDATED', fileName: figma.root.name, fileKey: '', pages: getPages() });

figma.ui.onmessage = async (msg: IncomingMessage) => {
  switch (msg.type) {
    case 'VALIDATE_FILE':
      sendToUI({ type: 'VALIDATED', fileName: figma.root.name, fileKey: '', pages: getPages() });
      break;
    case 'GET_PAGES':
      sendToUI({ type: 'PAGES', pages: getPages() });
      break;
    case 'WRITE_DOCUMENT':
      await handleWrite(msg);
      break;
    case 'CLOSE':
      figma.closePlugin();
      break;
  }
};

// ─── Write router ─────────────────────────────────────────────────────────────

async function handleWrite(msg: Extract<IncomingMessage, { type: 'WRITE_DOCUMENT' }>) {
  try {
    const { document, pageId, frameName, template, overwrite } = msg;

    const targetPage = pageId
      ? figma.root.children.find((p) => p.id === pageId) ?? figma.currentPage
      : figma.currentPage;
    if (targetPage.type !== 'PAGE') throw new Error('Target is not a page');
    await figma.setCurrentPageAsync(targetPage);

    const rootName = frameName || 'PaperBackWriter';
    if (overwrite) {
      targetPage.children
        .filter((n) => n.type === 'FRAME' && n.name === rootName)
        .forEach((n) => n.remove());
    }

    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Italic' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

    if (template === 'persona-cards') {
      await writePersonaCards(document, rootName);
    } else {
      await writeProjectSummary(document, rootName);
    }
  } catch (err) {
    sendToUI({ type: 'WRITE_ERROR', error: String(err) });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT SUMMARY template
// ═══════════════════════════════════════════════════════════════════════════════

async function writeProjectSummary(document: ParsedDocument, rootName: string) {
  const contentSections = document.sections.filter((s) => s.paragraphs.length > 0);
  const sectionCount = contentSections.length || 1;
  const innerW = COLUMN_W * sectionCount + COLUMN_GAP * (sectionCount - 1);
  const actualRootW = H_PADDING * 2 + innerW;

  const root = makeFrame('VERTICAL', actualRootW);
  root.name = rootName;
  root.primaryAxisSizingMode = 'AUTO';
  root.paddingBottom = 48;
  root.fills = [{ type: 'SOLID', color: C.canvasBg }];
  root.cornerRadius = 16;
  root.clipsContent = true;

  const titleHeader = buildTitleHeader(document.title);
  root.appendChild(titleHeader);
  titleHeader.layoutSizingHorizontal = 'FILL';

  const legendStrip = buildLegend();
  root.appendChild(legendStrip);
  legendStrip.layoutSizingHorizontal = 'FILL';

  const columnsRow = makeFrame('HORIZONTAL', actualRootW);
  columnsRow.name = '_columns';
  columnsRow.primaryAxisSizingMode = 'FIXED';
  columnsRow.counterAxisSizingMode = 'AUTO';
  columnsRow.counterAxisAlignItems = 'MIN';
  columnsRow.itemSpacing = COLUMN_GAP;
  columnsRow.paddingLeft = H_PADDING;
  columnsRow.paddingRight = H_PADDING;
  columnsRow.paddingTop = 32;
  columnsRow.paddingBottom = 32;
  columnsRow.fills = [];
  root.appendChild(columnsRow);
  columnsRow.layoutSizingHorizontal = 'FILL';

  let nodesCreated = 0;
  for (const section of contentSections) {
    const col = buildColumn(section);
    columnsRow.appendChild(col);
    nodesCreated++;
  }

  root.x = 100;
  root.y = 100;
  figma.viewport.scrollAndZoomIntoView([root]);
  sendToUI({ type: 'WRITE_SUCCESS', nodesCreated });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONA CARDS template
// ═══════════════════════════════════════════════════════════════════════════════

async function writePersonaCards(document: ParsedDocument, rootName: string) {
  const personas = groupPersonaSections(document.sections);
  if (personas.length === 0) {
    sendToUI({ type: 'WRITE_ERROR', error: 'No personas found. Make sure each persona starts with an ALL-CAPS heading.' });
    return;
  }

  const root = makeFrame('VERTICAL', PERSONA_ROOT_W);
  root.name = rootName;
  root.primaryAxisSizingMode = 'AUTO';
  root.paddingLeft = H_PADDING;
  root.paddingRight = H_PADDING;
  root.paddingTop = 0;
  root.paddingBottom = 48;
  root.itemSpacing = 32;
  root.fills = [{ type: 'SOLID', color: C.canvasBg }];
  root.cornerRadius = 16;
  root.clipsContent = true;

  // Title header
  const titleHeader = buildTitleHeader(document.title);
  root.appendChild(titleHeader);
  titleHeader.layoutSizingHorizontal = 'FILL';
  // Remove horizontal padding from title since root has it
  titleHeader.paddingLeft = 0;
  titleHeader.paddingRight = 0;

  // One row per persona
  for (const persona of personas) {
    const row = makeFrame('HORIZONTAL', PERSONA_ROOT_W - H_PADDING * 2);
    row.name = persona.name;
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.counterAxisAlignItems = 'MIN';
    row.itemSpacing = P_GAP;
    row.fills = [];

    row.appendChild(buildPart1Card(persona));
    row.appendChild(buildPart2Card(persona));

    root.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
  }

  root.x = 100;
  root.y = 100;
  figma.viewport.scrollAndZoomIntoView([root]);
  sendToUI({ type: 'WRITE_SUCCESS', nodesCreated: personas.length * 2 });
}

// ─── Persona grouping ─────────────────────────────────────────────────────────

const PERSONA_SUBSECTIONS = new Set([
  'INTENT', 'MY GOALS', 'MY UX HABITS', 'HOW I USE TOOLS',
  'WHAT BRINGS ME HERE', 'RISK TOLERANCE', 'WHAT FRUSTRATES ME',
  'I DONT WANT TO', "I DON'T WANT TO", 'I DON\'T WANT TO',
  'NAME', 'AGE', 'OCCUPATION', 'CHARACTERISTICS',
  'QUOTE', 'MOTIVATIONS', 'GOALS', 'FRUSTRATIONS',
]);

function blankPersona(name: string): PersonaData {
  return {
    name, intent: '', behavioralGoals: [], uxHabits: [], toolUsage: [],
    bringsHere: [], riskTolerance: 'Medium', frustrations: [], dontWant: [],
    profileName: name, age: '', occupation: '', characteristics: [],
    quote: '', motivations: '', profileGoals: [], profileFrustrations: [],
  };
}

function groupPersonaSections(sections: DocumentSection[]): PersonaData[] {
  const personas: PersonaData[] = [];
  let current: PersonaData | null = null;

  for (const section of sections) {
    const h = section.heading.toUpperCase().trim()
      .replace(/'/g, "'").replace(/'/g, "'");

    if (!PERSONA_SUBSECTIONS.has(h)) {
      if (current) personas.push(current);
      current = blankPersona(section.heading);
      continue;
    }

    if (!current) continue;

    const lines = section.paragraphs.filter((p) => p.trim());

    switch (h) {
      case 'INTENT':              current.intent = lines.join(' '); break;
      case 'MY GOALS':            current.behavioralGoals = lines; break;
      case 'MY UX HABITS':        current.uxHabits = lines; break;
      case 'HOW I USE TOOLS':     current.toolUsage = lines; break;
      case 'WHAT BRINGS ME HERE': current.bringsHere = lines; break;
      case 'RISK TOLERANCE':      current.riskTolerance = lines[0] || 'Medium'; break;
      case 'WHAT FRUSTRATES ME':  current.frustrations = lines; break;
      case 'I DONT WANT TO':
      case "I DON'T WANT TO":     current.dontWant = lines; break;
      case 'NAME':                current.profileName = lines[0] || current.name; break;
      case 'AGE':                 current.age = lines[0] || ''; break;
      case 'OCCUPATION':          current.occupation = lines[0] || ''; break;
      case 'CHARACTERISTICS':
        current.characteristics = lines.length === 1
          ? lines[0].split(/[,·•]+/).map((s) => s.trim()).filter(Boolean)
          : lines;
        break;
      case 'QUOTE':               current.quote = lines[0] || ''; break;
      case 'MOTIVATIONS':         current.motivations = lines.join(' '); break;
      case 'GOALS':               current.profileGoals = lines; break;
      case 'FRUSTRATIONS':        current.profileFrustrations = lines; break;
    }
  }

  if (current) personas.push(current);
  return personas;
}

// ─── Part 1: Behavioral profile card ─────────────────────────────────────────

function buildPart1Card(p: PersonaData): FrameNode {
  const card = makeFrame('VERTICAL', P1_W);
  card.name = `${p.name} — Behavioral Profile`;
  card.primaryAxisSizingMode = 'AUTO';
  card.cornerRadius = 12;
  card.clipsContent = true;
  card.fills = [{ type: 'SOLID', color: C.white }];
  card.strokes = [{ type: 'SOLID', color: C.divider }];
  card.strokeWeight = 1;

  // ── Header ──────────────────────────────────────────────────────────────────
  const header = makeFrame('VERTICAL', P1_W);
  header.primaryAxisSizingMode = 'AUTO';
  header.paddingLeft = 24;
  header.paddingRight = 24;
  header.paddingTop = 24;
  header.paddingBottom = 20;
  header.itemSpacing = 6;
  header.fills = [{ type: 'SOLID', color: G.headerTint }];

  const eyebrow = txt('BEHAVIORAL PROFILE', 9, 'Bold', G.label);
  eyebrow.letterSpacing = { value: 2, unit: 'PIXELS' };
  header.appendChild(eyebrow);
  eyebrow.layoutSizingHorizontal = 'FILL';

  const nameNode = txt(p.name, 22, 'Bold', G.heading);
  header.appendChild(nameNode);
  nameNode.layoutSizingHorizontal = 'FILL';

  card.appendChild(header);
  header.layoutSizingHorizontal = 'FILL';

  // ── Intent ───────────────────────────────────────────────────────────────────
  if (p.intent) {
    const intentBlock = makeFrame('VERTICAL', P1_W);
    intentBlock.primaryAxisSizingMode = 'AUTO';
    intentBlock.paddingLeft = 24;
    intentBlock.paddingRight = 24;
    intentBlock.paddingTop = 16;
    intentBlock.paddingBottom = 16;
    intentBlock.itemSpacing = 4;
    intentBlock.fills = [{ type: 'SOLID', color: G.intentTint }];

    const intentLabel = txt('PERSONA INTENT', 9, 'Bold', G.accent);
    intentLabel.letterSpacing = { value: 1.5, unit: 'PIXELS' };
    intentBlock.appendChild(intentLabel);
    intentLabel.layoutSizingHorizontal = 'FILL';

    const intentText = txt(`"${p.intent}"`, 14, 'Italic', G.body);
    intentText.lineHeight = { value: 155, unit: 'PERCENT' };
    intentBlock.appendChild(intentText);
    intentText.layoutSizingHorizontal = 'FILL';

    card.appendChild(intentBlock);
    intentBlock.layoutSizingHorizontal = 'FILL';
  }

  // ── Body sections ─────────────────────────────────────────────────────────
  const body = makeFrame('VERTICAL', P1_W);
  body.primaryAxisSizingMode = 'AUTO';
  body.paddingLeft = 24;
  body.paddingRight = 24;
  body.paddingTop = 20;
  body.paddingBottom = 24;
  body.itemSpacing = 16;
  body.fills = [];
  card.appendChild(body);
  body.layoutSizingHorizontal = 'FILL';

  // Row 1: My Goals | My UX Habits
  body.appendChild(buildBehaviorRow('MY GOALS', p.behavioralGoals, 'HOW I USE TOOLS', p.toolUsage, P1_W - 48));

  // Row 2: What Brings Me Here | My UX Habits
  body.appendChild(buildBehaviorRow('WHAT BRINGS ME HERE', p.bringsHere, 'MY UX HABITS', p.uxHabits, P1_W - 48));

  // Risk Tolerance — full width
  body.appendChild(buildRiskRow(p.riskTolerance, P1_W - 48));

  // Row 3: What Frustrates Me | I Don't Want To
  body.appendChild(buildBehaviorRow('WHAT FRUSTRATES ME', p.frustrations, "I DON'T WANT TO", p.dontWant, P1_W - 48));

  return card;
}

function buildBehaviorRow(
  leftLabel: string, leftItems: string[],
  rightLabel: string, rightItems: string[],
  width: number,
): FrameNode {
  const colW = Math.floor((width - 16) / 2);
  const row = makeFrame('HORIZONTAL', width);
  row.primaryAxisSizingMode = 'AUTO';
  row.counterAxisSizingMode = 'AUTO';
  row.counterAxisAlignItems = 'MIN';
  row.itemSpacing = 16;
  row.fills = [];

  row.appendChild(buildBehaviorCell(leftLabel, leftItems, colW));
  row.appendChild(buildBehaviorCell(rightLabel, rightItems, colW));
  return row;
}

function buildBehaviorCell(label: string, items: string[], width: number): FrameNode {
  const cell = makeFrame('VERTICAL', width);
  cell.primaryAxisSizingMode = 'AUTO';
  cell.itemSpacing = 6;
  cell.fills = [];

  const labelNode = txt(label, 9, 'Bold', G.accent);
  labelNode.letterSpacing = { value: 1.2, unit: 'PIXELS' };
  cell.appendChild(labelNode);
  labelNode.layoutSizingHorizontal = 'FILL';

  if (items.length === 0) {
    const empty = txt('—', 12, 'Regular', G.muted);
    cell.appendChild(empty);
    empty.layoutSizingHorizontal = 'FILL';
  } else {
    for (const item of items) {
      const bullet = txt('• ' + item, 12, 'Regular', G.body);
      bullet.lineHeight = { value: 148, unit: 'PERCENT' };
      cell.appendChild(bullet);
      bullet.layoutSizingHorizontal = 'FILL';
    }
  }

  return cell;
}

function buildRiskRow(level: string, width: number): FrameNode {
  const row = makeFrame('HORIZONTAL', width);
  row.primaryAxisSizingMode = 'AUTO';
  row.counterAxisSizingMode = 'AUTO';
  row.counterAxisAlignItems = 'CENTER';
  row.itemSpacing = 12;
  row.fills = [];

  const label = txt('RISK TOLERANCE', 9, 'Bold', G.accent);
  label.letterSpacing = { value: 1.2, unit: 'PIXELS' };
  row.appendChild(label);

  const levels = ['Low', 'Medium', 'High'];
  const normalized = level.trim();
  for (const l of levels) {
    const active = normalized.toLowerCase() === l.toLowerCase();
    const pill = makeFrame('HORIZONTAL', 60);
    pill.primaryAxisSizingMode = 'AUTO';
    pill.counterAxisSizingMode = 'AUTO';
    pill.paddingLeft = 10;
    pill.paddingRight = 10;
    pill.paddingTop = 4;
    pill.paddingBottom = 4;
    pill.cornerRadius = 999;
    pill.fills = active
      ? [{ type: 'SOLID', color: G.riskActive }]
      : [{ type: 'SOLID', color: G.riskInactive }];
    const pillText = txt(l, 10, active ? 'Bold' : 'Regular', active ? G.white : G.muted);
    pill.appendChild(pillText);
    row.appendChild(pill);
  }

  return row;
}

// ─── Part 2: User profile card ────────────────────────────────────────────────

function buildPart2Card(p: PersonaData): FrameNode {
  const card = makeFrame('VERTICAL', P2_W);
  card.name = `${p.name} — User Profile`;
  card.primaryAxisSizingMode = 'AUTO';
  card.cornerRadius = 12;
  card.clipsContent = true;
  card.fills = [{ type: 'SOLID', color: C.white }];
  card.strokes = [{ type: 'SOLID', color: C.divider }];
  card.strokeWeight = 1;

  // ── Profile header ───────────────────────────────────────────────────────
  const profileHeader = makeFrame('VERTICAL', P2_W);
  profileHeader.primaryAxisSizingMode = 'AUTO';
  profileHeader.paddingLeft = 20;
  profileHeader.paddingRight = 20;
  profileHeader.paddingTop = 24;
  profileHeader.paddingBottom = 20;
  profileHeader.itemSpacing = 8;
  profileHeader.fills = [{ type: 'SOLID', color: G.profileTint }];

  // Name
  const nameNode = txt(p.profileName || p.name, 20, 'Bold', G.heading);
  profileHeader.appendChild(nameNode);
  nameNode.layoutSizingHorizontal = 'FILL';

  // Age + Occupation
  const demo = [p.age, p.occupation].filter(Boolean).join('  ·  ');
  if (demo) {
    const demoNode = txt(demo, 12, 'Regular', G.body);
    profileHeader.appendChild(demoNode);
    demoNode.layoutSizingHorizontal = 'FILL';
  }

  // Characteristic pills
  if (p.characteristics.length > 0) {
    const pillRow = makeFrame('HORIZONTAL', P2_W - 40);
    pillRow.primaryAxisSizingMode = 'AUTO';
    pillRow.counterAxisSizingMode = 'AUTO';
    pillRow.layoutWrap = 'WRAP';
    pillRow.itemSpacing = 6;
    pillRow.counterAxisSpacing = 6;
    pillRow.fills = [];

    for (const trait of p.characteristics) {
      const pill = makeFrame('HORIZONTAL', 60);
      pill.primaryAxisSizingMode = 'AUTO';
      pill.counterAxisSizingMode = 'AUTO';
      pill.paddingLeft = 10;
      pill.paddingRight = 10;
      pill.paddingTop = 4;
      pill.paddingBottom = 4;
      pill.cornerRadius = 999;
      pill.fills = [{ type: 'SOLID', color: G.accentPill }];
      const t = txt(trait, 10, 'Medium', G.accent);
      pill.appendChild(t);
      pillRow.appendChild(pill);
    }

    profileHeader.appendChild(pillRow);
  }

  card.appendChild(profileHeader);
  profileHeader.layoutSizingHorizontal = 'FILL';

  // ── Body ─────────────────────────────────────────────────────────────────
  const body = makeFrame('VERTICAL', P2_W);
  body.primaryAxisSizingMode = 'AUTO';
  body.paddingLeft = 20;
  body.paddingRight = 20;
  body.paddingTop = 20;
  body.paddingBottom = 24;
  body.itemSpacing = 18;
  body.fills = [];
  card.appendChild(body);
  body.layoutSizingHorizontal = 'FILL';

  // Quote
  if (p.quote) {
    const quoteBlock = makeFrame('VERTICAL', P2_W - 40);
    quoteBlock.primaryAxisSizingMode = 'AUTO';
    quoteBlock.paddingLeft = 14;
    quoteBlock.paddingRight = 14;
    quoteBlock.paddingTop = 12;
    quoteBlock.paddingBottom = 12;
    quoteBlock.itemSpacing = 0;
    quoteBlock.cornerRadius = 6;
    quoteBlock.fills = [{ type: 'SOLID', color: G.quoteTint }];
    quoteBlock.strokes = [{ type: 'SOLID', color: G.accentPastel }];
    quoteBlock.strokeWeight = 1;

    const quoteText = txt(`"${p.quote}"`, 13, 'Italic', G.body);
    quoteText.lineHeight = { value: 155, unit: 'PERCENT' };
    quoteBlock.appendChild(quoteText);
    quoteText.layoutSizingHorizontal = 'FILL';

    body.appendChild(quoteBlock);
    quoteBlock.layoutSizingHorizontal = 'FILL';
  }

  // Motivations
  if (p.motivations) {
    body.appendChild(buildProfileSection('MOTIVATIONS', [p.motivations], false));
  }

  // Goals | Frustrations split
  const splitW = P2_W - 40;
  const colW = Math.floor((splitW - 12) / 2);

  const split = makeFrame('HORIZONTAL', splitW);
  split.primaryAxisSizingMode = 'AUTO';
  split.counterAxisSizingMode = 'AUTO';
  split.counterAxisAlignItems = 'MIN';
  split.itemSpacing = 12;
  split.fills = [];
  body.appendChild(split);
  split.layoutSizingHorizontal = 'FILL';

  split.appendChild(buildProfileSection('GOALS', p.profileGoals, true, colW));
  split.appendChild(buildProfileSection('FRUSTRATIONS', p.profileFrustrations, true, colW));

  return card;
}

function buildProfileSection(label: string, items: string[], bullets: boolean, width?: number): FrameNode {
  const col = width ? makeFrame('VERTICAL', width) : makeFrame('VERTICAL', P2_W - 40);
  col.primaryAxisSizingMode = 'AUTO';
  col.itemSpacing = 6;
  col.fills = [];

  const labelNode = txt(label, 9, 'Bold', G.accent);
  labelNode.letterSpacing = { value: 1.2, unit: 'PIXELS' };
  col.appendChild(labelNode);
  labelNode.layoutSizingHorizontal = 'FILL';

  for (const item of items) {
    const t = txt(bullets ? '• ' + item : item, 12, 'Regular', G.body);
    t.lineHeight = { value: 148, unit: 'PERCENT' };
    col.appendChild(t);
    t.layoutSizingHorizontal = 'FILL';
  }

  if (items.length === 0) {
    const empty = txt('—', 12, 'Regular', G.muted);
    col.appendChild(empty);
    empty.layoutSizingHorizontal = 'FILL';
  }

  return col;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT SUMMARY helpers
// ═══════════════════════════════════════════════════════════════════════════════

function buildTitleHeader(title: string): FrameNode {
  const header = makeFrame('VERTICAL', 800);
  header.name = '_title';
  header.primaryAxisSizingMode = 'AUTO';
  header.paddingLeft = H_PADDING;
  header.paddingRight = H_PADDING;
  header.paddingTop = 40;
  header.paddingBottom = 32;
  header.itemSpacing = 10;
  header.fills = [{ type: 'SOLID', color: C.headerBg }];

  const eyebrow = txt('BLUEPRINT', 10, 'Bold', C.mutedText);
  eyebrow.letterSpacing = { value: 2.5, unit: 'PIXELS' };
  header.appendChild(eyebrow);
  eyebrow.layoutSizingHorizontal = 'FILL';

  const titleNode = txt(title, 32, 'Bold', C.lightText);
  titleNode.lineHeight = { value: 115, unit: 'PERCENT' };
  header.appendChild(titleNode);
  titleNode.layoutSizingHorizontal = 'FILL';

  return header;
}

function buildLegend(): FrameNode {
  const legend = makeFrame('HORIZONTAL', 800);
  legend.name = '_legend';
  legend.primaryAxisSizingMode = 'AUTO';
  legend.counterAxisSizingMode = 'FIXED';
  legend.paddingLeft = H_PADDING;
  legend.paddingRight = H_PADDING;
  legend.paddingTop = 20;
  legend.paddingBottom = 20;
  legend.itemSpacing = 24;
  legend.counterAxisAlignItems = 'CENTER';
  legend.fills = [{ type: 'SOLID', color: C.legendBg }];

  const legendLabel = txt('LEGEND', 9, 'Bold', C.mutedText);
  legendLabel.letterSpacing = { value: 2, unit: 'PIXELS' };
  legend.appendChild(legendLabel);

  const div = figma.createFrame();
  div.resize(1, 16);
  div.fills = [{ type: 'SOLID', color: { r: 0.28, g: 0.28, b: 0.34 } }];
  legend.appendChild(div);

  for (const def of SECTIONS) {
    const item = makeFrame('HORIZONTAL', 60);
    item.primaryAxisSizingMode = 'AUTO';
    item.counterAxisSizingMode = 'AUTO';
    item.itemSpacing = 7;
    item.counterAxisAlignItems = 'CENTER';
    item.fills = [];

    const chip = makeFrame('HORIZONTAL', 30);
    chip.primaryAxisSizingMode = 'AUTO';
    chip.counterAxisSizingMode = 'AUTO';
    chip.paddingLeft = 6; chip.paddingRight = 6;
    chip.paddingTop = 2; chip.paddingBottom = 2;
    chip.cornerRadius = 3;
    chip.fills = [{ type: 'SOLID', color: def.color }];
    const codeText = txt(def.code, 9, 'Bold', C.lightText);
    codeText.letterSpacing = { value: 0.5, unit: 'PIXELS' };
    chip.appendChild(codeText);
    item.appendChild(chip);

    const label = txt(`= ${def.fullName}`, 11, 'Regular', { r: 0.72, g: 0.72, b: 0.78 });
    item.appendChild(label);
    legend.appendChild(item);
  }

  return legend;
}

function buildColumn(section: DocumentSection): FrameNode {
  const type = detectType(section.heading);
  const def = SECTION_MAP.get(type) ?? { label: section.heading, code: '#', color: C.mutedText, fullName: '' } as SectionDef;

  const col = makeFrame('VERTICAL', COLUMN_W);
  col.name = def.label;
  col.primaryAxisSizingMode = 'AUTO';
  col.itemSpacing = 0;
  col.fills = [{ type: 'SOLID', color: C.colBg }];
  col.cornerRadius = 10;
  col.clipsContent = true;
  col.strokes = [{ type: 'SOLID', color: C.divider }];
  col.strokeWeight = 1;

  col.appendChild(buildColumnHeader(def));

  const cardContainer = makeFrame('VERTICAL', COLUMN_W);
  cardContainer.primaryAxisSizingMode = 'AUTO';
  cardContainer.itemSpacing = 8;
  cardContainer.paddingLeft = 12; cardContainer.paddingRight = 12;
  cardContainer.paddingTop = 12; cardContainer.paddingBottom = 12;
  cardContainer.fills = [];
  col.appendChild(cardContainer);

  section.paragraphs.forEach((para, i) => {
    const card = type === 'CONTEXT'
      ? buildKVCard(para, def.color, i)
      : buildItemCard(para, i, def);
    cardContainer.appendChild(card);
    card.layoutSizingHorizontal = 'FILL';
  });

  return col;
}

function buildColumnHeader(def: SectionDef): FrameNode {
  const header = makeFrame('HORIZONTAL', COLUMN_W);
  header.primaryAxisSizingMode = 'AUTO';
  header.paddingLeft = 14; header.paddingRight = 14;
  header.paddingTop = 14; header.paddingBottom = 14;
  header.itemSpacing = 8;
  header.counterAxisAlignItems = 'CENTER';
  header.fills = [{ type: 'SOLID', color: def.color }];

  const badge = makeFrame('HORIZONTAL', 30);
  badge.primaryAxisSizingMode = 'AUTO';
  badge.counterAxisSizingMode = 'AUTO';
  badge.paddingLeft = 6; badge.paddingRight = 6;
  badge.paddingTop = 2; badge.paddingBottom = 2;
  badge.cornerRadius = 3;
  badge.fills = [{ type: 'SOLID', color: C.white, opacity: 0.2 }];
  const codeT = txt(def.code, 9, 'Bold', C.lightText);
  codeT.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  badge.appendChild(codeT);
  header.appendChild(badge);

  const labelT = txt(def.label.toUpperCase(), 11, 'Bold', C.lightText);
  labelT.letterSpacing = { value: 1.2, unit: 'PIXELS' };
  header.appendChild(labelT);
  labelT.layoutSizingHorizontal = 'FILL';

  return header;
}

function buildItemCard(para: string, index: number, def: SectionDef): FrameNode {
  const parsed = parseItem(para);
  const n = index + 1;
  const num = n < 10 ? '0' + n : String(n);
  const badgeLabel = `${parsed.prefix || def.code}${num}`;

  const card = makeFrame('VERTICAL', COLUMN_W - 24);
  card.primaryAxisSizingMode = 'AUTO';
  card.paddingLeft = 12; card.paddingRight = 12;
  card.paddingTop = 10; card.paddingBottom = 10;
  card.itemSpacing = 6;
  card.cornerRadius = 6;
  card.fills = [{ type: 'SOLID', color: C.white }];
  card.strokes = [{ type: 'SOLID', color: C.divider }];
  card.strokeWeight = 1;

  const accent = figma.createFrame();
  accent.resize(COLUMN_W, 3);
  accent.fills = [{ type: 'SOLID', color: def.color }];
  card.appendChild(accent);
  accent.layoutSizingHorizontal = 'FILL';

  const badgeFrame = makeFrame('HORIZONTAL', 40);
  badgeFrame.primaryAxisSizingMode = 'AUTO';
  badgeFrame.counterAxisSizingMode = 'AUTO';
  badgeFrame.paddingLeft = 6; badgeFrame.paddingRight = 6;
  badgeFrame.paddingTop = 2; badgeFrame.paddingBottom = 2;
  badgeFrame.cornerRadius = 3;
  badgeFrame.fills = [{ type: 'SOLID', color: def.color }];
  const badgeT = txt(badgeLabel, 9, 'Bold', C.lightText);
  badgeT.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  badgeFrame.appendChild(badgeT);
  card.appendChild(badgeFrame);

  const content = txt(parsed.content, 12, 'Regular', C.bodyText);
  content.lineHeight = { value: 150, unit: 'PERCENT' };
  card.appendChild(content);
  content.layoutSizingHorizontal = 'FILL';

  return card;
}

function buildKVCard(para: string, accentColor: RGB, index: number): FrameNode {
  const kv = parseKV(para);
  const key = kv ? kv.key : para;
  const value = kv ? kv.value : '';

  const card = makeFrame('VERTICAL', COLUMN_W - 24);
  card.primaryAxisSizingMode = 'AUTO';
  card.paddingLeft = 12; card.paddingRight = 12;
  card.paddingTop = 10; card.paddingBottom = 10;
  card.itemSpacing = 4;
  card.cornerRadius = 6;
  card.fills = [{ type: 'SOLID', color: index % 2 === 0 ? C.white : { r: 0.97, g: 0.97, b: 0.99 } }];
  card.strokes = [{ type: 'SOLID', color: C.divider }];
  card.strokeWeight = 1;

  const keyT = txt(key, 10, 'Semi Bold', accentColor);
  keyT.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  card.appendChild(keyT);
  keyT.layoutSizingHorizontal = 'FILL';

  const valueT = txt(value || '—', 13, 'Regular', C.bodyText);
  valueT.lineHeight = { value: 145, unit: 'PERCENT' };
  card.appendChild(valueT);
  valueT.layoutSizingHorizontal = 'FILL';

  return card;
}

// ─── Low-level helpers ────────────────────────────────────────────────────────

function makeFrame(direction: 'VERTICAL' | 'HORIZONTAL', width: number): FrameNode {
  const f = figma.createFrame();
  f.layoutMode = direction;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'FIXED';
  f.resize(width, 100);
  f.fills = [];
  return f;
}

function txt(characters: string, fontSize: number, style: string, color: RGB): TextNode {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style };
  t.characters = characters;
  t.fontSize = fontSize;
  t.fills = [{ type: 'SOLID', color }];
  return t;
}

function detectType(heading: string): string {
  const h = heading.toUpperCase();
  if (h.includes('CONTEXT'))                    return 'CONTEXT';
  if (h.includes('PERSONA'))                    return 'PERSONAS';
  if (h.includes('GOAL'))                       return 'GOALS';
  if (h.includes('REQUIREMENT'))                return 'REQUIREMENTS';
  if (h.includes('FLOW') || h.includes('STEP')) return 'USER_FLOW';
  if (h.includes('EDGE'))                       return 'EDGE_CASES';
  if (h.includes('QUESTION'))                   return 'OPEN_QUESTIONS';
  return 'DEFAULT';
}

function parseItem(text: string): { prefix: string | null; content: string } {
  const match = text.match(/^([A-Z]):\s+([\s\S]+)$/);
  if (match) return { prefix: match[1], content: match[2].trim() };
  const stripped = text.replace(/^\([^)]+\)\s*/, '').trim();
  return { prefix: null, content: stripped || text };
}

function parseKV(text: string): { key: string; value: string } | null {
  const i = text.indexOf(':');
  if (i === -1) return null;
  return { key: text.slice(0, i).trim(), value: text.slice(i + 1).trim() };
}

function getPages(): Array<{ id: string; name: string }> {
  return figma.root.children.map((p) => ({ id: p.id, name: p.name }));
}

function sendToUI(msg: OutgoingMessage) {
  figma.ui.postMessage(msg);
}
