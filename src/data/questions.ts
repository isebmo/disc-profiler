export type Dimension = 'D' | 'I' | 'S' | 'C';

export interface Question {
  id: number;
  dimension: Dimension;
}

/** Core 24 questions (6 per dimension) */
export const questions: Question[] = [
  { id: 1, dimension: 'D' }, { id: 2, dimension: 'D' }, { id: 3, dimension: 'D' },
  { id: 4, dimension: 'D' }, { id: 5, dimension: 'D' }, { id: 6, dimension: 'D' },
  { id: 7, dimension: 'I' }, { id: 8, dimension: 'I' }, { id: 9, dimension: 'I' },
  { id: 10, dimension: 'I' }, { id: 11, dimension: 'I' }, { id: 12, dimension: 'I' },
  { id: 13, dimension: 'S' }, { id: 14, dimension: 'S' }, { id: 15, dimension: 'S' },
  { id: 16, dimension: 'S' }, { id: 17, dimension: 'S' }, { id: 18, dimension: 'S' },
  { id: 19, dimension: 'C' }, { id: 20, dimension: 'C' }, { id: 21, dimension: 'C' },
  { id: 22, dimension: 'C' }, { id: 23, dimension: 'C' }, { id: 24, dimension: 'C' },
];

/** Extra adaptive questions (2 per dimension) — shown when top 2 scores are close */
export const extraQuestions: Question[] = [
  { id: 25, dimension: 'D' }, { id: 26, dimension: 'D' },
  { id: 27, dimension: 'I' }, { id: 28, dimension: 'I' },
  { id: 29, dimension: 'S' }, { id: 30, dimension: 'S' },
  { id: 31, dimension: 'C' }, { id: 32, dimension: 'C' },
];

export function shuffleQuestions<T>(qs: T[]): T[] {
  const shuffled = [...qs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
