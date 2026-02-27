import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from '../i18n/context';
import Nav from './Nav';
import Landing from './Landing';
import Questionnaire from './Questionnaire';
import type { QuizCompletionData } from './Questionnaire';
import Results from './Results';
import {
  calculateScores,
  resultFromScores,
  calculateNaturalScores,
  calculateSprangerScores,
  type DISCResult,
  type Scores,
  type ValuesResult,
} from '../lib/scoring';
import { decodeResults } from '../lib/sharing';
import { questions, extraQuestions, forcedChoiceGroups, sprangerPairs } from '../data/questions';

type Page = 'landing' | 'questionnaire' | 'loading' | 'results';

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}

function AppInner() {
  const { t } = useI18n();
  const [page, setPage] = useState<Page>('landing');
  const [result, setResult] = useState<DISCResult | null>(null);
  const [naturalScores, setNaturalScores] = useState<Scores | undefined>(undefined);
  const [valuesResult, setValuesResult] = useState<ValuesResult | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('r');
    if (encoded) {
      const scores = decodeResults(encoded);
      if (scores) {
        setResult(resultFromScores(scores));
        setPage('results');
      }
    }
  }, []);

  const handleStart = () => {
    setPage('questionnaire');
    window.scrollTo(0, 0);
  };

  const handleComplete = (data: QuizCompletionData) => {
    setPage('loading');
    window.scrollTo(0, 0);

    const allQ = data.usedExtra ? [...questions, ...extraQuestions] : questions;
    const discResult = calculateScores(data.likertAnswers, allQ);

    // Calculate Natural scores from forced-choice
    const natural = calculateNaturalScores(data.forcedChoiceAnswers, forcedChoiceGroups);

    // Calculate Spranger values
    const values = calculateSprangerScores(data.valuesAnswers, sprangerPairs);

    setTimeout(() => {
      setResult(discResult);
      setNaturalScores(natural);
      setValuesResult(values);
      setPage('results');
    }, 1500);
  };

  const handleRestart = () => {
    window.history.replaceState({}, '', window.location.pathname);
    setResult(null);
    setNaturalScores(undefined);
    setValuesResult(undefined);
    setPage('landing');
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative min-h-screen">
      <Nav currentPage="test" />
      {page === 'landing' && <Landing onStart={handleStart} />}
      {page === 'questionnaire' && <Questionnaire onComplete={handleComplete} />}
      {page === 'loading' && <LoadingScreen label={t.loading} />}
      {page === 'results' && result && (
        <Results
          result={result}
          naturalScores={naturalScores}
          valuesResult={valuesResult}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="flex gap-3 mb-6">
        {['#EA4335', '#FBBC04', '#34A853', '#4285F4'].map((color, i) => (
          <div key={color} className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="text-lg font-medium text-[#5F6368] dark:text-[#9AA0A6] font-display">{label}</p>
    </div>
  );
}
