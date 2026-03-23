import mammoth from 'mammoth';
import type { ParsedDocument, DocumentSection } from '../types';

/**
 * Fetches a .docx file from a URL and parses it into structured sections.
 * The URL must be CORS-accessible or proxied.
 */
export async function parseDocumentFromUrl(url: string): Promise<ParsedDocument> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return parseDocumentFromBuffer(arrayBuffer);
}

/**
 * Parses a .docx ArrayBuffer (e.g. from a file input) into structured sections.
 */
export async function parseDocumentFromBuffer(buffer: ArrayBuffer): Promise<ParsedDocument> {
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });

  if (result.messages.length > 0) {
    console.warn('[documentParser] Conversion warnings:', result.messages);
  }

  const sections = extractSections(result.value);
  const rawText = stripHtml(result.value);
  const title = sections[0]?.heading || 'Untitled Document';

  return { title, sections, rawText };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractSections(html: string): DocumentSection[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections: DocumentSection[] = [];
  let currentSection: DocumentSection | null = null;
  let idCounter = 0;

  const nodes = Array.from(doc.body.childNodes);

  for (const node of nodes) {
    if (!(node instanceof Element)) continue;

    const tag = node.tagName.toLowerCase();
    const text = node.textContent?.trim() || '';
    if (!text) continue;

    const headingMatch = tag.match(/^h([1-6])$/);
    // Also treat ALL-CAPS paragraphs (optionally ending with colon) as headings.
    // This handles Word docs that use bold/caps text instead of Heading styles.
    // Excludes single-letter prefix items like "P: content" or "G: content".
    const isCapsHeading = tag === 'p' && isSectionHeader(text);

    if (headingMatch || isCapsHeading) {
      const level = headingMatch ? parseInt(headingMatch[1], 10) : 2;
      if (currentSection) sections.push(currentSection);

      currentSection = {
        id: `section-${++idCounter}`,
        heading: text.replace(/:$/, '').trim(), // strip trailing colon
        level,
        content: '',
        paragraphs: [],
      };
    } else if (tag === 'p') {
      if (!currentSection) {
        currentSection = {
          id: `section-${++idCounter}`,
          heading: '',
          level: 0,
          content: '',
          paragraphs: [],
        };
      }
      currentSection.paragraphs.push(text);
      currentSection.content += (currentSection.content ? '\n\n' : '') + text;
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections;
}

/**
 * Returns true for ALL-CAPS section header paragraphs like "CONTEXT:", "PERSONAS:".
 * Returns false for single-letter item prefixes like "P: content" or plain sentences.
 */
function isSectionHeader(text: string): boolean {
  // Must be at least 3 characters
  if (text.length < 3) return false;
  // Exclude single-letter prefix items: "P: ..." "G: ..." etc.
  if (/^[A-Z]:\s/.test(text)) return false;
  // Allow optional trailing colon and parenthetical notes like "(Steps)"
  const cleaned = text.replace(/\([^)]*\)/, '').replace(/:$/, '').trim();
  // All remaining characters must be uppercase letters or spaces
  return /^[A-Z][A-Z\s]{2,}$/.test(cleaned);
}

function stripHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
