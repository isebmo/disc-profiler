import { useI18n } from '../i18n/context';

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-[#303134]/80 backdrop-blur border border-[#DADCE0] dark:border-[#5F6368] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] transition-colors font-display font-bold text-xs text-[#5F6368] dark:text-[#9AA0A6]"
      style={{ boxShadow: 'var(--shadow-ds-sm)' }}
      aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
