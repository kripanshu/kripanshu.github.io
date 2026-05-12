# Logo Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `$` favicon with a `❯ k` mark and add it as a topbar lockup next to the path breadcrumb.

**Architecture:** Three deliverables in order: (1) swap the favicon SVG with an OS-color-scheme-adaptive version, (2) add a reusable `BrandMark.astro` component that renders the same mark using the site's CSS theme tokens, (3) edit `BaseLayout.astro` so the home anchor wraps the mark + path text together. No new runtime dependencies.

**Tech Stack:** Astro 5, TypeScript, plain CSS with custom properties, hand-authored SVG. Verification via `astro check` and `astro build` (no test framework in repo — visual checks done in the dev server).

**Spec:** `docs/superpowers/specs/2026-05-11-logo-redesign-design.md`

**Project git rule:** every commit step requires the user's explicit approval before running. Steps below state the proposed commit message; pause and ask before running `git commit`.

---

## File Structure

| File                                  | Action  | Responsibility                                                    |
| ------------------------------------- | ------- | ----------------------------------------------------------------- |
| `public/favicon.svg`                  | Replace | OS-scheme-adaptive favicon, hard-coded hex (no CSS vars).         |
| `src/components/BrandMark.astro`      | Create  | Inline-SVG mark using `var(--bg/--border/--accent)` + `currentColor`. |
| `src/layouts/BaseLayout.astro`        | Modify  | Wrap mark + path in a single `.brand` anchor; add `.brand` styles. |

---

## Task 1: Replace the favicon with the new adaptive `❯ k` mark

**Files:**
- Replace: `public/favicon.svg`

- [ ] **Step 1: Capture the current favicon for visual comparison**

Run from the project root:

```bash
cp public/favicon.svg /tmp/favicon.before.svg
```

Expected: file copied. This is for the manual visual check in step 5; it is not committed.

- [ ] **Step 2: Write the new favicon**

Overwrite `public/favicon.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <style>
    .bg     { fill: #0b0d10; }
    .border { stroke: #1f2430; }
    .accent { stroke: #82aaff; }
    .fg     { fill: #d8dee9; }
    @media (prefers-color-scheme: light) {
      .bg     { fill: #f7f6f2; }
      .border { stroke: #e2dfd5; }
      .accent { stroke: #2f5fcf; }
      .fg     { fill: #1a1a1a; }
    }
  </style>
  <rect class="bg border" x="1" y="1" width="62" height="62" rx="7" stroke-width="2"/>
  <path class="accent" d="M14 18 L30 32 L14 46"
        stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text class="fg" x="34" y="48"
        font-family="ui-monospace, Menlo, monospace" font-size="42" font-weight="700">k</text>
</svg>
```

Notes:
- The rect is inset (`x="1" y="1"` with `width/height="62"`, `rx="7"`) so the 2px stroke stays inside the 64-unit viewBox and isn't clipped at small sizes.
- All colours are hard-coded hex values from `src/styles/global.css`. The favicon is fetched in isolation by the browser and cannot reference site CSS vars.
- `prefers-color-scheme` follows the OS, not the in-app theme toggle — that is intentional (browser chrome belongs to the OS).

- [ ] **Step 3: Verify the build still works**

Run from the project root:

```bash
npm run build
```

Expected: build succeeds, no errors mentioning `favicon.svg`. The file should appear in `dist/favicon.svg` byte-for-byte identical to `public/favicon.svg`.

Confirm with:

```bash
diff public/favicon.svg dist/favicon.svg
```

Expected: no output (files identical).

- [ ] **Step 4: Verify the favicon renders correctly**

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:4321` in a browser. Inspect the browser tab favicon. Verify:
- The mark shows as `❯ k` (angle + lower-case `k`), not the previous `$`.
- In a tab pinned at small width, both shapes are still distinguishable.
- Toggle the OS appearance (System Settings → Appearance → Light/Dark on macOS) and confirm the favicon flips: dark scheme shows the navy `#0b0d10` background with light blue accent; light scheme shows the cream `#f7f6f2` background with deeper blue accent.

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 5: Commit (ask user before running)**

Proposed commit:

```bash
git add public/favicon.svg
git commit -m "feat(brand): swap \$ favicon for adaptive ❯ k mark"
```

Per project rule, ask the user to approve the staged diff and commit message first.

---

## Task 2: Create the `BrandMark.astro` component

**Files:**
- Create: `src/components/BrandMark.astro`

- [ ] **Step 1: Create the component file**

Create `src/components/BrandMark.astro` with:

```astro
---
interface Props {
  size?: number;
  label?: string;
  decorative?: boolean;
}

const {
  size = 24,
  label = 'kripanshu',
  decorative = false,
} = Astro.props;

const a11y = decorative
  ? { 'aria-hidden': 'true' }
  : { role: 'img', 'aria-label': label };
---

<svg
  width={size}
  height={size}
  viewBox="0 0 64 64"
  class="brand-mark"
  {...a11y}
>
  <rect
    x="1" y="1" width="62" height="62" rx="7"
    fill="var(--bg)"
    stroke="var(--border)"
    stroke-width="2"
  />
  <path
    d="M14 18 L30 32 L14 46"
    stroke="var(--accent)"
    stroke-width="7"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
  <text
    x="34" y="48"
    font-family="ui-monospace, Menlo, monospace"
    font-size="42"
    font-weight="700"
    fill="currentColor"
  >k</text>
</svg>
```

Notes:
- `decorative` mode renders `aria-hidden="true"` and no `role` — used when the mark is wrapped in something that already has a label (e.g. a labelled `<a>`). This avoids screen readers announcing the brand twice.
- Non-decorative mode renders `role="img" aria-label={label}` — used when the mark stands alone.
- `fill="var(--bg)"`, `stroke="var(--border)"`, and `stroke="var(--accent)"` work because the SVG is inline in the rendered HTML, so the CSS custom properties from `src/styles/global.css` are in scope.
- The `k` uses `fill="currentColor"` so it inherits the parent text colour.

- [ ] **Step 2: Verify it type-checks**

Run from the project root:

```bash
npm run check
```

Expected: `0 errors, 0 warnings` (or whatever the baseline was before this change — the new file should not introduce any).

- [ ] **Step 3: Verify it builds**

Run:

```bash
npm run build
```

Expected: build succeeds. No errors referencing `BrandMark.astro`.

(The component isn't imported anywhere yet, so it won't appear in any output bundle, but it must still parse cleanly.)

- [ ] **Step 4: Commit (ask user before running)**

Proposed commit:

```bash
git add src/components/BrandMark.astro
git commit -m "feat(brand): add BrandMark component"
```

Per project rule, ask the user to approve the staged diff and commit message first.

---

## Task 3: Use `BrandMark` in the topbar

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add the import**

In `src/layouts/BaseLayout.astro`, find the existing import block at the top of the frontmatter (currently lines 2–6):

```astro
import '../styles/global.css';
import ThemeScript from '../components/ThemeScript.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import CommandPalette from '../components/CommandPalette.astro';
import RobotStatus from '../components/RobotStatus.astro';
```

Add one line below `RobotStatus`:

```astro
import BrandMark from '../components/BrandMark.astro';
```

- [ ] **Step 2: Replace the topbar markup**

Find the existing `<header class="topbar">…</header>` block (currently lines 51–55):

```astro
<header class="topbar">
  <a href="/" class="path" aria-label="Go home">{path}</a>
  <RobotStatus />
  <ThemeToggle />
</header>
```

Replace with:

```astro
<header class="topbar">
  <a href="/" class="brand" aria-label="Go home">
    <BrandMark size={22} decorative />
    <span class="path">{path}</span>
  </a>
  <RobotStatus />
  <ThemeToggle />
</header>
```

The `path` is now a `<span>` instead of the anchor itself — the anchor wraps both the mark and the text. `aria-label="Go home"` stays on the anchor; `decorative` on `BrandMark` keeps the mark out of the accessibility tree.

- [ ] **Step 3: Add the `.brand` CSS rule**

Find the existing `.path` style block in the `<style>` element (currently lines 95–102):

```css
.path {
  color: var(--text-dim);
  border-bottom: none;
  font-size: var(--text-sm);
}
.path:hover {
  color: var(--text);
}
```

Insert these rules immediately above the `.path` rule:

```css
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border-bottom: none;
}
.brand:hover .path {
  color: var(--text);
}
```

The existing `.path:hover` rule is now redundant for the topbar use (the anchor's hover state propagates via `.brand:hover .path`), but leave it in place — `.path` may be used elsewhere and the rule is harmless.

- [ ] **Step 4: Verify it type-checks**

Run from the project root:

```bash
npm run check
```

Expected: 0 errors. Any error about `BrandMark` props means the import path or prop names don't match Task 2.

- [ ] **Step 5: Verify it builds**

Run:

```bash
npm run build
```

Expected: build succeeds. The `BrandMark` SVG should appear inline in the rendered HTML.

```bash
grep -rl brand-mark dist/
```

Expected: at least `dist/index.html` matches, plus every other generated page (`dist/now/index.html`, `dist/projects/<slug>/index.html`).

- [ ] **Step 6: Visual verification in the dev server**

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:4321`. Verify:
- The topbar shows the `❯ k` mark to the left of `~/`, vertically centred, with a small gap.
- Hovering the mark+path together changes the path colour to `--text` (the brighter foreground colour).
- Clicking either the mark or the text navigates to `/`.
- Click the `ThemeToggle` button in the topbar to flip the in-app theme. The mark colours should update instantly: in light mode the angle becomes deeper blue (`#2f5fcf`) and the `k` becomes near-black (`#1a1a1a`); in dark mode it reverts. No flash, no broken state.
- Navigate to `/now` and a project page (e.g. `/projects/finsight` if it exists). The mark should appear in the topbar of every page, with `path` reflecting the page's `path` prop.
- Tab through the page from the very top with the keyboard. The first focusable element after the skip link should be the home anchor; VoiceOver (or your screen reader of choice) should announce it as "Go home, link" — not "kripanshu, Go home, link".

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 7: Commit (ask user before running)**

Proposed commit:

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(brand): show BrandMark next to path in topbar"
```

Per project rule, ask the user to approve the staged diff and commit message first.

---

## Acceptance check (run after all tasks)

These mirror the acceptance criteria in the spec.

- [ ] **AC1 — favicon distinguishable at 16px:** Pin the localhost tab in your browser. The `❯ k` should still read as two shapes, not a smudge.
- [ ] **AC2 — mark on every page:** Visit `/`, `/now`, and at least one `/projects/<slug>` page. Mark appears in each topbar.
- [ ] **AC3 — instant theme flip:** Toggle the in-app theme. Mark colours update with no flash; favicon does not (it follows OS, not the in-app toggle — verify by changing OS appearance separately).
- [ ] **AC4 — `npm run check` clean:** No new errors or warnings.
- [ ] **AC5 — keyboard nav unchanged:** First focusable element after skip-link is the home anchor; screen reader announces "Go home" once.

If any AC fails, do not push. Diagnose and fix before opening a PR.
