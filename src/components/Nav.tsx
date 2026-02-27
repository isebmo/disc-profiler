import { useI18n } from '../i18n/context';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

interface Props {
  currentPage?: 'test' | 'compare' | 'team';
}

export default function Nav({ currentPage = 'test' }: Props) {
  const { t } = useI18n();

  const links = [
    { key: 'test' as const, href: '/', label: t.nav.test },
    { key: 'compare' as const, href: '/compare', label: t.nav.compare },
    { key: 'team' as const, href: '/team', label: t.nav.team },
  ];

  return (
    <nav
      className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/80 dark:bg-[#303134]/80 backdrop-blur rounded-2xl border border-[#F1F3F4] dark:border-[#5F6368] sticky top-4 z-40 mx-4 sm:mx-6 mb-4 max-w-4xl xl:mx-auto"
      style={{ boxShadow: 'var(--shadow-ds-sm)' }}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 font-display font-extrabold text-lg text-[#202124] dark:text-white no-underline">
        <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
          <circle cx="12" cy="12" r="10" fill="#EA4335" opacity="0.85" />
          <circle cx="28" cy="12" r="10" fill="#FBBC04" opacity="0.85" />
          <circle cx="12" cy="28" r="10" fill="#34A853" opacity="0.85" />
          <circle cx="28" cy="28" r="10" fill="#4285F4" opacity="0.85" />
        </svg>
        <span className="hidden sm:inline">DISC</span>
      </a>

      {/* Links */}
      <ul className="flex gap-1 sm:gap-4 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.key}>
            <a
              href={link.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium no-underline transition-colors ${
                currentPage === link.key
                  ? 'bg-disc-c-light dark:bg-[rgba(66,133,244,0.15)] text-disc-c-dark dark:text-disc-c-mid'
                  : 'text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043]'
              }`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Toggles */}
      <div className="flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </nav>
  );
}
