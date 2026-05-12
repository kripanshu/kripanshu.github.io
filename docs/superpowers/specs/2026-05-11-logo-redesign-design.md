# Logo redesign — `❯ k` mark

Date: 2026-05-11
Status: design approved, ready to plan
Project: `kripanshu.github.io`

## Goal

Replace the current `$` favicon with a more distinctive personal mark, and give it
a real on-page presence by lock-up-ing it next to the path breadcrumb in the site
header.

## Background

Today the favicon (`public/favicon.svg`) is a `$` shell prompt in the accent
colour on a dark rounded square. It reads as "terminal" but is the default
move every dev portfolio makes — there's nothing personal in it. The header
(`src/layouts/BaseLayout.astro`) has no logo at all, just a text breadcrumb
(`~/`).

## Decision

The new mark is `❯ k` — a modern angle prompt (the kind zsh and fish users
customize their PS1 to) followed by a lower-case `k`. Clean, two shapes, no
trailing cursor. It owns the terminal vocabulary while signing it.

Brainstorming history is in `.superpowers/brainstorm/7204-1778564566/content/`
(direction spectrum → V2 chosen → no-cursor refinement chosen → favicon+lockup
scope chosen).

## Visual spec

### Anatomy

- **Canvas:** 64×64 viewBox, 8px corner radius (`rx="8"`).
- **Background:** an inset `<rect x="1" y="1" width="62" height="62" rx="7">`
  (inset so the stroke sits *inside* the viewBox instead of being clipped at
  small sizes). Filled with the theme's `--bg` colour. 2px stroke in the
  theme's `--border` colour to give a soft edge against light backgrounds
  (mostly invisible in dark mode, gently defining in light).
- **Angle (`❯`):** drawn as a path `M14 18 L30 32 L14 46`, 7px stroke, round
  caps and joins, in the theme's `--accent` colour. Not a glyph — a path —
  so it's font-independent and renders identically everywhere.
- **Initial (`k`):** lower-case, monospace (`ui-monospace, Menlo, monospace`),
  font-size 42, weight 700, in the theme's `--text` colour. Positioned at
  `x=34, y=48`.

### Colours (token-driven)

| Element     | Dark (default)         | Light                      |
| ----------- | ---------------------- | -------------------------- |
| Background  | `#0b0d10` (`--bg`)     | `#f7f6f2` (`--bg`)         |
| Border      | `#1f2430` (`--border`) | `#e2dfd5` (`--border`)     |
| Angle       | `#82aaff` (`--accent`) | `#2f5fcf` (`--accent`)     |
| Initial `k` | `#d8dee9` (`--text`)   | `#1a1a1a` (`--text`)       |

These are the real values from `src/styles/global.css`. Anything that ships in
the topbar must reference the CSS custom properties directly so the existing
theme toggle Just Works.

### Adaptive theming — favicon vs. topbar lockup

Two distinct theming concerns:

1. **Favicon** lives in browser chrome (tab strip, bookmarks, OS dock). It
   does not respond to the site's in-app theme toggle — it follows the OS
   colour scheme. Adapt with `prefers-color-scheme` inside the SVG.

2. **Topbar lockup** is on-page, so it must follow `data-theme` (the site's
   own toggle) by referencing CSS custom properties via `currentColor` /
   inline styles bound to vars.

This split is intentional. A user with light OS but dark site will see a light
favicon and a dark topbar — that is the correct behaviour, because each
surface belongs to a different visual system.

## Deliverables

### 1. `public/favicon.svg` — replace

Single SVG file, ~700 bytes, with an inline `<style>` block that flips colours
on `prefers-color-scheme: light`. Hard-coded hex values (cannot reference CSS
vars from the site since the favicon is fetched in isolation by the browser).

### 2. `src/components/BrandMark.astro` — new

A small component that emits the same mark as inline SVG, using
`currentColor` and `var(--accent)` so it follows whatever theme the page is in.

The `decorative` prop chooses between two ARIA modes: when the mark is wrapped
in a labelled element (e.g. an anchor with `aria-label="Go home"`), pass
`decorative` so the SVG is hidden from the accessibility tree and the parent's
label isn't doubled up. When the mark stands alone, omit it and the SVG is
announced as `label`.

```astro
---
interface Props {
  size?: number;
  label?: string;
  decorative?: boolean;
}
const { size = 24, label = 'kripanshu', decorative = false } = Astro.props;

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
  <rect x="1" y="1" width="62" height="62" rx="7"
        fill="var(--bg)" stroke="var(--border)" stroke-width="2" />
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

The `k` uses `fill="currentColor"` so it inherits whatever text colour the
parent has — usable on tinted backgrounds without needing a variant.

### 3. `src/layouts/BaseLayout.astro` — edit topbar

The current header is:

```astro
<header class="topbar">
  <a href="/" class="path" aria-label="Go home">{path}</a>
  <RobotStatus />
  <ThemeToggle />
</header>
```

Edit so the home link contains the `BrandMark` followed by the path text,
side-by-side, vertically centred:

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

Add CSS:

```css
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border-bottom: none;
}
.brand:hover .path { color: var(--text); }
```

`decorative` hides the SVG from assistive tech (`aria-hidden="true"`) because
the parent anchor already carries `aria-label="Go home"` — avoids announcing
"kripanshu, go home" twice to screen readers.

## Out of scope

- **OG image (`public/og.png`).** Currently a vim screenshot. A logo-driven
  OG card is a separate brief — typography, taglines, composition — and
  deserves its own pass.
- **Wordmark.** No custom-set "kripanshu" lockup. The path text and the
  page `<title>` continue to carry the name.
- **Other surfaces** (resume PDF cover, GitHub social preview, etc.) — out
  of scope for this spec.
- **Touch icons / `apple-touch-icon`.** Not currently set; not adding.
  SVG favicon covers the modern browsers we care about.

## Acceptance criteria

1. `public/favicon.svg` renders the `❯ k` mark, adapts to OS colour scheme,
   and is recognisably itself at 16px (browser tab) — verified by loading
   the dev server and squinting at the tab.
2. The site header shows the mark to the left of the `~/` path, on every
   page, in both light and dark theme.
3. Toggling the in-app theme (`/` then `t` or the `ThemeToggle` button)
   updates the topbar mark colours instantly with no flash.
4. `npm run check` passes (no TS / Astro errors introduced).
5. No regressions to keyboard navigation: tabbing into the header still
   reaches the home link first, and the link is announced as "Go home" by
   VoiceOver.

## Open questions

None. Ready to plan implementation.
