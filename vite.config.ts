import { defineConfig, type Plugin } from 'vite';
import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { parseCourses } from './src/build/parse-courses.ts';

const COURSES = resolve(import.meta.dirname, 'courses');

function buildId(): string {
  const sha = process.env.GITHUB_SHA?.slice(0, 7) ?? (() => {
    try { return execSync('git rev-parse --short HEAD').toString().trim(); } catch { return 'local'; }
  })();
  return `${sha}-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}`;
}
const BUILD_ID = buildId();

/** Parses courses/ at build time and serves the result as the module "virtual:courses". */
function courses(): Plugin {
  const id = 'virtual:courses';
  const resolved = '\0' + id;
  return {
    name: 'courses',
    resolveId: (s) => (s === id ? resolved : null),
    load(s) {
      if (s !== resolved) return null;
      return `export default ${JSON.stringify(parseCourses(COURSES))};`;
    },
    configureServer(server) {
      server.watcher.add(COURSES);
      server.watcher.on('change', (f) => {
        if (f.startsWith(COURSES)) {
          const m = server.moduleGraph.getModuleById(resolved);
          if (m) server.moduleGraph.invalidateModule(m);
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

/** After the build, writes sw.js with the exact list of files in dist, so the precache never 404s. */
function serviceWorker(): Plugin {
  let outDir = 'dist';
  return {
    name: 'service-worker',
    apply: 'build',
    configResolved(c) { outDir = c.build.outDir; },
    closeBundle() {
      const files: string[] = [];
      const walk = (d: string) => {
        for (const f of readdirSync(d)) {
          const p = join(d, f);
          if (statSync(p).isDirectory()) walk(p);
          else if (f !== 'sw.js') files.push(relative(outDir, p).split('\\').join('/'));
        }
      };
      walk(outDir);
      const urls = ['./', ...files.map((f) => './' + f)];
      const tpl = readFileSync(resolve(import.meta.dirname, 'src/sw-template.js'), 'utf8');
      writeFileSync(join(outDir, 'sw.js'), tpl.replace('__CACHE__', `learning-app-${BUILD_ID}`).replace('__PRECACHE__', JSON.stringify(urls)));
    },
  };
}

export default defineConfig({
  base: './',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [courses(), serviceWorker()],
  build: { target: 'es2020' },
  test: { include: ['test/**/*.test.ts'] },
} as never);
