import { profiles } from '../data/profiles';
import type { Dimension } from '../data/questions';

interface Props {
  onStart: () => void;
}

const dimensions: { key: Dimension; desc: string }[] = [
  { key: 'D', desc: 'Action & résultats' },
  { key: 'I', desc: 'Communication & enthousiasme' },
  { key: 'S', desc: 'Fiabilité & harmonie' },
  { key: 'C', desc: 'Rigueur & précision' },
];

export default function Landing({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Hero */}
      <div className="mb-10 relative">
        {/* DISC Logo */}
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 40 40" fill="none" className="w-12 h-12">
            <circle cx="12" cy="12" r="10" fill="#EA4335" opacity="0.85" />
            <circle cx="28" cy="12" r="10" fill="#FBBC04" opacity="0.85" />
            <circle cx="12" cy="28" r="10" fill="#34A853" opacity="0.85" />
            <circle cx="28" cy="28" r="10" fill="#4285F4" opacity="0.85" />
          </svg>
        </div>

        {/* Blob Letters */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8">
          {dimensions.map(({ key }) => {
            const p = profiles[key];
            return (
              <div key={key} className="relative w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                  <path d={p.blobPath} transform="translate(100 100)" fill={p.color} opacity="0.88" />
                </svg>
                <span
                  className="relative font-display font-extrabold text-3xl sm:text-5xl z-10"
                  style={{ color: p.textOnColor, textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                >
                  {key}
                </span>
              </div>
            );
          })}
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[3.5rem] text-[#202124] dark:text-white mb-4 tracking-tight leading-tight">
          Découvre ton profil DISC
        </h1>
        <p className="text-lg sm:text-xl text-[#5F6368] dark:text-[#9AA0A6] max-w-xl mx-auto leading-relaxed">
          Réponds à 24 questions rapides et découvre ton style comportemental dominant. Gratuit, sans inscription, résultats immédiats.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
        {dimensions.map(({ key, desc }) => {
          const p = profiles[key];
          return (
            <div
              key={key}
              className="profile-card p-5 text-center"
              style={{ borderColor: `${p.color}20` }}
            >
              <div className="relative w-14 h-14 mx-auto mb-3">
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                  <path d={p.blobPath} transform="translate(100 100)" fill={p.color} opacity="0.2" />
                </svg>
                <span
                  className="relative flex items-center justify-center w-full h-full font-display font-extrabold text-xl z-10"
                  style={{ color: p.colorDark }}
                >
                  {key}
                </span>
              </div>
              <div className="font-display font-semibold text-[#202124] dark:text-white text-sm">{p.name}</div>
              <div className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1">{desc}</div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button onClick={onStart} className="btn btn--primary btn--lg hover:scale-105 active:scale-95 transition-transform">
        Découvrir mon profil
      </button>
      <p className="mt-4 text-sm text-[#9AA0A6]">~ 3 minutes &middot; 24 questions &middot; 100% gratuit</p>
    </div>
  );
}
