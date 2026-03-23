# PaperBackWriter

> Turn structured Word documents into Figma blueprints and Azure DevOps work items — automatically.

PaperBackWriter is a React app paired with a Figma plugin that reads a `.docx` document and writes its contents into Figma as a visual, color-coded blueprint and/or into Azure DevOps as work items.

---

## What it does

Load a Word document (by URL or file upload). The app parses it into labeled sections:

| Code | Section | Description |
|------|---------|-------------|
| CTX | Context | Project metadata — name, client, owner, platform, goal |
| P | Personas | User types and their motivations |
| G | Goals | Product goals |
| R | Requirements | Functional requirements |
| S | User Flow | Step-by-step user flow |
| E | Edge Cases | Failure states and edge conditions |
| Q | Open Questions | Unresolved decisions |

Each section becomes a color-coded column in Figma with individual item cards numbered and badged (P01, P02, G01, G02, etc.). A legend strip at the top explains every code at a glance.

---

## Document format

PaperBackWriter recognizes section headers written in ALL CAPS (with or without a trailing colon):

```
CONTEXT:
Project: My App
Client: Acme Corp
...

PERSONAS:
P: Casual User — wants a simple way to...
P: Power User — wants advanced controls...

GOALS:
G: Reduce time to first action
G: Support offline mode

REQUIREMENTS:
R: App must support iOS and Android
R: App must work offline

USER FLOW NOTES:
S: User opens the app
S: User selects a mode

EDGE CASES:
E: No internet connection — show cached content
E: Session expires mid-task — prompt re-auth

OPEN QUESTIONS:
Q: Do we support dark mode in v1?
Q: What is the max session length?
```

---

## Getting started

### Prerequisites

- Node.js 18+
- Figma desktop app (for the plugin)

### Install

```bash
git clone https://github.com/bluescaban/PaperBackWriter.git
cd PaperBackWriter
npm install
```

### Run the app

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### Build the Figma plugin

```bash
npm run build:plugin
```

This compiles `plugin/code.ts` → `plugin/code.js`.

During development, run this in watch mode so the plugin rebuilds on every save:

```bash
npm run watch:plugin
```

---

## Using the Figma plugin

The app is designed to run **inside Figma as a plugin**. The plugin UI is your React app — Figma loads it directly.

### Load the plugin into Figma

1. Open the **Figma desktop app**
2. Open the Figma file you want to write to
3. Go to **Menu → Plugins → Development → Import plugin from manifest…**
4. Select `plugin/manifest.json` from this project folder
5. Run it: **Menu → Plugins → Development → PaperBackWriter**

The plugin window opens showing the React app. It automatically connects to the current Figma file and reads its pages.

### Write to Figma

1. Make sure `npm run dev` is running (the plugin UI loads from `localhost:3000`)
2. Make sure `plugin/code.js` is built (`npm run build:plugin`)
3. In the plugin window:
   - Load your `.docx` document (URL or file upload)
   - Check **Figma** under Targets
   - Select a target page (optional — defaults to current page)
   - Set a root frame name (default: `PaperBackWriter`)
   - Toggle **Overwrite existing** if you want to replace a previous run
   - Click **Write to Targets**

Figma will create a blueprint frame on the canvas with:
- A dark title header
- A legend strip
- One color-coded column per section, with cards stacking vertically

---

## Using Azure DevOps

1. Check **Azure DevOps** under Targets
2. Fill in:
   - **Organization** — your Azure DevOps org name
   - **Project** — your project name
   - **Personal Access Token** — a PAT with Work Items (Read & Write) scope
   - **Work Item Type** — Epic, Feature, User Story, or Task
   - **Area Path** — optional
3. Click **Validate Connection** to confirm access
4. Click **Write to Targets**

Each top-level section heading becomes one work item with its paragraphs as the description.

---

## Project structure

```
PaperBackWriter/
├── plugin/
│   ├── manifest.json        # Figma plugin manifest
│   ├── code.ts              # Plugin sandbox code (Figma API)
│   ├── code.js              # Compiled plugin (gitignored, build with npm run build:plugin)
│   └── ui.html              # Bridge: loads localhost:3000 inside Figma
├── src/
│   ├── components/
│   │   ├── SourceInput/     # URL or file upload for .docx
│   │   ├── TargetSelector/  # Choose Figma / Azure DevOps / both
│   │   ├── FigmaConfig/     # Page selector and frame name
│   │   ├── AzureDevOpsConfig/ # Org, project, PAT, work item type
│   │   └── Preview/         # Parsed section tree + write results
│   ├── services/
│   │   ├── documentParser.ts  # mammoth.js .docx → sections
│   │   ├── figmaService.ts    # postMessage bridge to plugin
│   │   └── azureDevOpsService.ts # Azure DevOps REST API
│   ├── hooks/
│   │   └── useFigmaPlugin.ts  # Plugin connection state
│   ├── store/
│   │   └── appStore.ts        # Central app state hook
│   └── types/
│       └── index.ts           # Shared TypeScript types
└── package.json
```

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Build the React app for production |
| `npm run build:plugin` | Compile the Figma plugin code |
| `npm run watch:plugin` | Compile plugin in watch mode |
| `npm run lint` | Run ESLint |

---

## Tech stack

- **React 19 + Vite + TypeScript** — app framework
- **mammoth.js** — `.docx` to HTML/text conversion
- **Figma Plugin API** — node creation in Figma
- **Azure DevOps REST API** — work item creation
- **CSS Modules** — component styles
