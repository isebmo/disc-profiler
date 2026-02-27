import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Locale, type Translation } from './translations';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translation;
}

const I18nCtx = createContext<I18nContextValue>(null!);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('disc-lang') as Locale) || 'fr';
    }
    return 'fr';
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('disc-lang', l);
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translations[locale].meta.title;
  }, [locale]);

  return (
    <I18nCtx.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}
