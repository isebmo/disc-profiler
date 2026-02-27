import type { Dimension, Question, ForcedChoiceGroup, SprangerMotivation, SprangerPair } from '../data/questions';

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
  /** Natural scores from forced-choice (Phase 2) */
  naturalScores?: Scores;
  /** Deltas: adapted - natural per dimension */
  deltas?: Scores;
  /** Interpretation of each delta */
  deltaInterpretations?: DeltaInterpretation[];
  /** Spranger values result (Phase 3) */
  valuesResult?: ValuesResult;
}

/** Delta interpretation for a single dimension */
export interface DeltaInterpretation {
  dimension: Dimension;
  delta: number;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  direction: 'increase' | 'decrease' | 'stable';
  text: { fr: string; en: string };
}

/** Spranger values scores */
export interface SprangerScores {
  cognitive: number;
  aesthetic: number;
  utilitarian: number;
  altruistic: number;
  individual: number;
  traditional: number;
}

/** Full values result with bipolar indicators */
export interface ValuesResult {
  scores: SprangerScores;
  bipolarIndicators: BipolarIndicator[];
  sortedValues: { key: SprangerMotivation; label: { fr: string; en: string }; score: number }[];
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
 * Optionally includes Natural scores and Values if provided.
 */
export function generateReport(
  result: DISCResult,
  locale: 'fr' | 'en',
  naturalScores?: Scores,
  valuesResult?: ValuesResult,
): DISCReport {
  const scores = result.normalizedScores;
  const { type: wheelType, position: wheelPosition } = getWheelType(scores);

  const oppositePosition = getOppositePosition(wheelPosition);
  const oppositeEntry = WHEEL_TYPES.find((wt) => wt.position === oppositePosition)!;

  const sortedDimensions = (Object.entries(scores) as [Dimension, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([dim, score]) => ({ dim, score }));

  const report: DISCReport = {
    result,
    wheelType,
    wheelPosition,
    oppositeType: oppositeEntry.type,
    oppositePosition,
    bipolarIndicators: calculateBipolarIndicators(scores),
    perceptions: generatePerceptions(scores, locale),
    sortedDimensions,
  };

  if (naturalScores) {
    report.naturalScores = naturalScores;
    const { deltas, interpretations } = calculateDeltas(scores, naturalScores, locale);
    report.deltas = deltas;
    report.deltaInterpretations = interpretations;
  }

  if (valuesResult) {
    report.valuesResult = valuesResult;
  }

  return report;
}

// ─── Natural Scores from Forced-Choice (Phase 2) ────────────

/**
 * Calculate Natural DISC scores from forced-choice answers.
 * Most picks indicate conscious projection (Adapted).
 * Least picks (inverted) reveal the Natural style.
 * Score = normalize((most_count - least_count + total) / (2 * total)) * 100
 */
export function calculateNaturalScores(
  answers: Record<number, { most: number; least: number }>,
  groups: ForcedChoiceGroup[],
): Scores {
  const mostCount: Scores = { D: 0, I: 0, S: 0, C: 0 };
  const leastCount: Scores = { D: 0, I: 0, S: 0, C: 0 };

  for (const group of groups) {
    const answer = answers[group.id];
    if (!answer) continue;
    const mostDim = group.adjectives[answer.most].dimension;
    const leastDim = group.adjectives[answer.least].dimension;
    mostCount[mostDim]++;
    leastCount[leastDim]++;
  }

  const total = groups.length;
  const dims: Dimension[] = ['D', 'I', 'S', 'C'];
  const scores: Scores = { D: 0, I: 0, S: 0, C: 0 };

  for (const dim of dims) {
    scores[dim] = Math.round(((mostCount[dim] - leastCount[dim] + total) / (total * 2)) * 100);
  }

  return scores;
}

// ─── Delta Analysis ─────────────────────────────────────────

const DELTA_TEXTS: Record<Dimension, {
  increase: { fr: string; en: string };
  decrease: { fr: string; en: string };
}> = {
  D: {
    increase: {
      fr: 'Vous amplifiez votre assertivité et votre directivité dans votre environnement actuel.',
      en: 'You amplify your assertiveness and directness in your current environment.',
    },
    decrease: {
      fr: 'Vous tempérez votre côté directif et compétitif au quotidien.',
      en: 'You temper your directive and competitive side day-to-day.',
    },
  },
  I: {
    increase: {
      fr: 'Vous faites un effort conscient pour être plus communicatif et expressif.',
      en: 'You make a conscious effort to be more communicative and expressive.',
    },
    decrease: {
      fr: 'Vous retenez votre enthousiasme naturel et êtes plus réservé que votre nature profonde.',
      en: 'You hold back your natural enthusiasm and are more reserved than your true nature.',
    },
  },
  S: {
    increase: {
      fr: 'Vous cultivez davantage de patience et de stabilité que ce que votre nature suggère.',
      en: 'You cultivate more patience and stability than your nature suggests.',
    },
    decrease: {
      fr: 'Vous réduisez votre besoin naturel de stabilité pour vous adapter au changement.',
      en: 'You reduce your natural need for stability to adapt to change.',
    },
  },
  C: {
    increase: {
      fr: 'Vous renforcez votre rigueur et votre attention aux détails au-delà de votre tendance naturelle.',
      en: 'You strengthen your rigor and attention to detail beyond your natural tendency.',
    },
    decrease: {
      fr: 'Vous assouplissez vos exigences de précision et acceptez plus de flexibilité.',
      en: 'You relax your precision requirements and accept more flexibility.',
    },
  },
};

function calculateDeltas(
  adapted: Scores,
  natural: Scores,
  locale: 'fr' | 'en',
): { deltas: Scores; interpretations: DeltaInterpretation[] } {
  const dims: Dimension[] = ['D', 'I', 'S', 'C'];
  const deltas: Scores = { D: 0, I: 0, S: 0, C: 0 };
  const interpretations: DeltaInterpretation[] = [];

  for (const dim of dims) {
    const delta = adapted[dim] - natural[dim];
    deltas[dim] = delta;

    const absDelta = Math.abs(delta);
    let level: DeltaInterpretation['level'] = 'low';
    if (absDelta > 30) level = 'very-high';
    else if (absDelta > 20) level = 'high';
    else if (absDelta > 10) level = 'moderate';

    const direction: DeltaInterpretation['direction'] =
      delta > 5 ? 'increase' : delta < -5 ? 'decrease' : 'stable';

    const dimTexts = DELTA_TEXTS[dim];
    let text: { fr: string; en: string };
    if (direction === 'stable') {
      text = {
        fr: `Votre profil ${dim} est cohérent entre votre style naturel et adapté.`,
        en: `Your ${dim} profile is consistent between your natural and adapted style.`,
      };
    } else {
      text = dimTexts[direction];
    }

    interpretations.push({ dimension: dim, delta, level, direction, text });
  }

  return { deltas, interpretations };
}

// ─── Spranger Values Scoring (Phase 3) ──────────────────────

const SPRANGER_LABELS: Record<SprangerMotivation, { fr: string; en: string }> = {
  cognitive: { fr: 'Cognitive', en: 'Cognitive' },
  aesthetic: { fr: 'Esthétique', en: 'Aesthetic' },
  utilitarian: { fr: 'Utilitaire', en: 'Utilitarian' },
  altruistic: { fr: 'Altruiste', en: 'Altruistic' },
  individual: { fr: 'Individualiste', en: 'Individualistic' },
  traditional: { fr: 'Traditionnelle', en: 'Traditional' },
};

/**
 * Calculate Spranger value scores from forced-pair answers.
 * Each motivation is scored as: (times_picked / times_appeared) * 100
 */
export function calculateSprangerScores(
  answers: Record<number, 0 | 1>,
  pairs: SprangerPair[],
): ValuesResult {
  const counts: Record<SprangerMotivation, number> = {
    cognitive: 0, aesthetic: 0, utilitarian: 0,
    altruistic: 0, individual: 0, traditional: 0,
  };
  const appearances: Record<SprangerMotivation, number> = {
    cognitive: 0, aesthetic: 0, utilitarian: 0,
    altruistic: 0, individual: 0, traditional: 0,
  };

  for (const pair of pairs) {
    const answer = answers[pair.id];
    if (answer === undefined) continue;
    appearances[pair.optionA.motivation]++;
    appearances[pair.optionB.motivation]++;
    if (answer === 0) counts[pair.optionA.motivation]++;
    else counts[pair.optionB.motivation]++;
  }

  const scores: SprangerScores = {
    cognitive: Math.round((counts.cognitive / Math.max(appearances.cognitive, 1)) * 100),
    aesthetic: Math.round((counts.aesthetic / Math.max(appearances.aesthetic, 1)) * 100),
    utilitarian: Math.round((counts.utilitarian / Math.max(appearances.utilitarian, 1)) * 100),
    altruistic: Math.round((counts.altruistic / Math.max(appearances.altruistic, 1)) * 100),
    individual: Math.round((counts.individual / Math.max(appearances.individual, 1)) * 100),
    traditional: Math.round((counts.traditional / Math.max(appearances.traditional, 1)) * 100),
  };

  const bipolar = (a: number, b: number): number => {
    const total = a + b;
    if (total === 0) return 0;
    return Math.round(((b - a) / total) * 100);
  };

  const bipolarIndicators: BipolarIndicator[] = [
    {
      id: 'knowledge-utility',
      leftLabel: { fr: 'Savoir & compréhension', en: 'Knowledge & understanding' },
      rightLabel: { fr: 'Utilité & rendement', en: 'Utility & efficiency' },
      value: bipolar(scores.cognitive, scores.utilitarian),
    },
    {
      id: 'beauty-tradition',
      leftLabel: { fr: 'Beauté & harmonie', en: 'Beauty & harmony' },
      rightLabel: { fr: 'Tradition & principes', en: 'Tradition & principles' },
      value: bipolar(scores.aesthetic, scores.traditional),
    },
    {
      id: 'self-others',
      leftLabel: { fr: 'Accomplissement personnel', en: 'Personal achievement' },
      rightLabel: { fr: 'Service aux autres', en: 'Service to others' },
      value: bipolar(scores.individual, scores.altruistic),
    },
  ];

  const sortedValues = (Object.entries(scores) as [SprangerMotivation, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => ({ key, label: SPRANGER_LABELS[key], score }));

  return { scores, bipolarIndicators, sortedValues };
}
