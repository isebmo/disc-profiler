export type Dimension = 'D' | 'I' | 'S' | 'C';

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
}

export const questions: Question[] = [
  // Dominance (D)
  { id: 1, text: "Je préfère prendre les décisions rapidement plutôt que de trop réfléchir", dimension: 'D' },
  { id: 2, text: "Face à un obstacle, je fonce et je trouve une solution en route", dimension: 'D' },
  { id: 3, text: "Je suis à l'aise pour dire non ou exprimer un désaccord", dimension: 'D' },
  { id: 4, text: "J'aime avoir le contrôle sur les projets que je mène", dimension: 'D' },
  { id: 5, text: "La compétition me stimule et me pousse à me dépasser", dimension: 'D' },
  { id: 6, text: "Je m'impatiente quand les choses avancent trop lentement", dimension: 'D' },

  // Influence (I)
  { id: 7, text: "J'aime convaincre les autres et partager mes idées avec enthousiasme", dimension: 'I' },
  { id: 8, text: "Je préfère travailler en équipe plutôt que seul", dimension: 'I' },
  { id: 9, text: "L'ambiance au travail compte autant que les résultats pour moi", dimension: 'I' },
  { id: 10, text: "Je me fais facilement de nouveaux contacts", dimension: 'I' },
  { id: 11, text: "J'ai tendance à voir le côté positif des situations", dimension: 'I' },
  { id: 12, text: "J'aime être au centre de l'attention dans un groupe", dimension: 'I' },

  // Stabilité (S)
  { id: 13, text: "Je préfère un environnement prévisible à un quotidien plein de surprises", dimension: 'S' },
  { id: 14, text: "Je suis quelqu'un sur qui les autres peuvent compter", dimension: 'S' },
  { id: 15, text: "J'ai besoin de temps pour m'adapter aux changements", dimension: 'S' },
  { id: 16, text: "J'évite les conflits autant que possible", dimension: 'S' },
  { id: 17, text: "Je préfère terminer une tâche avant d'en commencer une autre", dimension: 'S' },
  { id: 18, text: "La loyauté envers mon équipe est une de mes valeurs fortes", dimension: 'S' },

  // Conformité (C)
  { id: 19, text: "Je vérifie plusieurs fois mon travail avant de le considérer fini", dimension: 'C' },
  { id: 20, text: "Je préfère suivre un processus établi plutôt qu'improviser", dimension: 'C' },
  { id: 21, text: "Les détails comptent — une petite erreur peut tout changer", dimension: 'C' },
  { id: 22, text: "Je prends mes décisions en m'appuyant sur des faits et des données", dimension: 'C' },
  { id: 23, text: "Je suis mal à l'aise quand les règles ne sont pas clairement définies", dimension: 'C' },
  { id: 24, text: "Je préfère analyser toutes les options avant de m'engager", dimension: 'C' },
];

export function shuffleQuestions(qs: Question[]): Question[] {
  const shuffled = [...qs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
