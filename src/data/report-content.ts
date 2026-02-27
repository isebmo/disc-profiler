/**
 * Narrative content bank for the enriched DISC report.
 * Each item has conditions based on DISC scores and bilingual text.
 */
import type { Dimension } from './questions';
import type { Scores, WheelType } from '../lib/scoring';

type Locale = 'fr' | 'en';

// ─── Types ───────────────────────────────────────────────────

interface ConditionalItem {
  fr: string;
  en: string;
  /** Condition: which dimensions must be high/low for this item to appear */
  condition: (scores: Scores) => boolean;
  /** Priority for ordering (higher = shown first) */
  priority: (scores: Scores) => number;
}

// ─── Helpers ─────────────────────────────────────────────────

const high = (s: number) => s > 60;
const veryHigh = (s: number) => s > 75;
const moderate = (s: number) => s >= 35 && s <= 65;
const low = (s: number) => s < 40;
const veryLow = (s: number) => s < 25;

/** Select and order items matching the scores, return localized strings */
export function selectItems(
  items: ConditionalItem[],
  scores: Scores,
  locale: Locale,
  max: number,
): string[] {
  return items
    .filter((item) => item.condition(scores))
    .sort((a, b) => b.priority(scores) - a.priority(scores))
    .slice(0, max)
    .map((item) => item[locale]);
}

// ─── Talents (50 items) ──────────────────────────────────────

export const talents: ConditionalItem[] = [
  // D talents
  { fr: 'Sait prendre des décisions rapidement et avec assurance', en: 'Makes decisions quickly and confidently', condition: (s) => high(s.D), priority: (s) => s.D },
  { fr: 'Mène les projets avec détermination et énergie', en: 'Drives projects with determination and energy', condition: (s) => high(s.D), priority: (s) => s.D },
  { fr: 'Sait dire non et poser des limites claires', en: 'Can say no and set clear boundaries', condition: (s) => high(s.D), priority: (s) => s.D - 5 },
  { fr: 'Excelle dans la gestion de crise et l\'urgence', en: 'Excels in crisis management and urgency', condition: (s) => high(s.D), priority: (s) => s.D - 2 },
  { fr: 'Obtient des résultats concrets et mesurables', en: 'Achieves concrete and measurable results', condition: (s) => high(s.D), priority: (s) => s.D - 3 },
  { fr: 'Transforme les obstacles en défis motivants', en: 'Turns obstacles into motivating challenges', condition: (s) => veryHigh(s.D), priority: (s) => s.D - 1 },
  { fr: 'Impulse le mouvement et l\'action au sein de l\'équipe', en: 'Drives momentum and action within the team', condition: (s) => high(s.D) && !low(s.I), priority: (s) => s.D - 4 },

  // I talents
  { fr: 'Communique avec aisance et enthousiasme', en: 'Communicates with ease and enthusiasm', condition: (s) => high(s.I), priority: (s) => s.I },
  { fr: 'Sait motiver et fédérer une équipe autour d\'un projet', en: 'Motivates and unites a team around a project', condition: (s) => high(s.I), priority: (s) => s.I - 1 },
  { fr: 'Crée facilement des relations et un réseau de contacts', en: 'Easily builds relationships and a contact network', condition: (s) => high(s.I), priority: (s) => s.I - 2 },
  { fr: 'Apporte créativité et idées nouvelles', en: 'Brings creativity and new ideas', condition: (s) => high(s.I), priority: (s) => s.I - 3 },
  { fr: 'Diffuse une énergie positive et un optimisme contagieux', en: 'Spreads positive energy and contagious optimism', condition: (s) => high(s.I), priority: (s) => s.I - 4 },
  { fr: 'Sait présenter et vendre les idées avec conviction', en: 'Presents and sells ideas with conviction', condition: (s) => veryHigh(s.I), priority: (s) => s.I - 1 },
  { fr: 'Favorise un climat de travail agréable et stimulant', en: 'Fosters a pleasant and stimulating work climate', condition: (s) => high(s.I) && !low(s.S), priority: (s) => s.I - 5 },

  // S talents
  { fr: 'Est fiable et constant dans ses engagements', en: 'Is reliable and consistent in commitments', condition: (s) => high(s.S), priority: (s) => s.S },
  { fr: 'Possède une écoute active et une empathie naturelle', en: 'Has active listening skills and natural empathy', condition: (s) => high(s.S), priority: (s) => s.S - 1 },
  { fr: 'Fait preuve de patience et de persévérance', en: 'Shows patience and perseverance', condition: (s) => high(s.S), priority: (s) => s.S - 2 },
  { fr: 'Crée un environnement stable et rassurant', en: 'Creates a stable and reassuring environment', condition: (s) => high(s.S), priority: (s) => s.S - 3 },
  { fr: 'Accompagne les membres de l\'équipe avec bienveillance', en: 'Supports team members with kindness', condition: (s) => high(s.S), priority: (s) => s.S - 4 },
  { fr: 'Sait gérer les situations tendues avec calme', en: 'Handles tense situations with calm', condition: (s) => veryHigh(s.S), priority: (s) => s.S - 2 },
  { fr: 'Assure la cohésion et l\'harmonie du groupe', en: 'Ensures group cohesion and harmony', condition: (s) => high(s.S) && !low(s.I), priority: (s) => s.S - 5 },

  // C talents
  { fr: 'Sait analyser les problèmes pour les résoudre', en: 'Analyzes problems to solve them', condition: (s) => high(s.C), priority: (s) => s.C },
  { fr: 'Est ordonné, précis et méthodique', en: 'Is organized, precise, and methodical', condition: (s) => high(s.C), priority: (s) => s.C - 1 },
  { fr: 'Garantit la qualité et le respect des standards', en: 'Guarantees quality and standards compliance', condition: (s) => high(s.C), priority: (s) => s.C - 2 },
  { fr: 'Prend des décisions basées sur des faits et des données', en: 'Makes decisions based on facts and data', condition: (s) => high(s.C), priority: (s) => s.C - 3 },
  { fr: 'Structure les processus et les méthodes de travail', en: 'Structures processes and work methods', condition: (s) => high(s.C), priority: (s) => s.C - 4 },
  { fr: 'Identifie les risques et les anticipe avec rigueur', en: 'Identifies and anticipates risks rigorously', condition: (s) => veryHigh(s.C), priority: (s) => s.C - 1 },
  { fr: 'Apporte objectivité et esprit critique aux discussions', en: 'Brings objectivity and critical thinking to discussions', condition: (s) => high(s.C) && !low(s.D), priority: (s) => s.C - 5 },

  // Combined talents
  { fr: 'Allie leadership et rigueur pour piloter des projets complexes', en: 'Combines leadership and rigor to manage complex projects', condition: (s) => high(s.D) && high(s.C), priority: (s) => (s.D + s.C) / 2 },
  { fr: 'Sait convaincre tout en restant à l\'écoute des besoins', en: 'Convinces while remaining attentive to needs', condition: (s) => high(s.I) && high(s.S), priority: (s) => (s.I + s.S) / 2 },
  { fr: 'Concilie ambition et attention aux personnes', en: 'Balances ambition with attention to people', condition: (s) => high(s.D) && high(s.I), priority: (s) => (s.D + s.I) / 2 },
  { fr: 'Apporte méthode et stabilité aux projets d\'équipe', en: 'Brings method and stability to team projects', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 },
  { fr: 'Sait tempérer l\'action par la réflexion et l\'analyse', en: 'Tempers action with reflection and analysis', condition: (s) => moderate(s.D) && high(s.C), priority: (s) => s.C - 8 },
  { fr: 'Construit des relations durables fondées sur la confiance', en: 'Builds lasting relationships based on trust', condition: (s) => high(s.S) && !veryLow(s.I), priority: (s) => s.S - 6 },
  { fr: 'Maintient le cap même sous pression', en: 'Stays the course even under pressure', condition: (s) => high(s.D) && high(s.S), priority: (s) => (s.D + s.S) / 2 - 5 },
  { fr: 'Est capable d\'écouter avant de décider', en: 'Listens before making decisions', condition: (s) => high(s.S) && moderate(s.D), priority: (s) => s.S - 7 },
  { fr: 'Favorise l\'innovation par sa créativité et son ouverture', en: 'Fosters innovation through creativity and openness', condition: (s) => high(s.I) && !high(s.C), priority: (s) => s.I - 6 },
  { fr: 'Produit un travail d\'une fiabilité exemplaire', en: 'Produces work of exemplary reliability', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 3 },
  { fr: 'Communique de façon claire et structurée', en: 'Communicates clearly and in a structured way', condition: (s) => high(s.C) && moderate(s.I), priority: (s) => s.C - 6 },

  // Moderate/balanced talents
  { fr: 'Fait preuve d\'adaptabilité dans différents contextes', en: 'Shows adaptability in different contexts', condition: (s) => moderate(s.D) && moderate(s.I) && moderate(s.S) && moderate(s.C), priority: () => 40 },
  { fr: 'Sait équilibrer action et réflexion selon le contexte', en: 'Balances action and reflection based on context', condition: (s) => moderate(s.D) && moderate(s.C), priority: () => 38 },
  { fr: 'Possède une vision équilibrée entre résultats et relations', en: 'Has a balanced view between results and relationships', condition: (s) => moderate(s.D) && moderate(s.I), priority: () => 36 },

  // More D talents
  { fr: 'Prend les initiatives sans attendre les consignes', en: 'Takes initiative without waiting for instructions', condition: (s) => veryHigh(s.D), priority: (s) => s.D - 6 },
  { fr: 'Fixe des objectifs ambitieux et les atteint', en: 'Sets ambitious goals and achieves them', condition: (s) => high(s.D) && !low(s.C), priority: (s) => s.D - 7 },

  // More I talents
  { fr: 'Détend l\'atmosphère et désamorce les tensions', en: 'Lightens the mood and defuses tensions', condition: (s) => high(s.I) && high(s.S), priority: (s) => (s.I + s.S) / 2 - 6 },
  { fr: 'Sait adapter son discours à son interlocuteur', en: 'Adapts communication to the audience', condition: (s) => high(s.I) && moderate(s.S), priority: (s) => s.I - 7 },

  // More S talents
  { fr: 'Constitue le pilier silencieux de l\'équipe', en: 'Is the quiet backbone of the team', condition: (s) => veryHigh(s.S) && low(s.D), priority: (s) => s.S - 8 },
  { fr: 'Sait mettre les autres en confiance', en: 'Puts others at ease', condition: (s) => high(s.S) && moderate(s.I), priority: (s) => s.S - 9 },

  // More C talents
  { fr: 'Documente et formalise les bonnes pratiques', en: 'Documents and formalizes best practices', condition: (s) => veryHigh(s.C), priority: (s) => s.C - 7 },
  { fr: 'Repère les incohérences et les failles dans un raisonnement', en: 'Spots inconsistencies and flaws in reasoning', condition: (s) => veryHigh(s.C) && !low(s.D), priority: (s) => s.C - 8 },

  // Universal fallbacks (always match, low priority)
  { fr: 'Sait s\'adapter aux situations variées', en: 'Adapts to varied situations', condition: () => true, priority: () => 10 },
  { fr: 'Apporte un regard personnel et unique aux projets', en: 'Brings a personal and unique perspective to projects', condition: () => true, priority: () => 9 },
  { fr: 'Contribue positivement à la dynamique d\'équipe', en: 'Contributes positively to team dynamics', condition: () => true, priority: () => 8 },
  { fr: 'Sait tirer parti de ses expériences passées', en: 'Leverages past experiences effectively', condition: () => true, priority: () => 7 },
  { fr: 'Fait preuve de bonne volonté et d\'engagement', en: 'Shows goodwill and commitment', condition: () => true, priority: () => 6 },
  { fr: 'Sait identifier ses forces et les mettre au service de l\'équipe', en: 'Identifies strengths and puts them at the service of the team', condition: () => true, priority: () => 5 },
  { fr: 'Est capable de progresser rapidement quand on lui fait confiance', en: 'Progresses quickly when trusted', condition: () => true, priority: () => 4 },
  { fr: 'Apporte une contribution fiable au quotidien', en: 'Provides reliable daily contributions', condition: () => true, priority: () => 3 },
];

// ─── Environment (40 items) ──────────────────────────────────

export const environment: ConditionalItem[] = [
  // D environment
  { fr: 'Un environnement où l\'autonomie et l\'initiative sont valorisées', en: 'An environment where autonomy and initiative are valued', condition: (s) => high(s.D), priority: (s) => s.D },
  { fr: 'Des défis réguliers et des objectifs ambitieux à atteindre', en: 'Regular challenges and ambitious goals to achieve', condition: (s) => high(s.D), priority: (s) => s.D - 1 },
  { fr: 'Une culture de la performance et des résultats', en: 'A culture of performance and results', condition: (s) => high(s.D), priority: (s) => s.D - 2 },
  { fr: 'La possibilité de prendre des décisions et d\'agir rapidement', en: 'The ability to make decisions and act quickly', condition: (s) => high(s.D), priority: (s) => s.D - 3 },
  { fr: 'Un minimum de bureaucratie et de lourdeur administrative', en: 'Minimal bureaucracy and administrative burden', condition: (s) => high(s.D) && low(s.C), priority: (s) => s.D - 4 },

  // I environment
  { fr: 'Un cadre de travail collaboratif et convivial', en: 'A collaborative and friendly work setting', condition: (s) => high(s.I), priority: (s) => s.I },
  { fr: 'Des interactions fréquentes avec les collègues et partenaires', en: 'Frequent interactions with colleagues and partners', condition: (s) => high(s.I), priority: (s) => s.I - 1 },
  { fr: 'De la variété dans les tâches et les projets', en: 'Variety in tasks and projects', condition: (s) => high(s.I), priority: (s) => s.I - 2 },
  { fr: 'La possibilité d\'exprimer sa créativité et ses idées', en: 'The opportunity to express creativity and ideas', condition: (s) => high(s.I), priority: (s) => s.I - 3 },
  { fr: 'Une reconnaissance visible des contributions et des succès', en: 'Visible recognition of contributions and successes', condition: (s) => high(s.I), priority: (s) => s.I - 4 },

  // S environment
  { fr: 'Un environnement de travail stable et prévisible', en: 'A stable and predictable work environment', condition: (s) => high(s.S), priority: (s) => s.S },
  { fr: 'Des relations de confiance au sein de l\'équipe', en: 'Trusting relationships within the team', condition: (s) => high(s.S), priority: (s) => s.S - 1 },
  { fr: 'Du temps suffisant pour accomplir les tâches correctement', en: 'Sufficient time to complete tasks properly', condition: (s) => high(s.S), priority: (s) => s.S - 2 },
  { fr: 'Un accompagnement dans les phases de changement', en: 'Support during periods of change', condition: (s) => high(s.S), priority: (s) => s.S - 3 },
  { fr: 'Une équipe soudée avec un esprit d\'entraide', en: 'A close-knit team with a spirit of mutual support', condition: (s) => high(s.S), priority: (s) => s.S - 4 },

  // C environment
  { fr: 'Des processus clairs et des règles bien définies', en: 'Clear processes and well-defined rules', condition: (s) => high(s.C), priority: (s) => s.C },
  { fr: 'L\'accès à des informations fiables et complètes', en: 'Access to reliable and complete information', condition: (s) => high(s.C), priority: (s) => s.C - 1 },
  { fr: 'Un cadre qui valorise la qualité plutôt que la quantité', en: 'A framework that values quality over quantity', condition: (s) => high(s.C), priority: (s) => s.C - 2 },
  { fr: 'Du temps pour analyser et réfléchir avant de décider', en: 'Time to analyze and think before deciding', condition: (s) => high(s.C), priority: (s) => s.C - 3 },
  { fr: 'Un environnement qui respecte les standards et la rigueur', en: 'An environment that respects standards and rigor', condition: (s) => high(s.C), priority: (s) => s.C - 4 },

  // Combined
  { fr: 'Un équilibre entre travail en autonomie et moments d\'équipe', en: 'A balance between autonomous work and team moments', condition: (s) => moderate(s.I) && moderate(s.S), priority: () => 40 },
  { fr: 'Des objectifs clairs avec la liberté de choisir comment les atteindre', en: 'Clear goals with freedom to choose how to achieve them', condition: (s) => high(s.D) && high(s.C), priority: (s) => (s.D + s.C) / 2 },
  { fr: 'Un management qui donne du sens et une vision', en: 'Management that provides meaning and vision', condition: (s) => high(s.I) && moderate(s.D), priority: (s) => s.I - 5 },
  { fr: 'La possibilité de progresser et d\'évoluer dans son rôle', en: 'The opportunity to grow and evolve in the role', condition: (s) => high(s.D) || high(s.I), priority: (s) => Math.max(s.D, s.I) - 6 },
  { fr: 'Un cadre calme et ordonné pour se concentrer', en: 'A calm and organized setting to focus', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 2 },
  { fr: 'Des feedbacks réguliers et constructifs', en: 'Regular and constructive feedback', condition: (s) => high(s.S) || high(s.C), priority: (s) => Math.max(s.S, s.C) - 6 },
  { fr: 'Un rythme de travail soutenu mais avec des temps de récupération', en: 'A sustained work pace with recovery time', condition: (s) => high(s.D) && high(s.S), priority: (s) => (s.D + s.S) / 2 - 5 },
  { fr: 'Une culture qui encourage l\'apprentissage continu', en: 'A culture that encourages continuous learning', condition: (s) => high(s.C) && !veryLow(s.I), priority: (s) => s.C - 6 },
  { fr: 'Des réunions efficaces et bien structurées', en: 'Efficient and well-structured meetings', condition: (s) => high(s.C) && !high(s.I), priority: (s) => s.C - 7 },
  { fr: 'La possibilité de travailler avec des experts dans leur domaine', en: 'The opportunity to work with domain experts', condition: (s) => high(s.C) && moderate(s.I), priority: (s) => s.C - 8 },
  { fr: 'Un environnement où les conflits sont gérés avec diplomatie', en: 'An environment where conflicts are handled diplomatically', condition: (s) => high(s.S) && low(s.D), priority: (s) => s.S - 5 },
  { fr: 'Des projets stimulants avec un impact visible', en: 'Stimulating projects with visible impact', condition: (s) => high(s.D) && high(s.I), priority: (s) => (s.D + s.I) / 2 - 3 },
  { fr: 'Un espace de travail organisé et fonctionnel', en: 'An organized and functional workspace', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 4 },
  { fr: 'La liberté d\'organiser son emploi du temps', en: 'Freedom to organize one\'s own schedule', condition: (s) => high(s.D) && !high(s.C), priority: (s) => s.D - 5 },
  { fr: 'Un climat de bienveillance et de respect mutuel', en: 'An atmosphere of kindness and mutual respect', condition: (s) => high(s.S) && high(s.I), priority: (s) => (s.S + s.I) / 2 - 3 },

  // Moderate/balanced
  { fr: 'Un environnement flexible qui s\'adapte aux besoins de chacun', en: 'A flexible environment that adapts to individual needs', condition: (s) => moderate(s.D) && moderate(s.S), priority: () => 35 },
  { fr: 'Un mélange de travail individuel et de projets collaboratifs', en: 'A mix of individual work and collaborative projects', condition: (s) => moderate(s.I) && moderate(s.C), priority: () => 34 },
  { fr: 'Des responsabilités clairement définies', en: 'Clearly defined responsibilities', condition: (s) => high(s.C) || high(s.S), priority: (s) => Math.max(s.C, s.S) - 7 },
  { fr: 'Un management accessible et à l\'écoute', en: 'Accessible and attentive management', condition: (s) => high(s.S) && !high(s.D), priority: (s) => s.S - 6 },
  { fr: 'La possibilité de prendre du recul et de planifier', en: 'The opportunity to step back and plan', condition: (s) => high(s.C) && !veryHigh(s.D), priority: (s) => s.C - 9 },

  // Universal fallbacks
  { fr: 'Un environnement de travail respectueux et professionnel', en: 'A respectful and professional work environment', condition: () => true, priority: () => 10 },
  { fr: 'Des objectifs clairs et un cadre bien défini', en: 'Clear objectives and a well-defined framework', condition: () => true, priority: () => 9 },
  { fr: 'Un bon équilibre entre travail individuel et collectif', en: 'A good balance between individual and collective work', condition: () => true, priority: () => 8 },
  { fr: 'Des opportunités d\'apprentissage et de développement', en: 'Learning and development opportunities', condition: () => true, priority: () => 7 },
  { fr: 'Une communication transparente au sein de l\'équipe', en: 'Transparent communication within the team', condition: () => true, priority: () => 6 },
  { fr: 'Un management qui reconnaît les contributions individuelles', en: 'Management that recognizes individual contributions', condition: () => true, priority: () => 5 },
  { fr: 'La possibilité de contribuer de manière significative', en: 'The ability to contribute meaningfully', condition: () => true, priority: () => 4 },
  { fr: 'Un rythme de travail soutenable sur la durée', en: 'A sustainable work pace over time', condition: () => true, priority: () => 3 },
];

// ─── Communication Do (40 items) ─────────────────────────────

export const communicationDo: ConditionalItem[] = [
  // D do
  { fr: 'Allez droit au but, soyez concis et direct', en: 'Get straight to the point, be concise and direct', condition: (s) => high(s.D), priority: (s) => s.D },
  { fr: 'Présentez les résultats attendus plutôt que les détails du processus', en: 'Present expected results rather than process details', condition: (s) => high(s.D), priority: (s) => s.D - 1 },
  { fr: 'Proposez des options avec les avantages de chacune', en: 'Offer options with the benefits of each', condition: (s) => high(s.D), priority: (s) => s.D - 2 },
  { fr: 'Respectez son besoin d\'autonomie et de contrôle', en: 'Respect their need for autonomy and control', condition: (s) => high(s.D), priority: (s) => s.D - 3 },
  { fr: 'Montrez que vous êtes orienté action et solutions', en: 'Show that you are action and solution-oriented', condition: (s) => high(s.D), priority: (s) => s.D - 4 },
  { fr: 'Soyez factuel et précis dans vos arguments', en: 'Be factual and precise in your arguments', condition: (s) => high(s.D) && high(s.C), priority: (s) => (s.D + s.C) / 2 - 2 },

  // I do
  { fr: 'Soyez chaleureux et expressif dans vos échanges', en: 'Be warm and expressive in exchanges', condition: (s) => high(s.I), priority: (s) => s.I },
  { fr: 'Laissez-lui du temps pour s\'exprimer et partager ses idées', en: 'Give them time to express and share ideas', condition: (s) => high(s.I), priority: (s) => s.I - 1 },
  { fr: 'Valorisez ses idées et son enthousiasme', en: 'Value their ideas and enthusiasm', condition: (s) => high(s.I), priority: (s) => s.I - 2 },
  { fr: 'Utilisez l\'humour et la convivialité', en: 'Use humor and friendliness', condition: (s) => high(s.I), priority: (s) => s.I - 3 },
  { fr: 'Proposez des brainstormings et échanges informels', en: 'Suggest brainstorming and informal discussions', condition: (s) => high(s.I), priority: (s) => s.I - 4 },
  { fr: 'Reconnaissez publiquement ses contributions', en: 'Publicly acknowledge their contributions', condition: (s) => high(s.I) && !high(s.C), priority: (s) => s.I - 5 },

  // S do
  { fr: 'Soyez patient et rassurant dans vos échanges', en: 'Be patient and reassuring in exchanges', condition: (s) => high(s.S), priority: (s) => s.S },
  { fr: 'Prévenez des changements suffisamment à l\'avance', en: 'Warn about changes well in advance', condition: (s) => high(s.S), priority: (s) => s.S - 1 },
  { fr: 'Demandez son avis sincèrement et écoutez sa réponse', en: 'Ask for their opinion sincerely and listen', condition: (s) => high(s.S), priority: (s) => s.S - 2 },
  { fr: 'Montrez de la reconnaissance pour sa fiabilité et sa constance', en: 'Show appreciation for their reliability and consistency', condition: (s) => high(s.S), priority: (s) => s.S - 3 },
  { fr: 'Offrez un cadre sécurisant avec des repères clairs', en: 'Provide a reassuring framework with clear guidelines', condition: (s) => high(s.S), priority: (s) => s.S - 4 },
  { fr: 'Donnez-lui le temps de traiter l\'information', en: 'Give them time to process information', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 - 2 },

  // C do
  { fr: 'Soyez précis, factuel et bien préparé', en: 'Be precise, factual, and well-prepared', condition: (s) => high(s.C), priority: (s) => s.C },
  { fr: 'Appuyez vos arguments sur des données et des preuves', en: 'Support arguments with data and evidence', condition: (s) => high(s.C), priority: (s) => s.C - 1 },
  { fr: 'Donnez-lui du temps pour analyser et réfléchir', en: 'Give them time to analyze and reflect', condition: (s) => high(s.C), priority: (s) => s.C - 2 },
  { fr: 'Respectez son besoin de structure et de clarté', en: 'Respect their need for structure and clarity', condition: (s) => high(s.C), priority: (s) => s.C - 3 },
  { fr: 'Fournissez les détails et les informations complètes', en: 'Provide details and complete information', condition: (s) => high(s.C), priority: (s) => s.C - 4 },
  { fr: 'Respectez les processus et les protocoles établis', en: 'Respect established processes and protocols', condition: (s) => high(s.C) && !high(s.D), priority: (s) => s.C - 5 },

  // Combined do
  { fr: 'Combinez rigueur des faits et dynamisme de la présentation', en: 'Combine factual rigor with dynamic presentation', condition: (s) => high(s.C) && high(s.I), priority: (s) => (s.C + s.I) / 2 - 3 },
  { fr: 'Soyez direct mais attentif à ses réactions', en: 'Be direct but attentive to their reactions', condition: (s) => high(s.D) && high(s.S), priority: (s) => (s.D + s.S) / 2 - 3 },
  { fr: 'Donnez une vision d\'ensemble puis les détails si demandé', en: 'Give an overview then details if requested', condition: (s) => high(s.D) && moderate(s.C), priority: (s) => s.D - 6 },
  { fr: 'Créez un espace de dialogue ouvert et sans jugement', en: 'Create an open, judgment-free dialogue space', condition: (s) => high(s.S) && high(s.I), priority: (s) => (s.S + s.I) / 2 - 3 },
  { fr: 'Présentez un plan d\'action clair avec des échéances', en: 'Present a clear action plan with deadlines', condition: (s) => high(s.D) && high(s.C), priority: (s) => (s.D + s.C) / 2 - 4 },
  { fr: 'Sollicitez son expertise et ses connaissances', en: 'Seek out their expertise and knowledge', condition: (s) => high(s.C) && !low(s.I), priority: (s) => s.C - 6 },
  { fr: 'Commencez par les points d\'accord avant les divergences', en: 'Start with points of agreement before differences', condition: (s) => high(s.S) && !high(s.D), priority: (s) => s.S - 5 },
  { fr: 'Montrez de l\'intérêt pour la personne, pas seulement le travail', en: 'Show interest in the person, not just the work', condition: (s) => high(s.I) && high(s.S), priority: (s) => (s.I + s.S) / 2 - 4 },

  // Moderate
  { fr: 'Adaptez votre rythme au sien — ni trop rapide, ni trop lent', en: 'Match their pace — not too fast, not too slow', condition: (s) => moderate(s.D) && moderate(s.S), priority: () => 35 },
  { fr: 'Mélangez éléments factuels et relationnels dans vos échanges', en: 'Mix factual and relational elements in exchanges', condition: (s) => moderate(s.C) && moderate(s.I), priority: () => 34 },
  { fr: 'Soyez cohérent et fiable dans vos engagements', en: 'Be consistent and reliable in your commitments', condition: (s) => high(s.S) || high(s.C), priority: (s) => Math.max(s.S, s.C) - 7 },
  { fr: 'Posez des questions ouvertes pour mieux comprendre ses besoins', en: 'Ask open questions to better understand their needs', condition: (s) => high(s.S) && moderate(s.I), priority: (s) => s.S - 6 },
  { fr: 'Tenez vos promesses et respectez les délais annoncés', en: 'Keep your promises and respect announced deadlines', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 5 },

  // Universal fallbacks
  { fr: 'Soyez clair et transparent dans vos intentions', en: 'Be clear and transparent about your intentions', condition: () => true, priority: () => 10 },
  { fr: 'Écoutez activement avant de répondre', en: 'Listen actively before responding', condition: () => true, priority: () => 9 },
  { fr: 'Montrez du respect pour son point de vue', en: 'Show respect for their perspective', condition: () => true, priority: () => 8 },
  { fr: 'Exprimez vos attentes de façon explicite', en: 'Express your expectations explicitly', condition: () => true, priority: () => 7 },
  { fr: 'Soyez authentique et sincère dans vos échanges', en: 'Be authentic and sincere in your exchanges', condition: () => true, priority: () => 6 },
  { fr: 'Adaptez votre rythme et votre ton à la situation', en: 'Adapt your pace and tone to the situation', condition: () => true, priority: () => 5 },
  { fr: 'Privilégiez le dialogue constructif', en: 'Favor constructive dialogue', condition: () => true, priority: () => 4 },
  { fr: 'Reconnaissez ses efforts et ses contributions', en: 'Acknowledge their efforts and contributions', condition: () => true, priority: () => 3 },
];

// ─── Communication Don't (40 items) ──────────────────────────

export const communicationDont: ConditionalItem[] = [
  // D don't
  { fr: 'Ne perdez pas de temps en bavardages inutiles', en: 'Don\'t waste time on unnecessary small talk', condition: (s) => high(s.D), priority: (s) => s.D },
  { fr: 'Ne lui imposez pas de contraintes sans explication', en: 'Don\'t impose constraints without explanation', condition: (s) => high(s.D), priority: (s) => s.D - 1 },
  { fr: 'Ne remettez pas en question son autorité devant les autres', en: 'Don\'t question their authority in front of others', condition: (s) => high(s.D), priority: (s) => s.D - 2 },
  { fr: 'Ne soyez pas trop détaillé ou trop lent dans vos explications', en: 'Don\'t be too detailed or slow in explanations', condition: (s) => high(s.D), priority: (s) => s.D - 3 },
  { fr: 'Ne cherchez pas à le contrôler ou à micro-manager', en: 'Don\'t try to control or micromanage them', condition: (s) => high(s.D), priority: (s) => s.D - 4 },

  // I don't
  { fr: 'Ne soyez pas trop froid ou impersonnel', en: 'Don\'t be too cold or impersonal', condition: (s) => high(s.I), priority: (s) => s.I },
  { fr: 'Ne coupez pas ses élans d\'enthousiasme brutalement', en: 'Don\'t abruptly cut off their enthusiasm', condition: (s) => high(s.I), priority: (s) => s.I - 1 },
  { fr: 'Ne lui imposez pas des tâches trop solitaires ou répétitives', en: 'Don\'t assign them too many solitary or repetitive tasks', condition: (s) => high(s.I), priority: (s) => s.I - 2 },
  { fr: 'Ne négligez pas la dimension relationnelle des échanges', en: 'Don\'t neglect the relational dimension of exchanges', condition: (s) => high(s.I), priority: (s) => s.I - 3 },
  { fr: 'Ne le laissez pas dans l\'ombre — il a besoin de visibilité', en: 'Don\'t leave them in the shadows — they need visibility', condition: (s) => high(s.I), priority: (s) => s.I - 4 },

  // S don't
  { fr: 'Ne le mettez pas sous pression avec des délais irréalistes', en: 'Don\'t put them under pressure with unrealistic deadlines', condition: (s) => high(s.S), priority: (s) => s.S },
  { fr: 'Ne changez pas les plans sans prévenir ni expliquer', en: 'Don\'t change plans without notice or explanation', condition: (s) => high(s.S), priority: (s) => s.S - 1 },
  { fr: 'Ne le brusquez pas et ne l\'interrompez pas', en: 'Don\'t rush or interrupt them', condition: (s) => high(s.S), priority: (s) => s.S - 2 },
  { fr: 'Ne prenez pas son silence pour de l\'accord — vérifiez', en: 'Don\'t take their silence as agreement — check', condition: (s) => high(s.S), priority: (s) => s.S - 3 },
  { fr: 'Ne le confrontez pas de manière agressive', en: 'Don\'t confront them aggressively', condition: (s) => high(s.S), priority: (s) => s.S - 4 },

  // C don't
  { fr: 'Ne soyez pas approximatif ou imprécis dans vos demandes', en: 'Don\'t be vague or imprecise in your requests', condition: (s) => high(s.C), priority: (s) => s.C },
  { fr: 'Ne lui demandez pas de décider sans lui donner les données', en: 'Don\'t ask them to decide without providing data', condition: (s) => high(s.C), priority: (s) => s.C - 1 },
  { fr: 'Ne critiquez pas la qualité de son travail sans preuves', en: 'Don\'t criticize their work quality without evidence', condition: (s) => high(s.C), priority: (s) => s.C - 2 },
  { fr: 'Ne bouleversez pas les processus établis sans justification', en: 'Don\'t disrupt established processes without justification', condition: (s) => high(s.C), priority: (s) => s.C - 3 },
  { fr: 'Ne le forcez pas à improviser ou à décider dans l\'urgence', en: 'Don\'t force them to improvise or decide under pressure', condition: (s) => high(s.C), priority: (s) => s.C - 4 },

  // Combined don't
  { fr: 'Ne confondez pas rapidité et précipitation dans vos demandes', en: 'Don\'t confuse speed with haste in your requests', condition: (s) => high(s.D) && high(s.C), priority: (s) => (s.D + s.C) / 2 - 2 },
  { fr: 'Ne négligez ni les faits ni les sentiments', en: 'Don\'t neglect either facts or feelings', condition: (s) => moderate(s.C) && moderate(s.I), priority: () => 35 },
  { fr: 'N\'ignorez pas ses signaux de mal-être ou de surcharge', en: 'Don\'t ignore their signs of discomfort or overload', condition: (s) => high(s.S) && low(s.D), priority: (s) => s.S - 5 },
  { fr: 'Ne le laissez pas dans l\'incertitude sur les prochaines étapes', en: 'Don\'t leave them uncertain about next steps', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 - 3 },
  { fr: 'Ne monopolisez pas la parole lors des échanges', en: 'Don\'t monopolize the conversation during exchanges', condition: (s) => high(s.S) && high(s.I), priority: (s) => s.S - 6 },
  { fr: 'Ne promettez pas sans être sûr de pouvoir tenir', en: 'Don\'t promise unless you\'re sure you can deliver', condition: (s) => high(s.S) || high(s.C), priority: (s) => Math.max(s.S, s.C) - 6 },
  { fr: 'Ne minimisez pas ses préoccupations ou ses questions', en: 'Don\'t minimize their concerns or questions', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 4 },
  { fr: 'Ne l\'exposez pas publiquement sans son accord', en: 'Don\'t expose them publicly without their consent', condition: (s) => high(s.C) && low(s.I), priority: (s) => s.C - 5 },
  { fr: 'Ne répondez pas à ses questions par des généralités', en: 'Don\'t answer their questions with generalities', condition: (s) => high(s.C) && !low(s.D), priority: (s) => s.C - 6 },
  { fr: 'Ne changez pas de direction sans prévenir et expliquer pourquoi', en: 'Don\'t change direction without notice and explanation', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 - 5 },

  // More don't
  { fr: 'Ne traitez pas ses émotions comme un obstacle', en: 'Don\'t treat their emotions as an obstacle', condition: (s) => high(s.I) && high(s.S), priority: (s) => (s.I + s.S) / 2 - 5 },
  { fr: 'Ne le mettez pas en compétition s\'il ne le souhaite pas', en: 'Don\'t put them in competition if they don\'t want it', condition: (s) => high(s.S) && low(s.D), priority: (s) => s.S - 7 },
  { fr: 'Évitez le flou et l\'ambiguïté dans vos consignes', en: 'Avoid vagueness and ambiguity in your instructions', condition: (s) => high(s.C), priority: (s) => s.C - 7 },
  { fr: 'Ne sous-estimez pas l\'importance qu\'il accorde aux détails', en: 'Don\'t underestimate the importance they place on details', condition: (s) => veryHigh(s.C), priority: (s) => s.C - 3 },
  { fr: 'Ne rejetez pas ses idées sans les avoir considérées', en: 'Don\'t dismiss their ideas without considering them', condition: (s) => high(s.I) && !low(s.C), priority: (s) => s.I - 6 },
  { fr: 'Évitez de lui donner des ordres — préférez les suggestions', en: 'Avoid giving orders — prefer suggestions', condition: (s) => high(s.D) && moderate(s.S), priority: (s) => s.D - 5 },
  { fr: 'Ne faites pas de promesses que vous ne pourrez pas tenir', en: 'Don\'t make promises you can\'t keep', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 - 6 },

  // Universal fallbacks
  { fr: 'Ne faites pas de suppositions sur ses intentions', en: 'Don\'t make assumptions about their intentions', condition: () => true, priority: () => 10 },
  { fr: 'Ne le jugez pas trop rapidement', en: 'Don\'t judge them too quickly', condition: () => true, priority: () => 9 },
  { fr: 'Ne manquez pas de respect envers son travail', en: 'Don\'t disrespect their work', condition: () => true, priority: () => 8 },
  { fr: 'N\'ignorez pas ses besoins au profit des vôtres', en: 'Don\'t ignore their needs in favor of yours', condition: () => true, priority: () => 7 },
  { fr: 'Ne communiquez pas uniquement par écrit pour les sujets importants', en: 'Don\'t communicate only in writing for important topics', condition: () => true, priority: () => 6 },
  { fr: 'Évitez les messages contradictoires', en: 'Avoid contradictory messages', condition: () => true, priority: () => 5 },
  { fr: 'Ne remettez pas en cause sa compétence sans fondement', en: 'Don\'t question their competence without grounds', condition: () => true, priority: () => 4 },
  { fr: 'Évitez de reporter indéfiniment les décisions', en: 'Avoid postponing decisions indefinitely', condition: () => true, priority: () => 3 },
];

// ─── Motivation Keys (50 items) ──────────────────────────────

export const motivationKeys: ConditionalItem[] = [
  // D motivation
  { fr: 'Atteindre des objectifs ambitieux et mesurables', en: 'Achieving ambitious and measurable goals', condition: (s) => high(s.D), priority: (s) => s.D },
  { fr: 'Avoir du pouvoir de décision et de l\'autonomie', en: 'Having decision-making power and autonomy', condition: (s) => high(s.D), priority: (s) => s.D - 1 },
  { fr: 'Relever des défis et repousser ses limites', en: 'Taking on challenges and pushing boundaries', condition: (s) => high(s.D), priority: (s) => s.D - 2 },
  { fr: 'Voir des résultats concrets et rapides', en: 'Seeing concrete and fast results', condition: (s) => high(s.D), priority: (s) => s.D - 3 },
  { fr: 'Être reconnu pour ses compétences et ses réalisations', en: 'Being recognized for skills and achievements', condition: (s) => high(s.D), priority: (s) => s.D - 4 },
  { fr: 'Avoir la possibilité de diriger et d\'influencer', en: 'Having the opportunity to lead and influence', condition: (s) => veryHigh(s.D), priority: (s) => s.D - 2 },

  // I motivation
  { fr: 'Travailler dans un environnement social et collaboratif', en: 'Working in a social and collaborative environment', condition: (s) => high(s.I), priority: (s) => s.I },
  { fr: 'Être apprécié et reconnu par ses pairs', en: 'Being appreciated and recognized by peers', condition: (s) => high(s.I), priority: (s) => s.I - 1 },
  { fr: 'Pouvoir exprimer sa créativité librement', en: 'Being able to express creativity freely', condition: (s) => high(s.I), priority: (s) => s.I - 2 },
  { fr: 'Participer à des projets innovants et stimulants', en: 'Participating in innovative and stimulating projects', condition: (s) => high(s.I), priority: (s) => s.I - 3 },
  { fr: 'Avoir de la variété et éviter la routine', en: 'Having variety and avoiding routine', condition: (s) => high(s.I), priority: (s) => s.I - 4 },
  { fr: 'Inspirer et influencer positivement les autres', en: 'Inspiring and positively influencing others', condition: (s) => veryHigh(s.I), priority: (s) => s.I - 2 },

  // S motivation
  { fr: 'Évoluer dans un cadre stable et sécurisant', en: 'Evolving in a stable and secure framework', condition: (s) => high(s.S), priority: (s) => s.S },
  { fr: 'Contribuer au bien-être et à l\'harmonie de l\'équipe', en: 'Contributing to team well-being and harmony', condition: (s) => high(s.S), priority: (s) => s.S - 1 },
  { fr: 'Se sentir utile et apprécié pour sa fiabilité', en: 'Feeling useful and appreciated for reliability', condition: (s) => high(s.S), priority: (s) => s.S - 2 },
  { fr: 'Avoir des relations de confiance avec ses collègues', en: 'Having trusting relationships with colleagues', condition: (s) => high(s.S), priority: (s) => s.S - 3 },
  { fr: 'Accompagner et aider les autres à progresser', en: 'Supporting and helping others grow', condition: (s) => high(s.S), priority: (s) => s.S - 4 },
  { fr: 'Travailler à un rythme qui permet la qualité', en: 'Working at a pace that allows quality', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 - 2 },

  // C motivation
  { fr: 'Comprendre en profondeur les sujets sur lesquels on travaille', en: 'Deeply understanding the subjects one works on', condition: (s) => high(s.C), priority: (s) => s.C },
  { fr: 'Produire un travail de haute qualité et sans erreur', en: 'Producing high-quality, error-free work', condition: (s) => high(s.C), priority: (s) => s.C - 1 },
  { fr: 'Disposer de toutes les informations nécessaires', en: 'Having all necessary information available', condition: (s) => high(s.C), priority: (s) => s.C - 2 },
  { fr: 'Travailler dans un cadre structuré avec des règles claires', en: 'Working in a structured framework with clear rules', condition: (s) => high(s.C), priority: (s) => s.C - 3 },
  { fr: 'Être reconnu pour son expertise et sa rigueur', en: 'Being recognized for expertise and rigor', condition: (s) => high(s.C), priority: (s) => s.C - 4 },
  { fr: 'Résoudre des problèmes complexes avec méthode', en: 'Solving complex problems methodically', condition: (s) => veryHigh(s.C), priority: (s) => s.C - 2 },

  // Combined motivation
  { fr: 'Allier performance individuelle et réussite collective', en: 'Combining individual performance and collective success', condition: (s) => high(s.D) && high(s.I), priority: (s) => (s.D + s.I) / 2 - 3 },
  { fr: 'Construire quelque chose de durable et de qualité', en: 'Building something lasting and of quality', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 - 2 },
  { fr: 'Avoir un impact concret sur son environnement', en: 'Having a concrete impact on one\'s environment', condition: (s) => high(s.D) && !low(s.I), priority: (s) => s.D - 5 },
  { fr: 'Faire partie d\'une équipe qui se soutient mutuellement', en: 'Being part of a team that supports each other', condition: (s) => high(s.S) && high(s.I), priority: (s) => (s.S + s.I) / 2 - 3 },
  { fr: 'Apprendre continuellement et développer ses compétences', en: 'Continuously learning and developing skills', condition: (s) => high(s.C) && !low(s.I), priority: (s) => s.C - 5 },
  { fr: 'Voir le fruit de ses efforts et sa progression', en: 'Seeing the fruits of one\'s efforts and progress', condition: (s) => high(s.D) && high(s.S), priority: (s) => (s.D + s.S) / 2 - 4 },
  { fr: 'Travailler dans un environnement éthique et juste', en: 'Working in an ethical and fair environment', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 4 },
  { fr: 'Être encouragé à innover et proposer de nouvelles idées', en: 'Being encouraged to innovate and propose new ideas', condition: (s) => high(s.I) && moderate(s.D), priority: (s) => s.I - 5 },
  { fr: 'Avoir un rôle clair avec des responsabilités définies', en: 'Having a clear role with defined responsibilities', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 5 },
  { fr: 'Sentir que son travail a du sens et de la valeur', en: 'Feeling that one\'s work has meaning and value', condition: (s) => high(s.S) && moderate(s.C), priority: (s) => s.S - 5 },
  { fr: 'Pouvoir se concentrer sans interruptions fréquentes', en: 'Being able to focus without frequent interruptions', condition: (s) => high(s.C) && low(s.I), priority: (s) => s.C - 6 },
  { fr: 'Évoluer professionnellement et gravir les échelons', en: 'Growing professionally and climbing the ranks', condition: (s) => high(s.D) && !low(s.C), priority: (s) => s.D - 6 },

  // Moderate
  { fr: 'Avoir un équilibre entre vie professionnelle et personnelle', en: 'Having a work-life balance', condition: (s) => moderate(s.D) && high(s.S), priority: (s) => s.S - 6 },
  { fr: 'Travailler sur des sujets variés et enrichissants', en: 'Working on varied and enriching subjects', condition: (s) => moderate(s.I) && moderate(s.C), priority: () => 38 },
  { fr: 'Être traité avec respect et considération', en: 'Being treated with respect and consideration', condition: (s) => high(s.S) || high(s.C), priority: (s) => Math.max(s.S, s.C) - 7 },
  { fr: 'Contribuer à des projets qui comptent vraiment', en: 'Contributing to projects that truly matter', condition: (s) => high(s.D) || high(s.S), priority: (s) => Math.max(s.D, s.S) - 7 },
  { fr: 'Recevoir des feedbacks constructifs pour progresser', en: 'Receiving constructive feedback to improve', condition: (s) => high(s.C) && moderate(s.I), priority: (s) => s.C - 7 },
  { fr: 'Avoir confiance en sa hiérarchie et dans la direction', en: 'Having trust in management and leadership', condition: (s) => high(s.S) && !veryHigh(s.D), priority: (s) => s.S - 7 },

  // Extra
  { fr: 'Être impliqué dans les décisions importantes', en: 'Being involved in important decisions', condition: (s) => high(s.D) && moderate(s.C), priority: (s) => s.D - 7 },
  { fr: 'Partager ses connaissances et former les autres', en: 'Sharing knowledge and training others', condition: (s) => high(s.I) && high(s.C), priority: (s) => (s.I + s.C) / 2 - 4 },
  { fr: 'Se sentir en sécurité dans son poste et son rôle', en: 'Feeling secure in one\'s position and role', condition: (s) => veryHigh(s.S) && low(s.D), priority: (s) => s.S - 3 },
  { fr: 'Avoir les moyens et outils nécessaires pour bien travailler', en: 'Having the necessary resources and tools to work well', condition: (s) => high(s.C) && moderate(s.D), priority: (s) => s.C - 8 },

  // Universal fallbacks
  { fr: 'Sentir que son travail a du sens et contribue à quelque chose', en: 'Feeling that one\'s work has meaning and contributes', condition: () => true, priority: () => 10 },
  { fr: 'Être traité avec équité et respect', en: 'Being treated fairly and with respect', condition: () => true, priority: () => 9 },
  { fr: 'Avoir des perspectives d\'évolution claires', en: 'Having clear growth prospects', condition: () => true, priority: () => 8 },
  { fr: 'Travailler dans une ambiance positive et bienveillante', en: 'Working in a positive and supportive atmosphere', condition: () => true, priority: () => 7 },
  { fr: 'Être encouragé et soutenu dans ses efforts', en: 'Being encouraged and supported in one\'s efforts', condition: () => true, priority: () => 6 },
  { fr: 'Disposer d\'un cadre de travail clair et organisé', en: 'Having a clear and organized work framework', condition: () => true, priority: () => 5 },
  { fr: 'Pouvoir compter sur ses collègues', en: 'Being able to rely on colleagues', condition: () => true, priority: () => 4 },
  { fr: 'Recevoir de la reconnaissance pour ses efforts', en: 'Receiving recognition for one\'s efforts', condition: () => true, priority: () => 3 },
];

// ─── Improvement Areas (50 items) ────────────────────────────

export const improvementAreas: ConditionalItem[] = [
  // D improvements
  { fr: 'Développer davantage la patience et l\'écoute active', en: 'Develop more patience and active listening', condition: (s) => high(s.D) && low(s.S), priority: (s) => s.D },
  { fr: 'Apprendre à déléguer et à faire confiance', en: 'Learn to delegate and trust others', condition: (s) => high(s.D), priority: (s) => s.D - 1 },
  { fr: 'Prendre le temps de considérer les impacts humains des décisions', en: 'Take time to consider the human impact of decisions', condition: (s) => high(s.D) && low(s.I), priority: (s) => s.D - 2 },
  { fr: 'Tempérer l\'impatience quand les résultats tardent', en: 'Temper impatience when results are slow', condition: (s) => high(s.D), priority: (s) => s.D - 3 },
  { fr: 'Accorder plus d\'attention aux détails et aux processus', en: 'Pay more attention to details and processes', condition: (s) => high(s.D) && low(s.C), priority: (s) => s.D - 4 },
  { fr: 'Accepter que tout le monde n\'ait pas le même rythme', en: 'Accept that not everyone works at the same pace', condition: (s) => veryHigh(s.D) && low(s.S), priority: (s) => s.D - 1 },

  // I improvements
  { fr: 'Renforcer le suivi et la rigueur dans les projets', en: 'Strengthen follow-through and rigor in projects', condition: (s) => high(s.I) && low(s.C), priority: (s) => s.I },
  { fr: 'Apprendre à écouter davantage et parler moins', en: 'Learn to listen more and talk less', condition: (s) => high(s.I) && low(s.S), priority: (s) => s.I - 1 },
  { fr: 'Mieux gérer son temps et ses engagements', en: 'Better manage time and commitments', condition: (s) => high(s.I), priority: (s) => s.I - 2 },
  { fr: 'Ne pas éviter les conversations difficiles nécessaires', en: 'Don\'t avoid necessary difficult conversations', condition: (s) => high(s.I) && low(s.D), priority: (s) => s.I - 3 },
  { fr: 'Se concentrer sur une tâche à la fois plutôt que de se disperser', en: 'Focus on one task at a time rather than scattering', condition: (s) => high(s.I) && low(s.C), priority: (s) => s.I - 4 },
  { fr: 'Transformer les idées en plans d\'action concrets', en: 'Turn ideas into concrete action plans', condition: (s) => veryHigh(s.I) && low(s.C), priority: (s) => s.I - 2 },

  // S improvements
  { fr: 'Oser exprimer ses besoins et poser des limites', en: 'Dare to express needs and set boundaries', condition: (s) => high(s.S) && low(s.D), priority: (s) => s.S },
  { fr: 'Accepter le changement comme une opportunité de croissance', en: 'Accept change as a growth opportunity', condition: (s) => high(s.S), priority: (s) => s.S - 1 },
  { fr: 'Ne pas prendre les décisions des autres personnellement', en: 'Don\'t take others\' decisions personally', condition: (s) => high(s.S), priority: (s) => s.S - 2 },
  { fr: 'Prendre plus d\'initiatives sans attendre la validation', en: 'Take more initiative without waiting for validation', condition: (s) => high(s.S) && low(s.D), priority: (s) => s.S - 3 },
  { fr: 'Exprimer les désaccords de manière constructive', en: 'Express disagreements constructively', condition: (s) => high(s.S), priority: (s) => s.S - 4 },
  { fr: 'Oser sortir de sa zone de confort régulièrement', en: 'Dare to step out of comfort zone regularly', condition: (s) => veryHigh(s.S) && low(s.D), priority: (s) => s.S - 1 },

  // C improvements
  { fr: 'Accepter que la perfection n\'est pas toujours nécessaire', en: 'Accept that perfection isn\'t always necessary', condition: (s) => high(s.C), priority: (s) => s.C },
  { fr: 'Prendre des décisions même avec des informations incomplètes', en: 'Make decisions even with incomplete information', condition: (s) => high(s.C) && low(s.D), priority: (s) => s.C - 1 },
  { fr: 'Développer la dimension relationnelle au travail', en: 'Develop the relational dimension at work', condition: (s) => high(s.C) && low(s.I), priority: (s) => s.C - 2 },
  { fr: 'Ne pas sur-analyser au détriment de l\'action', en: 'Don\'t over-analyze at the expense of action', condition: (s) => high(s.C) && low(s.D), priority: (s) => s.C - 3 },
  { fr: 'Apprendre à improviser et sortir du cadre parfois', en: 'Learn to improvise and think outside the box sometimes', condition: (s) => high(s.C), priority: (s) => s.C - 4 },
  { fr: 'Montrer plus de chaleur et d\'expressivité dans les échanges', en: 'Show more warmth and expressiveness in exchanges', condition: (s) => veryHigh(s.C) && low(s.I), priority: (s) => s.C - 1 },

  // Combined improvements
  { fr: 'Trouver l\'équilibre entre exigence et bienveillance', en: 'Find the balance between standards and kindness', condition: (s) => high(s.D) && high(s.C) && low(s.S), priority: (s) => (s.D + s.C) / 2 - 3 },
  { fr: 'Canaliser son énergie vers les priorités essentielles', en: 'Channel energy toward essential priorities', condition: (s) => high(s.D) && high(s.I), priority: (s) => (s.D + s.I) / 2 - 4 },
  { fr: 'Communiquer les attentes plus clairement aux autres', en: 'Communicate expectations more clearly to others', condition: (s) => high(s.D) && low(s.I), priority: (s) => s.D - 5 },
  { fr: 'Apprendre à dire non avec diplomatie', en: 'Learn to say no diplomatically', condition: (s) => high(s.S) && high(s.I), priority: (s) => (s.S + s.I) / 2 - 3 },
  { fr: 'Développer la capacité à gérer les conflits', en: 'Develop the ability to manage conflicts', condition: (s) => high(s.S) && low(s.D), priority: (s) => s.S - 5 },
  { fr: 'Cultiver la souplesse face aux imprévus', en: 'Cultivate flexibility in the face of the unexpected', condition: (s) => high(s.C) && high(s.S), priority: (s) => (s.C + s.S) / 2 - 3 },
  { fr: 'Se rappeler que l\'erreur fait partie de l\'apprentissage', en: 'Remember that mistakes are part of learning', condition: (s) => high(s.C) && !high(s.D), priority: (s) => s.C - 5 },
  { fr: 'Verbaliser ses émotions plutôt que de les intérioriser', en: 'Verbalize emotions rather than internalize them', condition: (s) => high(s.S) && high(s.C), priority: (s) => (s.S + s.C) / 2 - 4 },
  { fr: 'Pratiquer la prise de parole en groupe', en: 'Practice speaking up in groups', condition: (s) => low(s.I) && high(s.C), priority: (s) => s.C - 6 },
  { fr: 'Développer la capacité à synthétiser et simplifier', en: 'Develop the ability to synthesize and simplify', condition: (s) => high(s.C) && low(s.I), priority: (s) => s.C - 7 },
  { fr: 'Reconnaître et célébrer les petites victoires', en: 'Recognize and celebrate small wins', condition: (s) => high(s.D) && low(s.I), priority: (s) => s.D - 6 },

  // Moderate
  { fr: 'Identifier plus clairement ses priorités et s\'y tenir', en: 'More clearly identify priorities and stick to them', condition: (s) => moderate(s.D) && moderate(s.C), priority: () => 38 },
  { fr: 'Travailler la communication assertive', en: 'Work on assertive communication', condition: (s) => moderate(s.D) && moderate(s.I), priority: () => 36 },
  { fr: 'Apprendre à demander de l\'aide quand nécessaire', en: 'Learn to ask for help when needed', condition: (s) => high(s.S) || (high(s.C) && low(s.I)), priority: (s) => Math.max(s.S, s.C) - 8 },

  // Extra
  { fr: 'Accepter les compliments et les retours positifs', en: 'Accept compliments and positive feedback', condition: (s) => high(s.C) && low(s.I), priority: (s) => s.C - 8 },
  { fr: 'Prendre du recul régulièrement pour éviter le surmenage', en: 'Step back regularly to avoid burnout', condition: (s) => high(s.D) && high(s.C), priority: (s) => (s.D + s.C) / 2 - 5 },
  { fr: 'Ne pas se comparer systématiquement aux autres', en: 'Don\'t systematically compare yourself to others', condition: (s) => high(s.D) || high(s.C), priority: (s) => Math.max(s.D, s.C) - 9 },
  { fr: 'Apprendre à prioriser l\'essentiel sur l\'urgent', en: 'Learn to prioritize the essential over the urgent', condition: (s) => high(s.D) && !high(s.C), priority: (s) => s.D - 7 },
  { fr: 'Cultiver la gratitude pour ce qui fonctionne bien', en: 'Cultivate gratitude for what works well', condition: (s) => high(s.C) && high(s.D), priority: (s) => (s.C + s.D) / 2 - 6 },

  // Universal fallbacks
  { fr: 'Développer la conscience de soi et de ses réactions sous stress', en: 'Develop self-awareness and stress reactions', condition: () => true, priority: () => 10 },
  { fr: 'Développer la capacité d\'adaptation à différents interlocuteurs', en: 'Develop adaptability to different communication styles', condition: () => true, priority: () => 9 },
  { fr: 'Apprendre à mieux gérer son énergie au quotidien', en: 'Learn to better manage daily energy', condition: () => true, priority: () => 8 },
  { fr: 'Pratiquer la communication assertive et bienveillante', en: 'Practice assertive and kind communication', condition: () => true, priority: () => 7 },
  { fr: 'Développer l\'écoute active dans les échanges', en: 'Develop active listening in conversations', condition: () => true, priority: () => 6 },
  { fr: 'Oser sortir de sa zone de confort de temps en temps', en: 'Dare to step out of one\'s comfort zone from time to time', condition: () => true, priority: () => 5 },
  { fr: 'Cultiver la patience envers soi-même et les autres', en: 'Cultivate patience toward oneself and others', condition: () => true, priority: () => 4 },
  { fr: 'Apprendre à célébrer les petites victoires', en: 'Learn to celebrate small wins', condition: () => true, priority: () => 3 },
];

// ─── Narrative Descriptions (8 wheel types) ──────────────────

interface NarrativeBlock {
  type: WheelType;
  fr: string;
  en: string;
}

export const narrativeDescriptions: NarrativeBlock[] = [
  {
    type: 'DIRECTIF',
    fr: `Vous êtes une personne résolument tournée vers l'action et les résultats. Votre style naturel est direct, affirmé et orienté vers l'objectif. Vous n'hésitez pas à prendre les rênes d'un projet et à tracer la voie pour les autres. Votre capacité à décider rapidement, même sous pression, est l'une de vos forces les plus remarquables.

Votre moteur principal est le défi : vous êtes stimulé par les obstacles et vous les percevez comme des opportunités de démontrer votre valeur. Vous avez un besoin profond d'autonomie et de contrôle, et vous êtes plus efficace lorsqu'on vous laisse la liberté de mener les choses à votre façon.

Votre communication est directe et sans détour. Vous préférez les échanges courts, efficaces et orientés solutions. Les discussions trop longues ou les processus lents peuvent être source de frustration pour vous. Votre entourage vous perçoit comme quelqu'un de déterminé, courageux et franc — mais sous pression, cette intensité peut parfois être perçue comme de l'autoritarisme ou de l'impatience.`,
    en: `You are a person resolutely focused on action and results. Your natural style is direct, assertive, and goal-oriented. You don't hesitate to take the reins of a project and blaze the trail for others. Your ability to decide quickly, even under pressure, is one of your most remarkable strengths.

Your main driver is challenge: you are energized by obstacles and see them as opportunities to demonstrate your value. You have a deep need for autonomy and control, and you are most effective when given the freedom to lead things your way.

Your communication is direct and straightforward. You prefer short, efficient, solution-oriented exchanges. Lengthy discussions or slow processes can be a source of frustration for you. Those around you perceive you as determined, courageous, and frank — but under pressure, this intensity can sometimes be perceived as authoritarian or impatient.`,
  },
  {
    type: 'PROMOUVANT',
    fr: `Vous combinez une énergie orientée action avec un talent naturel pour la communication et l'influence. Ce profil fait de vous un catalyseur : vous savez à la fois initier les projets et embarquer les autres dans votre vision. Votre charisme naturel et votre détermination créent une dynamique puissante.

Vous êtes stimulé par les nouveaux défis et les environnements qui vous permettent d'innover tout en obtenant des résultats concrets. Votre capacité à convaincre et à fédérer est un atout majeur : vous savez transformer une idée en mouvement collectif.

Votre communication est enthousiaste et persuasive, mais aussi directe et orientée résultats. Vous savez adapter votre discours pour motiver et engager, tout en gardant le cap sur les objectifs. Sous stress, vous pouvez avoir tendance à devenir trop directif ou à imposer votre vision sans suffisamment consulter les autres.`,
    en: `You combine action-oriented energy with a natural talent for communication and influence. This profile makes you a catalyst: you know how to both initiate projects and get others on board with your vision. Your natural charisma and determination create a powerful dynamic.

You are energized by new challenges and environments that allow you to innovate while achieving concrete results. Your ability to convince and unite people is a major asset: you can transform an idea into collective momentum.

Your communication is enthusiastic and persuasive, but also direct and results-oriented. You know how to adapt your speech to motivate and engage, while keeping the focus on objectives. Under stress, you may tend to become too directive or impose your vision without sufficiently consulting others.`,
  },
  {
    type: 'EXPANSIF',
    fr: `Vous êtes un communicateur né, doté d'un enthousiasme contagieux et d'un optimisme naturel. Votre énergie sociale et votre capacité à créer des liens font de vous un élément fédérateur dans toute équipe. Vous vivez pour les interactions humaines et vous tirez votre énergie des échanges avec les autres.

Votre créativité et votre ouverture d'esprit vous permettent de voir des possibilités là où d'autres voient des contraintes. Vous êtes naturellement attiré par la nouveauté, la variété et l'innovation. L'ennui et la routine sont vos plus grands ennemis.

Votre communication est chaleureuse, expressive et persuasive. Vous avez un don pour rendre les idées séduisantes et pour créer une atmosphère positive. Sous stress, votre besoin de reconnaissance peut vous pousser à vous disperser ou à promettre plus que ce que vous pouvez tenir. Vos interlocuteurs vous perçoivent généralement comme quelqu'un de dynamique et d'inspirant.`,
    en: `You are a born communicator, with contagious enthusiasm and natural optimism. Your social energy and ability to build connections make you a unifying force in any team. You thrive on human interactions and draw your energy from exchanges with others.

Your creativity and open-mindedness allow you to see possibilities where others see constraints. You are naturally drawn to novelty, variety, and innovation. Boredom and routine are your greatest enemies.

Your communication is warm, expressive, and persuasive. You have a gift for making ideas appealing and creating a positive atmosphere. Under stress, your need for recognition may lead you to spread yourself thin or promise more than you can deliver. Others generally perceive you as dynamic and inspiring.`,
  },
  {
    type: 'FACILITANT',
    fr: `Vous alliez un talent naturel pour les relations humaines à une profonde sensibilité aux besoins des autres. Ce profil fait de vous un facilitateur hors pair : vous savez créer les conditions pour que chacun donne le meilleur de lui-même dans un climat positif et bienveillant.

Vous êtes motivé par les interactions chaleureuses et la construction de relations durables. Votre capacité d'écoute, combinée à votre aisance sociale, vous permet de comprendre intuitivement ce qui motive vos interlocuteurs et de vous y adapter naturellement.

Votre communication est empathique, chaleureuse et inclusive. Vous cherchez naturellement le consensus et l'harmonie dans les échanges. Sous stress, vous pouvez avoir du mal à prendre des décisions impopulaires ou à affronter les conflits directement. Votre entourage vous perçoit comme quelqu'un de bienveillant, accessible et compréhensif.`,
    en: `You combine a natural talent for human relationships with a deep sensitivity to others' needs. This profile makes you an outstanding facilitator: you know how to create conditions for everyone to give their best in a positive and caring atmosphere.

You are motivated by warm interactions and building lasting relationships. Your listening ability, combined with your social ease, allows you to intuitively understand what motivates your interlocutors and adapt naturally.

Your communication is empathetic, warm, and inclusive. You naturally seek consensus and harmony in exchanges. Under stress, you may struggle to make unpopular decisions or confront conflicts directly. Those around you perceive you as kind, approachable, and understanding.`,
  },
  {
    type: 'COOPERATIF',
    fr: `Vous êtes le pilier silencieux sur lequel toute équipe peut compter. Votre fiabilité, votre patience et votre constance sont des qualités rares et précieuses dans un monde qui valorise souvent la vitesse et le bruit. Vous incarnez la stabilité et la loyauté.

Votre moteur est l'harmonie et la sécurité : vous donnez le meilleur de vous-même dans un environnement stable, prévisible et respectueux. Vous avez une capacité remarquable à écouter vraiment, à comprendre les autres et à les accompagner avec bienveillance.

Votre communication est calme, posée et bienveillante. Vous êtes un médiateur naturel qui sait désamorcer les tensions par votre seule présence rassurante. Sous stress, votre difficulté à dire non ou à exprimer vos frustrations peut conduire à un épuisement silencieux. Les autres vous perçoivent comme quelqu'un de fiable, patient et d'une grande qualité d'écoute.`,
    en: `You are the quiet pillar that any team can rely on. Your reliability, patience, and consistency are rare and valuable qualities in a world that often values speed and noise. You embody stability and loyalty.

Your driver is harmony and security: you perform best in a stable, predictable, and respectful environment. You have a remarkable ability to truly listen, understand others, and support them with kindness.

Your communication is calm, measured, and caring. You are a natural mediator who can defuse tensions simply through your reassuring presence. Under stress, your difficulty saying no or expressing frustrations can lead to silent exhaustion. Others perceive you as reliable, patient, and an excellent listener.`,
  },
  {
    type: 'COORDONNANT',
    fr: `Vous combinez la stabilité et l'écoute du profil Vert avec la rigueur et la précision du profil Bleu. Ce profil fait de vous un coordinateur exceptionnel : méthodique, fiable et attentif aux besoins de chacun. Vous êtes le garant de la qualité et de la cohésion.

Votre moteur est la recherche d'excellence dans un cadre harmonieux. Vous avez besoin de comprendre les choses en profondeur et de vous assurer que le travail est fait correctement, tout en veillant au bien-être de votre environnement. Vous prenez vos décisions de manière réfléchie, en pesant soigneusement les faits et les impacts humains.

Votre communication est posée, précise et bienveillante. Vous préférez écouter avant de parler, et quand vous vous exprimez, c'est toujours avec mesure et justesse. Sous stress, votre perfectionnisme combiné à votre résistance au changement peut vous freiner. Les autres vous perçoivent comme quelqu'un de sérieux, compétent et d'une fiabilité exemplaire.`,
    en: `You combine the stability and listening of the Green profile with the rigor and precision of the Blue profile. This profile makes you an exceptional coordinator: methodical, reliable, and attentive to everyone's needs. You are the guardian of quality and cohesion.

Your driver is the pursuit of excellence within a harmonious framework. You need to understand things deeply and ensure work is done correctly, while caring for the well-being of your environment. You make decisions thoughtfully, carefully weighing facts and human impacts.

Your communication is measured, precise, and caring. You prefer to listen before speaking, and when you do speak, it is always with balance and accuracy. Under stress, your perfectionism combined with resistance to change can hold you back. Others perceive you as serious, competent, and remarkably reliable.`,
  },
  {
    type: 'NORMATIF',
    fr: `Vous êtes guidé par la quête de qualité, de précision et de conformité aux standards élevés que vous vous fixez. Votre esprit analytique et votre rigueur méthodique font de vous un expert dans votre domaine. Vous ne laissez rien au hasard et chaque détail compte pour vous.

Votre moteur est la compréhension profonde et la maîtrise : vous avez besoin de connaître les règles, les données et les faits avant d'agir. Vous êtes stimulé par les problèmes complexes qui nécessitent une analyse approfondie et une résolution méthodique.

Votre communication est précise, structurée et factuelle. Vous préférez les échanges qui vont en profondeur plutôt qu'en surface. Sous stress, votre perfectionnisme peut devenir paralysant, et votre besoin de contrôle peut vous rendre critique envers ceux qui ne partagent pas vos standards. Les autres vous perçoivent comme quelqu'un de compétent, rigoureux et d'une expertise remarquable.`,
    en: `You are guided by the pursuit of quality, precision, and compliance with the high standards you set for yourself. Your analytical mind and methodical rigor make you an expert in your field. You leave nothing to chance and every detail matters to you.

Your driver is deep understanding and mastery: you need to know the rules, data, and facts before acting. You are energized by complex problems that require thorough analysis and methodical resolution.

Your communication is precise, structured, and factual. You prefer exchanges that go deep rather than staying on the surface. Under stress, your perfectionism can become paralyzing, and your need for control can make you critical of those who don't share your standards. Others perceive you as competent, rigorous, and remarkably expert.`,
  },
  {
    type: 'ORGANISANT',
    fr: `Vous combinez la rigueur analytique du profil Bleu avec l'orientation résultats du profil Rouge. Ce profil fait de vous un organisateur puissant : vous savez concevoir des systèmes efficaces et les mettre en œuvre avec détermination. Vous alliez réflexion stratégique et capacité d'exécution.

Votre moteur est l'efficacité organisée : vous cherchez à obtenir les meilleurs résultats possible tout en maintenant un haut niveau de qualité et de rigueur. Vous avez un don pour structurer, planifier et optimiser.

Votre communication est directe et factuelle, avec un souci constant de précision. Vous présentez vos idées de manière logique et argumentée, et vous attendez la même rigueur de vos interlocuteurs. Sous stress, vous pouvez devenir trop exigeant ou inflexible, ayant du mal à accepter des approches différentes de la vôtre. Les autres vous perçoivent comme quelqu'un de structuré, compétent et exigeant.`,
    en: `You combine the analytical rigor of the Blue profile with the results orientation of the Red profile. This profile makes you a powerful organizer: you know how to design efficient systems and implement them with determination. You combine strategic thinking with execution ability.

Your driver is organized efficiency: you seek to achieve the best possible results while maintaining a high level of quality and rigor. You have a gift for structuring, planning, and optimizing.

Your communication is direct and factual, with a constant concern for precision. You present your ideas logically and with well-supported arguments, and you expect the same rigor from others. Under stress, you can become too demanding or inflexible, struggling to accept approaches different from your own. Others perceive you as structured, competent, and demanding.`,
  },
];

// ─── Opposite Type Descriptions ──────────────────────────────

interface OppositeDescription {
  type: WheelType;
  oppositeType: WheelType;
  fr: string;
  en: string;
}

export const oppositeDescriptions: OppositeDescription[] = [
  {
    type: 'DIRECTIF',
    oppositeType: 'COOPERATIF',
    fr: `Votre opposé est le profil COOPÉRATIF (Vert dominant). Là où vous foncez vers l'objectif, il prend son temps. Là où vous tranchez rapidement, il cherche le consensus. Sa patience peut vous paraître de la lenteur, et votre directivité peut lui sembler agressive.

Pour mieux interagir avec ce profil : ralentissez, écoutez, et montrez que vous vous souciez des personnes autant que des résultats. Ce profil vous apprend la valeur de la patience et de l'harmonie.`,
    en: `Your opposite is the COOPERATIVE profile (Green dominant). Where you rush toward the goal, they take their time. Where you decide quickly, they seek consensus. Their patience may seem like slowness to you, and your directness may feel aggressive to them.

To better interact with this profile: slow down, listen, and show that you care about people as much as results. This profile teaches you the value of patience and harmony.`,
  },
  {
    type: 'PROMOUVANT',
    oppositeType: 'COORDONNANT',
    fr: `Votre opposé est le profil COORDONNANT (Vert-Bleu). Là où vous improvisez et innovez, il planifie et structure. Là où vous cherchez l'élan et le dynamisme, il cherche la stabilité et la précision. Votre énergie peut le déstabiliser, et sa prudence peut vous freiner.

Pour mieux interagir avec ce profil : présentez vos idées avec des faits, donnez-lui du temps, et montrez que vous avez réfléchi aux risques. Ce profil vous apprend la valeur de la préparation et de la constance.`,
    en: `Your opposite is the COORDINATING profile (Green-Blue). Where you improvise and innovate, they plan and structure. Where you seek momentum and dynamism, they seek stability and precision. Your energy may destabilize them, and their caution may slow you down.

To better interact with this profile: present your ideas with facts, give them time, and show that you've considered the risks. This profile teaches you the value of preparation and consistency.`,
  },
  {
    type: 'EXPANSIF',
    oppositeType: 'NORMATIF',
    fr: `Votre opposé est le profil NORMATIF (Bleu dominant). Là où vous êtes spontané et expressif, il est réservé et méthodique. Là où vous foncez sur l'intuition, il attend les données. Votre exubérance peut l'épuiser, et son côté analytique peut vous paraître froid.

Pour mieux interagir avec ce profil : structurez vos idées, appuyez-vous sur des faits, et respectez son besoin de calme et de réflexion. Ce profil vous apprend la valeur de la rigueur et de l'analyse.`,
    en: `Your opposite is the NORMATIVE profile (Blue dominant). Where you are spontaneous and expressive, they are reserved and methodical. Where you act on intuition, they wait for data. Your exuberance may exhaust them, and their analytical side may feel cold to you.

To better interact with this profile: structure your ideas, rely on facts, and respect their need for quiet and reflection. This profile teaches you the value of rigor and analysis.`,
  },
  {
    type: 'FACILITANT',
    oppositeType: 'ORGANISANT',
    fr: `Votre opposé est le profil ORGANISANT (Bleu-Rouge). Là où vous cherchez l'harmonie et le consensus, il cherche l'efficacité et la structure. Là où vous privilégiez les relations, il privilégie les résultats et les processus. Votre souplesse peut lui paraître du laxisme, et sa rigueur peut vous sembler rigide.

Pour mieux interagir avec ce profil : soyez factuel, montrez des résultats concrets, et proposez des solutions structurées. Ce profil vous apprend la valeur de la structure et de l'exigence.`,
    en: `Your opposite is the ORGANIZING profile (Blue-Red). Where you seek harmony and consensus, they seek efficiency and structure. Where you prioritize relationships, they prioritize results and processes. Your flexibility may seem like laxity to them, and their rigor may feel rigid to you.

To better interact with this profile: be factual, show concrete results, and propose structured solutions. This profile teaches you the value of structure and high standards.`,
  },
  {
    type: 'COOPERATIF',
    oppositeType: 'DIRECTIF',
    fr: `Votre opposé est le profil DIRECTIF (Rouge dominant). Là où vous cherchez la stabilité et l'harmonie, il cherche l'action et les résultats immédiats. Là où vous patientez et écoutez, il décide et avance. Son intensité peut vous stresser, et votre rythme peut le frustrer.

Pour mieux interagir avec ce profil : allez plus directement au but, montrez votre détermination, et n'ayez pas peur de prendre position. Ce profil vous apprend la valeur de l'audace et de la rapidité.`,
    en: `Your opposite is the DIRECTIVE profile (Red dominant). Where you seek stability and harmony, they seek action and immediate results. Where you wait and listen, they decide and move forward. Their intensity may stress you, and your pace may frustrate them.

To better interact with this profile: get to the point more directly, show your determination, and don't be afraid to take a stand. This profile teaches you the value of boldness and speed.`,
  },
  {
    type: 'COORDONNANT',
    oppositeType: 'PROMOUVANT',
    fr: `Votre opposé est le profil PROMOUVANT (Rouge-Jaune). Là où vous planifiez et structurez, il improvise et fonce. Là où vous cherchez la stabilité, il cherche le mouvement et le changement. Son énergie débordante peut vous sembler chaotique, et votre besoin de méthode peut lui sembler inhibant.

Pour mieux interagir avec ce profil : acceptez un peu de spontanéité, montrez de l'enthousiasme pour ses idées, et proposez un cadre sans être trop rigide. Ce profil vous apprend la valeur de l'audace et de la flexibilité.`,
    en: `Your opposite is the PROMOTING profile (Red-Yellow). Where you plan and structure, they improvise and charge ahead. Where you seek stability, they seek movement and change. Their overflowing energy may seem chaotic to you, and your need for method may seem inhibiting to them.

To better interact with this profile: accept some spontaneity, show enthusiasm for their ideas, and propose a framework without being too rigid. This profile teaches you the value of boldness and flexibility.`,
  },
  {
    type: 'NORMATIF',
    oppositeType: 'EXPANSIF',
    fr: `Votre opposé est le profil EXPANSIF (Jaune dominant). Là où vous êtes méthodique et réservé, il est spontané et expressif. Là où vous analysez les données, il suit son intuition. Son côté social peut vous sembler superficiel, et votre rigueur peut lui sembler froide.

Pour mieux interagir avec ce profil : montrez plus de chaleur dans vos échanges, soyez ouvert aux idées nouvelles, et acceptez que tout n'a pas besoin d'être parfait. Ce profil vous apprend la valeur de la spontanéité et de la connexion humaine.`,
    en: `Your opposite is the EXPANSIVE profile (Yellow dominant). Where you are methodical and reserved, they are spontaneous and expressive. Where you analyze data, they follow their intuition. Their social side may seem superficial to you, and your rigor may seem cold to them.

To better interact with this profile: show more warmth in exchanges, be open to new ideas, and accept that not everything needs to be perfect. This profile teaches you the value of spontaneity and human connection.`,
  },
  {
    type: 'ORGANISANT',
    oppositeType: 'FACILITANT',
    fr: `Votre opposé est le profil FACILITANT (Jaune-Vert). Là où vous structurez et exigez, il facilite et accompagne. Là où vous cherchez l'efficacité, il cherche le bien-être. Votre exigence peut lui sembler dure, et sa souplesse peut vous paraître permissive.

Pour mieux interagir avec ce profil : montrez de l'intérêt pour les personnes, pas seulement pour les processus, et accueillez les idées des autres avec bienveillance. Ce profil vous apprend la valeur de l'empathie et de la flexibilité.`,
    en: `Your opposite is the FACILITATING profile (Yellow-Green). Where you structure and demand, they facilitate and support. Where you seek efficiency, they seek well-being. Your high standards may seem harsh to them, and their flexibility may seem permissive to you.

To better interact with this profile: show interest in people, not just processes, and welcome others' ideas with kindness. This profile teaches you the value of empathy and flexibility.`,
  },
];

// ─── Wheel Type Labels ───────────────────────────────────────

export const wheelTypeLabels: Record<WheelType, { fr: string; en: string }> = {
  DIRECTIF:    { fr: 'Directif',    en: 'Directive' },
  PROMOUVANT:  { fr: 'Promouvant',  en: 'Promoting' },
  EXPANSIF:    { fr: 'Expansif',    en: 'Expansive' },
  FACILITANT:  { fr: 'Facilitant',  en: 'Facilitating' },
  COOPERATIF:  { fr: 'Coopératif',  en: 'Cooperative' },
  COORDONNANT: { fr: 'Coordonnant', en: 'Coordinating' },
  NORMATIF:    { fr: 'Normatif',    en: 'Normative' },
  ORGANISANT:  { fr: 'Organisant',  en: 'Organizing' },
};

// ─── Convenience: get all report content for a given score set ──

export function getReportContent(scores: Scores, locale: Locale, wheelType: WheelType) {
  return {
    talents: selectItems(talents, scores, locale, 12),
    environment: selectItems(environment, scores, locale, 10),
    communicationDo: selectItems(communicationDo, scores, locale, 12),
    communicationDont: selectItems(communicationDont, scores, locale, 12),
    motivationKeys: selectItems(motivationKeys, scores, locale, 14),
    improvementAreas: selectItems(improvementAreas, scores, locale, 12),
    narrative: narrativeDescriptions.find((n) => n.type === wheelType)?.[locale] ?? '',
    opposite: oppositeDescriptions.find((o) => o.type === wheelType),
    wheelTypeLabel: wheelTypeLabels[wheelType][locale],
  };
}
