import { describe, expect, it } from 'vitest';
import { checkLine, formatCheckDate, readDepth, shortName, tierWords, trustView } from '../src/trust';
import type { Lesson } from '../src/types';

const lesson = (over: Partial<Lesson>): Lesson => ({
  id: 't/a', slug: 'a', file: 'lessons/01-a.md', title: 'A', order: 1, status: 'draft', sources: [], blocks: [], itemIds: [], visualIds: [], ...over,
});

describe('trust display data', () => {
  it('formats the check line for a checked and an unchecked lesson', () => {
    expect(formatCheckDate('2026-11-16')).toBe('16 Nov 2026');
    expect(checkLine({ checked: '2026-11-16' })).toBe('Checked against its sources on 16 Nov 2026');
    expect(checkLine({})).toBe('Not yet checked against its sources');
  });

  it('shortens cites to a short name', () => {
    expect(shortName('Zivic, Andjelkovic, Ozden, Dekic, Castronova (2017). Results of a massive experiment. PLOS ONE')).toBe('Zivic et al. 2017');
    expect(shortName('Ascarza (2018). Retention Futility.')).toBe('Ascarza 2018');
    expect(shortName('Hullett, Nagappan (2012). Empirical analysis.')).toBe('Hullett and Nagappan 2012');
    expect(shortName('A report with no year in parentheses, and a long title')).toBe('A report with no year in parentheses, and a long title'.slice(0, 40));
  });

  it('words the tiers', () => {
    expect(tierWords(1)).toBe('peer-reviewed');
    expect(tierWords(2)).toBe('preprint or report, not peer-reviewed');
    expect(tierWords(3)).toBe("a studio's own report");
  });

  it('uses read when present, else the grade', () => {
    expect(readDepth({ read: 'abstract only', grade: 'A' })).toBe('abstract only');
    expect(readDepth({ grade: 'A' })).toBe('read in the paper itself');
    expect(readDepth({ grade: 'B' })).toBe('secondary summary only');
    expect(readDepth({ grade: 'C' })).toBe('inference, no direct study');
  });

  it('builds the view for a checked lesson with and without read', () => {
    const l = lesson({
      checked: '2026-11-16',
      ledgerUrl: 'https://github.com/x/ledger.md',
      sources: [
        { cite: 'Zivic, Andjelkovic, Ozden (2017). Title.', url: 'https://doi.org/a', tier: 1, grade: 'A', read: 'full text', caveat: 'One study, one game.' },
        { cite: 'Drachen, Thurau (2014). Title.', url: 'https://arxiv.org/b', tier: 2, grade: 'B' },
      ],
    });
    const v = trustView(l);
    expect(v.checkLine).toBe('Checked against its sources on 16 Nov 2026');
    expect(v.ledgerUrl).toBe('https://github.com/x/ledger.md');
    expect(v.sources[0]).toEqual({ name: 'Zivic et al. 2017', url: 'https://doi.org/a', tier: 'peer-reviewed', read: 'full text', caveat: 'One study, one game.' });
    expect(v.sources[1]).toMatchObject({ name: 'Drachen and Thurau 2014', tier: 'preprint or report, not peer-reviewed', read: 'secondary summary only', caveat: undefined });
    const u = trustView(lesson({}));
    expect(u.checked).toBe(false);
    expect(u.checkLine).toBe('Not yet checked against its sources');
  });
});
