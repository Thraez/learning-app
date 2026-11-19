import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { bucket, collectUrls, plan } from '../scripts/check-links.mjs';
import { parseCourses } from '../src/build/parse-courses.ts';

// No network here: the link check itself runs only in CI on pull requests.
describe('source link check', () => {
  it('fails only on 404 and 410', () => {
    expect(bucket(200)).toBe('ok');
    expect(bucket(302)).toBe('ok');
    expect(bucket(404)).toBe('dead');
    expect(bucket(410)).toBe('dead');
    for (const blocked of [0, 401, 403, 418, 429, 500, 503]) expect(bucket(blocked)).toBe('unknown');
  });

  it('judges a DOI by its first answer and asks the OSF API for an OSF id', () => {
    expect(plan('https://doi.org/10.1371/journal.pone.0186407')).toMatchObject({ request: 'https://doi.org/10.1371/journal.pone.0186407', redirect: 'manual' });
    expect(plan('https://osf.io/kzy7u')).toMatchObject({ request: 'https://api.osf.io/v2/guids/kzy7u/', redirect: 'manual' });
    expect(plan('https://arxiv.org/abs/2210.07970')).toMatchObject({ request: 'https://arxiv.org/abs/2210.07970', redirect: 'follow' });
  });

  it('finds the same source links as the build parser', () => {
    const root = resolve(import.meta.dirname, '..', 'courses');
    const fromParser = new Set(parseCourses(root).courses.flatMap((c) => c.lessons.flatMap((l) => l.sources.map((s) => s.url))));
    expect(new Set(collectUrls(root).keys())).toEqual(fromParser);
    expect(fromParser.size).toBeGreaterThan(20);
  });
});
