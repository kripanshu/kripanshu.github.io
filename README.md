# kripanshu.github.io

Personal portfolio. Terminal-themed, built with [Astro](https://astro.build).

Live: <https://kripanshu.github.io>

## Develop

```bash
npm install
npm run dev    # http://localhost:4321
```

## Build

```bash
npm run build  # outputs to dist/
npm run preview
npm run check  # Astro + TypeScript checks
```

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` via the official `actions/deploy-pages` action.

One-time setup on the repo: **Settings → Pages → Source: GitHub Actions**.

## Project layout

```
src/
├── components/      # Prompt, Cursor, DirListing, ThemeToggle, CommandPalette, ...
├── content/
│   └── projects/    # Markdown case studies (one per project)
├── content.config.ts
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro          # landing
│   ├── now.astro            # /now — current focus
│   └── projects/[...slug].astro
└── styles/global.css        # tokens + base styles
public/
├── favicon.svg
├── avatar.jpg
└── resume.pdf
```

## Adding a project case study

1. Drop a new file in `src/content/projects/<slug>.md`. Frontmatter shape
   (zod-validated in `src/content.config.ts`):

   ```yaml
   ---
   title: 'FinSight'
   summary: 'Local-first personal finance dashboard.'
   status: active        # active | paused | archived
   started: '2025-09-15'
   updated: '2026-04-22'
   repo: 'https://github.com/kripanshu/finsight'
   demo: 'https://...'   # optional
   stack: ['Python', 'SQLite', 'Ollama']
   order: 1              # lower numbers list first
   ---
   ```

2. Body is plain Markdown. Convention: use `## $ command` style headings
   (`## $ ls features/`) so they render in voice with the rest of the site.
3. Add a one-line entry to the `projects` array in `src/pages/index.astro`
   pointing at `/projects/<slug>`. The cmd-k palette picks it up automatically
   from the content collection.

## Refreshing /now

Edit `src/pages/now.astro`. The page is intentionally minimal — bump
`lastUpdated`, rewrite `focus` and `reading`. The signal is in updating it
often, not in writing a lot.

## Theming

Tokens live in `src/styles/global.css` under `:root` (dark) and
`[data-theme='light']`. Theme is set inline before paint by
`src/components/ThemeScript.astro` (reads `localStorage.theme` →
`prefers-color-scheme`), so there is no flash. The toggle in the topbar
flips and persists.

Accent: `#82aaff` (dark) / `#2f5fcf` (light).

## Command palette (cmd-k)

`src/components/CommandPalette.astro`. Hotkeys:

- `⌘/ctrl + K` — toggle
- `/` — open and focus input
- `↑ ↓` or `j k` (when input is blurred) — navigate
- `i` or `/` (when input is blurred) — refocus input
- `↵` — run, `esc` — blur input → second `esc` closes
