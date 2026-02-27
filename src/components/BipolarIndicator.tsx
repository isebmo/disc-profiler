import { useI18n } from '../i18n/context';
import type { BipolarIndicator as BipolarIndicatorType } from '../lib/scoring';

interface Props {
  indicators: BipolarIndicatorType[];
}

export default function BipolarIndicator({ indicators }: Props) {
  const { locale } = useI18n();

  return (
    <div className="flex flex-col gap-6">
      {indicators.map((ind) => {
        // Convert -100..+100 to 0..100 for positioning
        const position = (ind.value + 100) / 2;

        return (
          <div key={ind.id} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-[#3C4043] dark:text-[#BDC1C6]">
                {ind.leftLabel[locale]}
              </span>
              <span className="font-medium text-[#3C4043] dark:text-[#BDC1C6]">
                {ind.rightLabel[locale]}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-gradient-to-r from-[#EA4335]/20 via-[#E8EAED] to-[#4285F4]/20 dark:from-[#EA4335]/15 dark:via-[#3C4043] dark:to-[#4285F4]/15">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white dark:border-[#303134] shadow-md transition-all duration-500"
                style={{
                  left: `calc(${position}% - 10px)`,
                  background: position < 40
                    ? '#EA4335'
                    : position > 60
                      ? '#4285F4'
                      : '#5F6368',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
