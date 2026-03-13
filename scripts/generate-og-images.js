const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', '_site');
const OG_DIR = path.join(SITE_DIR, 'images', 'og');
const TEMPLATE_PATH = path.join(__dirname, 'og-template.html');

// Directories to skip — javadoc and groovydoc pages don't need OG images
const EXCLUDED_DIRS = ['docs/javadoc'];
// Also skip groovydoc dirs nested under plugin pages (e.g., docs/plugins/java/docs/)
const EXCLUDED_PATTERNS = [/^docs\/plugins\/[^/]+\/docs/];

// Titles to skip — redirect pages, etc.
const EXCLUDED_TITLES = ['Redirecting...'];

function findHtmlFiles(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const relPath = path.join(basePath, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.some(ex => relPath.startsWith(ex))) continue;
      if (EXCLUDED_PATTERNS.some(pat => pat.test(relPath))) continue;
      files = files.concat(findHtmlFiles(path.join(dir, entry.name), relPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(relPath);
    }
  }
  return files;
}

function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  if (!match) return null;
  // Remove the " - Savant Build" suffix to get just the page title
  return match[1].replace(/\s*-\s*Savant Build$/, '').trim();
}

function computeSlug(filePath) {
  // index.html at root → "home"
  if (filePath === 'index.html') return 'home';
  // Remove index.html and .html, replace / with -
  return filePath
    .replace(/\/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\//g, '-');
}

async function main() {
  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const htmlFiles = findHtmlFiles(SITE_DIR);

  fs.mkdirSync(OG_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  let generated = 0;

  for (const filePath of htmlFiles) {
    const fullPath = path.join(SITE_DIR, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const title = extractTitle(content);
    if (!title || EXCLUDED_TITLES.includes(title)) continue;

    const slug = computeSlug(filePath);
    const outputPath = path.join(OG_DIR, `${slug}.png`);

    const html = templateHtml.replace('{{TITLE}}', title.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: outputPath, type: 'png' });
    generated++;
    console.log(`  ${slug}.png <- "${title}"`);
  }

  await browser.close();
  console.log(`\nGenerated ${generated} OG images in _site/images/og/`);
}

main().catch(err => {
  console.error('OG image generation failed:', err);
  process.exit(1);
});
