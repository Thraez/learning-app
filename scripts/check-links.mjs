// Dead-link check for the source links in lesson front matter (AGENTS.md rule 4).
// Runs in CI on pull requests only: `node scripts/check-links.mjs`. Extra URLs to check may be passed as arguments.
// Exits 1 only when a link is really gone (404 or 410). A publisher that refuses automated requests, a timeout or a
// server error is listed apart as "could not check" and never fails the run, since it says nothing about the link.
import { readdirSync, readFileSync, appendFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const UA = 'Mozilla/5.0 (compatible; source-link-check)';
const TIMEOUT_MS = 20000;

/** Sorts one HTTP status (0 for a network error or timeout) into ok, dead or unknown. */
export function bucket(status) {
  if (status >= 200 && status < 400) return 'ok';
  if (status === 404 || status === 410) return 'dead';
  return 'unknown';
}

/**
 * What to request for a link, and how to read the answer.
 * - doi.org: the first answer only. A redirect means the DOI is registered; the publisher behind it often blocks bots.
 * - osf.io: its pages answer 200 even for an id that does not exist, so ask the OSF API for the id.
 */
export function plan(url) {
  const u = new URL(url);
  if (u.hostname === 'doi.org' || u.hostname === 'dx.doi.org') return { request: url, redirect: 'manual', how: 'DOI registered' };
  if (u.hostname === 'osf.io') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    if (id) return { request: `https://api.osf.io/v2/guids/${id}/`, redirect: 'manual', how: 'OSF id exists' };
  }
  return { request: url, redirect: 'follow', how: 'page opens' };
}

/** Reads every `sources[].url` from the lesson files. Returns a map of url to the files that cite it. */
export function collectUrls(coursesRoot) {
  const found = new Map();
  for (const course of readdirSync(coursesRoot, { withFileTypes: true })) {
    if (!course.isDirectory()) continue;
    const dir = join(coursesRoot, course.name, 'lessons');
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
      const text = readFileSync(join(dir, name), 'utf8').replace(/\r\n/g, '\n');
      const m = /^---\n([\s\S]*?)\n---/.exec(text);
      if (!m) continue;
      const data = parse(m[1]) ?? {};
      for (const s of Array.isArray(data.sources) ? data.sources : []) {
        const url = s && s.url ? String(s.url).trim() : '';
        if (!url) continue;
        const file = `courses/${course.name}/lessons/${name}`;
        if (!found.has(url)) found.set(url, []);
        found.get(url).push(file);
      }
    }
  }
  return found;
}

async function status(url, redirect, method) {
  try {
    const res = await fetch(url, { method, redirect, headers: { 'user-agent': UA, accept: 'text/html,application/json;q=0.9,*/*;q=0.8' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    await res.body?.cancel();
    return { code: res.status, detail: '' };
  } catch (e) {
    return { code: 0, detail: e instanceof Error ? (e.cause && e.cause.code) || e.name : 'error' };
  }
}

/** Checks one link: HEAD first, GET when HEAD is refused or unclear, one retry on anything that is not a clear answer. */
export async function checkUrl(url) {
  const p = plan(url);
  let r = await status(p.request, p.redirect, 'HEAD');
  if (bucket(r.code) !== 'ok') r = await status(p.request, p.redirect, 'GET');
  if (bucket(r.code) === 'unknown') {
    await new Promise((done) => setTimeout(done, 3000));
    r = await status(p.request, p.redirect, 'GET');
  }
  return { url, how: p.how, code: r.code, detail: r.detail, result: bucket(r.code) };
}

function report(rows, files) {
  const by = (k) => rows.filter((r) => r.result === k);
  const line = (r) => `- ${r.url} (${r.code === 0 ? `no answer: ${r.detail}` : `HTTP ${r.code}`}) in ${(files.get(r.url) ?? ['the command line']).join(', ')}`;
  const out = ['## Source links', ''];
  out.push(`${rows.length} links checked: ${by('ok').length} open, ${by('dead').length} dead, ${by('unknown').length} could not be checked.`, '');
  if (by('dead').length) out.push('### Dead (404 or 410): this fails the check', '', ...by('dead').map(line), '');
  if (by('unknown').length) out.push('### Could not check (blocked, timed out or a server error): open these by hand', '', ...by('unknown').map(line), '');
  out.push('A doi.org link counts as open when the DOI is registered; the publisher page behind it is not fetched.', '');
  return out.join('\n');
}

async function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'courses');
  const files = collectUrls(root);
  const urls = [...new Set([...files.keys(), ...process.argv.slice(2)])];
  const rows = [];
  // Four at a time: quick enough for a few dozen links, and polite to doi.org.
  for (let i = 0; i < urls.length; i += 4) rows.push(...(await Promise.all(urls.slice(i, i + 4).map(checkUrl))));
  const text = report(rows, files);
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
  process.exit(rows.some((r) => r.result === 'dead') ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
