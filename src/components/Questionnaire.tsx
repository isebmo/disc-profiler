import { useState, useMemo, useCallback, useEffect } from 'react';
import { useI18n } from '../i18n/context';
import { questions, extraQuestions, shuffleQuestions, type Question } from '../data/questions';
import { calculateScores, needsAdaptive } from '../lib/scoring';
import ProgressBar from './ProgressBar';
import LikertScale from './LikertScale';

interface Props {
  onComplete: (answers: Record<number, number>, usedExtra: boolean) => void;
}

type Phase = 'main' | 'adaptive-intro' | 'adaptive';

export default function Questionnaire({ onComplete }: Props) {
  const { t } = useI18n();
  const shuffledMain = useMemo(() => shuffleQuestions(questions), []);
  const [phase, setPhase] = useState<Phase>('main');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [adaptiveQs, setAdaptiveQs] = useState<Question[]>([]);

  const currentQuestions = phase === 'adaptive' ? adaptiveQs : shuffledMain;
  const current = currentQuestions[currentIndex];
  const totalQuestions = currentQuestions.length;

  const handleAnswer = useCallback(
    (value: number) => {
      setAnswers((prev) => ({ ...prev, [current.id]: value }));
    },
    [current.id],
  );

  const canGoNext = answers[current.id] !== undefined;
  const isLast = currentIndex === totalQuestions - 1;
  const allCurrentAnswered = currentQuestions.every((q) => answers[q.id] !== undefined);

  const handleSubmitMain = useCallback(() => {
    // Calculate preliminary scores to check if adaptive is needed
    const prelim = calculateScores(answers, questions);
    const close = needsAdaptive(prelim.normalizedScores);

    if (close) {
      const [dim1, dim2] = close;
      const extras = extraQuestions.filter((q) => q.dimension === dim1 || q.dimension === dim2);
      setAdaptiveQs(shuffleQuestions(extras));
      setPhase('adaptive-intro');
    } else {
      onComplete(answers, false);
    }
  }, [answers, onComplete]);

  const handleSubmitAdaptive = useCallback(() => {
    onComplete(answers, true);
  }, [answers, onComplete]);

  const goNext = useCallback(() => {
    if (isLast && allCurrentAnswered) {
      if (phase === 'main') handleSubmitMain();
      else handleSubmitAdaptive();
    } else if (canGoNext && !isLast) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLast, allCurrentAnswered, canGoNext, phase, handleSubmitMain, handleSubmitAdaptive]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (phase === 'adaptive-intro') {
        if (e.key === 'Enter') { e.preventDefault(); startAdaptive(); }
        return;
      }
      const digit = parseInt(e.key, 10);
      if (digit >= 1 && digit <= 5) { e.preventDefault(); handleAnswer(digit); return; }
      if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); goNext(); return; }
      if (e.key === 'Backspace' || e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer, goNext, goPrev, phase]);

  const startAdaptive = () => {
    setPhase('adaptive');
    setCurrentIndex(0);
  };

  // Adaptive intro screen
  if (phase === 'adaptive-intro') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
        <div className="quiz-card w-full text-center">
          <div className="flex gap-3 justify-center mb-6">
            {['#EA4335', '#FBBC04', '#34A853', '#4285F4'].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#202124] dark:text-white mb-3">
            {t.quiz.adaptiveIntro}
          </h2>
          <p className="text-[#5F6368] dark:text-[#9AA0A6] mb-8">{t.quiz.adaptiveSubtitle}</p>
          <button onClick={startAdaptive} className="btn btn--primary btn--lg">
            {t.quiz.next} &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="quiz-card w-full">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        <div key={current.id} className="animate-fade-in">
          <p className="font-display font-bold text-xl sm:text-2xl text-[#202124] dark:text-white mb-8 leading-snug tracking-tight">
            {t.questions[current.id]}
          </p>
          <LikertScale value={answers[current.id]} onChange={handleAnswer} />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={goPrev} disabled={currentIndex === 0} className="btn btn--outline disabled:opacity-30 disabled:cursor-not-allowed">
            {t.quiz.prev}
          </button>

          {isLast ? (
            <button
              onClick={() => (phase === 'main' ? handleSubmitMain() : handleSubmitAdaptive())}
              disabled={!allCurrentAnswered}
              className="btn btn--primary btn--lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.quiz.submit}
              <kbd className="ml-1 text-xs opacity-70 font-mono">{t.quiz.enter}</kbd>
            </button>
          ) : (
            <button onClick={goNext} disabled={!canGoNext} className="btn btn--primary disabled:opacity-30 disabled:cursor-not-allowed">
              {t.quiz.next}
              <kbd className="ml-1 text-xs opacity-70 font-mono">{t.quiz.enter}</kbd>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
