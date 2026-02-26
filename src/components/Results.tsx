import type { DISCResult } from '../lib/scoring';
import type { Dimension } from '../data/questions';
import { profiles } from '../data/profiles';
import RadarChart from './RadarChart';
import ShareButton from './ShareButton';

interface Props {
  result: DISCResult;
  onRestart: () => void;
}

const dimensionOrder: Dimension[] = ['D', 'I', 'S', 'C'];

export default function Results({ result, onRestart }: Props) {
  const dominant = profiles[result.dominant];
  const secondary = result.secondary ? profiles[result.secondary] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
            <circle cx="12" cy="12" r="10" fill="#EA4335" opacity="0.85" />
            <circle cx="28" cy="12" r="10" fill="#FBBC04" opacity="0.85" />
            <circle cx="12" cy="28" r="10" fill="#34A853" opacity="0.85" />
            <circle cx="28" cy="28" r="10" fill="#4285F4" opacity="0.85" />
          </svg>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#202124] dark:text-white mb-2 tracking-tight">
          Ton profil DISC
        </h2>
        <p className="text-[#5F6368] dark:text-[#9AA0A6]">Voici tes résultats basés sur tes réponses</p>
      </div>

      {/* Radar Chart Card */}
      <div className="profile-card p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <RadarChart scores={result.normalizedScores} />
      </div>

      {/* Result Bars */}
      <div className="profile-card p-6 sm:p-8 mb-8 flex flex-col gap-5" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
        {dimensionOrder.map((dim) => {
          const p = profiles[dim];
          const score = result.normalizedScores[dim];
          return (
            <div key={dim} className="result-bar">
              <span className="result-bar__label" style={{ color: p.color }}>
                {dim}
              </span>
              <div className="result-bar__track">
                <div
                  className="result-bar__fill"
                  style={{
                    width: `${score}%`,
                    background: `linear-gradient(90deg, ${p.colorMid}, ${p.color})`,
                  }}
                />
              </div>
              <span className="result-bar__value text-[#5F6368] dark:text-[#BDC1C6]">{score}%</span>
            </div>
          );
        })}
      </div>

      {/* Dominant Profile Card */}
      <div className="profile-card mb-6 overflow-hidden" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <div className="profile-card__blob-header" style={{ background: dominant.colorSurface }}>
          <svg viewBox="0 0 200 200">
            <path d={dominant.blobPath} transform="translate(100 100)" fill={dominant.color} opacity="0.3" />
          </svg>
          <span className="profile-card__icon" style={{ color: dominant.textOnColor }}>
            {dominant.dimension}
          </span>
        </div>
        <div className="profile-card__body">
          <span className="profile-card__tag" style={{ background: dominant.colorLight, color: dominant.colorDark }}>
            Profil dominant
          </span>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[#202124] dark:text-white mb-2 tracking-tight">
            {dominant.title} — {dominant.name}
          </h3>
          <p className="text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">{dominant.description}</p>
        </div>
      </div>

      {/* Secondary Profile Card */}
      {secondary && (
        <div className="profile-card mb-8 overflow-hidden" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
          <div className="profile-card__blob-header" style={{ background: secondary.colorSurface, height: 100 }}>
            <svg viewBox="0 0 200 200" style={{ width: 160, height: 160 }}>
              <path d={secondary.blobPath} transform="translate(100 100)" fill={secondary.color} opacity="0.3" />
            </svg>
            <span className="profile-card__icon text-[2rem]" style={{ color: secondary.textOnColor }}>
              {secondary.dimension}
            </span>
          </div>
          <div className="profile-card__body">
            <span className="profile-card__tag" style={{ background: secondary.colorLight, color: secondary.colorDark }}>
              Profil secondaire
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-[#202124] dark:text-white mb-2 tracking-tight">
              {secondary.title} — {secondary.name}
            </h3>
            <p className="text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed">{secondary.description}</p>
          </div>
        </div>
      )}

      {/* Strengths as chips */}
      <Section title="Tes forces" icon={<StrengthIcon />} color={dominant.color}>
        <div className="flex flex-wrap gap-2">
          {dominant.strengths.map((s, i) => (
            <span key={i} className="chip" style={{ background: dominant.colorLight, color: dominant.colorDark }}>
              <span className="chip__dot" style={{ background: dominant.color }} />
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* Watchouts */}
      <Section title="Tes points de vigilance" icon={<WatchoutIcon />} color="#E37400">
        <ul className="space-y-3">
          {dominant.watchouts.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#3C4043] dark:text-[#BDC1C6]">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FBBC04]" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* Communication */}
      <Section title="Comment communiquer avec toi" icon={<CommIcon />} color="#4285F4">
        <ul className="space-y-3">
          {dominant.communication.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#3C4043] dark:text-[#BDC1C6]">
              <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: dominant.color }} />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-8">
        <ShareButton scores={result.normalizedScores} />
        <button onClick={onRestart} className="btn btn--outline">
          Refaire le test
        </button>
      </div>

      {/* Link to article */}
      <div className="text-center pb-8">
        <a
          href="https://mouret.pro/blog/comprendre-le-disc-et-mieux-communiquer/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline font-medium"
        >
          En savoir plus sur le modèle DISC &rarr;
        </a>
      </div>
    </div>
  );
}

function Section({ title, icon, color, children }: { title: string; icon: React.ReactNode; color: string; children: React.ReactNode }) {
  return (
    <div className="profile-card p-6 mb-5" style={{ boxShadow: 'var(--shadow-ds-sm)' }}>
      <h4 className="font-display font-bold text-lg text-[#202124] dark:text-white mb-4 flex items-center gap-2">
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

function StrengthIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#34A853]" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WatchoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FBBC04]" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CommIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4285F4]" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
