/// <reference types="@figma/plugin-typings" />

// ─── Types ────────────────────────────────────────────────────────────────────

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

type IncomingMessage =
  | { type: 'OPEN_UI' }
  | { type: 'VALIDATE_FILE' }
  | { type: 'GET_PAGES' }
  | { type: 'WRITE_DOCUMENT'; document: ParsedDocument; pageId?: string; frameName?: string; overwrite?: boolean }
  | { type: 'CLOSE' };

type OutgoingMessage =
  | { type: 'VALIDATED'; fileName: string; fileKey: string; pages: Array<{ id: string; name: string }> }
  | { type: 'PAGES'; pages: Array<{ id: string; name: string }> }
  | { type: 'WRITE_SUCCESS'; nodesCreated: number }
  | { type: 'WRITE_ERROR'; error: string };

// ─── Design system ────────────────────────────────────────────────────────────

const C = {
  canvasBg:    { r: 0.08, g: 0.08, b: 0.10 },
  headerBg:    { r: 0.11, g: 0.11, b: 0.15 },
  legendBg:    { r: 0.13, g: 0.13, b: 0.17 },
  white:       { r: 1.00, g: 1.00, b: 1.00 },
  bodyText:    { r: 0.18, g: 0.18, b: 0.22 },
  mutedText:   { r: 0.50, g: 0.50, b: 0.55 },
  lightText:   { r: 1.00, g: 1.00, b: 1.00 },
  divider:     { r: 0.88, g: 0.88, b: 0.91 },
  colBg:       { r: 0.96, g: 0.96, b: 0.98 },
};

interface SectionDef {
  type: string;
  label: string;
  code: string;
  fullName: string;
  color: RGB;
}

const SECTIONS: SectionDef[] = [
  { type: 'CONTEXT',        label: 'Context',        code: 'CTX', fullName: 'Project Context',    color: { r: 0.13, g: 0.35, b: 0.80 } },
  { type: 'PERSONAS',       label: 'Personas',        code: 'P',   fullName: 'User Persona',       color: { r: 0.45, g: 0.18, b: 0.75 } },
  { type: 'GOALS',          label: 'Goals',           code: 'G',   fullName: 'Product Goal',       color: { r: 0.07, g: 0.52, b: 0.35 } },
  { type: 'REQUIREMENTS',   label: 'Requirements',    code: 'R',   fullName: 'Requirement',        color: { r: 0.75, g: 0.38, b: 0.08 } },
  { type: 'USER_FLOW',      label: 'User Flow',       code: 'S',   fullName: 'Flow Step',          color: { r: 0.07, g: 0.48, b: 0.58 } },
  { type: 'EDGE_CASES',     label: 'Edge Cases',      code: 'E',   fullName: 'Edge Case',          color: { r: 0.72, g: 0.16, b: 0.22 } },
  { type: 'OPEN_QUESTIONS', label: 'Open Questions',  code: 'Q',   fullName: 'Open Question',      color: { r: 0.58, g: 0.40, b: 0.05 } },
];

const SECTION_MAP = new Map(SECTIONS.map((s) => [s.type, s]));

const COLUMN_W   = 300;
const COLUMN_GAP = 20;
const H_PADDING  = 48;
const NUM_COLS   = SECTIONS.length;
const ROOT_W     = H_PADDING * 2 + COLUMN_W * NUM_COLS + COLUMN_GAP * (NUM_COLS - 1);

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

// ─── Write ────────────────────────────────────────────────────────────────────

async function handleWrite(msg: Extract<IncomingMessage, { type: 'WRITE_DOCUMENT' }>) {
  try {
    const { document, pageId, frameName, overwrite } = msg;

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
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

    // ── Root ─────────────────────────────────────────────────────────────────
    const root = figma.createFrame();
    root.name = rootName;
    root.layoutMode = 'VERTICAL';
    root.primaryAxisSizingMode = 'AUTO';
    root.counterAxisSizingMode = 'FIXED';
    root.resize(ROOT_W, 100);
    root.itemSpacing = 0;
    root.paddingLeft = 0;
    root.paddingRight = 0;
    root.paddingTop = 0;
    root.paddingBottom = 48;
    root.fills = [{ type: 'SOLID', color: C.canvasBg }];
    root.cornerRadius = 16;
    root.clipsContent = true;

    // ── Title header & legend (appended before we know final width; resized below) ──
    const titleHeader = buildTitleHeader(document.title);
    root.appendChild(titleHeader);
    titleHeader.layoutSizingHorizontal = 'FILL';

    const legendStrip = buildLegend();
    root.appendChild(legendStrip);
    legendStrip.layoutSizingHorizontal = 'FILL';

    // ── Columns ──────────────────────────────────────────────────────────────
    // Filter sections that have content, skip the document-title heading
    const contentSections = document.sections.filter(
      (s) => s.paragraphs.length > 0
    );

    // Calculate actual width based on how many sections we have
    const sectionCount = contentSections.length;
    const innerW = COLUMN_W * sectionCount + COLUMN_GAP * (sectionCount - 1);
    const actualRootW = H_PADDING * 2 + innerW;

    // Resize root to fit the actual number of columns
    root.resize(actualRootW, 100);

    const columnsRow = figma.createFrame();
    columnsRow.name = '_columns';
    columnsRow.layoutMode = 'HORIZONTAL';
    columnsRow.primaryAxisSizingMode = 'FIXED';   // explicit fixed width
    columnsRow.counterAxisSizingMode = 'AUTO';     // height hugs tallest column
    columnsRow.counterAxisAlignItems = 'MIN';      // columns pin to top
    columnsRow.itemSpacing = COLUMN_GAP;
    columnsRow.paddingLeft = H_PADDING;
    columnsRow.paddingRight = H_PADDING;
    columnsRow.paddingTop = 32;
    columnsRow.paddingBottom = 32;
    columnsRow.fills = [];
    columnsRow.resize(actualRootW, 100);           // give it explicit width before children
    root.appendChild(columnsRow);
    columnsRow.layoutSizingHorizontal = 'FILL';    // fill root after appending

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
  } catch (err) {
    sendToUI({ type: 'WRITE_ERROR', error: String(err) });
  }
}

// ─── Title header ─────────────────────────────────────────────────────────────

function buildTitleHeader(title: string): FrameNode {
  const header = figma.createFrame();
  header.name = '_title';
  header.layoutMode = 'VERTICAL';
  header.primaryAxisSizingMode = 'AUTO';
  header.counterAxisSizingMode = 'FIXED';
  header.resize(800, 100); // will be FILL in parent
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

// ─── Legend ───────────────────────────────────────────────────────────────────

function buildLegend(): FrameNode {
  const legend = figma.createFrame();
  legend.name = '_legend';
  legend.layoutMode = 'HORIZONTAL';
  legend.primaryAxisSizingMode = 'AUTO';
  legend.counterAxisSizingMode = 'FIXED';
  legend.resize(800, 100); // will be FILL in parent
  legend.paddingLeft = H_PADDING;
  legend.paddingRight = H_PADDING;
  legend.paddingTop = 20;
  legend.paddingBottom = 20;
  legend.itemSpacing = 24;
  legend.counterAxisAlignItems = 'CENTER';
  legend.fills = [{ type: 'SOLID', color: C.legendBg }];

  // Label
  const legendLabel = txt('LEGEND', 9, 'Bold', C.mutedText);
  legendLabel.letterSpacing = { value: 2, unit: 'PIXELS' };
  legend.appendChild(legendLabel);

  // Divider
  const div = figma.createFrame();
  div.name = '_div';
  div.resize(1, 16);
  div.fills = [{ type: 'SOLID', color: { r: 0.28, g: 0.28, b: 0.34 } }];
  legend.appendChild(div);

  // One entry per section type
  for (const def of SECTIONS) {
    legend.appendChild(buildLegendItem(def));
  }

  return legend;
}

function buildLegendItem(def: SectionDef): FrameNode {
  const item = figma.createFrame();
  item.name = `_legend-${def.code}`;
  item.layoutMode = 'HORIZONTAL';
  item.primaryAxisSizingMode = 'AUTO';
  item.counterAxisSizingMode = 'AUTO';
  item.itemSpacing = 7;
  item.counterAxisAlignItems = 'CENTER';
  item.fills = [];

  // Code chip
  const chip = figma.createFrame();
  chip.name = '_chip';
  chip.layoutMode = 'HORIZONTAL';
  chip.primaryAxisSizingMode = 'AUTO';
  chip.counterAxisSizingMode = 'AUTO';
  chip.paddingLeft = 6;
  chip.paddingRight = 6;
  chip.paddingTop = 2;
  chip.paddingBottom = 2;
  chip.cornerRadius = 3;
  chip.fills = [{ type: 'SOLID', color: def.color }];
  const codeText = txt(def.code, 9, 'Bold', C.lightText);
  codeText.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  chip.appendChild(codeText);
  item.appendChild(chip);

  // Full name
  const label = txt(`= ${def.fullName}`, 11, 'Regular', { r: 0.72, g: 0.72, b: 0.78 });
  item.appendChild(label);

  return item;
}

// ─── Column ───────────────────────────────────────────────────────────────────

function buildColumn(section: DocumentSection): FrameNode {
  const type = detectType(section.heading);
  const def = SECTION_MAP.get(type) ?? { label: section.heading, code: '#', color: C.mutedText, fullName: '' } as SectionDef;

  const col = figma.createFrame();
  col.name = def.label;
  col.layoutMode = 'VERTICAL';
  col.primaryAxisSizingMode = 'AUTO';
  col.counterAxisSizingMode = 'FIXED';
  col.resize(COLUMN_W, 100);
  col.itemSpacing = 0;
  col.fills = [{ type: 'SOLID', color: C.colBg }];
  col.cornerRadius = 10;
  col.clipsContent = true;
  col.strokes = [{ type: 'SOLID', color: C.divider }];
  col.strokeWeight = 1;

  // Column header
  col.appendChild(buildColumnHeader(def));

  // Cards
  const cardContainer = figma.createFrame();
  cardContainer.name = '_cards';
  cardContainer.layoutMode = 'VERTICAL';
  cardContainer.primaryAxisSizingMode = 'AUTO';
  cardContainer.counterAxisSizingMode = 'FIXED';
  cardContainer.resize(COLUMN_W, 100);
  cardContainer.itemSpacing = 8;
  cardContainer.paddingLeft = 12;
  cardContainer.paddingRight = 12;
  cardContainer.paddingTop = 12;
  cardContainer.paddingBottom = 12;
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

// ─── Column header ────────────────────────────────────────────────────────────

function buildColumnHeader(def: SectionDef): FrameNode {
  const header = figma.createFrame();
  header.name = '_col-header';
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisSizingMode = 'AUTO';
  header.counterAxisSizingMode = 'FIXED';
  header.resize(COLUMN_W, 100);
  header.paddingLeft = 14;
  header.paddingRight = 14;
  header.paddingTop = 14;
  header.paddingBottom = 14;
  header.itemSpacing = 8;
  header.counterAxisAlignItems = 'CENTER';
  header.fills = [{ type: 'SOLID', color: def.color }];

  // Code badge
  const badge = figma.createFrame();
  badge.name = '_badge';
  badge.layoutMode = 'HORIZONTAL';
  badge.primaryAxisSizingMode = 'AUTO';
  badge.counterAxisSizingMode = 'AUTO';
  badge.paddingLeft = 6;
  badge.paddingRight = 6;
  badge.paddingTop = 2;
  badge.paddingBottom = 2;
  badge.cornerRadius = 3;
  badge.fills = [{ type: 'SOLID', color: C.white, opacity: 0.2 }];
  const codeT = txt(def.code, 9, 'Bold', C.lightText);
  codeT.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  badge.appendChild(codeT);
  header.appendChild(badge);

  // Section label
  const labelT = txt(def.label.toUpperCase(), 11, 'Bold', C.lightText);
  labelT.letterSpacing = { value: 1.2, unit: 'PIXELS' };
  header.appendChild(labelT);
  labelT.layoutSizingHorizontal = 'FILL';

  return header;
}

// ─── Item card ────────────────────────────────────────────────────────────────

function buildItemCard(para: string, index: number, def: SectionDef): FrameNode {
  const parsed = parseItem(para);
  const n = index + 1;
  const num = n < 10 ? '0' + n : String(n);
  const badgeLabel = `${parsed.prefix || def.code}${num}`;

  const card = figma.createFrame();
  card.name = badgeLabel;
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(COLUMN_W - 24, 100); // will be overridden by FILL
  card.paddingLeft = 12;
  card.paddingRight = 12;
  card.paddingTop = 10;
  card.paddingBottom = 10;
  card.itemSpacing = 6;
  card.cornerRadius = 6;
  card.fills = [{ type: 'SOLID', color: C.white }];
  card.strokes = [{ type: 'SOLID', color: C.divider }];
  card.strokeWeight = 1;

  // Colored top accent bar
  const accent = figma.createFrame();
  accent.name = '_accent';
  accent.resize(COLUMN_W, 3);
  accent.fills = [{ type: 'SOLID', color: def.color }];
  card.appendChild(accent);
  accent.layoutSizingHorizontal = 'FILL';

  // Badge row
  const badgeFrame = figma.createFrame();
  badgeFrame.name = '_badge-row';
  badgeFrame.layoutMode = 'HORIZONTAL';
  badgeFrame.primaryAxisSizingMode = 'AUTO';
  badgeFrame.counterAxisSizingMode = 'AUTO';
  badgeFrame.paddingLeft = 6;
  badgeFrame.paddingRight = 6;
  badgeFrame.paddingTop = 2;
  badgeFrame.paddingBottom = 2;
  badgeFrame.cornerRadius = 3;
  badgeFrame.fills = [{ type: 'SOLID', color: def.color }];
  const badgeT = txt(badgeLabel, 9, 'Bold', C.lightText);
  badgeT.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  badgeFrame.appendChild(badgeT);
  card.appendChild(badgeFrame);

  // Content
  const content = txt(parsed.content, 12, 'Regular', C.bodyText);
  content.lineHeight = { value: 150, unit: 'PERCENT' };
  card.appendChild(content);
  content.layoutSizingHorizontal = 'FILL';

  return card;
}

// ─── Key-value card (CONTEXT) ─────────────────────────────────────────────────

function buildKVCard(para: string, accentColor: RGB, index: number): FrameNode {
  const kv = parseKV(para);
  const key = kv ? kv.key : para;
  const value = kv ? kv.value : '';

  const card = figma.createFrame();
  card.name = key;
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(COLUMN_W - 24, 100);
  card.paddingLeft = 12;
  card.paddingRight = 12;
  card.paddingTop = 10;
  card.paddingBottom = 10;
  card.itemSpacing = 4;
  card.cornerRadius = 6;
  card.fills = [{ type: 'SOLID', color: index % 2 === 0 ? C.white : { r: 0.97, g: 0.97, b: 0.99 } }];
  card.strokes = [{ type: 'SOLID', color: C.divider }];
  card.strokeWeight = 1;

  const keyT = txt(key, 10, 'Semi Bold', { ...accentColor });
  keyT.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  card.appendChild(keyT);
  keyT.layoutSizingHorizontal = 'FILL';

  const valueT = txt(value || '—', 13, 'Regular', C.bodyText);
  valueT.lineHeight = { value: 145, unit: 'PERCENT' };
  card.appendChild(valueT);
  valueT.layoutSizingHorizontal = 'FILL';

  return card;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
