import { useState, useEffect } from 'react';
import Landing from './Landing';
import Questionnaire from './Questionnaire';
import Results from './Results';
import ThemeToggle from './ThemeToggle';
import { calculateScores, type DISCResult } from '../lib/scoring';
import { decodeResults } from '../lib/sharing';
import { questions } from '../data/questions';
import type { Dimension } from '../data/questions';

type Page = 'landing' | 'questionnaire' | 'loading' | 'results';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [result, setResult] = useState<DISCResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('r');
    if (encoded) {
      const scores = decodeResults(encoded);
      if (scores) {
        const sorted = (Object.entries(scores) as [Dimension, number][]).sort((a, b) => b[1] - a[1]);
        const dominant = sorted[0][0];
        const secondary = sorted[0][1] - sorted[1][1] < 15 ? sorted[1][0] : null;
        setResult({ rawScores: scores, normalizedScores: scores, dominant, secondary });
        setPage('results');
      }
    }
  }, []);

  const handleStart = () => {
    setPage('questionnaire');
    window.scrollTo(0, 0);
  };

  const handleComplete = (answers: Record<number, number>) => {
    setPage('loading');
    window.scrollTo(0, 0);

    const questionDimensions: Record<number, Dimension> = {};
    questions.forEach((q) => {
      questionDimensions[q.id] = q.dimension;
    });

    const discResult = calculateScores(answers, questionDimensions);
    setTimeout(() => {
      setResult(discResult);
      setPage('results');
    }, 1500);
  };

  const handleRestart = () => {
    window.history.replaceState({}, '', window.location.pathname);
    setResult(null);
    setPage('landing');
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative min-h-screen">
      <ThemeToggle />
      {page === 'landing' && <Landing onStart={handleStart} />}
      {page === 'questionnaire' && <Questionnaire onComplete={handleComplete} />}
      {page === 'loading' && <LoadingScreen />}
      {page === 'results' && result && <Results result={result} onRestart={handleRestart} />}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="flex gap-3 mb-6">
        {['#EA4335', '#FBBC04', '#34A853', '#4285F4'].map((color, i) => (
          <div
            key={color}
            className="w-4 h-4 rounded-full animate-bounce"
            style={{ backgroundColor: color, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-lg font-medium text-[#5F6368] dark:text-[#9AA0A6] font-display">
        Analyse de ton profil en cours...
      </p>
    </div>
  );
}
