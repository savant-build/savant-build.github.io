# Savant Website Redesign — Tailwind CSS

## Overview

Full redesign of savantbuild.org using Tailwind CSS. Dark-first theme with light mode toggle. Balanced approach: polished homepage for newcomers + well-structured documentation for existing users. Jekyll remains the static site generator.

## Technology Stack

- **SSG:** Jekyll (unchanged), deployed to GitHub Pages via GitHub Actions
- **CSS:** Tailwind CSS via PostCSS pipeline (`postcss` + `tailwindcss` + `autoprefixer` as Node dev deps)
- **Config:** `postcss.config.js` at root, `tailwind.config.js` with `darkMode: 'class'`
- **Main CSS:** Imports Tailwind layers (`@tailwind base/components/utilities`)
- **Fonts:** Inter (body) + JetBrains Mono (code) via Google Fonts
- **Icons:** Inline SVGs / Heroicons — no Font Awesome
- **JS:** Vanilla only — dark/light toggle + mobile nav hamburger. Remove Prime.js.
- **Dark/light mode:** `darkMode: 'class'` strategy. JS snippet reads `localStorage` (defaults to dark), toggles `dark` class on `<html>`. Toggle button in header (sun/moon icon).
- **Syntax highlighting:** Jekyll's built-in Rouge highlighter with a custom CSS theme file (`css/highlight.css`) targeting Rouge's output classes. Token colors use the sky/emerald/amber/rose palette on the always-dark code block background. Language labels injected via a custom Liquid include that wraps code blocks.

### Theme Removal

Remove `theme: minima` from `_config.yml` and `gem "minima"` from `Gemfile`. All layouts (`homepage.html`, `default.html`, `docs.html`) are built from scratch — no inherited theme templates.

### Build Pipeline

GitHub Pages cannot run Node/PostCSS natively. Use a GitHub Actions workflow:

1. `setup-node` → `npm ci` (installs tailwindcss, postcss, autoprefixer)
2. `npm run build:css` → compiles `css/main.css` (Tailwind directives) into `css/styles.css`
3. `setup-ruby` → `bundle install` → `jekyll build`
4. Deploy `_site/` to GitHub Pages

The compiled `css/styles.css` is **not** committed — it is generated in CI only. A `package.json` at the repo root defines the `build:css` script.

## Page Structure & Layouts

### Global Header

- Fixed top bar, `slate-900` (dark) / `white` (light), consistent across all pages
- Left: Savant logo + wordmark
- Center/right: nav links — Docs, Getting Started, Download, GitHub (external link icon)
- Far right: dark/light toggle + mobile hamburger
- Mobile: hamburger opens slide-out drawer with all nav links

### Layout 1: Homepage (`homepage.html`)

- **Hero:** Full-width dark gradient (`slate-950` → `slate-900`). Large heading, one-line tagline, prominent copyable install command in terminal-style box with copy button. "Read the Docs" secondary link below.
- **Feature cards:** 3-column grid (stacks on mobile) — Fast Builds, Dependency Management, Plugin System. Icon + title + description each.
- **Code example section:** Side-by-side `build.savant` file and CLI output.
- **Footer:** Links to GitHub, Docs, Download, Contributing, Savant org. Copyright.

### Layout 2: Default (`default.html`)

- For standalone pages (download, contributing)
- Header + single centered content column (max ~72ch) + footer

### Layout 3: Documentation (`docs.html`)

- **Three-column layout:**
  - **Left sidebar (240px, fixed):** Flat section navigation with uppercase category headers. All items visible. Active page: blue left border + lighter text. Independently scrollable.
  - **Center content (fluid, max ~65ch):** Doc page from Markdown. Distinct code blocks.
  - **Right sidebar (200px, fixed):** "On this page" outline from h2/h3 headings. Highlights current section on scroll. Hidden below ~1280px.
- **Mobile:** Left sidebar becomes slide-out drawer. Right sidebar hidden.

## Content Structure

```
/                           → Homepage
/docs/                      → Docs landing (overview + section links)
/docs/getting-started/      → Installation & first build
/docs/build-files/          → Build file topics
  project-info, dependencies, publications, targets,
  output, plugins, variables, failing-the-build
/docs/dependency-management/ → Dep management topics
  index, repositories
/docs/plugins/              → Plugin topics
  index, writing-plugins, per-plugin pages
/docs/releasing/            → Release process
/download/                  → Download page (default layout)
/contributing/              → Contributing page (default layout)
```

Key changes:
- Getting Started moves from `/getting-started` to `/docs/getting-started/`. The old `getting-started.md` at the root becomes a redirect stub using a meta-refresh layout (no plugin dependency) pointing to `/docs/getting-started/`.
- Download and Contributing stay as standalone pages. They appear in the header nav and footer, not the docs sidebar.
- JavaDoc directories for core libraries remain as-is (auto-generated, not restyled).

### Left Sidebar Nav Order

1. **Getting Started** — Installation, Quick Start
2. **Build Files** — Project Info, Dependencies, Publications, Targets, Output, Failing the Build, Plugins, Variables
3. **Dependency Management** — Overview, Repositories
4. **Plugins** — Overview, Writing Plugins, then all individual plugin pages listed alphabetically: Database, Debian, Dependency, File, Groovy, Groovy TestNG, Idea, Java, Java TestNG, Release Git, Spock, Tomcat, Webapp. Plugin list is generated dynamically from pages in `docs/plugins/` via front matter (any new plugin page added to that directory automatically appears).
5. **Releasing** — Release process

## Color System

### Dark Mode (default)

| Role | Token | Hex |
|------|-------|-----|
| Page background | `slate-950` | #020617 |
| Content/card bg | `slate-900` | #0f172a |
| Sidebar bg | `slate-950` | #020617 |
| Borders | `slate-700` | #334155 |
| Body text | `slate-300` | #cbd5e1 |
| Headings | `white` | #ffffff |
| Accent/links | `sky-400` | #38bdf8 |
| Accent hover | `sky-300` | #7dd3fc |
| Muted text | `slate-500` | #64748b |

### Light Mode

| Role | Token | Hex |
|------|-------|-----|
| Page background | `white` | #ffffff |
| Content/card bg | `slate-50` | #f8fafc |
| Sidebar bg | `white` | #ffffff |
| Borders | `slate-200` | #e2e8f0 |
| Body text | `slate-700` | #334155 |
| Headings | `slate-900` | #0f172a |
| Accent/links | `sky-600` | #0284c7 |
| Muted text | `slate-400` | #94a3b8 |

### Code Blocks (both modes — always dark)

| Role | Token | Hex |
|------|-------|-----|
| Background | `slate-800` | #1e293b |
| Border | `slate-700` | #334155 |
| Text | `slate-200` | #e2e8f0 |

- Border-radius: 8px
- Font: JetBrains Mono, 14px
- Syntax highlighting: sky/emerald/amber/rose for keywords/strings/numbers/errors
- Copy button top-right on hover with "Copied!" feedback
- Language label top-left (e.g., "groovy", "bash")

## Typography

- Headings: Inter, semibold/bold
- Body: Inter, regular, 16px base, 1.7 line-height
- Code: JetBrains Mono
- Prose max-width: ~65ch

## Interactive Details

- Sidebar active item: left border `sky-400`, text `white` (dark) / `sky-700` (light)
- Links underline on hover
- Smooth scroll for "on this page" anchor links
- Dark/light toggle: sun/moon icon swap
- Mobile nav: slide-out drawer
