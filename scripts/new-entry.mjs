#!/usr/bin/env node
/**
 * Scaffold a changelog entry with everything discoverable pre-filled.
 *
 *   npm run new:ota                        OTA update entry
 *   npm run new:ota -- "Custom title"
 *   npm run new:release -- "Big 1.1 update"   App Store build entry
 *
 * Pulls version + commit sha from the app repo, and (for OTA entries) the
 * latest published update group from EAS. You write the notes; nothing else.
 *
 * The app repo is assumed to sit next to this one; override with APP_REPO=path.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SITE_ROOT = path.resolve(import.meta.dirname, '..');
const APP_REPO = process.env.APP_REPO ?? path.resolve(SITE_ROOT, '..', 'JJay-app');
const EAS_BRANCH = process.env.EAS_BRANCH ?? 'production';

const [type, ...titleParts] = process.argv.slice(2);
if (type !== 'ota' && type !== 'binary') {
  console.error('Usage: node scripts/new-entry.mjs <ota|binary> [title]');
  process.exit(1);
}

function sh(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

// version: from app.config.js (regex — the config is JS, not JSON)
let version = 'REPLACE_ME';
try {
  const config = fs.readFileSync(path.join(APP_REPO, 'app.config.js'), 'utf8');
  version = config.match(/version:\s*['"]([^'"]+)['"]/)?.[1] ?? version;
} catch {
  console.warn(`! could not read ${APP_REPO}/app.config.js — fill in version yourself`);
}

// commit: the app repo's current HEAD
const commit = sh(`git -C "${APP_REPO}" rev-parse --short HEAD`);

// updateGroup + suggested title: latest published EAS update (read-only)
let updateGroup = null;
let easTitle = null;
if (type === 'ota') {
  console.log(`Fetching latest update on branch "${EAS_BRANCH}" from EAS…`);
  const raw = sh(
    `npx --yes eas-cli update:list --branch ${EAS_BRANCH} --limit 1 --non-interactive --json`,
    APP_REPO
  );
  const jsonStart = raw?.indexOf('{') ?? -1;
  if (jsonStart >= 0) {
    try {
      const latest = JSON.parse(raw.slice(jsonStart)).currentPage?.[0];
      updateGroup = latest?.group ?? null;
      // message looks like: "The title" (2 days ago by userlaws)
      easTitle = latest?.message?.match(/^"(.*)"\s*\(/)?.[1] ?? null;
      if (latest?.runtimeVersion) version = latest.runtimeVersion;
    } catch {
      /* fall through to placeholder */
    }
  }
  if (!updateGroup) {
    updateGroup = 'REPLACE_ME';
    console.warn('! could not fetch the update group from EAS — paste it in yourself');
  }
}

const title =
  titleParts.join(' ').trim() ||
  easTitle ||
  (type === 'ota' ? 'Fixes and improvements' : 'App Store release');

// local date, not UTC — a 9 PM release should not be dated tomorrow
const now = new Date();
const date = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-');
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 48);

const file = path.join(SITE_ROOT, 'src/content/changelog', `${date}-${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`! ${path.relative(SITE_ROOT, file)} already exists — pick a different title`);
  process.exit(1);
}

const frontmatter = [
  '---',
  `version: "${version}"`,
  `date: "${date}"`,
  `type: "${type}"`,
  ...(type === 'ota' ? [`updateGroup: "${updateGroup}"`] : []),
  ...(commit ? [`commit: "${commit}"`] : []),
  `title: "${title.replace(/"/g, '\\"')}"`,
  '---',
  '',
  '- What changed, in words a student would use.',
  '- One bullet per change. Delete these two.',
  '',
].join('\n');

fs.writeFileSync(file, frontmatter);
console.log(`\n✓ ${path.relative(SITE_ROOT, file)}`);
console.log('\nNext: write the notes, then');
console.log('  git add -A && git commit -m "Changelog: <title>" && git push');
console.log('Vercel rebuilds on push — live in about a minute.');
