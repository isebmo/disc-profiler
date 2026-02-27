import { useState, useEffect, useCallback } from 'react';
import { I18nProvider, useI18n } from '../i18n/context';
import Nav from './Nav';
import { parseShareUrl, encodeTeam, decodeTeam, type TeamMember } from '../lib/sharing';
import { resultFromScores, type Scores } from '../lib/scoring';
import type { Dimension } from '../data/questions';
import { profiles } from '../data/profiles';
import RadarChart from './RadarChart';

const STORAGE_KEY = 'disc-team';

export default function Team() {
  return (
    <I18nProvider>
      <TeamInner />
    </I18nProvider>
  );
}

function TeamInner() {
  const { t } = useI18n();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Load from URL param or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const teamParam = params.get('t');
    if (teamParam) {
      const decoded = decodeTeam(teamParam);
      if (decoded) {
        setMembers(decoded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
        return;
      }
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setMembers(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const handleAdd = useCallback(() => {
    setError('');
    const scores = parseShareUrl(url);
    if (!scores) {
      setError(t.team.invalidUrl);
      return;
    }
    const trimmedName = name.trim() || `Member ${members.length + 1}`;
    setMembers((prev) => [...prev, { name: trimmedName, scores }]);
    setName('');
    setUrl('');
  }, [name, url, members.length, t.team.invalidUrl]);

  const handleRemove = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleShare = async () => {
    if (members.length === 0) return;
    const encoded = encodeTeam(members);
    const shareUrl = new URL(window.location.href.split('?')[0]);
    shareUrl.searchParams.set('t', encoded);
    try {
      await navigator.clipboard.writeText(shareUrl.toString());
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl.toString();
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const averageScores: Scores | null = members.length > 0
    ? {
        D: Math.round(members.reduce((s, m) => s + m.scores.D, 0) / members.length),
        I: Math.round(members.reduce((s, m) => s + m.scores.I, 0) / members.length),
        S: Math.round(members.reduce((s, m) => s + m.scores.S, 0) / members.length),
        C: Math.round(members.reduce((s, m) => s + m.scores.C, 0) / members.length),
      }
    : null;

  const dimensionOrder: Dimension[] = ['D', 'I', 'S', 'C'];

  return (
    <div className="relative min-h-screen">
      <Nav currentPage="team" />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#202124] dark:text-white mb-2 tracking-tight">
            {t.team.title}
          </h2>
          <p className="text-[#5F6368] dark:text-[#9AA0A6]">{t.team.subtitle}</p>
        </div>

        {/* Add member form */}
        <div className="profile-card p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
          <h3 className="font-display font-bold text-lg text-[#202124] dark:text-white mb-4">{t.team.addMember}</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.team.name}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#303134] text-[#202124] dark:text-white placeholder-[#9AA0A6] focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.team.url}
              className="flex-[2] px-4 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#5F6368] bg-white dark:bg-[#303134] text-[#202124] dark:text-white placeholder-[#9AA0A6] focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />
            <button onClick={handleAdd} className="btn btn--primary whitespace-nowrap">
              {t.team.add}
            </button>
          </div>
          {error && <p className="text-sm text-[#EA4335] mt-2">{error}</p>}
        </div>

        {/* Members list */}
        {members.length > 0 && (
          <div className="profile-card p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
            <div className="flex flex-col gap-3">
              {members.map((member, index) => {
                const res = resultFromScores(member.scores);
                const p = profiles[res.dominant];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#303134] border border-[#F1F3F4] dark:border-[#5F6368]"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                      style={{ backgroundColor: p.colorLight, color: p.colorDark }}
                    >
                      {res.dominant}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-sm text-[#202124] dark:text-white truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-[#5F6368] dark:text-[#9AA0A6]">
                        D:{member.scores.D}% I:{member.scores.I}% S:{member.scores.S}% C:{member.scores.C}%
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-xs text-[#EA4335] hover:text-[#C5221F] font-medium px-2 py-1 rounded-lg hover:bg-[#FCEAE8] dark:hover:bg-[rgba(234,67,53,0.1)] transition-colors"
                    >
                      {t.team.remove}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team overview */}
        {averageScores ? (
          <>
            <div className="text-center mb-6">
              <h3 className="font-display font-bold text-xl text-[#202124] dark:text-white">
                {t.team.overview}
              </h3>
              <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6]">{t.team.average}</p>
            </div>

            {/* Average radar chart */}
            <div className="profile-card p-6 sm:p-8 mb-8" style={{ boxShadow: 'var(--shadow-ds-lg)' }}>
              <RadarChart scores={averageScores} />
            </div>

            {/* Average bars */}
            <div className="profile-card p-6 sm:p-8 mb-8 flex flex-col gap-5" style={{ boxShadow: 'var(--shadow-ds-md)' }}>
              {dimensionOrder.map((dim) => {
                const p = profiles[dim];
                const avg = averageScores[dim];
                const min = Math.min(...members.map((m) => m.scores[dim]));
                const max = Math.max(...members.map((m) => m.scores[dim]));
                return (
                  <div key={dim}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-sm" style={{ color: p.color }}>
                        {t.profiles[dim].name} ({dim})
                      </span>
                      <span className="text-xs text-[#9AA0A6]">
                        min {min}% — avg {avg}% — max {max}%
                      </span>
                    </div>
                    <div className="result-bar__track relative">
                      {/* Range bar (min to max) */}
                      <div
                        className="absolute h-full rounded-full opacity-30"
                        style={{
                          left: `${min}%`,
                          width: `${max - min}%`,
                          background: p.color,
                        }}
                      />
                      {/* Average marker */}
                      <div
                        className="result-bar__fill"
                        style={{
                          width: `${avg}%`,
                          background: `linear-gradient(90deg, ${p.colorMid}, ${p.color})`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Share team */}
            <div className="flex justify-center mb-8">
              <button onClick={handleShare} className="btn btn--primary btn--lg">
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t.team.copied}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    {t.team.share}
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-[#9AA0A6] py-12">
            {t.team.empty}
          </div>
        )}
      </div>
    </div>
  );
}
