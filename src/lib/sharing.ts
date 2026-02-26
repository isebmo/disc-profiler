import type { Scores } from './scoring';

export function encodeResults(scores: Scores): string {
  const data = `${scores.D}-${scores.I}-${scores.S}-${scores.C}`;
  return btoa(data);
}

export function decodeResults(encoded: string): Scores | null {
  try {
    const data = atob(encoded);
    const parts = data.split('-').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return null;
    const [D, I, S, C] = parts;
    if ([D, I, S, C].some((v) => v < 0 || v > 100)) return null;
    return { D, I, S, C };
  } catch {
    return null;
  }
}

export function getShareUrl(scores: Scores): string {
  const encoded = encodeResults(scores);
  const url = new URL(window.location.href.split('?')[0]);
  url.searchParams.set('r', encoded);
  return url.toString();
}
