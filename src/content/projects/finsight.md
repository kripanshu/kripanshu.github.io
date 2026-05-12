---
title: FinSight
summary: Local-first personal-finance dashboard with on-device LLM transaction categorization.
status: active
started: '2026-01'
updated: '2026-05'
stack:
  - TypeScript
  - SQLite
  - Ollama (llama3.2:3b)
  - Astro
order: 1
---

## ❯ cat NOTES.md

FinSight is the answer to "I want a clean view of my money without
shipping every transaction to a cloud SaaS." Bank statements come in,
get parsed, get categorized by a small LLM running locally, and end up
in a dashboard you'd actually look at.

The interesting decisions:

- **Local-first by default.** Everything runs on the user's machine.
  Ollama hosts the categorization model. No transactions leave the box.
- **PII scrubber as a pre-prompt step.** Before any text touches the
  model, we strip account numbers, balances, and identifiers — even
  though the model is local, scrubbing is cheap insurance against
  remote-host configurations.
- **Re-categorize, don't re-parse.** Categorization is the slow,
  improvable part. Parsing is deterministic. Splitting the two means
  the LLM step is the only thing that changes when prompts improve.

## ❯ ls features/

- CSV / OFX import
- Account-level views with per-account naming
- LLM-assisted categorization with confidence scores
- Manual override that becomes training data
- Dark, finance-style theme (gold-on-black) with glassmorphism cards

## ❯ git log --oneline -5

```text
bc737e7  Refresh UX with Notion-style left-nav and design.google polish
302a054  Add LLM recategorization, account naming, and upload flow fixes
6ea7d6d  Add PII scrubber and remote Ollama safety checks
72f4dc1  Remove Google Fonts CDN import for privacy compliance
3a8c815  Add dark finance theme, UI polish, and integration hardening
```

## ❯ ls roadmap/

- Phase 2: fine-tune the local LLM on user-corrected categorizations
- Mobile-friendly read-only view
- Budget envelopes
