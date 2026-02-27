import { useState, useRef, useMemo } from 'react';
import { useI18n } from '../i18n/context';
import type { DISCResult } from '../lib/scoring';
import { generateReport } from '../lib/scoring';
import type { Dimension } from '../data/questions';
import { profiles } from '../data/profiles';
import { getReportContent, wheelTypeLabels } from '../data/report-content';
import RadarChart from './RadarChart';
import ShareButton from './ShareButton';
import ExportPDF from './ExportPDF';
import WheelPosition from './WheelPosition';
import BipolarIndicator from './BipolarIndicator';
import PerceptionCard from './PerceptionCard';
import TalentsList from './TalentsList';

interface Props {
  result: DISCResult;
  onRestart: () => void;
}

const dimensionOrder: Dimension[] = ['D', 'I', 'S', 'C'];

type TabId = 'overview' | 'profile' | 'talents' | 'environment' | 'perceptions' | 'communication' | 'motivation' | 'improvement' | 'indicators' | 'opposite';

const TAB_IDS: TabId[] = [
  'overview', 'profile', 'talents', 'environment', 'perceptions',
  'communication', 'motivation', 'improvement', 'indicators', 'opposite',
];

export default function Results({ result, onRestart }: Props) {
  const { t, locale } = useI18n();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const report = useMemo(() => generateReport(result, locale), [result, locale]);
  const content = useMemo(
    () => getReportContent(result.normalizedScores, locale, report.wheelType),
    [result.normalizedScores, locale, report.wheelType],
  );

  const dominantProfile = profiles[result.dominant];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
            <circle cx="12" cy="12" r="10" fill="#EA4335" opacity="0.85" />
            <circle cx="28" cy="12" r="10" fill="#FBBC04" opacity="0.85" />
            <circle cx="12" cy="28" r="10" fill="#34A853" opacity="0.85" />
            <circle cx="28" cy="28" r="10" fill="#4285F4" opacity="0.85" />
          </svg>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#202124] dark:text-white mb-2 tracking-tight">
          {t.results.title}
        </h2>
        <p className="text-[#5F6368] dark:text-[#9AA0A6]">{t.results.subtitle}</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-1 min-w-max p-1 bg-[#F1F3F4] dark:bg-[#3C4043] rounded-2xl">
          {TAB_IDS.map((tabId) => {
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-[#303134] text-[#202124] dark:text-white shadow-sm'
                    : 'text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white'
                }`}
              >
                {t.report.tabs[tabId]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div ref={pdfRef}>
        {activeTab === 'overview' && (
          <TabOverview result={result} report={report} content={content} />
        )}
        {activeTab === 'profile' && (
          <TabProfile report={report} content={content} />
        )}
        {activeTab === 'talents' && (
          <TabTalents content={content} dominant={result.dominant} />
        )}
        {activeTab === 'environment' && (
          <TabEnvironment content={content} dominant={result.dominant} />
        )}
        {activeTab === 'perceptions' && (
          <TabPerceptions report={report} />
        )}
        {activeTab === 'communication' && (
          <TabCommunication content={content} dominant={result.dominant} />
        )}
        {activeTab === 'motivation' && (
          <TabMotivation content={content} dominant={result.dominant} />
        )}
        {activeTab === 'improvement' && (
          <TabImprovement content={content} dominant={result.dominant} />
        )}
        {activeTab === 'indicators' && (
          <TabIndicators report={report} />
        )}
        {activeTab === 'opposite' && (
          <TabOpposite report={report} content={content} dominant={result.dominant} />
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-8">
        <ShareButton scores={result.normalizedScores} />
        <ExportPDF targetRef={pdfRef} report={report} />
        <button onClick={onRestart} className="btn btn--outline">
          {t.results.restart}
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
          {t.results.learnMore} &rarr;
        </a>
      </div>
    </div>
  );
}

// ─── Tab Components ──────────────────────────────────────────

function TabOverview({
  result,
  report,
  content,
}: {
  result: DISCResult;
  report: ReturnType<typeof generateReport>;
  content: ReturnType<typeof getReportContent>;
}) {
  const { t } = useI18n();
  const dominantProfile = profiles[result.dominant];
  const dominantText = t.profiles[result.dominant];
  const secondaryProfile = result.secondary ? profiles[result.secondary] : null;
  const secondaryText = result.secondary ? t.profiles[result.secondary] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Wheel + Radar side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="profile-card p-6" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
          <WheelPosition
            wheelType={report.wheelType}
            wheelPosition={report.wheelPosition}
            dominant={result.dominant}
            secondary={result.secondary}
          />
        </div>
        <div className="profile-card p-6" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
          <RadarChart scores={result.normalizedScores} />
        </div>
      </div>

      {/* Score Bars */}
      <div className="profile-card p-6 flex flex-col gap-5" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
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

      {/* Type + Description summary */}
      <div className="profile-card p-6" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg"
            style={{ background: dominantProfile.color, color: dominantProfile.textOnColor }}
          >
            {result.dominant}
          </span>
          <div>
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1"
              style={{ background: dominantProfile.colorLight, color: dominantProfile.colorDark }}
            >
              {t.report.overview.yourType}: {content.wheelTypeLabel}
            </span>
            <h3 className="font-display font-bold text-lg text-[#202124] dark:text-white">
              {dominantText.title} — {dominantText.name}
            </h3>
          </div>
        </div>
        <p className="text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed text-sm">
          {dominantText.description}
        </p>

        {secondaryProfile && secondaryText && (
          <div className="mt-4 pt-4 border-t border-[#E8EAED] dark:border-[#5F6368]">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm"
                style={{ background: secondaryProfile.color, color: secondaryProfile.textOnColor }}
              >
                {result.secondary}
              </span>
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: secondaryProfile.colorLight, color: secondaryProfile.colorDark }}
              >
                {t.results.secondary}
              </span>
            </div>
            <p className="text-[#5F6368] dark:text-[#BDC1C6] leading-relaxed text-sm">
              {secondaryText.description}
            </p>
          </div>
        )}
      </div>

      {/* Quick strengths chips */}
      <div className="profile-card p-6" style={{ boxShadow: 'var(--shadow-ds-sm)' }}>
        <h4 className="font-display font-bold text-lg text-[#202124] dark:text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#34A853]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {t.results.strengths}
        </h4>
        <div className="flex flex-wrap gap-2">
          {t.profiles[result.dominant].strengths.map((s, i) => (
            <span key={i} className="chip" style={{ background: dominantProfile.colorLight, color: dominantProfile.colorDark }}>
              <span className="chip__dot" style={{ background: dominantProfile.color }} />
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabProfile({
  report,
  content,
}: {
  report: ReturnType<typeof generateReport>;
  content: ReturnType<typeof getReportContent>;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="profile-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.profile.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-6">
          {t.report.profile.subtitle}
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {content.narrative.split('\n\n').map((para, i) => (
            <p key={i} className="text-[#3C4043] dark:text-[#BDC1C6] leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabTalents({
  content,
  dominant,
}: {
  content: ReturnType<typeof getReportContent>;
  dominant: Dimension;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="profile-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.talents.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-6">
          {t.report.talents.subtitle}
        </p>
        <TalentsList items={content.talents} dominant={dominant} icon="star" />
      </div>
    </div>
  );
}

function TabEnvironment({
  content,
  dominant,
}: {
  content: ReturnType<typeof getReportContent>;
  dominant: Dimension;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="profile-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.environment.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-6">
          {t.report.environment.subtitle}
        </p>
        <TalentsList items={content.environment} dominant={dominant} icon="leaf" />
      </div>
    </div>
  );
}

function TabPerceptions({
  report,
}: {
  report: ReturnType<typeof generateReport>;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.perceptions.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6]">
          {t.report.perceptions.subtitle}
        </p>
      </div>
      <PerceptionCard perceptions={report.perceptions} />
    </div>
  );
}

function TabCommunication({
  content,
  dominant,
}: {
  content: ReturnType<typeof getReportContent>;
  dominant: Dimension;
}) {
  const { t } = useI18n();
  const p = profiles[dominant];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.communication.subtitle}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Do */}
        <div className="profile-card p-6" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
          <h4 className="font-display font-bold text-base text-[#34A853] mb-4 flex items-center gap-2">
            <span className="text-lg">&#x2713;</span>
            {t.report.communication.doTitle}
          </h4>
          <ul className="space-y-3">
            {content.communicationDo.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#3C4043] dark:text-[#BDC1C6]">
                <span className="text-[#34A853] mt-0.5 flex-shrink-0">&#x25B8;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Don't */}
        <div className="profile-card p-6" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
          <h4 className="font-display font-bold text-base text-[#EA4335] mb-4 flex items-center gap-2">
            <span className="text-lg">&#x2717;</span>
            {t.report.communication.dontTitle}
          </h4>
          <ul className="space-y-3">
            {content.communicationDont.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#3C4043] dark:text-[#BDC1C6]">
                <span className="text-[#EA4335] mt-0.5 flex-shrink-0">&#x25B8;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TabMotivation({
  content,
  dominant,
}: {
  content: ReturnType<typeof getReportContent>;
  dominant: Dimension;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="profile-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.motivation.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-6">
          {t.report.motivation.subtitle}
        </p>
        <TalentsList items={content.motivationKeys} dominant={dominant} icon="heart" />
      </div>
    </div>
  );
}

function TabImprovement({
  content,
  dominant,
}: {
  content: ReturnType<typeof getReportContent>;
  dominant: Dimension;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="profile-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.improvement.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-4">
          {t.report.improvement.subtitle}
        </p>
        <div className="mb-6 p-3 rounded-xl bg-[#FEF7E0] dark:bg-[#FBBC04]/10 text-sm text-[#E37400] dark:text-[#FDD663]">
          {t.report.improvement.cta}
        </div>
        <TalentsList items={content.improvementAreas} dominant={dominant} icon="arrow" />
      </div>
    </div>
  );
}

function TabIndicators({
  report,
}: {
  report: ReturnType<typeof generateReport>;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="profile-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.indicators.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-6">
          {t.report.indicators.subtitle}
        </p>
        <BipolarIndicator indicators={report.bipolarIndicators} />
      </div>
    </div>
  );
}

function TabOpposite({
  report,
  content,
  dominant,
}: {
  report: ReturnType<typeof generateReport>;
  content: ReturnType<typeof getReportContent>;
  dominant: Dimension;
}) {
  const { t, locale } = useI18n();
  const p = profiles[dominant];
  const oppositeLabel = wheelTypeLabels[report.oppositeType][locale];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="profile-card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
        <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white mb-2">
          {t.report.opposite.title}
        </h3>
        <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mb-6">
          {t.report.opposite.subtitle}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl mb-1"
              style={{ background: p.color, color: p.textOnColor }}
            >
              {content.wheelTypeLabel.charAt(0)}
            </div>
            <span className="text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6]">
              {content.wheelTypeLabel}
            </span>
          </div>
          <div className="flex-1 flex items-center">
            <div className="flex-1 h-0.5 bg-gradient-to-r from-current to-transparent" style={{ color: p.color }} />
            <span className="px-3 text-[#5F6368] dark:text-[#9AA0A6] text-lg">&#x2194;</span>
            <div className="flex-1 h-0.5 bg-gradient-to-l from-[#9AA0A6] to-transparent" />
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl mb-1 bg-[#E8EAED] dark:bg-[#5F6368] text-[#5F6368] dark:text-[#BDC1C6]">
              {oppositeLabel.charAt(0)}
            </div>
            <span className="text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6]">
              {oppositeLabel}
            </span>
          </div>
        </div>

        {content.opposite && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content.opposite[locale].split('\n\n').map((para, i) => (
              <p key={i} className="text-[#3C4043] dark:text-[#BDC1C6] leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
