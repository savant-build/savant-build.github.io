# Savant Website Tailwind Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign savantbuild.org with Tailwind CSS — dark-first theme with light mode, three-column docs layout, modern homepage.

**Architecture:** Jekyll remains the SSG. Tailwind CSS compiled via PostCSS in a GitHub Actions workflow. Dark mode via `class` strategy on `<html>`. Three layouts: homepage, default (standalone pages), and docs (three-column with sidebar + "on this page" outline).

**Tech Stack:** Jekyll, Tailwind CSS, PostCSS, autoprefixer, vanilla JS, Inter + JetBrains Mono fonts, GitHub Actions for CI/CD.

**Spec:** `docs/superpowers/specs/2026-03-10-tailwind-redesign-design.md`

---

## Chunk 1: Infrastructure & Build Pipeline

### Task 1: Initialize Node.js project and install Tailwind

**Files:**
- Create: `package.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "savant-build-website",
  "private": true,
  "scripts": {
    "build:css": "postcss css/main.css -o css/styles.css"
  },
  "devDependencies": {
    "tailwindcss": "^3.4",
    "postcss": "^8.4",
    "postcss-cli": "^11.0",
    "autoprefixer": "^10.4"
  }
}
```

- [ ] **Step 2: Create tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './*.md',
    './*.html',
    './docs/**/*.md',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        prose: '65ch',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

- [ ] **Step 4: Run npm install**

Run: `cd /Users/bpontarelli/dev/os/savant/savant-build.github.io && npm install`
Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 5: Add node_modules and generated CSS to .gitignore**

Modify: `.gitignore` — add these lines:

```
node_modules/
css/styles.css
.superpowers/
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tailwind.config.js postcss.config.js .gitignore
git commit -m "feat: initialize Tailwind CSS and PostCSS build pipeline"
```

---

### Task 2: Create Tailwind CSS source file

**Files:**
- Create: `css/main.css` (replaces `css/main.scss` — but don't delete the old one yet)

- [ ] **Step 1: Create css/main.css**

This is the Tailwind source file that PostCSS compiles. It imports Tailwind layers and defines custom component styles.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== Base typography ===== */
@layer base {
  html {
    @apply font-sans;
  }

  body {
    @apply bg-slate-950 text-slate-300 text-base leading-relaxed;
  }

  html:not(.dark) body {
    @apply bg-white text-slate-700;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-sans font-bold text-white;
  }

  html:not(.dark) h1,
  html:not(.dark) h2,
  html:not(.dark) h3,
  html:not(.dark) h4,
  html:not(.dark) h5,
  html:not(.dark) h6 {
    @apply text-slate-900;
  }

  a {
    @apply text-sky-400 hover:underline;
  }

  html:not(.dark) a {
    @apply text-sky-600;
  }

  /* Prose content styling */
  .prose {
    @apply max-w-prose;
  }

  .prose p {
    @apply mb-4 leading-[1.7];
  }

  .prose h2 {
    @apply text-2xl mt-10 mb-4;
  }

  .prose h3 {
    @apply text-xl mt-8 mb-3;
  }

  .prose ul, .prose ol {
    @apply mb-4 pl-6;
  }

  .prose ul {
    @apply list-disc;
  }

  .prose ol {
    @apply list-decimal;
  }

  .prose li {
    @apply mb-1;
  }

  .prose table {
    @apply w-full border-collapse mb-6;
  }

  .prose th {
    @apply text-left p-2 border border-slate-700 bg-slate-800 font-semibold text-sm text-slate-200;
  }

  html:not(.dark) .prose th {
    @apply border-slate-200 bg-slate-100 text-slate-700;
  }

  .prose td {
    @apply p-2 border border-slate-700 text-sm;
  }

  html:not(.dark) .prose td {
    @apply border-slate-200;
  }

  .prose p code, .prose li code {
    @apply bg-slate-800 text-slate-200 text-sm px-1.5 py-0.5 rounded border border-slate-700 font-mono;
  }
}

/* ===== Code blocks — always dark ===== */
@layer components {
  .highlight {
    @apply bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto mb-6 font-mono text-sm text-slate-200 relative;
  }

  .code-block-wrapper {
    @apply relative;
  }

  .code-block-wrapper .code-lang {
    @apply absolute top-2 left-3 text-xs text-slate-500 font-mono uppercase;
  }

  .code-block-wrapper .copy-btn {
    @apply absolute top-2 right-2 text-xs text-slate-500 hover:text-slate-300 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded cursor-pointer opacity-0 transition-opacity;
  }

  .code-block-wrapper:hover .copy-btn {
    @apply opacity-100;
  }
}
```

- [ ] **Step 2: Test PostCSS build**

Run: `cd /Users/bpontarelli/dev/os/savant/savant-build.github.io && npx postcss css/main.css -o css/styles.css`
Expected: `css/styles.css` generated with compiled Tailwind output.

- [ ] **Step 3: Commit**

```bash
git add css/main.css
git commit -m "feat: add Tailwind CSS source file with base styles and code block components"
```

---

### Task 3: Update Jekyll configuration and Gemfile

**Files:**
- Modify: `_config.yml`
- Modify: `Gemfile`

- [ ] **Step 1: Update _config.yml**

Remove `theme: minima`. Update the URL to https. Add `highlighter: rouge` explicitly. Exclude node files from Jekyll build.

Replace the full contents of `_config.yml` with:

```yaml
title: Savant Build
email: brian@inversoft.com
description: >
  Savant Build tool is a simple and elegant way to take back control of
  your software. With a SemVer compliant dependency management system,
  Savant just works.
baseurl: ""
url: "https://savantbuild.org"
twitter_username: inversoft
github_username: savant-build

# Build settings
markdown: kramdown
highlighter: rouge

permalink: pretty

exclude:
  - node_modules
  - package.json
  - package-lock.json
  - postcss.config.js
  - tailwind.config.js
  - Gemfile
  - Gemfile.lock
  - README.md
  - docs/superpowers
```

- [ ] **Step 2: Update Gemfile**

Remove the `minima` gem. Update Jekyll version. Remove the hardcoded `ruby RUBY_VERSION`.

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "webrick"
```

- [ ] **Step 3: Run bundle install**

Run: `cd /Users/bpontarelli/dev/os/savant/savant-build.github.io && bundle install`
Expected: Gemfile.lock updated, minima removed.

- [ ] **Step 4: Commit**

```bash
git add _config.yml Gemfile Gemfile.lock
git commit -m "feat: remove minima theme, update Jekyll config for Tailwind build"
```

---

### Task 4: Create GitHub Actions workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install Node dependencies
        run: npm ci

      - name: Build Tailwind CSS
        run: npm run build:css

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Build Jekyll
        run: bundle exec jekyll build
        env:
          JEKYLL_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for Tailwind + Jekyll build and deploy"
```

---

## Chunk 2: Core Includes (Header, Footer, Head, Dark Mode)

### Task 5: Create the dark mode toggle script

**Files:**
- Create: `js/darkmode.js`

- [ ] **Step 1: Create js/darkmode.js**

This script runs on page load to set the dark class, and provides the toggle function.

```js
(function() {
  // Apply theme immediately to avoid flash
  var theme = localStorage.getItem('theme');
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})();

function toggleDarkMode() {
  var html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  // Update toggle button icons
  document.querySelectorAll('.dark-icon').forEach(function(el) {
    el.style.display = html.classList.contains('dark') ? 'none' : 'block';
  });
  document.querySelectorAll('.light-icon').forEach(function(el) {
    el.style.display = html.classList.contains('dark') ? 'block' : 'none';
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add js/darkmode.js
git commit -m "feat: add dark mode toggle script with localStorage persistence"
```

---

### Task 6: Create the new _head.html include

**Files:**
- Modify: `_includes/_head.html`

- [ ] **Step 1: Replace _includes/_head.html**

Replace the entire contents with:

```html
<head>
  <meta charset="utf-8">
  <title>{{ page.title }} - {{ site.title }}</title>
  <meta name="description" content="{{ page.description }}"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css"/>
  <link rel="stylesheet" href="/css/highlight.css"/>
  <script src="/js/darkmode.js"></script>
</head>
```

- [ ] **Step 2: Commit**

```bash
git add _includes/_head.html
git commit -m "feat: update head include for Tailwind, Inter/JetBrains Mono fonts, dark mode"
```

---

### Task 7: Create the new _header.html include

**Files:**
- Modify: `_includes/_header.html`

- [ ] **Step 1: Replace _includes/_header.html**

Replace the entire contents with:

```html
<header class="fixed top-0 w-full z-50 bg-slate-900 border-b border-slate-700 dark:bg-slate-900 dark:border-slate-700" style="background-color: var(--header-bg, #0f172a); border-color: var(--header-border, #334155);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 no-underline hover:no-underline">
        <img src="/images/logo.png" alt="Savant" class="h-8">
        <span class="text-white font-semibold text-lg">Savant</span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6">
        <a href="/docs/" class="text-slate-300 hover:text-white text-sm no-underline transition-colors">Docs</a>
        <a href="/docs/getting-started/" class="text-slate-300 hover:text-white text-sm no-underline transition-colors">Getting Started</a>
        <a href="/download" class="text-slate-300 hover:text-white text-sm no-underline transition-colors">Download</a>
        <a href="https://github.com/savant-build" class="text-slate-300 hover:text-white text-sm no-underline transition-colors inline-flex items-center gap-1" target="_blank" rel="noopener">
          GitHub
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <!-- Dark mode toggle -->
        <button onclick="toggleDarkMode()" class="text-slate-400 hover:text-white p-1 transition-colors" aria-label="Toggle dark mode">
          <!-- Sun icon (shown in dark mode) -->
          <svg class="w-5 h-5 light-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <!-- Moon icon (shown in light mode) -->
          <svg class="w-5 h-5 dark-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        </button>
      </nav>

      <!-- Mobile hamburger -->
      <button id="mobile-menu-btn" class="md:hidden text-slate-300 hover:text-white p-1" aria-label="Open menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>

  <!-- Mobile drawer -->
  <div id="mobile-menu" class="hidden md:hidden bg-slate-900 border-t border-slate-700 px-4 pb-4">
    <a href="/docs/" class="block py-2 text-slate-300 hover:text-white text-sm no-underline">Docs</a>
    <a href="/docs/getting-started/" class="block py-2 text-slate-300 hover:text-white text-sm no-underline">Getting Started</a>
    <a href="/download" class="block py-2 text-slate-300 hover:text-white text-sm no-underline">Download</a>
    <a href="https://github.com/savant-build" class="block py-2 text-slate-300 hover:text-white text-sm no-underline" target="_blank" rel="noopener">GitHub</a>
    <button onclick="toggleDarkMode()" class="mt-2 text-slate-400 hover:text-white text-sm flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
      Toggle theme
    </button>
  </div>

  <script>
    document.getElementById('mobile-menu-btn').addEventListener('click', function() {
      var menu = document.getElementById('mobile-menu');
      menu.classList.toggle('hidden');
    });
    // Set initial icon visibility
    (function() {
      var isDark = document.documentElement.classList.contains('dark');
      document.querySelectorAll('.dark-icon').forEach(function(el) { el.style.display = isDark ? 'none' : 'block'; });
      document.querySelectorAll('.light-icon').forEach(function(el) { el.style.display = isDark ? 'block' : 'none'; });
    })();
  </script>
</header>
```

Note: The header uses a fixed `bg-slate-900` regardless of light/dark mode to keep the header consistently dark, matching the design spec.

- [ ] **Step 2: Commit**

```bash
git add _includes/_header.html
git commit -m "feat: new header with dark mode toggle, mobile drawer, and GitHub link"
```

---

### Task 8: Create the _footer.html include

**Files:**
- Create: `_includes/_footer.html`

- [ ] **Step 1: Create _includes/_footer.html**

```html
<footer class="border-t border-slate-700 mt-16 dark:border-slate-700">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-6 text-sm">
        <a href="/docs/" class="text-slate-400 hover:text-slate-200 no-underline transition-colors">Docs</a>
        <a href="/download" class="text-slate-400 hover:text-slate-200 no-underline transition-colors">Download</a>
        <a href="/contributing" class="text-slate-400 hover:text-slate-200 no-underline transition-colors">Contributing</a>
        <a href="https://github.com/savant-build" class="text-slate-400 hover:text-slate-200 no-underline transition-colors" target="_blank" rel="noopener">GitHub</a>
      </div>
      <p class="text-sm text-slate-500">&copy; {{ 'now' | date: '%Y' }} Savant Build</p>
    </div>
  </div>
</footer>

<style>
  html:not(.dark) footer { border-color: #e2e8f0; }
  html:not(.dark) footer a { color: #94a3b8; }
  html:not(.dark) footer a:hover { color: #334155; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add _includes/_footer.html
git commit -m "feat: add footer include with nav links and copyright"
```

---

## Chunk 3: Layouts

### Task 9: Create the new homepage layout

**Files:**
- Create: `_layouts/homepage.html` (directory `_layouts/` may not exist — create with `mkdir -p _layouts` first)

- [ ] **Step 1: Replace _layouts/homepage.html**

Replace the entire contents with:

```html
<!doctype html>
<html class="dark">
{% include _head.html %}
<body class="bg-slate-950 dark:bg-slate-950 min-h-screen flex flex-col">
  {% include _header.html %}

  <main class="flex-1 pt-16">
    <!-- Hero -->
    <section class="bg-gradient-to-b from-slate-950 to-slate-900 py-20 sm:py-28">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Savant Build System</h1>
        <p class="text-lg sm:text-xl text-slate-400 mb-10">A modern, dependency-aware build system for Java</p>

        <!-- Install command -->
        <div class="max-w-xl mx-auto mb-6">
          <div class="bg-slate-800 border border-slate-700 rounded-lg p-4 font-mono text-sm flex items-center justify-between gap-4">
            <code class="text-sky-400 overflow-x-auto whitespace-nowrap">
              <span class="text-slate-500">$</span> curl -sL savantbuild.org/install | bash
            </code>
            <button onclick="navigator.clipboard.writeText('curl -sL savantbuild.org/install | bash').then(function(){var b=document.getElementById('copy-feedback');b.textContent='Copied!';setTimeout(function(){b.textContent=''},2000)})" class="text-slate-500 hover:text-slate-300 flex-shrink-0 flex items-center gap-1 text-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span id="copy-feedback">Copy</span>
            </button>
          </div>
        </div>

        <a href="/docs/" class="text-sky-400 hover:text-sky-300 text-sm inline-flex items-center gap-1">
          Read the Docs
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
    </section>

    <!-- Feature cards -->
    <section class="py-16 sm:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Fast Builds -->
          <div class="bg-slate-900 border border-slate-700 rounded-lg p-6 dark:bg-slate-900 dark:border-slate-700">
            <div class="text-sky-400 mb-3">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Fast Builds</h3>
            <p class="text-slate-400 text-sm">Groovy DSL build files that are simple and declarative. No plugin dependency management overhead.</p>
          </div>
          <!-- Dependency Management -->
          <div class="bg-slate-900 border border-slate-700 rounded-lg p-6 dark:bg-slate-900 dark:border-slate-700">
            <div class="text-sky-400 mb-3">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Dependency Management</h3>
            <p class="text-slate-400 text-sm">Fully SemVer compliant. Handles the most complex dependency graphs with ease.</p>
          </div>
          <!-- Plugin System -->
          <div class="bg-slate-900 border border-slate-700 rounded-lg p-6 dark:bg-slate-900 dark:border-slate-700">
            <div class="text-sky-400 mb-3">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Plugin System</h3>
            <p class="text-slate-400 text-sm">Plugins provide reusable logic without injecting targets. You control the build flow.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code example -->
    <section class="py-16 sm:py-20 bg-slate-900/50 dark:bg-slate-900/50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-white text-center mb-10">Build files are simple</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- build.savant example -->
          <div>
            <div class="text-xs text-slate-500 font-mono mb-2 uppercase">build.savant</div>
            <div class="highlight">
<pre><code>project(group: "org.example",
        name: "my-app",
        version: "1.0.0",
        licenses: ["ApacheV2_0"])

java = loadPlugin(
  id: "org.savantbuild.plugin:java:1.0.0")
java.settings.javaVersion = "17"

target(name: "compile",
       description: "Compiles the project") {
  java.compile()
}

target(name: "test",
       description: "Runs the tests",
       dependsOn: ["compile"]) {
  java.test()
}</code></pre>
            </div>
          </div>
          <!-- CLI output -->
          <div>
            <div class="text-xs text-slate-500 font-mono mb-2 uppercase">Terminal</div>
            <div class="highlight">
<pre><code><span class="text-slate-500">$</span> <span class="text-sky-400">sb compile</span>
<span class="text-emerald-400">Compiling [main] sources</span>
<span class="text-emerald-400">Compiling [test] sources</span>

<span class="text-slate-500">$</span> <span class="text-sky-400">sb test</span>
<span class="text-emerald-400">Running tests</span>
<span class="text-emerald-400">All 42 tests passed</span>

<span class="text-slate-500">$</span> <span class="text-sky-400">sb jar</span>
<span class="text-emerald-400">Building [build/jars/my-app-1.0.0.jar]</span></code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What is Savant -->
    <section class="py-16 sm:py-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose">
        {{ content }}
      </div>
    </section>
  </main>

  {% include _footer.html %}
</body>
</html>
```

- [ ] **Step 2: Update index.md content**

Update `index.md` to only include the "What is Savant?" text section (hero and features are now in the layout). Replace with:

```markdown
---
layout: homepage
title: Savant Build System
description: Savant is a modern build tool that you don't have to battle with. It just works!
---

## What is Savant?

Savant is a modern build tool that uses a Groovy DSL for the build files. Savant is fully SemVer compliant and
handles the most complex dependency graphs easily. Savant uses a plugin approach to quickly add complex build
logic to a project.

The main difference between Savant and other build systems is that Savant does not allow plugins to add targets
to the build. This decision makes Savant declarative and simplifies the entire system by removing the need to
manage inter-plugin dependencies (i.e. the JUnit plugin depends on the Java plugin).

If you are interested in learning more about this design decision, check out the [Plugin Doc Page](/docs/plugins/)
```

- [ ] **Step 3: Verify Jekyll builds locally**

Run: `cd /Users/bpontarelli/dev/os/savant/savant-build.github.io && npx postcss css/main.css -o css/styles.css && bundle exec jekyll build 2>&1 | tail -5`
Expected: Site builds successfully with output in `_site/`.

- [ ] **Step 4: Commit**

```bash
git add _layouts/homepage.html index.md
git commit -m "feat: new homepage layout with hero, install command, feature cards, and code examples"
```

---

### Task 10: Create the new default layout

**Files:**
- Create: `_layouts/default.html`

- [ ] **Step 1: Replace _layouts/default.html**

Replace the entire contents with:

```html
<!doctype html>
<html class="dark">
{% include _head.html %}
<body class="bg-slate-950 dark:bg-slate-950 min-h-screen flex flex-col">
  {% include _header.html %}

  <main class="flex-1 pt-24 pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-8">{{ page.title }}</h1>
      <div class="prose">
        {{ content }}
      </div>
    </div>
  </main>

  {% include _footer.html %}

  <style>
    html:not(.dark) body { background-color: #ffffff; }
  </style>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add _layouts/default.html
git commit -m "feat: new default layout with centered prose content"
```

---

### Task 11: Create the new docs layout with three-column navigation

**Files:**
- Create: `_layouts/docs.html`
- Create: `_includes/_docs-sidebar.html`
- Create: `js/docs.js`

- [ ] **Step 1: Create _includes/_docs-sidebar.html**

This is the left sidebar navigation. It uses flat sections with uppercase category headers. The plugin list is dynamically generated from pages in `docs/plugins/` that have `plugin: true` in their front matter.

```html
<nav class="docs-sidebar text-sm">
  <!-- GETTING STARTED -->
  <div class="mb-6">
    <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Getting Started</h4>
    <ul class="space-y-1">
      <li><a href="/docs/getting-started/" class="block py-1 px-2 rounded {% if page.url == '/docs/getting-started/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Installation</a></li>
    </ul>
  </div>

  <!-- BUILD FILES -->
  <div class="mb-6">
    <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Build Files</h4>
    <ul class="space-y-1">
      <li><a href="/docs/build-files/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Overview</a></li>
      <li><a href="/docs/build-files/project-info/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/project-info/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Project Info</a></li>
      <li><a href="/docs/build-files/dependencies/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/dependencies/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Dependencies</a></li>
      <li><a href="/docs/build-files/publications/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/publications/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Publications</a></li>
      <li><a href="/docs/build-files/targets/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/targets/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Targets</a></li>
      <li><a href="/docs/build-files/output/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/output/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Output</a></li>
      <li><a href="/docs/build-files/failing-the-build/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/failing-the-build/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Failing the Build</a></li>
      <li><a href="/docs/build-files/plugins/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/plugins/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Plugins</a></li>
      <li><a href="/docs/build-files/variables/" class="block py-1 px-2 rounded {% if page.url == '/docs/build-files/variables/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Variables</a></li>
    </ul>
  </div>

  <!-- DEPENDENCY MANAGEMENT -->
  <div class="mb-6">
    <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Dependency Management</h4>
    <ul class="space-y-1">
      <li><a href="/docs/dependency-management/" class="block py-1 px-2 rounded {% if page.url == '/docs/dependency-management/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Overview</a></li>
      <li><a href="/docs/dependency-management/repositories/" class="block py-1 px-2 rounded {% if page.url == '/docs/dependency-management/repositories/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Repositories</a></li>
    </ul>
  </div>

  <!-- PLUGINS -->
  <div class="mb-6">
    <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Plugins</h4>
    <ul class="space-y-1">
      <li><a href="/docs/plugins/" class="block py-1 px-2 rounded {% if page.url == '/docs/plugins/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Overview</a></li>
      <li><a href="/docs/plugins/writing-plugins/" class="block py-1 px-2 rounded {% if page.url == '/docs/plugins/writing-plugins/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Writing Plugins</a></li>
      {% assign plugin_pages = site.pages | where: "plugin", true | sort: "plugin_name" %}
      {% for plugin_page in plugin_pages %}
      <li><a href="{{ plugin_page.url }}" class="block py-1 px-2 rounded {% if page.url == plugin_page.url %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">{{ plugin_page.plugin_name }}</a></li>
      {% endfor %}
    </ul>
  </div>

  <!-- RELEASING -->
  <div class="mb-6">
    <h4 class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">Releasing</h4>
    <ul class="space-y-1">
      <li><a href="/docs/releasing/" class="block py-1 px-2 rounded {% if page.url == '/docs/releasing/' %}text-white bg-slate-800 border-l-2 border-sky-400{% else %}text-slate-400 hover:text-slate-200{% endif %} no-underline transition-colors">Releasing a Project</a></li>
    </ul>
  </div>
</nav>
```

- [ ] **Step 2: Create js/docs.js**

This script generates the "on this page" right sidebar from h2/h3 headings and highlights the current section on scroll.

```js
document.addEventListener('DOMContentLoaded', function() {
  var toc = document.getElementById('toc-list');
  var content = document.getElementById('docs-content');
  if (!toc || !content) return;

  // Build TOC from h2 and h3 elements
  var headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    document.getElementById('toc-sidebar').style.display = 'none';
    return;
  }

  headings.forEach(function(heading) {
    // Ensure heading has an id
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    a.className = 'block py-1 text-slate-500 hover:text-slate-300 no-underline transition-colors text-xs';
    if (heading.tagName === 'H3') {
      a.classList.add('pl-3');
    }
    li.appendChild(a);
    toc.appendChild(li);
  });

  // Highlight current section on scroll
  var tocLinks = toc.querySelectorAll('a');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        tocLinks.forEach(function(link) { link.classList.remove('text-sky-400'); link.classList.add('text-slate-500'); });
        var activeLink = toc.querySelector('a[href="#' + entry.target.id + '"]');
        if (activeLink) {
          activeLink.classList.remove('text-slate-500');
          activeLink.classList.add('text-sky-400');
        }
      }
    });
  }, { rootMargin: '-80px 0px -80% 0px' });

  headings.forEach(function(heading) { observer.observe(heading); });

  // Smooth scroll
  toc.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      var target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, null, e.target.getAttribute('href'));
      }
    }
  });
});
```

- [ ] **Step 3: Replace _layouts/docs.html**

Replace the entire contents with:

```html
<!doctype html>
<html class="dark">
{% include _head.html %}
<body class="bg-slate-950 dark:bg-slate-950 min-h-screen flex flex-col">
  {% include _header.html %}

  <div class="flex-1 pt-16 flex">
    <!-- Left sidebar -->
    <aside class="hidden lg:block w-60 flex-shrink-0 border-r border-slate-700 overflow-y-auto fixed top-16 bottom-0 bg-slate-950 dark:bg-slate-950 p-4">
      {% include _docs-sidebar.html %}
    </aside>

    <!-- Mobile sidebar toggle -->
    <button id="docs-sidebar-btn" class="lg:hidden fixed bottom-4 left-4 z-40 bg-sky-500 text-white p-3 rounded-full shadow-lg" aria-label="Open docs navigation">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>

    <!-- Mobile sidebar drawer -->
    <div id="docs-sidebar-drawer" class="hidden lg:hidden fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/60" id="docs-sidebar-overlay"></div>
      <aside class="absolute left-0 top-0 bottom-0 w-72 bg-slate-950 border-r border-slate-700 p-4 overflow-y-auto">
        <button id="docs-sidebar-close" class="mb-4 text-slate-400 hover:text-white" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        {% include _docs-sidebar.html %}
      </aside>
    </div>

    <!-- Main content area -->
    <div class="flex-1 lg:ml-60 min-w-0">
      <div class="max-w-5xl mx-auto flex">
        <!-- Center content -->
        <main id="docs-content" class="flex-1 min-w-0 px-6 sm:px-8 py-8">
          <h1 class="text-3xl font-bold text-white mb-6">{{ page.title }}</h1>
          <div class="prose">
            {{ content }}
          </div>
        </main>

        <!-- Right "on this page" sidebar -->
        <aside id="toc-sidebar" class="hidden xl:block w-52 flex-shrink-0 py-8 pr-4">
          <div class="sticky top-24">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">On this page</h4>
            <ul id="toc-list" class="space-y-0.5 border-l border-slate-700 pl-3">
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>

  {% include _footer.html %}

  <script src="/js/docs.js"></script>
  <script>
    // Mobile docs sidebar
    var sidebarBtn = document.getElementById('docs-sidebar-btn');
    var sidebarDrawer = document.getElementById('docs-sidebar-drawer');
    var sidebarOverlay = document.getElementById('docs-sidebar-overlay');
    var sidebarClose = document.getElementById('docs-sidebar-close');

    function openSidebar() { sidebarDrawer.classList.remove('hidden'); }
    function closeSidebar() { sidebarDrawer.classList.add('hidden'); }

    if (sidebarBtn) sidebarBtn.addEventListener('click', openSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  </script>

  <style>
    html:not(.dark) body { background-color: #ffffff; }
    html:not(.dark) aside { background-color: #ffffff; border-color: #e2e8f0; }
    html:not(.dark) .docs-sidebar a { color: #64748b; }
    html:not(.dark) .docs-sidebar a:hover { color: #334155; }
    html:not(.dark) .docs-sidebar a.text-white { color: #0284c7; }
  </style>
</body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git add _layouts/docs.html _includes/_docs-sidebar.html js/docs.js
git commit -m "feat: three-column docs layout with sidebar nav and on-this-page outline"
```

---

## Chunk 4: Syntax Highlighting & Content Migration

### Task 12: Update syntax highlighting theme

**Files:**
- Modify: `css/highlight.css`

- [ ] **Step 1: Replace css/highlight.css**

Replace the entire file with a new theme using sky/emerald/amber/rose on the always-dark `slate-800` background. These classes target Rouge's output.

```css
/* Rouge syntax highlighting — always dark background */
.highlight { background-color: #1e293b; color: #e2e8f0; padding: 1rem 1.25rem; overflow-x: auto; border: 1px solid #334155; border-radius: 0.5rem; margin-bottom: 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; line-height: 1.7; }
.highlight pre { margin: 0; }
.highlight code { background: none; border: none; padding: 0; font-size: inherit; color: inherit; }
.highlight .hll { background-color: #334155; }
.highlight .c { color: #64748b; font-style: italic } /* Comment */
.highlight .cm { color: #64748b; font-style: italic } /* Comment.Multiline */
.highlight .cp { color: #64748b } /* Comment.Preproc */
.highlight .c1 { color: #64748b; font-style: italic } /* Comment.Single */
.highlight .cs { color: #64748b } /* Comment.Special */
.highlight .err { color: #fb7185 } /* Error */
.highlight .k { color: #38bdf8 } /* Keyword */
.highlight .l { color: #fbbf24 } /* Literal */
.highlight .n { color: #e2e8f0 } /* Name */
.highlight .o { color: #94a3b8 } /* Operator */
.highlight .p { color: #94a3b8 } /* Punctuation */
.highlight .ge { font-style: italic } /* Generic.Emph */
.highlight .gs { font-weight: bold } /* Generic.Strong */
.highlight .kc { color: #38bdf8 } /* Keyword.Constant */
.highlight .kd { color: #38bdf8 } /* Keyword.Declaration */
.highlight .kn { color: #fb7185 } /* Keyword.Namespace */
.highlight .kp { color: #38bdf8 } /* Keyword.Pseudo */
.highlight .kr { color: #38bdf8 } /* Keyword.Reserved */
.highlight .kt { color: #38bdf8 } /* Keyword.Type */
.highlight .ld { color: #34d399 } /* Literal.Date */
.highlight .m { color: #fbbf24 } /* Literal.Number */
.highlight .s { color: #34d399 } /* Literal.String */
.highlight .na { color: #34d399 } /* Name.Attribute */
.highlight .nb { color: #e2e8f0 } /* Name.Builtin */
.highlight .nc { color: #34d399 } /* Name.Class */
.highlight .no { color: #38bdf8 } /* Name.Constant */
.highlight .nd { color: #34d399 } /* Name.Decorator */
.highlight .ni { color: #e2e8f0 } /* Name.Entity */
.highlight .ne { color: #34d399 } /* Name.Exception */
.highlight .nf { color: #34d399 } /* Name.Function */
.highlight .nl { color: #e2e8f0 } /* Name.Label */
.highlight .nn { color: #e2e8f0 } /* Name.Namespace */
.highlight .nx { color: #34d399 } /* Name.Other */
.highlight .py { color: #e2e8f0 } /* Name.Property */
.highlight .nt { color: #fb7185 } /* Name.Tag */
.highlight .nv { color: #e2e8f0 } /* Name.Variable */
.highlight .ow { color: #fb7185 } /* Operator.Word */
.highlight .w { color: #e2e8f0 } /* Text.Whitespace */
.highlight .mf { color: #fbbf24 } /* Literal.Number.Float */
.highlight .mh { color: #fbbf24 } /* Literal.Number.Hex */
.highlight .mi { color: #fbbf24 } /* Literal.Number.Integer */
.highlight .mo { color: #fbbf24 } /* Literal.Number.Oct */
.highlight .sb { color: #34d399 } /* Literal.String.Backtick */
.highlight .sc { color: #34d399 } /* Literal.String.Char */
.highlight .sd { color: #34d399 } /* Literal.String.Doc */
.highlight .s2 { color: #34d399 } /* Literal.String.Double */
.highlight .se { color: #fbbf24 } /* Literal.String.Escape */
.highlight .sh { color: #34d399 } /* Literal.String.Heredoc */
.highlight .si { color: #34d399 } /* Literal.String.Interpol */
.highlight .sx { color: #34d399 } /* Literal.String.Other */
.highlight .sr { color: #34d399 } /* Literal.String.Regex */
.highlight .s1 { color: #34d399 } /* Literal.String.Single */
.highlight .ss { color: #34d399 } /* Literal.String.Symbol */
.highlight .bp { color: #e2e8f0 } /* Name.Builtin.Pseudo */
.highlight .vc { color: #e2e8f0 } /* Name.Variable.Class */
.highlight .vg { color: #e2e8f0 } /* Name.Variable.Global */
.highlight .vi { color: #e2e8f0 } /* Name.Variable.Instance */
.highlight .il { color: #fbbf24 } /* Literal.Number.Integer.Long */
.highlight .gh { color: #e2e8f0; font-weight: bold } /* Generic Heading */
.highlight .gu { color: #64748b; } /* Generic.Subheading */
.highlight .gd { color: #fb7185; } /* Generic.Deleted */
.highlight .gi { color: #34d399; } /* Generic.Inserted */
```

- [ ] **Step 2: Commit**

```bash
git add css/highlight.css
git commit -m "feat: update syntax highlighting theme with sky/emerald/amber/rose on dark background"
```

---

### Task 13: Move Getting Started and create redirect

**Files:**
- Create: `docs/getting-started/index.md`
- Modify: `getting-started.md` (becomes redirect stub)
- Create: `_layouts/redirect.html`

- [ ] **Step 1: Create _layouts/redirect.html**

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <meta http-equiv="refresh" content="0; url={{ page.redirect_to }}">
  <link rel="canonical" href="{{ page.redirect_to }}">
</head>
<body>
  <p>Redirecting to <a href="{{ page.redirect_to }}">{{ page.redirect_to }}</a>...</p>
</body>
</html>
```

- [ ] **Step 2: Create docs/getting-started/index.md**

Move the current getting-started content to the docs section, changing the layout to `docs`:

```markdown
---
layout: docs
title: Getting Started
description: Getting Started with Savant is simple. Just download, install and go!
---

Getting started with Savant is simple. Follow these steps to get going:

## Step 1

[Download the latest version of Savant](https://repository.savantbuild.org/org/savantbuild/savant-core/1.0.0/savant-1.0.0.tar.gz)

## Step 2

Unpack the TAR GZ file to a good location:

~~~~ bash
$ mkdir -p ~/dev/savant
$ cd ~/dev/savant
$ tar -xzvf savant-1.0.0.tar.gz
~~~~

## Step 3

Add the **bin** directory to your PATH:

~~~~ bash
$ export PATH=$PATH:~/dev/savant/savant-1.0.0/bin
~~~~

## Step 4

Test it out:

~~~~ bash
$ sb --version
~~~~
```

- [ ] **Step 3: Replace getting-started.md with redirect**

```markdown
---
layout: redirect
redirect_to: /docs/getting-started/
---
```

- [ ] **Step 4: Commit**

```bash
git add _layouts/redirect.html docs/getting-started/index.md getting-started.md
git commit -m "feat: move Getting Started under /docs/, add redirect from old URL"
```

---

### Task 14: Add plugin front matter for dynamic sidebar generation

**Files:**
- Modify: Each plugin `index.md` in `docs/plugins/*/index.md` — add `plugin: true` and `plugin_name` to front matter

- [ ] **Step 1: Add front matter to all plugin pages**

For each of these files, add `plugin: true` and `plugin_name: "<Name>"` to the existing front matter (after the `description` line):

| File | plugin_name |
|------|-------------|
| `docs/plugins/database/index.md` | Database |
| `docs/plugins/debian/index.md` | Debian |
| `docs/plugins/dependency/index.md` | Dependency |
| `docs/plugins/file/index.md` | File |
| `docs/plugins/groovy/index.md` | Groovy |
| `docs/plugins/groovy-testng/index.md` | Groovy TestNG |
| `docs/plugins/idea/index.md` | IDEA |
| `docs/plugins/java/index.md` | Java |
| `docs/plugins/java-testng/index.md` | Java TestNG |
| `docs/plugins/release-git/index.md` | Release Git |
| `docs/plugins/spock/index.md` | Spock |
| `docs/plugins/tomcat/index.md` | Tomcat |
| `docs/plugins/webapp/index.md` | Webapp |

Example for `docs/plugins/java/index.md`:
```yaml
---
layout: docs
title: Java Plugin
description: The Java plugin allows you compile and JAR your project's Java source code.
plugin: true
plugin_name: Java
---
```

- [ ] **Step 2: Commit**

```bash
git add docs/plugins/*/index.md
git commit -m "feat: add plugin front matter for dynamic sidebar generation"
```

---

## Chunk 5: Cleanup & Final Verification

### Task 15: Remove old assets

**Files:**
- Delete: `css/main.scss`
- Delete: `css/normalize-4.1.1.css`
- Delete: `js/prime-min-0.35.0.js`

- [ ] **Step 1: Delete old files**

```bash
cd /Users/bpontarelli/dev/os/savant/savant-build.github.io
git rm css/main.scss css/normalize-4.1.1.css js/prime-min-0.35.0.js
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove old SCSS, normalize.css, and Prime.js"
```

---

### Task 16: Update docs/index.md for new layout

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: Update docs/index.md**

The docs landing page should work as a gateway. Update it to reference the new Getting Started location:

```markdown
---
layout: docs
title: Documentation
description: Savant docs, tutorials, guides and more.
---

Welcome to the Savant documentation. Use the sidebar to navigate between topics.

## Core Documentation

- [Getting Started](/docs/getting-started/) — Install Savant and run your first build
- [Build Files](/docs/build-files/) — Project definitions, dependencies, targets, and plugins
- [Dependency Management](/docs/dependency-management/) — How Savant resolves and manages dependencies
- [Plugins](/docs/plugins/) — Plugin system overview and individual plugin docs
- [Releasing](/docs/releasing) — How to release a Savant project

## API Reference (JavaDoc)

- [Savant Core](savant-core/docs/)
- [Savant Dependency Management](savant-dependency-management/docs/)
- [Savant IO](savant-io/docs/)
- [Savant Utils](savant-utils/docs/)
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md
git commit -m "feat: update docs landing page with clean navigation links"
```

---

### Task 17: Full local build verification

- [ ] **Step 1: Build CSS**

Run: `cd /Users/bpontarelli/dev/os/savant/savant-build.github.io && npm run build:css`
Expected: `css/styles.css` generated without errors.

- [ ] **Step 2: Build Jekyll**

Run: `cd /Users/bpontarelli/dev/os/savant/savant-build.github.io && bundle exec jekyll build`
Expected: Site builds successfully. Check `_site/` for all expected pages.

- [ ] **Step 3: Serve locally and verify**

Run: `cd /Users/bpontarelli/dev/os/savant/savant-build.github.io && bundle exec jekyll serve`
Expected: Site served at http://localhost:4000. Manually verify:
- Homepage renders with hero, install command, feature cards, code examples
- Dark mode is default, toggle switches to light mode
- Docs pages show three-column layout (left sidebar, content, right outline)
- Getting Started redirect from `/getting-started` works
- Code blocks are always dark in both modes
- Mobile responsive: sidebar becomes drawer, nav becomes hamburger

- [ ] **Step 4: Stop server and commit any fixes**

If any fixes were needed, commit them with descriptive messages.
