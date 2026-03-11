# CLAUDE.md

## Project Overview

This is the Savant Build System website (savantbuild.org). It is a Jekyll static site deployed to GitHub Pages.

## Claude Code Directories

All Claude Code artifacts live under `.claude/` to keep them out of the published site:

- `.claude/plans/` — Implementation plans
- `.claude/specs/` — Design specs
- `.claude/brainstorm/` — Visual brainstorming session files and superpowers (gitignored)

When creating new plans or specs, save them in the appropriate `.claude/` subdirectory, not under `docs/`.

## Build

```bash
npm run build:css   # Compile Tailwind CSS (requires npm install first)
bundle exec jekyll build   # Build the site
bundle exec jekyll serve   # Serve locally at http://localhost:4000
```

## Structure

- `_layouts/` — Page layout templates (homepage, default, docs)
- `_includes/` — Reusable HTML partials (head, header, footer, sidebar)
- `css/` — Stylesheets (Tailwind source + syntax highlighting)
- `js/` — JavaScript (dark mode, docs TOC)
- `docs/` — Documentation content (Markdown)
- `images/` — Static images
