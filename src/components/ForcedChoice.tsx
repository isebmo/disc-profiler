import { useI18n } from '../i18n/context';
import type { ForcedChoiceGroup } from '../data/questions';

interface Props {
  group: ForcedChoiceGroup;
  answer: { most: number; least: number } | undefined;
  onChange: (answer: { most: number; least: number }) => void;
}

export default function ForcedChoice({ group, answer, onChange }: Props) {
  const { t, locale } = useI18n();

  const most = answer?.most ?? -1;
  const least = answer?.least ?? -1;

  const handleMost = (idx: number) => {
    if (idx === least) return; // can't pick same for both
    onChange({ most: idx, least: least === -1 ? (answer?.least ?? -1) : least });
  };

  const handleLeast = (idx: number) => {
    if (idx === most) return; // can't pick same for both
    onChange({ most: most === -1 ? (answer?.most ?? -1) : most, least: idx });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-4 text-center">
        {t.quiz.forcedChoiceInstruction}
      </p>

      {/* Header row */}
      <div className="flex items-center gap-2 mb-2 px-2">
        <div className="flex-1" />
        <span className="w-16 text-center text-xs font-semibold text-[#34A853] uppercase tracking-wider">
          {t.quiz.forcedChoiceMost}
        </span>
        <span className="w-16 text-center text-xs font-semibold text-[#EA4335] uppercase tracking-wider">
          {t.quiz.forcedChoiceLeast}
        </span>
      </div>

      {group.adjectives.map((adj, idx) => {
        const isMost = most === idx;
        const isLeast = least === idx;
        const dimColors: Record<string, string> = {
          D: '#EA4335', I: '#FBBC04', S: '#34A853', C: '#4285F4',
        };

        return (
          <div
            key={idx}
            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
              isMost
                ? 'border-[#34A853] bg-[#E6F4EA] dark:bg-[#34A853]/10'
                : isLeast
                  ? 'border-[#EA4335] bg-[#FCEAE8] dark:bg-[#EA4335]/10'
                  : 'border-[#E8EAED] dark:border-[#5F6368]'
            }`}
          >
            {/* Dimension color dot */}
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: dimColors[adj.dimension] }}
            />

            {/* Adjective text */}
            <span className="flex-1 font-sans font-medium text-[#3C4043] dark:text-[#E8EAED]">
              {adj.text[locale]}
            </span>

            {/* Most radio */}
            <button
              type="button"
              onClick={() => handleMost(idx)}
              disabled={idx === least}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                isMost
                  ? 'border-[#34A853] bg-[#34A853]'
                  : idx === least
                    ? 'border-[#E8EAED] dark:border-[#5F6368] opacity-30 cursor-not-allowed'
                    : 'border-[#DADCE0] dark:border-[#5F6368] hover:border-[#34A853] cursor-pointer'
              }`}
              aria-label={`${adj.text[locale]} - ${t.quiz.forcedChoiceMost}`}
            >
              {isMost && (
                <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3l2.5 5 5.5.8-4 3.9.9 5.3L10 15.3 5.1 18l.9-5.3-4-3.9 5.5-.8z" />
                </svg>
              )}
            </button>

            {/* Least radio */}
            <button
              type="button"
              onClick={() => handleLeast(idx)}
              disabled={idx === most}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                isLeast
                  ? 'border-[#EA4335] bg-[#EA4335]'
                  : idx === most
                    ? 'border-[#E8EAED] dark:border-[#5F6368] opacity-30 cursor-not-allowed'
                    : 'border-[#DADCE0] dark:border-[#5F6368] hover:border-[#EA4335] cursor-pointer'
              }`}
              aria-label={`${adj.text[locale]} - ${t.quiz.forcedChoiceLeast}`}
            >
              {isLeast && (
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
