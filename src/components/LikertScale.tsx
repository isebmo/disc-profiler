import { useI18n } from '../i18n/context';

interface Props {
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function LikertScale({ value, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3 w-full" role="radiogroup">
      {t.quiz.likert.map((label, index) => {
        const score = index + 1;
        const isSelected = value === score;
        return (
          <button key={score} onClick={() => onChange(score)} className={`quiz-option ${isSelected ? 'quiz-option--selected' : ''}`} role="radio" aria-checked={isSelected}>
            <span className="quiz-option__radio" />
            <span className={`flex-1 ${isSelected ? 'font-semibold' : ''}`}>{label}</span>
            <kbd className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] text-xs font-mono font-medium shrink-0">
              {score}
            </kbd>
          </button>
        );
      })}
    </div>
  );
}
