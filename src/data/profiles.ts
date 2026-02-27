import type { Dimension } from './questions';

/** Visual-only profile data — text comes from i18n */
export interface Profile {
  dimension: Dimension;
  color: string;
  colorLight: string;
  colorMid: string;
  colorDark: string;
  colorSurface: string;
  textOnColor: string;
  blobPath: string;
}

export const profiles: Record<Dimension, Profile> = {
  D: {
    dimension: 'D',
    color: '#EA4335',
    colorLight: '#FCEAE8',
    colorMid: '#F5A8A1',
    colorDark: '#C5221F',
    colorSurface: '#FFF1F0',
    textOnColor: '#FFFFFF',
    blobPath: 'M45,-62C57,-52,65,-37,70,-21C75,-5,78,12,72,26C66,41,53,52,38,60C23,68,7,72,-9,72C-26,72,-44,68,-56,57C-67,47,-74,30,-75,13C-77,-4,-73,-21,-64,-34C-55,-47,-40,-55,-26,-63C-12,-71,3,-78,18,-76C32,-74,33,-72,45,-62Z',
  },
  I: {
    dimension: 'I',
    color: '#FBBC04',
    colorLight: '#FEF7E0',
    colorMid: '#FDD663',
    colorDark: '#E37400',
    colorSurface: '#FFFBE6',
    textOnColor: '#202124',
    blobPath: 'M38,-52C52,-45,66,-36,72,-24C77,-12,74,4,67,18C61,32,51,44,39,53C27,62,13,68,-2,71C-17,74,-34,73,-45,64C-57,56,-64,39,-67,22C-71,5,-72,-11,-66,-24C-60,-37,-48,-47,-34,-54C-21,-62,-7,-67,4,-72C14,-76,25,-60,38,-52Z',
  },
  S: {
    dimension: 'S',
    color: '#34A853',
    colorLight: '#E6F4EA',
    colorMid: '#81C995',
    colorDark: '#1E8E3E',
    colorSurface: '#F0FFF4',
    textOnColor: '#FFFFFF',
    blobPath: 'M43,-55C55,-47,64,-33,69,-18C74,-3,75,14,68,28C62,42,48,53,34,60C19,66,3,69,-13,68C-29,67,-44,62,-56,51C-67,40,-72,23,-72,7C-73,-10,-70,-26,-61,-38C-52,-51,-36,-58,-21,-65C-6,-72,8,-78,22,-75C36,-71,30,-64,43,-55Z',
  },
  C: {
    dimension: 'C',
    color: '#4285F4',
    colorLight: '#E8F0FE',
    colorMid: '#8AB4F8',
    colorDark: '#1A73E8',
    colorSurface: '#F0F6FF',
    textOnColor: '#FFFFFF',
    blobPath: 'M44,-58C58,-51,70,-38,75,-24C80,-9,78,9,71,23C65,38,54,50,40,58C27,66,12,70,-3,74C-19,78,-35,83,-47,76C-60,70,-69,51,-73,33C-76,15,-73,-2,-67,-18C-61,-33,-52,-47,-40,-56C-28,-65,-12,-69,2,-71C16,-73,31,-66,44,-58Z',
  },
};
