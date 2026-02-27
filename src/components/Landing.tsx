import { useI18n } from '../i18n/context';
import { profiles } from '../data/profiles';
import type { Dimension } from '../data/questions';

interface Props {
  onStart: () => void;
}

const dims: Dimension[] = ['D', 'I', 'S', 'C'];

export default function Landing({ onStart }: Props) {
  const { t } = useI18n();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="mb-10 relative">
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8">
          {dims.map((key) => {
            const p = profiles[key];
            return (
              <div key={key} className="relative w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                  <path d={p.blobPath} transform="translate(100 100)" fill={p.color} opacity="0.88" />
                </svg>
                <span className="relative font-display font-extrabold text-3xl sm:text-5xl z-10" style={{ color: p.textOnColor, textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                  {key}
                </span>
              </div>
            );
          })}
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[3.5rem] text-[#202124] dark:text-white mb-4 tracking-tight leading-tight">
          {t.landing.title}
        </h1>
        <p className="text-lg sm:text-xl text-[#5F6368] dark:text-[#9AA0A6] max-w-xl mx-auto leading-relaxed">
          {t.landing.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
        {dims.map((key) => {
          const p = profiles[key];
          return (
            <div key={key} className="profile-card p-5 text-center" style={{ borderColor: `${p.color}20` }}>
              <div className="relative w-14 h-14 mx-auto mb-3">
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                  <path d={p.blobPath} transform="translate(100 100)" fill={p.color} opacity="0.2" />
                </svg>
                <span className="relative flex items-center justify-center w-full h-full font-display font-extrabold text-xl z-10" style={{ color: p.colorDark }}>
                  {key}
                </span>
              </div>
              <div className="font-display font-semibold text-[#202124] dark:text-white text-sm">{t.profiles[key].name}</div>
              <div className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1">{t.landing.dims[key]}</div>
            </div>
          );
        })}
      </div>

      <button onClick={onStart} className="btn btn--primary btn--lg hover:scale-105 active:scale-95 transition-transform">
        {t.landing.cta}
      </button>
      <p className="mt-4 text-sm text-[#9AA0A6]">{t.landing.duration}</p>
    </div>
  );
}
