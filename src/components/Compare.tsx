import { useState } from 'react';
import { I18nProvider, useI18n } from '../i18n/context';
import Nav from './Nav';
import { parseShareUrl } from '../lib/sharing';
import { resultFromScores, type Scores } from '../lib/scoring';
import type { Dimension } from '../data/questions';
import { profiles } from '../data/profiles';
import RadarChart from './RadarChart';

export default function Compare() {
  return (
    <I18nProvider>
      <CompareInner />
    </I18nProvider>
  );
}

function CompareInner() {
  const { t } = useI18n();
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [scoresA, setScoresA] = useState<Scores | null>(null);
  const [scoresB, setScoresB] = useState<Scores | null>(null);
  const [error, setError] = useState('');

  const handleCompare = () => {
    setError('');
    const a = parseShareUrl(urlA);
    const b = parseShareUrl(urlB);
    if (!a || !b) {
      setError(t.team.invalidUrl);
      return;
    }
    setScoresA(a);
    setScoresB(b);
  };

  const dimensionOrder: Dimension[] = ['D', 'I', 'S', 'C'];

  return (
    <div className="relative min-h-screen">
      <Nav currentPage="compare" />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#202124] dark:text-white mb-2 tracking-tight">
            {t.compare.title}
          </h2>
          <p className="text-[#5F6368] dark:text-[#9AA0A6]">{t.compare.subtitle}</p>
        </div>

        {/* Input form */}
        <div className="profile-card p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-1.5 font-display">
                {t.compare.labelA}
              </label>
              <input
                type="text"
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                placeholder={t.compare.placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#303134] text-[#202124] dark:text-white placeholder-[#9AA0A6] focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-1.5 font-display">
                {t.compare.labelB}
              </label>
              <input
                type="text"
                value={urlB}
                onChange={(e) => setUrlB(e.target.value)}
                placeholder={t.compare.placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#303134] text-[#202124] dark:text-white placeholder-[#9AA0A6] focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm"
              />
            </div>
            {error && <p className="text-sm text-[#EA4335]">{error}</p>}
            <button
              onClick={handleCompare}
              disabled={!urlA.trim() || !urlB.trim()}
              className="btn btn--primary btn--lg self-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.compare.button}
            </button>
          </div>
        </div>

        {/* Comparison results */}
        {scoresA && scoresB ? (
          <>
            {/* Overlay radar chart */}
            <div className="profile-card p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
              <RadarChart scores={scoresA} secondScores={scoresB} secondLabel={t.compare.profileB} />
              <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[rgba(66,133,244,0.6)]" />
                  {t.compare.profileA}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[rgba(234,67,53,0.5)]" />
                  {t.compare.profileB}
                </span>
              </div>
            </div>

            {/* Side-by-side bars */}
            <div className="profile-card p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
              <div className="flex flex-col gap-6">
                {dimensionOrder.map((dim) => {
                  const p = profiles[dim];
                  const a = scoresA[dim];
                  const b = scoresB[dim];
                  return (
                    <div key={dim}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-base" style={{ color: p.color }}>
                          {t.profiles[dim].name} ({dim})
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6] w-6">A</span>
                          <div className="result-bar__track flex-1">
                            <div
                              className="result-bar__fill"
                              style={{
                                width: `${a}%`,
                                background: `linear-gradient(90deg, ${p.colorMid}, ${p.color})`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-[#5F6368] dark:text-[#BDC1C6] w-10 text-right">{a}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6] w-6">B</span>
                          <div className="result-bar__track flex-1">
                            <div
                              className="result-bar__fill"
                              style={{
                                width: `${b}%`,
                                background: `linear-gradient(90deg, ${p.colorMid}80, ${p.color}80)`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-[#5F6368] dark:text-[#BDC1C6] w-10 text-right">{b}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profile summaries side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <ProfileSummary label={t.compare.profileA} scores={scoresA} />
              <ProfileSummary label={t.compare.profileB} scores={scoresB} />
            </div>
          </>
        ) : (
          <div className="text-center text-[#9AA0A6] py-12">
            {t.compare.empty}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSummary({ label, scores }: { label: string; scores: Scores }) {
  const { t } = useI18n();
  const res = resultFromScores(scores);
  const p = profiles[res.dominant];
  const pt = t.profiles[res.dominant];

  return (
    <div className="profile-card overflow-hidden" style={{ boxShadow: 'var(--shadow-ds-sm)' }}>
      <div className="profile-card__blob-header" style={{ background: p.colorSurface, height: 80 }}>
        <svg viewBox="0 0 200 200" style={{ width: 120, height: 120 }}>
          <path d={p.blobPath} transform="translate(100 100)" fill={p.color} opacity="0.3" />
        </svg>
        <span className="profile-card__icon text-[1.5rem]" style={{ color: p.textOnColor }}>
          {p.dimension}
        </span>
      </div>
      <div className="profile-card__body">
        <span className="profile-card__tag mb-1" style={{ background: p.colorLight, color: p.colorDark }}>
          {label}
        </span>
        <h3 className="font-display font-bold text-lg text-[#202124] dark:text-white mb-1 tracking-tight">
          {pt.title} — {pt.name}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed line-clamp-3">{pt.description}</p>
      </div>
    </div>
  );
}
