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

/** 8 types on the DISC wheel */
export type WheelType =
  | 'DIRECTIF'
  | 'PROMOUVANT'
  | 'EXPANSIF'
  | 'FACILITANT'
  | 'COOPERATIF'
  | 'COORDONNANT'
  | 'NORMATIF'
  | 'ORGANISANT';

/** Bipolar indicator: position between two poles (-100 to +100) */
export interface BipolarIndicator {
  id: string;
  leftLabel: { fr: string; en: string };
  rightLabel: { fr: string; en: string };
  /** -100 = fully left, 0 = center, +100 = fully right */
  value: number;
}

/** Perception: how you see yourself vs how others may see you under stress */
export interface Perceptions {
  selfPositive: string[];
  othersStress: string[];
}

/** Full enriched report generated from scores */
export interface DISCReport {
  result: DISCResult;
  wheelType: WheelType;
  wheelPosition: number; // 1-8 on the wheel
  oppositeType: WheelType;
  oppositePosition: number;
  bipolarIndicators: BipolarIndicator[];
  perceptions: Perceptions;
  /** Primary and secondary dimensions, sorted by score descending */
  sortedDimensions: { dim: Dimension; score: number }[];
}

// ─── Core scoring (unchanged) ────────────────────────────────

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

// ─── 8 Wheel Types ───────────────────────────────────────────

const WHEEL_TYPES: { type: WheelType; position: number; primary: Dimension; secondary: Dimension | null }[] = [
  { type: 'DIRECTIF',    position: 1, primary: 'D', secondary: null },
  { type: 'PROMOUVANT',  position: 2, primary: 'D', secondary: 'I' },
  { type: 'EXPANSIF',    position: 3, primary: 'I', secondary: null },
  { type: 'FACILITANT',  position: 4, primary: 'I', secondary: 'S' },
  { type: 'COOPERATIF',  position: 5, primary: 'S', secondary: null },
  { type: 'COORDONNANT', position: 6, primary: 'S', secondary: 'C' },
  { type: 'NORMATIF',    position: 7, primary: 'C', secondary: null },
  { type: 'ORGANISANT',  position: 8, primary: 'C', secondary: 'D' },
];

/** Map to opposite position on the wheel (position 1↔5, 2↔6, 3↔7, 4↔8) */
function getOppositePosition(pos: number): number {
  return ((pos - 1 + 4) % 8) + 1;
}

/**
 * Determine the wheel type from DISC scores.
 * Uses the top two dimensions and checks if they are close enough
 * to form a combined type. Checks both orderings (e.g. C+S and S+C both → COORDONNANT).
 */
export function getWheelType(scores: Scores): { type: WheelType; position: number } {
  const sorted = (Object.entries(scores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  const primary = sorted[0][0];
  const primaryScore = sorted[0][1];
  const secondaryDim = sorted[1][0];
  const secondaryScore = sorted[1][1];

  // If secondary is within 20 points of primary, consider combined type
  const hasCombined = primaryScore - secondaryScore < 20;

  if (hasCombined) {
    // Check both orderings: primary+secondary AND secondary+primary
    // This handles cases like C:79/S:75 → COORDONNANT (S+C blend)
    const combined =
      WHEEL_TYPES.find(
        (wt) => wt.primary === primary && wt.secondary === secondaryDim,
      ) ??
      WHEEL_TYPES.find(
        (wt) => wt.primary === secondaryDim && wt.secondary === primary,
      );
    if (combined) return { type: combined.type, position: combined.position };
  }

  // Pure type: primary dimension only
  const pure = WHEEL_TYPES.find((wt) => wt.primary === primary && wt.secondary === null);
  return pure
    ? { type: pure.type, position: pure.position }
    : { type: 'DIRECTIF', position: 1 };
}

// ─── 8 Bipolar Indicators ────────────────────────────────────

/**
 * Calculate 8 bipolar indicators from DISC scores.
 * Each indicator is a ratio between -100 and +100.
 */
export function calculateBipolarIndicators(scores: Scores): BipolarIndicator[] {
  const { D, I, S, C } = scores;

  const bipolar = (left: number, right: number): number => {
    const total = left + right;
    if (total === 0) return 0;
    return Math.round(((right - left) / total) * 100);
  };

  return [
    {
      id: 'global-detail',
      leftLabel: { fr: 'Vision globale', en: 'Big picture' },
      rightLabel: { fr: 'Attention aux détails', en: 'Attention to detail' },
      value: bipolar(D + I, S + C),
    },
    {
      id: 'task-relation',
      leftLabel: { fr: 'Orienté tâche', en: 'Task-oriented' },
      rightLabel: { fr: 'Orienté relation', en: 'People-oriented' },
      value: bipolar(D + C, I + S),
    },
    {
      id: 'results-contacts',
      leftLabel: { fr: 'Résultats & exigence', en: 'Results & standards' },
      rightLabel: { fr: 'Contacts humains', en: 'Human contacts' },
      value: bipolar(D, I),
    },
    {
      id: 'urgency-patience',
      leftLabel: { fr: 'Urgence & directivité', en: 'Urgency & directness' },
      rightLabel: { fr: 'Patience & coopération', en: 'Patience & cooperation' },
      value: bipolar(D, S),
    },
    {
      id: 'action-reflection',
      leftLabel: { fr: 'Autorité & action', en: 'Authority & action' },
      rightLabel: { fr: 'Adaptabilité & réflexion', en: 'Adaptability & reflection' },
      value: bipolar(D + I * 0.5, S + C * 0.5),
    },
    {
      id: 'exterior-concentration',
      leftLabel: { fr: 'Extériorisation', en: 'Extroversion' },
      rightLabel: { fr: 'Concentration', en: 'Concentration' },
      value: bipolar(I, C),
    },
    {
      id: 'optimism-prudence',
      leftLabel: { fr: 'Optimisme & créativité', en: 'Optimism & creativity' },
      rightLabel: { fr: 'Prévoyance & perfectionnisme', en: 'Foresight & perfectionism' },
      value: bipolar(I * 1.2, C * 1.2),
    },
    {
      id: 'stability-type',
      leftLabel: { fr: 'Stabilité affective', en: 'Emotional stability' },
      rightLabel: { fr: 'Stabilité rationnelle', en: 'Rational stability' },
      value: bipolar(S, C),
    },
  ];
}

// ─── Perceptions ─────────────────────────────────────────────

/** Perception adjectives per dimension */
const SELF_POSITIVE: Record<Dimension, { fr: string[]; en: string[] }> = {
  D: {
    fr: ['Déterminé', 'Ambitieux', 'Franc', 'Courageux', 'Efficace', 'Décisif'],
    en: ['Determined', 'Ambitious', 'Frank', 'Courageous', 'Efficient', 'Decisive'],
  },
  I: {
    fr: ['Enthousiaste', 'Optimiste', 'Persuasif', 'Sociable', 'Créatif', 'Inspirant'],
    en: ['Enthusiastic', 'Optimistic', 'Persuasive', 'Sociable', 'Creative', 'Inspiring'],
  },
  S: {
    fr: ['Fiable', 'Patient', 'À l\'écoute', 'Loyal', 'Persévérant', 'Coopératif'],
    en: ['Reliable', 'Patient', 'Good listener', 'Loyal', 'Persevering', 'Cooperative'],
  },
  C: {
    fr: ['Rigoureux', 'Méthodique', 'Précis', 'Objectif', 'Organisé', 'Analytique'],
    en: ['Rigorous', 'Methodical', 'Precise', 'Objective', 'Organized', 'Analytical'],
  },
};

const OTHERS_STRESS: Record<Dimension, { fr: string[]; en: string[] }> = {
  D: {
    fr: ['Autoritaire', 'Impatient', 'Brusque', 'Intransigeant', 'Cassant', 'Dominateur'],
    en: ['Authoritarian', 'Impatient', 'Blunt', 'Uncompromising', 'Harsh', 'Domineering'],
  },
  I: {
    fr: ['Superficiel', 'Dispersé', 'Bavard', 'Désorganisé', 'Impulsif', 'Excessif'],
    en: ['Superficial', 'Scattered', 'Talkative', 'Disorganized', 'Impulsive', 'Excessive'],
  },
  S: {
    fr: ['Passif', 'Lent', 'Indécis', 'Soumis', 'Résistant', 'Effacé'],
    en: ['Passive', 'Slow', 'Indecisive', 'Submissive', 'Resistant', 'Self-effacing'],
  },
  C: {
    fr: ['Froid', 'Perfectionniste', 'Distant', 'Rigide', 'Critique', 'Craintif'],
    en: ['Cold', 'Perfectionist', 'Distant', 'Rigid', 'Critical', 'Fearful'],
  },
};

/**
 * Generate perceptions based on sorted dimensions.
 * Takes the top 2 dimensions for self-positive and the dominant + its stress adjectives.
 */
export function generatePerceptions(
  scores: Scores,
  locale: 'fr' | 'en',
): Perceptions {
  const sorted = (Object.entries(scores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  // Self-positive: 3 from primary + 3 from secondary
  const selfPositive = [
    ...SELF_POSITIVE[primary][locale].slice(0, 3),
    ...SELF_POSITIVE[secondary][locale].slice(0, 3),
  ];

  // Others under stress: 3 from primary + 3 from secondary
  const othersStress = [
    ...OTHERS_STRESS[primary][locale].slice(0, 3),
    ...OTHERS_STRESS[secondary][locale].slice(0, 3),
  ];

  return { selfPositive, othersStress };
}

// ─── Full Report Generation ──────────────────────────────────

/**
 * Generate a full enriched DISC report from a DISCResult.
 */
export function generateReport(result: DISCResult, locale: 'fr' | 'en'): DISCReport {
  const scores = result.normalizedScores;
  const { type: wheelType, position: wheelPosition } = getWheelType(scores);

  const oppositePosition = getOppositePosition(wheelPosition);
  const oppositeEntry = WHEEL_TYPES.find((wt) => wt.position === oppositePosition)!;

  const sortedDimensions = (Object.entries(scores) as [Dimension, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([dim, score]) => ({ dim, score }));

  return {
    result,
    wheelType,
    wheelPosition,
    oppositeType: oppositeEntry.type,
    oppositePosition,
    bipolarIndicators: calculateBipolarIndicators(scores),
    perceptions: generatePerceptions(scores, locale),
    sortedDimensions,
  };
}
