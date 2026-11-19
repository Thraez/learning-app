export function bucket(status: number): 'ok' | 'dead' | 'unknown';
export function plan(url: string): { request: string; redirect: 'manual' | 'follow'; how: string };
export function collectUrls(coursesRoot: string): Map<string, string[]>;
export function checkUrl(url: string): Promise<{ url: string; how: string; code: number; detail: string; result: 'ok' | 'dead' | 'unknown' }>;
