import { useState, useMemo, useCallback, useEffect } from 'react';
import { questions, shuffleQuestions } from '../data/questions';
import ProgressBar from './ProgressBar';
import LikertScale from './LikertScale';

interface Props {
  onComplete: (answers: Record<number, number>) => void;
}

export default function Questionnaire({ onComplete }: Props) {
  const shuffled = useMemo(() => shuffleQuestions(questions), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const current = shuffled[currentIndex];
  const totalQuestions = shuffled.length;

  const handleAnswer = useCallback(
    (value: number) => {
      setAnswers((prev) => ({ ...prev, [current.id]: value }));
    },
    [current.id],
  );

  const canGoNext = answers[current.id] !== undefined;
  const isLast = currentIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  const goNext = useCallback(() => {
    if (isLast && allAnswered) {
      onComplete(answers);
    } else if (canGoNext && !isLast) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLast, allAnswered, canGoNext, onComplete, answers]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // 1-5: select answer
      const digit = parseInt(e.key, 10);
      if (digit >= 1 && digit <= 5) {
        e.preventDefault();
        handleAnswer(digit);
        return;
      }

      // Enter: go next
      if (e.key === 'Enter') {
        e.preventDefault();
        goNext();
        return;
      }

      // Backspace or Left arrow: go previous
      if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        return;
      }

      // Right arrow: go next
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer, goNext, goPrev]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="quiz-card w-full">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        <div key={current.id} className="animate-fade-in">
          <p className="font-display font-bold text-xl sm:text-2xl text-[#202124] dark:text-white mb-8 leading-snug tracking-tight">
            {current.text}
          </p>
          <LikertScale value={answers[current.id]} onChange={handleAnswer} />
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={goPrev} disabled={currentIndex === 0} className="btn btn--outline disabled:opacity-30 disabled:cursor-not-allowed">
            Précédent
          </button>

          {isLast ? (
            <button
              onClick={() => onComplete(answers)}
              disabled={!allAnswered}
              className="btn btn--primary btn--lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Voir mes résultats
              <kbd className="ml-1 text-xs opacity-70 font-mono">(Entrée)</kbd>
            </button>
          ) : (
            <button onClick={goNext} disabled={!canGoNext} className="btn btn--primary disabled:opacity-30 disabled:cursor-not-allowed">
              Suivant
              <kbd className="ml-1 text-xs opacity-70 font-mono">(Entrée)</kbd>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
