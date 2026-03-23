import Anthropic from '@anthropic-ai/sdk';

const PERSONA_SYSTEM_PROMPT = `You are a senior UX researcher. Generate detailed user personas in the exact PaperBackWriter document format below.

Rules:
- Each persona starts with an ALL-CAPS name on its own line (e.g. CASUAL LISTENER)
- Every section header is ALL-CAPS on its own line, exactly as shown
- Write one item per line under each section — no bullet characters, no numbers
- The INTENT section is a single sentence: "I do [activity]. I need [solution] because [reason]."
- RISK TOLERANCE is a single word: Low, Medium, or High
- CHARACTERISTICS is a comma-separated list on one line
- QUOTE starts with "I need " and is a single sentence
- MOTIVATIONS is 2–3 full sentences
- GOALS and FRUSTRATIONS each have exactly 6 items
- Separate each persona with a blank line between sections
- Do not add any commentary, markdown, or text outside the format

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
I need [most important thing for this user]
MOTIVATIONS
[2–3 sentences about what motivates this user]
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

export async function generatePersonas(
  apiKey: string,
  description: string,
  count: number,
  focusHint?: string,
): Promise<string> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const userMsg = [
    `Product / context: ${description}`,
    `Generate ${count} distinct user persona${count > 1 ? 's' : ''}.`,
    focusHint ? `Focus on these user types: ${focusHint}` : '',
  ].filter(Boolean).join('\n');

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    system: PERSONA_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMsg }],
  });

  const block = message.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}
