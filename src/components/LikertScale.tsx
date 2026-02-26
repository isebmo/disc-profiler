interface Props {
  value: number | undefined;
  onChange: (value: number) => void;
}

const labels = [
  "Pas du tout d'accord",
  "Plutôt pas d'accord",
  'Neutre',
  "Plutôt d'accord",
  "Tout à fait d'accord",
];

export default function LikertScale({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full" role="radiogroup" aria-label="Échelle de réponse">
      {labels.map((label, index) => {
        const score = index + 1;
        const isSelected = value === score;
        return (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`quiz-option ${isSelected ? 'quiz-option--selected' : ''}`}
            role="radio"
            aria-checked={isSelected}
          >
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
