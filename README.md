# Test DISC

Test de personnalite DISC en ligne, gratuit et sans inscription.
Decouvre ton profil comportemental en quelques minutes avec des resultats detailles et des conseils personnalises.

**https://disc.mouret.pro**

## Fonctionnalites

- **Quiz multi-phases** : questions Likert, choix forces (naturel/adapte), valeurs Spranger
- **Phase adaptative** : questions supplementaires si les deux dimensions dominantes sont proches
- **Resultats detailles** : profil DISC, position sur la roue (8 types), talents, communication, stress, indicateurs bipolaires, valeurs/motivations
- **Comparaison** : superposition de deux profils en radar chart (`/compare`)
- **Vue equipe** : visualisation des profils de toute une equipe (`/team`)
- **Export PDF** : rapport complet telechargeble
- **Partage par URL** : resultats encodes dans l'URL pour partage direct
- **Bilingue** : francais / anglais
- **Dark mode** : theme clair/sombre (auto-detecte ou manuel)

## Stack technique

| Couche | Techno |
|---|---|
| Framework | [Astro](https://astro.build) 5 |
| UI | [React](https://react.dev) 19 |
| Styles | [Tailwind CSS](https://tailwindcss.com) 4 |
| Charts | [Chart.js](https://www.chartjs.org) + react-chartjs-2 |
| Export | jsPDF + html2canvas |
| Fonts | Google Fonts (DM Sans, Outfit) |
| Deploiement | GitHub Pages |
| Analytics | Umami |

## Installation

```bash
# Cloner le repo
git clone git@github.com:isebmo/disc-profiler.git
cd disc-profiler

# Installer les dependances
npm install

# Lancer le serveur de dev
npm run dev
```

Le site est accessible sur `http://localhost:4321`.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de dev local (port 4321) |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Preview du build en local |
| `npm run og` | Genere `public/og.png` (1200x630) et `public/favicon-32.png` (32x32) |
| `npm run astro` | CLI Astro (`astro add`, `astro check`, etc.) |

## Structure du projet

```
src/
  pages/
    index.astro          # Page principale (quiz)
    compare.astro        # Comparaison de deux profils
    team.astro           # Vue equipe
  components/
    App.tsx              # Orchestrateur principal (landing -> quiz -> resultats)
    Landing.tsx          # Ecran d'accueil
    Questionnaire.tsx    # Quiz multi-phases
    Results.tsx          # Affichage des resultats (12 onglets)
    RadarChart.tsx       # Radar chart DISC
    WheelPosition.tsx    # Position sur la roue des 8 types
    ExportPDF.tsx        # Export PDF du rapport
    ShareButton.tsx      # Partage par URL
    Compare.tsx          # Comparaison de profils
    Team.tsx             # Vue equipe
    ...
  data/
    questions.ts         # Questions, choix forces, paires Spranger
    profiles.ts          # Profils visuels (couleurs, blobs SVG)
    report-content.ts    # Contenu des rapports par type
  lib/
    scoring.ts           # Algorithmes de scoring et calcul du type
    sharing.ts           # Encodage/decodage URL des resultats
  i18n/
    context.tsx          # Provider React FR/EN
    translations.ts      # Traductions
  layouts/
    Layout.astro         # Layout HTML, meta tags OG/Twitter, theme
  styles/
    global.css           # Tailwind, tokens de theme, animations
public/
  og.png                 # Image Open Graph (1200x630)
  favicon.svg            # Favicon SVG
  favicon-32.png         # Favicon PNG 32x32
  CNAME                  # Domaine custom
scripts/
  generate-og.mjs        # Generation des images OG et favicon PNG
```

## Deploiement

Le deploiement est automatique via GitHub Actions sur chaque push sur `main` :

1. `npm ci` + `npm run build`
2. Upload de `dist/` vers GitHub Pages
3. Domaine custom : `disc.mouret.pro` (via `public/CNAME`)

Le workflow est dans `.github/workflows/deploy.yml`.

## Meta tags & partage social

Le site inclut des meta tags complets pour un rendu propre sur toutes les plateformes de partage (LinkedIn, Slack, Discord, Twitter/X, iMessage, WhatsApp) :

- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:locale`)
- Twitter Card (`summary_large_image`)
- URL canonique (`<link rel="canonical">`)
- `og:url` et `canonical` dynamiques par page via `Astro.url`

Pour regenerer l'image OG : `npm run og`

## Licence

Projet prive.
