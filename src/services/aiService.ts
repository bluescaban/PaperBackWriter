import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// ─── Provider detection ────────────────────────────────────────────────────────

const ENV_ANTHROPIC = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
const ENV_OPENAI    = import.meta.env.VITE_OPENAI_API_KEY    as string | undefined;

const LS_ANTHROPIC = 'pbw_anthropic_api_key';
const LS_OPENAI    = 'pbw_openai_api_key';

function isSet(val: string | undefined): boolean {
  return !!val && val !== 'your_api_key_here';
}

export type AIProvider = 'anthropic' | 'openai';

export function getAvailableProvider(): AIProvider | null {
  if (isSet(ENV_ANTHROPIC) || localStorage.getItem(LS_ANTHROPIC)) return 'anthropic';
  if (isSet(ENV_OPENAI)    || localStorage.getItem(LS_OPENAI))    return 'openai';
  return null;
}

export function getEnvProvider(): AIProvider | null {
  if (isSet(ENV_ANTHROPIC)) return 'anthropic';
  if (isSet(ENV_OPENAI))    return 'openai';
  return null;
}

export function getApiKey(provider: AIProvider): string {
  if (provider === 'anthropic') {
    return (isSet(ENV_ANTHROPIC) ? ENV_ANTHROPIC : null)
      ?? localStorage.getItem(LS_ANTHROPIC)
      ?? '';
  }
  return (isSet(ENV_OPENAI) ? ENV_OPENAI : null)
    ?? localStorage.getItem(LS_OPENAI)
    ?? '';
}

export function saveApiKeyOverride(provider: AIProvider, key: string) {
  const lsKey = provider === 'anthropic' ? LS_ANTHROPIC : LS_OPENAI;
  if (key) localStorage.setItem(lsKey, key);
  else localStorage.removeItem(lsKey);
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior UX researcher. Analyze the provided document and extract or infer detailed user personas.

Generate personas that are grounded in the document's context — use any existing persona descriptions, goals, requirements, user flow steps, and constraints as source material to build rich, realistic personas.

Output ONLY persona data in the exact PaperBackWriter format. No commentary, no markdown, no extra text.

RULES:
- Each persona starts with an ALL-CAPS name on its own line (e.g. CASUAL LISTENER)
- Every section header is ALL-CAPS on its own line exactly as shown below
- One item per line — no bullet characters, no numbers, no dashes
- INTENT is one sentence: "I do [activity]. I need [solution] because [reason]."
- RISK TOLERANCE is one word: Low, Medium, or High
- CHARACTERISTICS is a comma-separated list on one line
- QUOTE starts with "I need " and is a single punchy sentence
- MOTIVATIONS is 2–3 full sentences
- GOALS and FRUSTRATIONS have exactly 6 items each
- Separate sections with a blank line

FORMAT (repeat for each persona):

[PERSONA NAME]

INTENT
I do [activity]. I need [solution] because [reason].

MY GOALS
[item]
[item]
[item]
[item]

MY UX HABITS
[item]
[item]
[item]

HOW I USE TOOLS
[item]
[item]
[item]

WHAT BRINGS ME HERE
[item]
[item]
[item]

RISK TOLERANCE
[Low / Medium / High]

WHAT FRUSTRATES ME
[item]
[item]
[item]

I DONT WANT TO
[item]
[item]
[item]

NAME
[First Last]
AGE
[number]
OCCUPATION
[job title]
CHARACTERISTICS
[trait], [trait], [trait], [trait], [trait]
QUOTE
I need [the single most important thing for this user]
MOTIVATIONS
[2–3 sentences about what drives this user]
GOALS
[item]
[item]
[item]
[item]
[item]
[item]
FRUSTRATIONS
[item]
[item]
[item]
[item]
[item]
[item]`;

// ─── Generation ────────────────────────────────────────────────────────────────

export async function generatePersonasFromDocument(
  documentText: string,
  count: number,
  provider: AIProvider,
  apiKey?: string,
): Promise<string> {
  const key = apiKey || getApiKey(provider);
  if (!key) throw new Error(`No ${provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API key found. Add it to your .env file.`);

  const userMsg =
    `Based on the following document, generate ${count} distinct user persona${count > 1 ? 's' : ''} that represent real users of this product or feature.\n\n` +
    `DOCUMENT:\n${documentText}`;

  if (provider === 'anthropic') {
    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMsg }],
    });
    const block = message.content[0];
    return block.type === 'text' ? block.text.trim() : '';
  } else {
    const client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMsg },
      ],
    });
    return response.choices[0]?.message?.content?.trim() ?? '';
  }
}
