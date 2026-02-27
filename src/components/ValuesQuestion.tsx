import { useI18n } from '../i18n/context';
import type { SprangerPair } from '../data/questions';

interface Props {
  pair: SprangerPair;
  answer: 0 | 1 | undefined;
  onChange: (value: 0 | 1) => void;
}

export default function ValuesQuestion({ pair, answer, onChange }: Props) {
  const { locale } = useI18n();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[pair.optionA, pair.optionB].map((option, idx) => {
        const isSelected = answer === idx;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(idx as 0 | 1)}
            className={`quiz-option flex-col items-start gap-3 p-5 min-h-[100px] ${
              isSelected ? 'quiz-option--selected' : ''
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`quiz-option__radio ${isSelected ? '' : ''}`}>
                {isSelected && <span />}
              </div>
              <span className="text-left leading-snug">{option.text[locale]}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
