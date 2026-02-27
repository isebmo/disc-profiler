import type { Dimension, Question } from '../data/questions';

export interface Scores {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DISCResult {
  rawScores: Scores;
  normalizedScores: Scores;
  dominant: Dimension;
  secondary: Dimension | null;
}

/**
 * Calculate DISC scores from answers.
 * Handles variable number of questions per dimension (for adaptive mode).
 */
export function calculateScores(
  answers: Record<number, number>,
  allQuestions: Question[],
): DISCResult {
  const rawScores: Scores = { D: 0, I: 0, S: 0, C: 0 };
  const counts: Scores = { D: 0, I: 0, S: 0, C: 0 };

  for (const q of allQuestions) {
    const value = answers[q.id];
    if (value !== undefined) {
      rawScores[q.dimension] += value;
      counts[q.dimension]++;
    }
  }

  const normalize = (dim: Dimension) => {
    const n = counts[dim];
    if (n === 0) return 0;
    // min = n*1, max = n*5, range = n*4
    return Math.round(((rawScores[dim] - n) / (n * 4)) * 100);
  };

  const normalizedScores: Scores = {
    D: normalize('D'),
    I: normalize('I'),
    S: normalize('S'),
    C: normalize('C'),
  };

  const sorted = (Object.entries(normalizedScores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  const dominant = sorted[0][0];
  const secondary = sorted[0][1] - sorted[1][1] < 15 ? sorted[1][0] : null;

  return { rawScores, normalizedScores, dominant, secondary };
}

/** Check if adaptive questions are needed (top 2 within threshold) */
export function needsAdaptive(scores: Scores, threshold = 10): [Dimension, Dimension] | null {
  const sorted = (Object.entries(scores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  if (sorted[0][1] - sorted[1][1] < threshold) {
    return [sorted[0][0], sorted[1][0]];
  }
  return null;
}

/** Get the dominant/secondary from raw scores (for shared results) */
export function resultFromScores(scores: Scores): DISCResult {
  const sorted = (Object.entries(scores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const dominant = sorted[0][0];
  const secondary = sorted[0][1] - sorted[1][1] < 15 ? sorted[1][0] : null;
  return { rawScores: scores, normalizedScores: scores, dominant, secondary };
}
