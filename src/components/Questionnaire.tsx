import { useState, useMemo, useCallback, useEffect } from 'react';
import { useI18n } from '../i18n/context';
import {
  questions, extraQuestions, shuffleQuestions,
  forcedChoiceGroups, sprangerPairs,
  type Question,
} from '../data/questions';
import { calculateScores, needsAdaptive } from '../lib/scoring';
import ProgressBar from './ProgressBar';
import LikertScale from './LikertScale';
import ForcedChoice from './ForcedChoice';
import ValuesQuestion from './ValuesQuestion';

export interface QuizCompletionData {
  likertAnswers: Record<number, number>;
  usedExtra: boolean;
  forcedChoiceAnswers: Record<number, { most: number; least: number }>;
  valuesAnswers: Record<number, 0 | 1>;
}

interface Props {
  onComplete: (data: QuizCompletionData) => void;
}

type Phase =
  | 'main'
  | 'adaptive-intro'
  | 'adaptive'
  | 'forced-choice-intro'
  | 'forced-choice'
  | 'values-intro'
  | 'values';

export default function Questionnaire({ onComplete }: Props) {
  const { t } = useI18n();
  const shuffledMain = useMemo(() => shuffleQuestions(questions), []);
  const shuffledFC = useMemo(() => shuffleQuestions(forcedChoiceGroups), []);
  const shuffledValues = useMemo(() => shuffleQuestions(sprangerPairs), []);

  const [phase, setPhase] = useState<Phase>('main');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likertAnswers, setLikertAnswers] = useState<Record<number, number>>({});
  const [adaptiveQs, setAdaptiveQs] = useState<Question[]>([]);
  const [usedExtra, setUsedExtra] = useState(false);
  const [fcAnswers, setFcAnswers] = useState<Record<number, { most: number; least: number }>>({});
  const [valuesAnswers, setValuesAnswers] = useState<Record<number, 0 | 1>>({});

  // ── Likert phase helpers ──
  const currentLikertQs = phase === 'adaptive' ? adaptiveQs : shuffledMain;
  const currentLikertQ = (phase === 'main' || phase === 'adaptive') ? currentLikertQs[currentIndex] : null;
  const likertTotal = currentLikertQs.length;

  const handleLikertAnswer = useCallback(
    (value: number) => {
      if (!currentLikertQ) return;
      setLikertAnswers((prev) => ({ ...prev, [currentLikertQ.id]: value }));
    },
    [currentLikertQ],
  );

  // ── Forced-choice phase helpers ──
  const currentFCGroup = phase === 'forced-choice' ? shuffledFC[currentIndex] : null;
  const fcTotal = shuffledFC.length;

  const handleFCAnswer = useCallback(
    (answer: { most: number; least: number }) => {
      if (!currentFCGroup) return;
      setFcAnswers((prev) => ({ ...prev, [currentFCGroup.id]: answer }));
    },
    [currentFCGroup],
  );

  // ── Values phase helpers ──
  const currentValuesPair = phase === 'values' ? shuffledValues[currentIndex] : null;
  const valuesTotal = shuffledValues.length;

  const handleValuesAnswer = useCallback(
    (value: 0 | 1) => {
      if (!currentValuesPair) return;
      setValuesAnswers((prev) => ({ ...prev, [currentValuesPair.id]: value }));
    },
    [currentValuesPair],
  );

  // ── Navigation ──
  const getPhaseTotal = () => {
    if (phase === 'main' || phase === 'adaptive') return currentLikertQs.length;
    if (phase === 'forced-choice') return fcTotal;
    if (phase === 'values') return valuesTotal;
    return 0;
  };

  const canGoNext = () => {
    if (phase === 'main' || phase === 'adaptive') {
      return currentLikertQ ? likertAnswers[currentLikertQ.id] !== undefined : false;
    }
    if (phase === 'forced-choice') {
      if (!currentFCGroup) return false;
      const a = fcAnswers[currentFCGroup.id];
      return a !== undefined && a.most >= 0 && a.least >= 0;
    }
    if (phase === 'values') {
      return currentValuesPair ? valuesAnswers[currentValuesPair.id] !== undefined : false;
    }
    return false;
  };

  const isLast = currentIndex === getPhaseTotal() - 1;

  // ── Phase transitions ──
  const transitionToForcedChoice = useCallback(() => {
    setPhase('forced-choice-intro');
    setCurrentIndex(0);
  }, []);

  const transitionToValues = useCallback(() => {
    setPhase('values-intro');
    setCurrentIndex(0);
  }, []);

  const finishQuiz = useCallback(() => {
    onComplete({
      likertAnswers,
      usedExtra,
      forcedChoiceAnswers: fcAnswers,
      valuesAnswers,
    });
  }, [likertAnswers, usedExtra, fcAnswers, valuesAnswers, onComplete]);

  const handleSubmitMain = useCallback(() => {
    const prelim = calculateScores(likertAnswers, questions);
    const close = needsAdaptive(prelim.normalizedScores);

    if (close) {
      const [dim1, dim2] = close;
      const extras = extraQuestions.filter((q) => q.dimension === dim1 || q.dimension === dim2);
      setAdaptiveQs(shuffleQuestions(extras));
      setUsedExtra(true);
      setPhase('adaptive-intro');
    } else {
      transitionToForcedChoice();
    }
  }, [likertAnswers, transitionToForcedChoice]);

  const handleSubmitAdaptive = useCallback(() => {
    transitionToForcedChoice();
  }, [transitionToForcedChoice]);

  const handleSubmitFC = useCallback(() => {
    transitionToValues();
  }, [transitionToValues]);

  const handleSubmitValues = useCallback(() => {
    finishQuiz();
  }, [finishQuiz]);

  const goNext = useCallback(() => {
    if (!canGoNext()) return;

    if (isLast) {
      if (phase === 'main') handleSubmitMain();
      else if (phase === 'adaptive') handleSubmitAdaptive();
      else if (phase === 'forced-choice') handleSubmitFC();
      else if (phase === 'values') handleSubmitValues();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLast, phase, handleSubmitMain, handleSubmitAdaptive, handleSubmitFC, handleSubmitValues, currentIndex, likertAnswers, fcAnswers, valuesAnswers, currentLikertQ, currentFCGroup, currentValuesPair]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Intro screens: Enter to continue
      if (phase === 'adaptive-intro' || phase === 'forced-choice-intro' || phase === 'values-intro') {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (phase === 'adaptive-intro') startAdaptive();
          else if (phase === 'forced-choice-intro') startFC();
          else startValues();
        }
        return;
      }

      // Likert: digit 1-5 to answer
      if ((phase === 'main' || phase === 'adaptive') && /^[1-5]$/.test(e.key)) {
        e.preventDefault();
        handleLikertAnswer(parseInt(e.key, 10));
        return;
      }

      // Values: 1 or 2 to pick option
      if (phase === 'values' && (e.key === '1' || e.key === '2')) {
        e.preventDefault();
        handleValuesAnswer((parseInt(e.key, 10) - 1) as 0 | 1);
        return;
      }

      if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); goNext(); return; }
      if (e.key === 'Backspace' || e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLikertAnswer, handleValuesAnswer, goNext, goPrev, phase]);

  const startAdaptive = () => { setPhase('adaptive'); setCurrentIndex(0); };
  const startFC = () => { setPhase('forced-choice'); setCurrentIndex(0); };
  const startValues = () => { setPhase('values'); setCurrentIndex(0); };

  // ── Intro screens ──
  if (phase === 'adaptive-intro' || phase === 'forced-choice-intro' || phase === 'values-intro') {
    const introConfig = {
      'adaptive-intro': { title: t.quiz.adaptiveIntro, subtitle: t.quiz.adaptiveSubtitle, onStart: startAdaptive },
      'forced-choice-intro': { title: t.quiz.forcedChoiceIntro, subtitle: t.quiz.forcedChoiceSubtitle, onStart: startFC },
      'values-intro': { title: t.quiz.valuesIntro, subtitle: t.quiz.valuesSubtitle, onStart: startValues },
    }[phase];

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
        <div className="quiz-card w-full text-center">
          <div className="flex gap-3 justify-center mb-6">
            {['#EA4335', '#FBBC04', '#34A853', '#4285F4'].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#202124] dark:text-white mb-3">
            {introConfig.title}
          </h2>
          <p className="text-[#5F6368] dark:text-[#9AA0A6] mb-8">{introConfig.subtitle}</p>
          <button onClick={introConfig.onStart} className="btn btn--primary btn--lg">
            {t.quiz.next} &rarr;
          </button>
        </div>
      </div>
    );
  }

  // ── Phase label ──
  const phaseLabel = phase === 'main' || phase === 'adaptive'
    ? `1/3 — ${t.quiz.question}`
    : phase === 'forced-choice'
      ? '2/3'
      : '3/3';

  const total = getPhaseTotal();
  const showSubmit = isLast;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="quiz-card w-full">
        {/* Phase indicator */}
        <div className="text-center mb-2">
          <span className="text-xs font-medium text-[#9AA0A6] dark:text-[#5F6368] uppercase tracking-wider">
            {phaseLabel}
          </span>
        </div>

        <ProgressBar current={currentIndex + 1} total={total} />

        {/* Likert phase */}
        {(phase === 'main' || phase === 'adaptive') && currentLikertQ && (
          <div key={currentLikertQ.id} className="animate-fade-in">
            <p className="font-display font-bold text-xl sm:text-2xl text-[#202124] dark:text-white mb-8 leading-snug tracking-tight">
              {t.questions[currentLikertQ.id]}
            </p>
            <LikertScale value={likertAnswers[currentLikertQ.id]} onChange={handleLikertAnswer} />
          </div>
        )}

        {/* Forced-choice phase */}
        {phase === 'forced-choice' && currentFCGroup && (
          <div key={currentFCGroup.id} className="animate-fade-in">
            <ForcedChoice
              group={currentFCGroup}
              answer={fcAnswers[currentFCGroup.id]}
              onChange={handleFCAnswer}
            />
          </div>
        )}

        {/* Values phase */}
        {phase === 'values' && currentValuesPair && (
          <div key={currentValuesPair.id} className="animate-fade-in">
            <p className="font-display font-bold text-lg sm:text-xl text-[#202124] dark:text-white mb-6 text-center leading-snug tracking-tight">
              {t.quiz.valuesQuestion}
            </p>
            <ValuesQuestion
              pair={currentValuesPair}
              answer={valuesAnswers[currentValuesPair.id]}
              onChange={handleValuesAnswer}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={goPrev} disabled={currentIndex === 0} className="btn btn--outline disabled:opacity-30 disabled:cursor-not-allowed">
            {t.quiz.prev}
          </button>

          {showSubmit ? (
            <button
              onClick={goNext}
              disabled={!canGoNext()}
              className="btn btn--primary btn--lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {phase === 'values' ? t.quiz.submit : t.quiz.next}
              <kbd className="ml-1 text-xs opacity-70 font-mono">{t.quiz.enter}</kbd>
            </button>
          ) : (
            <button onClick={goNext} disabled={!canGoNext()} className="btn btn--primary disabled:opacity-30 disabled:cursor-not-allowed">
              {t.quiz.next}
              <kbd className="ml-1 text-xs opacity-70 font-mono">{t.quiz.enter}</kbd>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
