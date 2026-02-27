import type { Perceptions } from '../lib/scoring';
import { useI18n } from '../i18n/context';

interface Props {
  perceptions: Perceptions;
}

export default function PerceptionCard({ perceptions }: Props) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Self-positive */}
      <div className="profile-card p-5" style={{ boxShadow: 'var(--shadow-ds-sm)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#34A853] text-lg">&#x25B2;</span>
          <h5 className="font-display font-bold text-sm text-[#202124] dark:text-white">
            {t.report.perceptions.selfTitle}
          </h5>
        </div>
        <div className="flex flex-wrap gap-2">
          {perceptions.selfPositive.map((adj, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: '#E6F4EA', color: '#1E8E3E' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
              {adj}
            </span>
          ))}
        </div>
      </div>

      {/* Others under stress */}
      <div className="profile-card p-5" style={{ boxShadow: 'var(--shadow-ds-sm)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#EA4335] text-lg">&#x25BC;</span>
          <h5 className="font-display font-bold text-sm text-[#202124] dark:text-white">
            {t.report.perceptions.stressTitle}
          </h5>
        </div>
        <div className="flex flex-wrap gap-2">
          {perceptions.othersStress.map((adj, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: '#FCEAE8', color: '#C5221F' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              {adj}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
