import type { Dimension } from './questions';

export interface Profile {
  dimension: Dimension;
  name: string;
  title: string;
  color: string;
  colorLight: string;
  colorMid: string;
  colorDark: string;
  colorSurface: string;
  textOnColor: string;
  blobPath: string;
  description: string;
  strengths: string[];
  watchouts: string[];
  communication: string[];
}

export const profiles: Record<Dimension, Profile> = {
  D: {
    dimension: 'D',
    name: 'Dominance',
    title: 'Le Meneur',
    color: '#EA4335',
    colorLight: '#FCEAE8',
    colorMid: '#F5A8A1',
    colorDark: '#C5221F',
    colorSurface: '#FFF1F0',
    textOnColor: '#FFFFFF',
    blobPath:
      'M45,-62C57,-52,65,-37,70,-21C75,-5,78,12,72,26C66,41,53,52,38,60C23,68,7,72,-9,72C-26,72,-44,68,-56,57C-67,47,-74,30,-75,13C-77,-4,-73,-21,-64,-34C-55,-47,-40,-55,-26,-63C-12,-71,3,-78,18,-76C32,-74,33,-72,45,-62Z',
    description:
      "Tu es orient\u00e9 action et r\u00e9sultats. Tu prends des d\u00e9cisions rapidement, tu aimes les d\u00e9fis et tu n'h\u00e9sites pas \u00e0 dire ce que tu penses. Tu es un leader naturel qui avance avec d\u00e9termination.",
    strengths: [
      'Prise de d\u00e9cision rapide et affirm\u00e9e',
      'Orientation r\u00e9sultats et objectifs',
      'Leadership naturel en situation de crise',
      'Capacit\u00e9 \u00e0 dire non et fixer des limites',
      'Go\u00fbt du d\u00e9fi et de la comp\u00e9tition',
    ],
    watchouts: [
      'Peut para\u00eetre autoritaire ou brusque',
      'Tendance \u00e0 n\u00e9gliger les d\u00e9tails et les processus',
      'Impatience face \u00e0 la lenteur des autres',
      'Difficult\u00e9 \u00e0 d\u00e9l\u00e9guer et faire confiance',
      'Risque de prendre des d\u00e9cisions trop h\u00e2tives',
    ],
    communication: [
      'Va droit au but, sois concis et direct',
      'Pr\u00e9sente les r\u00e9sultats attendus plut\u00f4t que les d\u00e9tails',
      'Propose des options plut\u00f4t que des ordres',
      "Respecte son besoin d'autonomie",
      '\u00c9vite les discussions trop longues sans conclusion',
    ],
  },
  I: {
    dimension: 'I',
    name: 'Influence',
    title: 'Le Communicant',
    color: '#FBBC04',
    colorLight: '#FEF7E0',
    colorMid: '#FDD663',
    colorDark: '#E37400',
    colorSurface: '#FFFBE6',
    textOnColor: '#202124',
    blobPath:
      'M38,-52C52,-45,66,-36,72,-24C77,-12,74,4,67,18C61,32,51,44,39,53C27,62,13,68,-2,71C-17,74,-34,73,-45,64C-57,56,-64,39,-67,22C-71,5,-72,-11,-66,-24C-60,-37,-48,-47,-34,-54C-21,-62,-7,-67,4,-72C14,-76,25,-60,38,-52Z',
    description:
      "Tu es enthousiaste, optimiste et sociable. Tu excelles dans la communication et tu sais motiver les autres. Tu aimes travailler en \u00e9quipe et tu cr\u00e9es facilement des liens.",
    strengths: [
      'Communication naturelle et persuasive',
      "Capacit\u00e9 \u00e0 motiver et f\u00e9d\u00e9rer une \u00e9quipe",
      "Cr\u00e9ativit\u00e9 et g\u00e9n\u00e9ration d'id\u00e9es nouvelles",
      'Optimisme contagieux et \u00e9nergie positive',
      'Facilit\u00e9 \u00e0 cr\u00e9er des relations et du r\u00e9seau',
    ],
    watchouts: [
      'Peut manquer de rigueur dans le suivi des projets',
      'Tendance \u00e0 trop parler et pas assez \u00e9couter',
      'Difficult\u00e9 avec les t\u00e2ches r\u00e9p\u00e9titives ou solitaires',
      'Peut \u00e9viter les confrontations n\u00e9cessaires',
      "Risque de s'engager sur trop de fronts \u00e0 la fois",
    ],
    communication: [
      'Sois chaleureux et expressif dans tes \u00e9changes',
      "Laisse-lui du temps pour s'exprimer et rebondir",
      'Valorise ses id\u00e9es et son enthousiasme',
      'Propose des moments de collaboration informels',
      '\u00c9vite les \u00e9changes trop formels ou impersonnels',
    ],
  },
  S: {
    dimension: 'S',
    name: 'Stabilit\u00e9',
    title: 'Le Co\u00e9quipier',
    color: '#34A853',
    colorLight: '#E6F4EA',
    colorMid: '#81C995',
    colorDark: '#1E8E3E',
    colorSurface: '#F0FFF4',
    textOnColor: '#FFFFFF',
    blobPath:
      'M43,-55C55,-47,64,-33,69,-18C74,-3,75,14,68,28C62,42,48,53,34,60C19,66,3,69,-13,68C-29,67,-44,62,-56,51C-67,40,-72,23,-72,7C-73,-10,-70,-26,-61,-38C-52,-51,-36,-58,-21,-65C-6,-72,8,-78,22,-75C36,-71,30,-64,43,-55Z',
    description:
      "Tu es fiable, patient et \u00e0 l'\u00e9coute. Tu privil\u00e9gies l'harmonie et la stabilit\u00e9. On peut compter sur toi, et tu es souvent le pilier silencieux d'une \u00e9quipe.",
    strengths: [
      "Fiabilit\u00e9 et constance dans l'effort",
      '\u00c9coute active et empathie naturelle',
      'Patience et pers\u00e9v\u00e9rance face aux difficult\u00e9s',
      "Esprit d'\u00e9quipe et solidarit\u00e9",
      'Loyaut\u00e9 et engagement sur le long terme',
    ],
    watchouts: [
      'R\u00e9sistance au changement et aux nouvelles m\u00e9thodes',
      'Difficult\u00e9 \u00e0 dire non et \u00e0 poser des limites',
      'Tendance \u00e0 garder ses frustrations pour soi',
      '\u00c9vitement des conflits m\u00eame quand ils sont n\u00e9cessaires',
      "Peut se sentir submerg\u00e9 sans oser demander de l'aide",
    ],
    communication: [
      'Sois patient et rassurant dans tes \u00e9changes',
      "Pr\u00e9viens-le des changements suffisamment \u00e0 l'avance",
      'Demande son avis sinc\u00e8rement et \u00e9coute sa r\u00e9ponse',
      'Montre de la reconnaissance pour sa fiabilit\u00e9',
      '\u00c9vite de le mettre sous pression ou de le brusquer',
    ],
  },
  C: {
    dimension: 'C',
    name: 'Conformit\u00e9',
    title: "L'Analyste",
    color: '#4285F4',
    colorLight: '#E8F0FE',
    colorMid: '#8AB4F8',
    colorDark: '#1A73E8',
    colorSurface: '#F0F6FF',
    textOnColor: '#FFFFFF',
    blobPath:
      'M44,-58C58,-51,70,-38,75,-24C80,-9,78,9,71,23C65,38,54,50,40,58C27,66,12,70,-3,74C-19,78,-35,83,-47,76C-60,70,-69,51,-73,33C-76,15,-73,-2,-67,-18C-61,-33,-52,-47,-40,-56C-28,-65,-12,-69,2,-71C16,-73,31,-66,44,-58Z',
    description:
      "Tu es rigoureux, m\u00e9thodique et pr\u00e9cis. Tu t'appuies sur les faits et les donn\u00e9es pour prendre tes d\u00e9cisions. Tu recherches la qualit\u00e9 et l'exactitude en toutes choses.",
    strengths: [
      'Rigueur et attention aux d\u00e9tails',
      "Capacit\u00e9 d'analyse approfondie",
      'Organisation et m\u00e9thode de travail structur\u00e9e',
      'Pens\u00e9e critique et objectivit\u00e9',
      'Respect des processus et de la qualit\u00e9',
    ],
    watchouts: [
      'Perfectionnisme pouvant ralentir la progression',
      "Paralysie d'analyse face aux d\u00e9cisions complexes",
      'Difficult\u00e9 \u00e0 improviser ou sortir du cadre',
      'Peut para\u00eetre froid ou distant en \u00e9quipe',
      "Tendance \u00e0 sur-analyser au d\u00e9triment de l'action",
    ],
    communication: [
      'Sois pr\u00e9cis et factuel dans tes \u00e9changes',
      'Appuie-toi sur des donn\u00e9es et des preuves concr\u00e8tes',
      'Donne-lui du temps pour analyser et r\u00e9fl\u00e9chir',
      'Respecte son besoin de structure et de clart\u00e9',
      "\u00c9vite l'approximation et les d\u00e9cisions impulsives",
    ],
  },
};
