import fs from 'node:fs';
import path from 'node:path';

const QUEUE_DIR = path.resolve('content-queue');
const BLOG_DIR = path.resolve('src/content/blog');
const PUBLIC_PROJECTS_DIR = path.resolve('public/projects');

if (!fs.existsSync(QUEUE_DIR)) {
  console.log('No content-queue directory found. Exiting.');
  process.exit(0);
}

const entries = fs
  .readdirSync(QUEUE_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

if (entries.length === 0) {
  console.log('Queue is empty. Nothing to publish today.');
  process.exit(0);
}

const nextSlug = entries[0];
const srcDir = path.join(QUEUE_DIR, nextSlug);
const destBlogDir = path.join(BLOG_DIR, nextSlug);
const srcAssets = path.join(srcDir, 'assets');
const destAssets = path.join(PUBLIC_PROJECTS_DIR, nextSlug);

fs.mkdirSync(destBlogDir, { recursive: true });

// Move markdown and non-asset files to src/content/blog/<slug>/
for (const file of fs.readdirSync(srcDir)) {
  if (file === 'assets') continue;
  fs.renameSync(path.join(srcDir, file), path.join(destBlogDir, file));
}

// Move downloadable assets (infographics, specs, etc.) to public/projects/<slug>/
if (fs.existsSync(srcAssets)) {
  fs.mkdirSync(destAssets, { recursive: true });
  for (const asset of fs.readdirSync(srcAssets)) {
    fs.renameSync(path.join(srcAssets, asset), path.join(destAssets, asset));
  }
  fs.rmSync(srcAssets, { recursive: true, force: true });
}

fs.rmSync(srcDir, { recursive: true, force: true });
console.log(`Published daily project: ${nextSlug}`);
