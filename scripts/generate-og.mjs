import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';

// --- OG Image (1200x630) ---

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>

  <!-- 4 DISC circles -->
  <circle cx="500" cy="260" r="80" fill="#EA4335" opacity="0.85"/>
  <circle cx="620" cy="260" r="80" fill="#FBBC04" opacity="0.85"/>
  <circle cx="500" cy="380" r="80" fill="#34A853" opacity="0.85"/>
  <circle cx="620" cy="380" r="80" fill="#4285F4" opacity="0.85"/>

  <!-- D I S C letters -->
  <text x="500" y="272" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="36" fill="#ffffff">D</text>
  <text x="620" y="272" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="36" fill="#ffffff">I</text>
  <text x="500" y="392" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="36" fill="#ffffff">S</text>
  <text x="620" y="392" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="36" fill="#ffffff">C</text>

  <!-- Title -->
  <text x="600" y="510" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="52" fill="#1a1a1a">Test DISC</text>

  <!-- Subtitle -->
  <text x="600" y="565" text-anchor="middle" font-family="sans-serif" font-weight="400" font-size="26" fill="#666666">Découvre ton profil comportemental</text>
</svg>
`;

const ogResvg = new Resvg(ogSvg, {
  fitTo: { mode: 'width', value: 1200 },
});
const ogPng = ogResvg.render().asPng();
writeFileSync('public/og.png', ogPng);
console.log('Generated public/og.png (1200x630)');

// --- Favicon PNG (32x32) ---

const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="32" height="32" fill="none">
  <circle cx="12" cy="12" r="10" fill="#EA4335" opacity="0.85"/>
  <circle cx="28" cy="12" r="10" fill="#FBBC04" opacity="0.85"/>
  <circle cx="12" cy="28" r="10" fill="#34A853" opacity="0.85"/>
  <circle cx="28" cy="28" r="10" fill="#4285F4" opacity="0.85"/>
</svg>
`;

const favResvg = new Resvg(faviconSvg, {
  fitTo: { mode: 'width', value: 32 },
});
const favPng = favResvg.render().asPng();
writeFileSync('public/favicon-32.png', favPng);
console.log('Generated public/favicon-32.png (32x32)');
