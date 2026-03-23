import type { FigmaWriteResult, ParsedDocument } from '../types';

/**
 * Figma Plugin bridge service.
 *
 * When running inside the Figma plugin (loaded via plugin/ui.html),
 * all communication with the Figma API goes through postMessage to the
 * plugin sandbox (plugin/code.ts), which has access to figma.* APIs.
 *
 * When running outside Figma (plain browser), isPluginContext() returns
 * false and calls are no-ops so the app still renders normally.
 */

// ─── Context detection ────────────────────────────────────────────────────────

/**
 * True when the React app is running as a Figma plugin UI.
 * The plugin/ui.html bridge sets window.__figmaPlugin = true before loading us.
 */
export function isPluginContext(): boolean {
  return typeof window !== 'undefined' && (window as Window & { __figmaPlugin?: boolean }).__figmaPlugin === true;
}

// ─── Send helpers ─────────────────────────────────────────────────────────────

function send(message: object) {
  // Goes to plugin/ui.html bridge → plugin/code.ts
  window.parent.postMessage({ pluginMessage: message }, '*');
}

export function sendValidateFile() {
  send({ type: 'VALIDATE_FILE' });
}

export function sendGetPages() {
  send({ type: 'GET_PAGES' });
}

export function sendClose() {
  send({ type: 'CLOSE' });
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function writeDocumentToFigma(
  pageId: string | undefined,
  frameName: string | undefined,
  document: ParsedDocument,
  overwrite: boolean,
): Promise<FigmaWriteResult> {
  return new Promise((resolve) => {
    // One-shot listener for the response
    function onMessage(event: MessageEvent) {
      const msg = event.data?.pluginMessage ?? event.data;
      if (!msg) return;

      if (msg.type === 'WRITE_SUCCESS') {
        window.removeEventListener('message', onMessage);
        resolve({ success: true, nodesCreated: msg.nodesCreated, errors: [] });
      } else if (msg.type === 'WRITE_ERROR') {
        window.removeEventListener('message', onMessage);
        resolve({ success: false, nodesCreated: 0, errors: [msg.error] });
      }
    }

    window.addEventListener('message', onMessage);

    send({
      type: 'WRITE_DOCUMENT',
      document,
      pageId,
      frameName,
      overwrite,
    });
  });
}

// ─── Receive helpers (used by useFigmaPlugin hook) ────────────────────────────

export type FigmaIncomingMessage =
  | { type: 'VALIDATED'; fileName: string; fileKey: string; pages: Array<{ id: string; name: string }> }
  | { type: 'PAGES'; pages: Array<{ id: string; name: string }> }
  | { type: 'WRITE_SUCCESS'; nodesCreated: number }
  | { type: 'WRITE_ERROR'; error: string };

export function onFigmaMessage(handler: (msg: FigmaIncomingMessage) => void): () => void {
  function listener(event: MessageEvent) {
    // Messages come from the bridge (source: 'figma-plugin') or direct
    const msg = event.data?.pluginMessage ?? event.data;
    if (msg?.type) handler(msg as FigmaIncomingMessage);
  }
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
