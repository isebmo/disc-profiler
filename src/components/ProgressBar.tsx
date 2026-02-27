import { useI18n } from '../i18n/context';

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const { t } = useI18n();

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="font-display font-semibold text-sm text-[#5F6368] dark:text-[#9AA0A6]">
          {t.quiz.question} {current} / {total}
        </span>
        <span className="font-display font-semibold text-sm text-[#5F6368] dark:text-[#9AA0A6]">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div className="pip-progress">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`pip ${i < current - 1 ? 'pip--done' : i === current - 1 ? 'pip--active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
