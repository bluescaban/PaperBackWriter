import { useEffect, useState } from 'react';
import { onFigmaMessage, sendValidateFile, sendGetPages, isPluginContext } from '../services/figmaService';

export interface FigmaPluginState {
  connected: boolean;
  inPluginContext: boolean;
  fileName: string;
  pages: Array<{ id: string; name: string }>;
  refresh: () => void;
}

export function useFigmaPlugin(): FigmaPluginState {
  const inPluginContext = isPluginContext();
  const [connected, setConnected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const off = onFigmaMessage((msg) => {
      if (msg.type === 'VALIDATED') {
        setConnected(true);
        setFileName(msg.fileName);
        setPages(msg.pages);
      } else if (msg.type === 'PAGES') {
        setPages(msg.pages);
      }
    });
    return off;
  }, []);

  function refresh() {
    if (inPluginContext) {
      sendValidateFile();
      sendGetPages();
    }
  }

  return { connected, inPluginContext, fileName, pages, refresh };
}
