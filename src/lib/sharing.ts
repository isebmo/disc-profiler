import type { Scores } from './scoring';

export function encodeResults(scores: Scores): string {
  return btoa(`${scores.D}-${scores.I}-${scores.S}-${scores.C}`);
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

/** Extract encoded results from a full share URL or just the encoded string */
export function parseShareUrl(input: string): Scores | null {
  const trimmed = input.trim();
  // Try as a URL with ?r= param
  try {
    const url = new URL(trimmed);
    const r = url.searchParams.get('r');
    if (r) return decodeResults(r);
  } catch {
    // Not a URL, try as raw encoded string
  }
  return decodeResults(trimmed);
}

export function getShareUrl(scores: Scores): string {
  const encoded = encodeResults(scores);
  const url = new URL(window.location.href.split('?')[0]);
  url.searchParams.set('r', encoded);
  return url.toString();
}

// ── Team sharing ──

export interface TeamMember {
  name: string;
  scores: Scores;
}

export function encodeTeam(members: TeamMember[]): string {
  const data = members.map((m) => ({
    n: m.name,
    d: m.scores.D,
    i: m.scores.I,
    s: m.scores.S,
    c: m.scores.C,
  }));
  return btoa(JSON.stringify(data));
}

export function decodeTeam(encoded: string): TeamMember[] | null {
  try {
    const data = JSON.parse(atob(encoded));
    if (!Array.isArray(data)) return null;
    return data.map((m: { n: string; d: number; i: number; s: number; c: number }) => ({
      name: m.n,
      scores: { D: m.d, I: m.i, S: m.s, C: m.c },
    }));
  } catch {
    return null;
  }
}
