import type { Dimension } from '../data/questions';

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

export function calculateScores(
  answers: Record<number, number>,
  questionDimensions: Record<number, Dimension>,
): DISCResult {
  const rawScores: Scores = { D: 0, I: 0, S: 0, C: 0 };

  for (const [questionId, value] of Object.entries(answers)) {
    const dimension = questionDimensions[Number(questionId)];
    if (dimension) {
      rawScores[dimension] += value;
    }
  }

  const normalizedScores: Scores = {
    D: Math.round(((rawScores.D - 6) / 24) * 100),
    I: Math.round(((rawScores.I - 6) / 24) * 100),
    S: Math.round(((rawScores.S - 6) / 24) * 100),
    C: Math.round(((rawScores.C - 6) / 24) * 100),
  };

  const sorted = (Object.entries(normalizedScores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  const dominant = sorted[0][0];
  const secondary = sorted[0][1] - sorted[1][1] < 15 ? sorted[1][0] : null;

  return { rawScores, normalizedScores, dominant, secondary };
}
