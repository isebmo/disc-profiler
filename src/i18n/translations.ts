export type Locale = 'fr' | 'en';
export type Dimension = 'D' | 'I' | 'S' | 'C';

export interface ProfileText {
  name: string;
  title: string;
  description: string;
  strengths: string[];
  watchouts: string[];
  communication: string[];
}

export interface Translation {
  meta: { title: string; description: string };
  nav: { test: string; compare: string; team: string };
  landing: {
    title: string;
    subtitle: string;
    cta: string;
    duration: string;
    dims: Record<Dimension, string>;
  };
  quiz: {
    question: string;
    prev: string;
    next: string;
    enter: string;
    submit: string;
    likert: string[];
    adaptiveIntro: string;
    adaptiveSubtitle: string;
    forcedChoiceIntro: string;
    forcedChoiceSubtitle: string;
    forcedChoiceMost: string;
    forcedChoiceLeast: string;
    forcedChoiceInstruction: string;
    valuesIntro: string;
    valuesSubtitle: string;
    valuesQuestion: string;
  };
  results: {
    title: string;
    subtitle: string;
    dominant: string;
    secondary: string;
    strengths: string;
    watchouts: string;
    communication: string;
    share: string;
    copied: string;
    restart: string;
    learnMore: string;
    exportPdf: string;
  };
  compare: {
    title: string;
    subtitle: string;
    labelA: string;
    labelB: string;
    placeholder: string;
    button: string;
    empty: string;
    profileA: string;
    profileB: string;
  };
  team: {
    title: string;
    subtitle: string;
    addMember: string;
    name: string;
    url: string;
    add: string;
    remove: string;
    overview: string;
    average: string;
    empty: string;
    share: string;
    copied: string;
    invalidUrl: string;
  };
  report: {
    tabs: {
      overview: string;
      profile: string;
      talents: string;
      environment: string;
      perceptions: string;
      communication: string;
      motivation: string;
      improvement: string;
      indicators: string;
      opposite: string;
      comparison: string;
      values: string;
    };
    overview: {
      yourType: string;
      position: string;
    };
    profile: {
      title: string;
      subtitle: string;
    };
    talents: {
      title: string;
      subtitle: string;
    };
    environment: {
      title: string;
      subtitle: string;
    };
    perceptions: {
      title: string;
      subtitle: string;
      selfTitle: string;
      stressTitle: string;
    };
    communication: {
      doTitle: string;
      dontTitle: string;
      subtitle: string;
    };
    motivation: {
      title: string;
      subtitle: string;
    };
    improvement: {
      title: string;
      subtitle: string;
      cta: string;
    };
    indicators: {
      title: string;
      subtitle: string;
    };
    opposite: {
      title: string;
      subtitle: string;
      interactTitle: string;
    };
    comparison: {
      title: string;
      subtitle: string;
      adapted: string;
      natural: string;
      delta: string;
      deltaSubtitle: string;
      stressWarning: string;
    };
    values: {
      title: string;
      subtitle: string;
      motivations: string;
      bipolarTitle: string;
    };
  };
  loading: string;
  questions: Record<number, string>;
  profiles: Record<Dimension, ProfileText>;
}

export const translations: Record<Locale, Translation> = {
  fr: {
    meta: {
      title: 'Test DISC — Découvre ton profil comportemental',
      description: 'Découvre ton profil DISC en 3 minutes. Test gratuit, sans inscription, avec résultats détaillés et conseils personnalisés.',
    },
    nav: { test: 'Le test', compare: 'Comparer', team: 'Équipe' },
    landing: {
      title: 'Découvre ton profil DISC',
      subtitle: 'Réponds à des questions rapides et découvre ton style comportemental, tes motivations et tes talents. Gratuit, sans inscription, résultats immédiats.',
      cta: 'Découvrir mon profil',
      duration: '~ 8 minutes · 3 parties · 100% gratuit',
      dims: {
        D: 'Action & résultats',
        I: 'Communication & enthousiasme',
        S: 'Fiabilité & harmonie',
        C: 'Rigueur & précision',
      },
    },
    quiz: {
      question: 'Question',
      prev: 'Précédent',
      next: 'Suivant',
      enter: '(Entrée)',
      submit: 'Voir mes résultats',
      likert: ["Pas du tout d'accord", "Plutôt pas d'accord", 'Neutre', "Plutôt d'accord", "Tout à fait d'accord"],
      adaptiveIntro: 'Tes scores sont très proches entre deux profils.',
      adaptiveSubtitle: 'Quelques questions supplémentaires vont nous aider à affiner ton résultat.',
      forcedChoiceIntro: 'Passons à la deuxième partie !',
      forcedChoiceSubtitle: 'Choisis le mot qui te ressemble LE PLUS et celui qui te ressemble LE MOINS dans chaque groupe.',
      forcedChoiceMost: 'Le plus',
      forcedChoiceLeast: 'Le moins',
      forcedChoiceInstruction: 'Sélectionne un mot pour "le plus" et un pour "le moins"',
      valuesIntro: 'Dernière partie : tes motivations !',
      valuesSubtitle: 'Pour chaque paire, choisis la phrase qui te parle le plus. Il n\'y a pas de bonne ou mauvaise réponse.',
      valuesQuestion: 'Qu\'est-ce qui te parle le plus ?',
    },
    results: {
      title: 'Ton profil DISC',
      subtitle: 'Voici tes résultats basés sur tes réponses',
      dominant: 'Profil dominant',
      secondary: 'Profil secondaire',
      strengths: 'Tes forces',
      watchouts: 'Tes points de vigilance',
      communication: 'Comment communiquer avec toi',
      share: 'Partager mes résultats',
      copied: 'Lien copié !',
      restart: 'Refaire le test',
      learnMore: 'En savoir plus sur le modèle DISC',
      exportPdf: 'Exporter en PDF',
    },
    compare: {
      title: 'Comparer deux profils',
      subtitle: 'Colle les URLs de partage de deux profils DISC pour les comparer côte à côte.',
      labelA: 'Profil A',
      labelB: 'Profil B',
      placeholder: 'Colle l\'URL de partage ici…',
      button: 'Comparer',
      empty: 'Entre deux URLs de partage pour voir la comparaison.',
      profileA: 'Profil A',
      profileB: 'Profil B',
    },
    team: {
      title: 'Vue équipe',
      subtitle: 'Rassemble les profils DISC de ton équipe pour une vue d\'ensemble.',
      addMember: 'Ajouter un membre',
      name: 'Prénom',
      url: 'URL de partage',
      add: 'Ajouter',
      remove: 'Retirer',
      overview: 'Vue d\'ensemble',
      average: 'Profil moyen de l\'équipe',
      empty: 'Ajoute des membres pour voir la vue d\'ensemble.',
      share: 'Partager la vue équipe',
      copied: 'Lien copié !',
      invalidUrl: 'URL invalide — utilise une URL de partage DISC.',
    },
    report: {
      tabs: {
        overview: 'Vue d\'ensemble',
        profile: 'Votre profil',
        talents: 'Talents',
        environment: 'Environnement',
        perceptions: 'Perceptions',
        communication: 'Communication',
        motivation: 'Motivation',
        improvement: 'Amélioration',
        indicators: 'Indicateurs',
        opposite: 'Votre opposé',
        comparison: 'Naturel vs Adapté',
        values: 'Valeurs',
      },
      overview: {
        yourType: 'Votre type',
        position: 'Position sur la roue',
      },
      profile: {
        title: 'Votre profil en détail',
        subtitle: 'Description approfondie de votre style comportemental',
      },
      talents: {
        title: 'Vos talents pour l\'entreprise',
        subtitle: 'Les compétences naturelles que vous apportez',
      },
      environment: {
        title: 'Votre environnement idéal',
        subtitle: 'Les conditions dans lesquelles vous donnez le meilleur de vous-même',
      },
      perceptions: {
        title: 'Perceptions',
        subtitle: 'Comment vous vous percevez et comment les autres peuvent vous percevoir',
        selfTitle: 'En temps normal, vous vous percevez comme…',
        stressTitle: 'Sous stress, les autres peuvent vous voir comme…',
      },
      communication: {
        doTitle: 'Mieux communiquer avec vous',
        dontTitle: 'À éviter avec vous',
        subtitle: 'Les clés pour des échanges efficaces avec votre profil',
      },
      motivation: {
        title: 'Vos clés de motivation',
        subtitle: 'Ce qui vous pousse à donner le meilleur de vous-même',
      },
      improvement: {
        title: 'Domaines d\'amélioration',
        subtitle: 'Ces pistes ne sont pas des faiblesses mais des axes de développement. Choisissez 1 à 3 priorités.',
        cta: 'Choisissez 1 à 3 axes prioritaires',
      },
      indicators: {
        title: 'Indicateurs bipolaires',
        subtitle: 'Votre positionnement entre différents pôles comportementaux',
      },
      opposite: {
        title: 'Votre profil opposé',
        subtitle: 'Le type diamétralement opposé au vôtre sur la roue DISC',
        interactTitle: 'Comment mieux interagir avec votre opposé',
      },
      comparison: {
        title: 'Style Naturel vs Style Adapté',
        subtitle: 'Comparaison entre votre comportement naturel (profond) et votre comportement adapté (projeté)',
        adapted: 'Style Adapté',
        natural: 'Style Naturel',
        delta: 'Écarts (Delta)',
        deltaSubtitle: 'Différences entre votre style adapté et naturel par dimension',
        stressWarning: 'Un écart important peut être source de tension si cette adaptation est subie plutôt que choisie.',
      },
      values: {
        title: 'Vos motivations (Valeurs de Spranger)',
        subtitle: 'Ce qui vous anime profondément et guide vos décisions',
        motivations: 'Vos motivations principales',
        bipolarTitle: 'Indicateurs de valeurs',
      },
    },
    loading: 'Analyse de ton profil en cours…',
    questions: {
      1: 'Je préfère prendre les décisions rapidement plutôt que de trop réfléchir',
      2: 'Face à un obstacle, je fonce et je trouve une solution en route',
      3: "Je suis à l'aise pour dire non ou exprimer un désaccord",
      4: "J'aime avoir le contrôle sur les projets que je mène",
      5: 'La compétition me stimule et me pousse à me dépasser',
      6: "Je m'impatiente quand les choses avancent trop lentement",
      7: "J'aime convaincre les autres et partager mes idées avec enthousiasme",
      8: 'Je préfère travailler en équipe plutôt que seul',
      9: "L'ambiance au travail compte autant que les résultats pour moi",
      10: 'Je me fais facilement de nouveaux contacts',
      11: 'J\'ai tendance à voir le côté positif des situations',
      12: "J'aime être au centre de l'attention dans un groupe",
      13: 'Je préfère un environnement prévisible à un quotidien plein de surprises',
      14: 'Je suis quelqu\'un sur qui les autres peuvent compter',
      15: "J'ai besoin de temps pour m'adapter aux changements",
      16: "J'évite les conflits autant que possible",
      17: 'Je préfère terminer une tâche avant d\'en commencer une autre',
      18: 'La loyauté envers mon équipe est une de mes valeurs fortes',
      19: 'Je vérifie plusieurs fois mon travail avant de le considérer fini',
      20: "Je préfère suivre un processus établi plutôt qu'improviser",
      21: 'Les détails comptent — une petite erreur peut tout changer',
      22: "Je prends mes décisions en m'appuyant sur des faits et des données",
      23: 'Je suis mal à l\'aise quand les règles ne sont pas clairement définies',
      24: "Je préfère analyser toutes les options avant de m'engager",
      // Extra adaptive questions
      25: "Quand je suis convaincu d'avoir raison, je persiste même face à l'opposition",
      26: "Je préfère diriger un projet plutôt que d'y contribuer en tant que membre",
      27: 'Je suis souvent celui qui lance les conversations dans un groupe',
      28: "Je me nourris de l'énergie des autres pour avancer",
      29: 'Je me sens plus efficace dans un cadre de travail stable et prévisible',
      30: "Quand un collègue a un problème, je mets mes tâches de côté pour l'aider",
      31: "Je préfère avoir toutes les informations avant de prendre position",
      32: 'Je suis frustré quand le travail des autres ne respecte pas les standards de qualité',
    },
    profiles: {
      D: {
        name: 'Dominance',
        title: 'Le Meneur',
        description: "Tu es orienté action et résultats. Tu prends des décisions rapidement, tu aimes les défis et tu n'hésites pas à dire ce que tu penses. Tu es un leader naturel qui avance avec détermination.",
        strengths: ['Prise de décision rapide et affirmée', 'Orientation résultats et objectifs', 'Leadership naturel en situation de crise', 'Capacité à dire non et fixer des limites', 'Goût du défi et de la compétition'],
        watchouts: ['Peut paraître autoritaire ou brusque', 'Tendance à négliger les détails et les processus', 'Impatience face à la lenteur des autres', 'Difficulté à déléguer et faire confiance', 'Risque de prendre des décisions trop hâtives'],
        communication: ['Va droit au but, sois concis et direct', 'Présente les résultats attendus plutôt que les détails', 'Propose des options plutôt que des ordres', "Respecte son besoin d'autonomie", 'Évite les discussions trop longues sans conclusion'],
      },
      I: {
        name: 'Influence',
        title: 'Le Communicant',
        description: "Tu es enthousiaste, optimiste et sociable. Tu excelles dans la communication et tu sais motiver les autres. Tu aimes travailler en équipe et tu crées facilement des liens.",
        strengths: ['Communication naturelle et persuasive', 'Capacité à motiver et fédérer une équipe', "Créativité et génération d'idées nouvelles", 'Optimisme contagieux et énergie positive', 'Facilité à créer des relations et du réseau'],
        watchouts: ['Peut manquer de rigueur dans le suivi des projets', 'Tendance à trop parler et pas assez écouter', 'Difficulté avec les tâches répétitives ou solitaires', 'Peut éviter les confrontations nécessaires', "Risque de s'engager sur trop de fronts à la fois"],
        communication: ['Sois chaleureux et expressif dans tes échanges', "Laisse-lui du temps pour s'exprimer et rebondir", 'Valorise ses idées et son enthousiasme', 'Propose des moments de collaboration informels', 'Évite les échanges trop formels ou impersonnels'],
      },
      S: {
        name: 'Stabilité',
        title: 'Le Coéquipier',
        description: "Tu es fiable, patient et à l'écoute. Tu privilégies l'harmonie et la stabilité. On peut compter sur toi, et tu es souvent le pilier silencieux d'une équipe.",
        strengths: ["Fiabilité et constance dans l'effort", 'Écoute active et empathie naturelle', 'Patience et persévérance face aux difficultés', "Esprit d'équipe et solidarité", 'Loyauté et engagement sur le long terme'],
        watchouts: ['Résistance au changement et aux nouvelles méthodes', 'Difficulté à dire non et à poser des limites', 'Tendance à garder ses frustrations pour soi', 'Évitement des conflits même quand ils sont nécessaires', "Peut se sentir submergé sans oser demander de l'aide"],
        communication: ['Sois patient et rassurant dans tes échanges', "Préviens-le des changements suffisamment à l'avance", 'Demande son avis sincèrement et écoute sa réponse', 'Montre de la reconnaissance pour sa fiabilité', 'Évite de le mettre sous pression ou de le brusquer'],
      },
      C: {
        name: 'Conformité',
        title: "L'Analyste",
        description: "Tu es rigoureux, méthodique et précis. Tu t'appuies sur les faits et les données pour prendre tes décisions. Tu recherches la qualité et l'exactitude en toutes choses.",
        strengths: ['Rigueur et attention aux détails', "Capacité d'analyse approfondie", 'Organisation et méthode de travail structurée', 'Pensée critique et objectivité', 'Respect des processus et de la qualité'],
        watchouts: ['Perfectionnisme pouvant ralentir la progression', "Paralysie d'analyse face aux décisions complexes", 'Difficulté à improviser ou sortir du cadre', 'Peut paraître froid ou distant en équipe', "Tendance à sur-analyser au détriment de l'action"],
        communication: ['Sois précis et factuel dans tes échanges', 'Appuie-toi sur des données et des preuves concrètes', 'Donne-lui du temps pour analyser et réfléchir', 'Respecte son besoin de structure et de clarté', "Évite l'approximation et les décisions impulsives"],
      },
    },
  },

  en: {
    meta: {
      title: 'DISC Test — Discover your behavioral profile',
      description: 'Discover your DISC profile in 3 minutes. Free, no sign-up, with detailed results and personalized advice.',
    },
    nav: { test: 'Take the test', compare: 'Compare', team: 'Team' },
    landing: {
      title: 'Discover your DISC profile',
      subtitle: 'Answer quick questions and discover your behavioral style, motivations, and talents. Free, no sign-up, instant results.',
      cta: 'Discover my profile',
      duration: '~ 8 minutes · 3 parts · 100% free',
      dims: {
        D: 'Action & results',
        I: 'Communication & enthusiasm',
        S: 'Reliability & harmony',
        C: 'Rigor & precision',
      },
    },
    quiz: {
      question: 'Question',
      prev: 'Previous',
      next: 'Next',
      enter: '(Enter)',
      submit: 'See my results',
      likert: ['Strongly disagree', 'Somewhat disagree', 'Neutral', 'Somewhat agree', 'Strongly agree'],
      adaptiveIntro: 'Your scores are very close between two profiles.',
      adaptiveSubtitle: 'A few extra questions will help us refine your result.',
      forcedChoiceIntro: "Let's move to part two!",
      forcedChoiceSubtitle: 'Pick the word that is MOST like you and the one that is LEAST like you in each group.',
      forcedChoiceMost: 'Most',
      forcedChoiceLeast: 'Least',
      forcedChoiceInstruction: 'Select one word for "most" and one for "least"',
      valuesIntro: 'Final part: your motivations!',
      valuesSubtitle: "For each pair, choose the statement that resonates most with you. There are no right or wrong answers.",
      valuesQuestion: 'Which resonates more with you?',
    },
    results: {
      title: 'Your DISC profile',
      subtitle: 'Here are your results based on your answers',
      dominant: 'Dominant profile',
      secondary: 'Secondary profile',
      strengths: 'Your strengths',
      watchouts: 'Watch out for',
      communication: 'How to communicate with you',
      share: 'Share my results',
      copied: 'Link copied!',
      restart: 'Retake the test',
      learnMore: 'Learn more about the DISC model',
      exportPdf: 'Export as PDF',
    },
    compare: {
      title: 'Compare two profiles',
      subtitle: 'Paste the share URLs of two DISC profiles to compare them side by side.',
      labelA: 'Profile A',
      labelB: 'Profile B',
      placeholder: 'Paste the share URL here…',
      button: 'Compare',
      empty: 'Enter two share URLs to see the comparison.',
      profileA: 'Profile A',
      profileB: 'Profile B',
    },
    team: {
      title: 'Team view',
      subtitle: 'Gather your team\'s DISC profiles for an overview.',
      addMember: 'Add a member',
      name: 'First name',
      url: 'Share URL',
      add: 'Add',
      remove: 'Remove',
      overview: 'Overview',
      average: 'Team average profile',
      empty: 'Add members to see the team overview.',
      share: 'Share team view',
      copied: 'Link copied!',
      invalidUrl: 'Invalid URL — use a DISC share URL.',
    },
    report: {
      tabs: {
        overview: 'Overview',
        profile: 'Your profile',
        talents: 'Talents',
        environment: 'Environment',
        perceptions: 'Perceptions',
        communication: 'Communication',
        motivation: 'Motivation',
        improvement: 'Improvement',
        indicators: 'Indicators',
        opposite: 'Your opposite',
        comparison: 'Natural vs Adapted',
        values: 'Values',
      },
      overview: {
        yourType: 'Your type',
        position: 'Wheel position',
      },
      profile: {
        title: 'Your profile in detail',
        subtitle: 'In-depth description of your behavioral style',
      },
      talents: {
        title: 'Your talents for the workplace',
        subtitle: 'The natural skills you bring to the table',
      },
      environment: {
        title: 'Your ideal environment',
        subtitle: 'The conditions where you perform at your best',
      },
      perceptions: {
        title: 'Perceptions',
        subtitle: 'How you see yourself and how others may see you',
        selfTitle: 'Normally, you see yourself as…',
        stressTitle: 'Under stress, others may see you as…',
      },
      communication: {
        doTitle: 'Better communicate with you',
        dontTitle: 'What to avoid with you',
        subtitle: 'Keys for effective exchanges with your profile',
      },
      motivation: {
        title: 'Your motivation keys',
        subtitle: 'What drives you to give your best',
      },
      improvement: {
        title: 'Areas for improvement',
        subtitle: 'These are not weaknesses but development areas. Choose 1 to 3 priorities.',
        cta: 'Choose 1 to 3 priority areas',
      },
      indicators: {
        title: 'Bipolar indicators',
        subtitle: 'Your positioning between different behavioral poles',
      },
      opposite: {
        title: 'Your opposite profile',
        subtitle: 'The type diametrically opposite to yours on the DISC wheel',
        interactTitle: 'How to better interact with your opposite',
      },
      comparison: {
        title: 'Natural Style vs Adapted Style',
        subtitle: 'Comparison between your natural behavior (deep) and your adapted behavior (projected)',
        adapted: 'Adapted Style',
        natural: 'Natural Style',
        delta: 'Gaps (Delta)',
        deltaSubtitle: 'Differences between your adapted and natural style per dimension',
        stressWarning: 'A significant gap can be a source of tension if this adaptation is involuntary rather than chosen.',
      },
      values: {
        title: 'Your Motivations (Spranger Values)',
        subtitle: 'What deeply drives you and guides your decisions',
        motivations: 'Your main motivations',
        bipolarTitle: 'Value indicators',
      },
    },
    loading: 'Analyzing your profile…',
    questions: {
      1: 'I prefer to make decisions quickly rather than overthink',
      2: 'When facing an obstacle, I charge ahead and find a solution along the way',
      3: "I'm comfortable saying no or expressing disagreement",
      4: 'I like having control over the projects I lead',
      5: 'Competition motivates me and pushes me to excel',
      6: 'I get impatient when things move too slowly',
      7: 'I enjoy persuading others and sharing my ideas enthusiastically',
      8: 'I prefer working in a team rather than alone',
      9: 'Workplace atmosphere matters as much as results to me',
      10: 'I easily make new contacts',
      11: 'I tend to see the positive side of situations',
      12: 'I like being the center of attention in a group',
      13: 'I prefer a predictable environment to a daily life full of surprises',
      14: "I'm someone others can rely on",
      15: 'I need time to adapt to changes',
      16: 'I avoid conflicts as much as possible',
      17: 'I prefer to finish one task before starting another',
      18: 'Loyalty to my team is one of my core values',
      19: 'I check my work several times before considering it done',
      20: 'I prefer following an established process rather than improvising',
      21: 'Details matter — a small mistake can change everything',
      22: 'I make my decisions based on facts and data',
      23: "I'm uncomfortable when rules aren't clearly defined",
      24: 'I prefer to analyze all options before committing',
      25: "When I'm convinced I'm right, I persist even in the face of opposition",
      26: "I'd rather lead a project than contribute as a team member",
      27: "I'm often the one who starts conversations in a group",
      28: "I feed off other people's energy to move forward",
      29: 'I feel most effective in a stable and predictable work setting',
      30: "When a colleague has a problem, I set my tasks aside to help",
      31: 'I prefer having all the information before taking a position',
      32: "I get frustrated when others' work doesn't meet quality standards",
    },
    profiles: {
      D: {
        name: 'Dominance',
        title: 'The Leader',
        description: "You are action and results-oriented. You make decisions quickly, enjoy challenges, and don't hesitate to speak your mind. You're a natural leader who moves forward with determination.",
        strengths: ['Quick and assertive decision-making', 'Results and goal orientation', 'Natural leadership in crisis situations', 'Ability to say no and set boundaries', 'Appetite for challenge and competition'],
        watchouts: ['Can appear authoritarian or blunt', 'Tendency to overlook details and processes', "Impatience with others' pace", 'Difficulty delegating and trusting others', 'Risk of making hasty decisions'],
        communication: ['Get straight to the point, be concise', 'Present expected results rather than details', 'Suggest options rather than give orders', 'Respect their need for autonomy', 'Avoid lengthy discussions without conclusions'],
      },
      I: {
        name: 'Influence',
        title: 'The Communicator',
        description: 'You are enthusiastic, optimistic, and sociable. You excel at communication and know how to motivate others. You love teamwork and easily build connections.',
        strengths: ['Natural and persuasive communication', 'Ability to motivate and unite a team', 'Creativity and new idea generation', 'Contagious optimism and positive energy', 'Ease in building relationships and networks'],
        watchouts: ['May lack rigor in project follow-up', 'Tendency to talk too much and not listen enough', 'Difficulty with repetitive or solitary tasks', 'May avoid necessary confrontations', 'Risk of committing to too many things at once'],
        communication: ['Be warm and expressive in exchanges', 'Give them time to express themselves', 'Value their ideas and enthusiasm', 'Suggest informal collaboration moments', 'Avoid overly formal or impersonal exchanges'],
      },
      S: {
        name: 'Stability',
        title: 'The Teammate',
        description: "You are reliable, patient, and a good listener. You prioritize harmony and stability. People can count on you, and you're often the quiet backbone of a team.",
        strengths: ['Reliability and consistency in effort', 'Active listening and natural empathy', 'Patience and perseverance through difficulties', 'Team spirit and solidarity', 'Loyalty and long-term commitment'],
        watchouts: ['Resistance to change and new methods', 'Difficulty saying no and setting boundaries', 'Tendency to keep frustrations to yourself', 'Conflict avoidance even when necessary', 'May feel overwhelmed without daring to ask for help'],
        communication: ['Be patient and reassuring in exchanges', 'Warn them about changes well in advance', 'Ask for their opinion sincerely and listen', 'Show appreciation for their reliability', 'Avoid putting them under pressure'],
      },
      C: {
        name: 'Conformity',
        title: 'The Analyst',
        description: 'You are thorough, methodical, and precise. You rely on facts and data to make decisions. You seek quality and accuracy in everything.',
        strengths: ['Rigor and attention to detail', 'Deep analytical capacity', 'Structured organization and work methods', 'Critical thinking and objectivity', 'Respect for processes and quality'],
        watchouts: ['Perfectionism that can slow progress', 'Analysis paralysis with complex decisions', 'Difficulty improvising or thinking outside the box', 'Can appear cold or distant in a team', 'Tendency to over-analyze at the expense of action'],
        communication: ['Be precise and factual in exchanges', 'Support with data and concrete evidence', 'Give them time to analyze and reflect', 'Respect their need for structure and clarity', 'Avoid approximation and impulsive decisions'],
      },
    },
  },
};
