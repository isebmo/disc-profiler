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

// ─── Forced-Choice Adjective Groups (Phase 2) ───────────────

export interface ForcedChoiceAdjective {
  text: { fr: string; en: string };
  dimension: Dimension;
}

export interface ForcedChoiceGroup {
  id: number;
  adjectives: ForcedChoiceAdjective[];
}

/** 24 forced-choice groups — user picks "most like me" and "least like me" */
export const forcedChoiceGroups: ForcedChoiceGroup[] = [
  {
    id: 1,
    adjectives: [
      { text: { fr: 'Déterminé', en: 'Determined' }, dimension: 'D' },
      { text: { fr: 'Enthousiaste', en: 'Enthusiastic' }, dimension: 'I' },
      { text: { fr: 'Patient', en: 'Patient' }, dimension: 'S' },
      { text: { fr: 'Méthodique', en: 'Methodical' }, dimension: 'C' },
    ],
  },
  {
    id: 2,
    adjectives: [
      { text: { fr: 'Direct', en: 'Direct' }, dimension: 'D' },
      { text: { fr: 'Optimiste', en: 'Optimistic' }, dimension: 'I' },
      { text: { fr: 'Fiable', en: 'Reliable' }, dimension: 'S' },
      { text: { fr: 'Précis', en: 'Precise' }, dimension: 'C' },
    ],
  },
  {
    id: 3,
    adjectives: [
      { text: { fr: 'Ambitieux', en: 'Ambitious' }, dimension: 'D' },
      { text: { fr: 'Sociable', en: 'Sociable' }, dimension: 'I' },
      { text: { fr: 'Loyal', en: 'Loyal' }, dimension: 'S' },
      { text: { fr: 'Rigoureux', en: 'Rigorous' }, dimension: 'C' },
    ],
  },
  {
    id: 4,
    adjectives: [
      { text: { fr: 'Compétitif', en: 'Competitive' }, dimension: 'D' },
      { text: { fr: 'Communicatif', en: 'Communicative' }, dimension: 'I' },
      { text: { fr: 'Calme', en: 'Calm' }, dimension: 'S' },
      { text: { fr: 'Analytique', en: 'Analytical' }, dimension: 'C' },
    ],
  },
  {
    id: 5,
    adjectives: [
      { text: { fr: 'Décisif', en: 'Decisive' }, dimension: 'D' },
      { text: { fr: 'Expressif', en: 'Expressive' }, dimension: 'I' },
      { text: { fr: 'Coopératif', en: 'Cooperative' }, dimension: 'S' },
      { text: { fr: 'Organisé', en: 'Organized' }, dimension: 'C' },
    ],
  },
  {
    id: 6,
    adjectives: [
      { text: { fr: 'Audacieux', en: 'Bold' }, dimension: 'D' },
      { text: { fr: 'Persuasif', en: 'Persuasive' }, dimension: 'I' },
      { text: { fr: 'Stable', en: 'Stable' }, dimension: 'S' },
      { text: { fr: 'Logique', en: 'Logical' }, dimension: 'C' },
    ],
  },
  {
    id: 7,
    adjectives: [
      { text: { fr: 'Indépendant', en: 'Independent' }, dimension: 'D' },
      { text: { fr: 'Spontané', en: 'Spontaneous' }, dimension: 'I' },
      { text: { fr: 'Prévisible', en: 'Predictable' }, dimension: 'S' },
      { text: { fr: 'Perfectionniste', en: 'Perfectionist' }, dimension: 'C' },
    ],
  },
  {
    id: 8,
    adjectives: [
      { text: { fr: 'Fonceur', en: 'Go-getter' }, dimension: 'D' },
      { text: { fr: 'Charismatique', en: 'Charismatic' }, dimension: 'I' },
      { text: { fr: 'Attentionné', en: 'Caring' }, dimension: 'S' },
      { text: { fr: 'Consciencieux', en: 'Conscientious' }, dimension: 'C' },
    ],
  },
  {
    id: 9,
    adjectives: [
      { text: { fr: 'Résolu', en: 'Resolute' }, dimension: 'D' },
      { text: { fr: 'Inspirant', en: 'Inspiring' }, dimension: 'I' },
      { text: { fr: 'Diplomate', en: 'Diplomatic' }, dimension: 'S' },
      { text: { fr: 'Systématique', en: 'Systematic' }, dimension: 'C' },
    ],
  },
  {
    id: 10,
    adjectives: [
      { text: { fr: 'Exigeant', en: 'Demanding' }, dimension: 'D' },
      { text: { fr: 'Dynamique', en: 'Dynamic' }, dimension: 'I' },
      { text: { fr: 'Compréhensif', en: 'Understanding' }, dimension: 'S' },
      { text: { fr: 'Prudent', en: 'Cautious' }, dimension: 'C' },
    ],
  },
  {
    id: 11,
    adjectives: [
      { text: { fr: 'Volontaire', en: 'Strong-willed' }, dimension: 'D' },
      { text: { fr: 'Créatif', en: 'Creative' }, dimension: 'I' },
      { text: { fr: 'Accommodant', en: 'Accommodating' }, dimension: 'S' },
      { text: { fr: 'Factuel', en: 'Factual' }, dimension: 'C' },
    ],
  },
  {
    id: 12,
    adjectives: [
      { text: { fr: 'Pragmatique', en: 'Pragmatic' }, dimension: 'D' },
      { text: { fr: 'Motivant', en: 'Motivating' }, dimension: 'I' },
      { text: { fr: 'Attentif', en: 'Attentive' }, dimension: 'S' },
      { text: { fr: 'Réfléchi', en: 'Thoughtful' }, dimension: 'C' },
    ],
  },
  {
    id: 13,
    adjectives: [
      { text: { fr: 'Énergique', en: 'Energetic' }, dimension: 'D' },
      { text: { fr: 'Chaleureux', en: 'Warm' }, dimension: 'I' },
      { text: { fr: 'Régulier', en: 'Steady' }, dimension: 'S' },
      { text: { fr: 'Critique', en: 'Critical thinker' }, dimension: 'C' },
    ],
  },
  {
    id: 14,
    adjectives: [
      { text: { fr: 'Tenace', en: 'Tenacious' }, dimension: 'D' },
      { text: { fr: 'Convivial', en: 'Friendly' }, dimension: 'I' },
      { text: { fr: 'Serein', en: 'Serene' }, dimension: 'S' },
      { text: { fr: 'Structuré', en: 'Structured' }, dimension: 'C' },
    ],
  },
  {
    id: 15,
    adjectives: [
      { text: { fr: 'Franc', en: 'Frank' }, dimension: 'D' },
      { text: { fr: 'Confiant', en: 'Confident' }, dimension: 'I' },
      { text: { fr: 'Modeste', en: 'Modest' }, dimension: 'S' },
      { text: { fr: 'Minutieux', en: 'Meticulous' }, dimension: 'C' },
    ],
  },
  {
    id: 16,
    adjectives: [
      { text: { fr: 'Assertif', en: 'Assertive' }, dimension: 'D' },
      { text: { fr: 'Extraverti', en: 'Extroverted' }, dimension: 'I' },
      { text: { fr: 'Conciliant', en: 'Conciliatory' }, dimension: 'S' },
      { text: { fr: 'Objectif', en: 'Objective' }, dimension: 'C' },
    ],
  },
  {
    id: 17,
    adjectives: [
      { text: { fr: 'Leader', en: 'Leader' }, dimension: 'D' },
      { text: { fr: 'Influent', en: 'Influential' }, dimension: 'I' },
      { text: { fr: 'Tolérant', en: 'Tolerant' }, dimension: 'S' },
      { text: { fr: 'Réservé', en: 'Reserved' }, dimension: 'C' },
    ],
  },
  {
    id: 18,
    adjectives: [
      { text: { fr: 'Proactif', en: 'Proactive' }, dimension: 'D' },
      { text: { fr: 'Vivant', en: 'Lively' }, dimension: 'I' },
      { text: { fr: 'Serviable', en: 'Helpful' }, dimension: 'S' },
      { text: { fr: 'Méticuleux', en: 'Detail-oriented' }, dimension: 'C' },
    ],
  },
  {
    id: 19,
    adjectives: [
      { text: { fr: 'Courageux', en: 'Courageous' }, dimension: 'D' },
      { text: { fr: 'Démonstratif', en: 'Demonstrative' }, dimension: 'I' },
      { text: { fr: 'Constant', en: 'Consistent' }, dimension: 'S' },
      { text: { fr: 'Discipliné', en: 'Disciplined' }, dimension: 'C' },
    ],
  },
  {
    id: 20,
    adjectives: [
      { text: { fr: 'Performant', en: 'High-performing' }, dimension: 'D' },
      { text: { fr: 'Stimulant', en: 'Stimulating' }, dimension: 'I' },
      { text: { fr: 'Empathique', en: 'Empathetic' }, dimension: 'S' },
      { text: { fr: 'Rationnel', en: 'Rational' }, dimension: 'C' },
    ],
  },
  {
    id: 21,
    adjectives: [
      { text: { fr: 'Conquérant', en: 'Driven' }, dimension: 'D' },
      { text: { fr: 'Communicant', en: 'Communicator' }, dimension: 'I' },
      { text: { fr: 'Harmonieux', en: 'Harmonious' }, dimension: 'S' },
      { text: { fr: 'Normatif', en: 'Standards-driven' }, dimension: 'C' },
    ],
  },
  {
    id: 22,
    adjectives: [
      { text: { fr: 'Efficace', en: 'Efficient' }, dimension: 'D' },
      { text: { fr: 'Jovial', en: 'Cheerful' }, dimension: 'I' },
      { text: { fr: 'Persévérant', en: 'Persevering' }, dimension: 'S' },
      { text: { fr: 'Scrupuleux', en: 'Scrupulous' }, dimension: 'C' },
    ],
  },
  {
    id: 23,
    adjectives: [
      { text: { fr: 'Pionnier', en: 'Pioneer' }, dimension: 'D' },
      { text: { fr: 'Populaire', en: 'Popular' }, dimension: 'I' },
      { text: { fr: 'Fidèle', en: 'Faithful' }, dimension: 'S' },
      { text: { fr: 'Expert', en: 'Expert' }, dimension: 'C' },
    ],
  },
  {
    id: 24,
    adjectives: [
      { text: { fr: 'Entreprenant', en: 'Enterprising' }, dimension: 'D' },
      { text: { fr: 'Rassembleur', en: 'Unifying' }, dimension: 'I' },
      { text: { fr: 'Dévoué', en: 'Devoted' }, dimension: 'S' },
      { text: { fr: 'Appliqué', en: 'Thorough' }, dimension: 'C' },
    ],
  },
];

// ─── Spranger Value Pairs (Phase 3) ─────────────────────────

export type SprangerMotivation = 'cognitive' | 'aesthetic' | 'utilitarian' | 'altruistic' | 'individual' | 'traditional';

export interface SprangerPair {
  id: number;
  optionA: { text: { fr: string; en: string }; motivation: SprangerMotivation };
  optionB: { text: { fr: string; en: string }; motivation: SprangerMotivation };
}

/** 18 value pairs — user picks which statement resonates more */
export const sprangerPairs: SprangerPair[] = [
  // Cognitive vs Utilitarian (3)
  {
    id: 1,
    optionA: { text: { fr: "J'apprends pour le plaisir de comprendre", en: 'I learn for the pleasure of understanding' }, motivation: 'cognitive' },
    optionB: { text: { fr: "J'apprends ce qui a une utilité pratique", en: 'I learn what has practical use' }, motivation: 'utilitarian' },
  },
  {
    id: 2,
    optionA: { text: { fr: 'La recherche de la vérité me motive', en: 'The pursuit of truth motivates me' }, motivation: 'cognitive' },
    optionB: { text: { fr: "L'efficacité et le retour sur investissement me motivent", en: 'Efficiency and return on investment motivate me' }, motivation: 'utilitarian' },
  },
  {
    id: 3,
    optionA: { text: { fr: 'Je préfère réfléchir en profondeur à un sujet', en: 'I prefer to think deeply about a subject' }, motivation: 'cognitive' },
    optionB: { text: { fr: 'Je préfère obtenir des résultats concrets rapidement', en: 'I prefer to get concrete results quickly' }, motivation: 'utilitarian' },
  },
  // Aesthetic vs Traditional (3)
  {
    id: 4,
    optionA: { text: { fr: "La beauté et l'harmonie guident mes choix", en: 'Beauty and harmony guide my choices' }, motivation: 'aesthetic' },
    optionB: { text: { fr: 'Les valeurs et les principes guident mes choix', en: 'Values and principles guide my choices' }, motivation: 'traditional' },
  },
  {
    id: 5,
    optionA: { text: { fr: "Je suis attiré par la créativité et l'originalité", en: "I'm drawn to creativity and originality" }, motivation: 'aesthetic' },
    optionB: { text: { fr: 'Je suis attaché aux traditions et aux règles établies', en: "I'm attached to traditions and established rules" }, motivation: 'traditional' },
  },
  {
    id: 6,
    optionA: { text: { fr: "L'expression artistique m'inspire", en: 'Artistic expression inspires me' }, motivation: 'aesthetic' },
    optionB: { text: { fr: "Le respect des engagements m'inspire", en: 'Honoring commitments inspires me' }, motivation: 'traditional' },
  },
  // Individual vs Altruistic (3)
  {
    id: 7,
    optionA: { text: { fr: 'Je cherche à me réaliser personnellement', en: 'I seek personal self-fulfillment' }, motivation: 'individual' },
    optionB: { text: { fr: 'Je cherche à aider les autres à se réaliser', en: 'I seek to help others fulfill themselves' }, motivation: 'altruistic' },
  },
  {
    id: 8,
    optionA: { text: { fr: "L'indépendance et l'autonomie me motivent", en: 'Independence and autonomy motivate me' }, motivation: 'individual' },
    optionB: { text: { fr: 'Le service aux autres me motive', en: 'Service to others motivates me' }, motivation: 'altruistic' },
  },
  {
    id: 9,
    optionA: { text: { fr: "Je vise l'excellence personnelle", en: 'I aim for personal excellence' }, motivation: 'individual' },
    optionB: { text: { fr: 'Je vise le bien-être collectif', en: 'I aim for collective well-being' }, motivation: 'altruistic' },
  },
  // Cognitive vs Aesthetic (2)
  {
    id: 10,
    optionA: { text: { fr: 'Je préfère analyser et comprendre les mécanismes', en: 'I prefer to analyze and understand mechanisms' }, motivation: 'cognitive' },
    optionB: { text: { fr: 'Je préfère ressentir et contempler la beauté', en: 'I prefer to feel and contemplate beauty' }, motivation: 'aesthetic' },
  },
  {
    id: 11,
    optionA: { text: { fr: 'La logique et la raison me guident', en: 'Logic and reason guide me' }, motivation: 'cognitive' },
    optionB: { text: { fr: "L'intuition et la sensibilité me guident", en: 'Intuition and sensitivity guide me' }, motivation: 'aesthetic' },
  },
  // Utilitarian vs Altruistic (2)
  {
    id: 12,
    optionA: { text: { fr: 'Le rendement et la productivité comptent le plus pour moi', en: 'Productivity and efficiency matter most to me' }, motivation: 'utilitarian' },
    optionB: { text: { fr: "L'impact humain et le bien commun comptent le plus pour moi", en: 'Human impact and the common good matter most to me' }, motivation: 'altruistic' },
  },
  {
    id: 13,
    optionA: { text: { fr: 'Investir judicieusement est primordial', en: 'Investing wisely is paramount' }, motivation: 'utilitarian' },
    optionB: { text: { fr: 'Donner généreusement est primordial', en: 'Giving generously is paramount' }, motivation: 'altruistic' },
  },
  // Individual vs Traditional (2)
  {
    id: 14,
    optionA: { text: { fr: 'Je forge mes propres règles et ma propre voie', en: 'I forge my own rules and path' }, motivation: 'individual' },
    optionB: { text: { fr: 'Je respecte les règles et les structures établies', en: 'I respect established rules and structures' }, motivation: 'traditional' },
  },
  {
    id: 15,
    optionA: { text: { fr: 'Mon accomplissement personnel prime', en: 'My personal achievement comes first' }, motivation: 'individual' },
    optionB: { text: { fr: 'Contribuer à un système plus grand que soi prime', en: 'Contributing to something greater comes first' }, motivation: 'traditional' },
  },
  // Cognitive vs Altruistic (1)
  {
    id: 16,
    optionA: { text: { fr: 'Comprendre le monde et ses mécanismes m\'anime', en: 'Understanding the world and its mechanisms drives me' }, motivation: 'cognitive' },
    optionB: { text: { fr: 'Améliorer concrètement la vie des autres m\'anime', en: "Concretely improving others' lives drives me" }, motivation: 'altruistic' },
  },
  // Aesthetic vs Individual (1)
  {
    id: 17,
    optionA: { text: { fr: "Je cherche la beauté et l'élégance dans ce que je fais", en: 'I seek beauty and elegance in what I do' }, motivation: 'aesthetic' },
    optionB: { text: { fr: "Je cherche le pouvoir et l'influence sur mon environnement", en: 'I seek power and influence over my environment' }, motivation: 'individual' },
  },
  // Utilitarian vs Traditional (1)
  {
    id: 18,
    optionA: { text: { fr: "L'efficacité prime sur la tradition", en: 'Efficiency takes precedence over tradition' }, motivation: 'utilitarian' },
    optionB: { text: { fr: "La tradition et l'éthique guident l'action", en: 'Tradition and ethics guide action' }, motivation: 'traditional' },
  },
];
