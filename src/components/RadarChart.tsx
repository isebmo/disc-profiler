import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useI18n } from '../i18n/context';
import type { Scores } from '../lib/scoring';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface Props {
  scores: Scores;
  secondScores?: Scores;
  secondLabel?: string;
}

export default function RadarChart({ scores, secondScores, secondLabel }: Props) {
  const { t } = useI18n();

  const labels = [
    `${t.profiles.D.name} (D)`,
    `${t.profiles.I.name} (I)`,
    `${t.profiles.S.name} (S)`,
    `${t.profiles.C.name} (C)`,
  ];

  const datasets = [
    {
      label: secondScores ? 'A' : undefined,
      data: [scores.D, scores.I, scores.S, scores.C],
      backgroundColor: 'rgba(66, 133, 244, 0.12)',
      borderColor: 'rgba(66, 133, 244, 0.6)',
      borderWidth: 2,
      pointBackgroundColor: ['#EA4335', '#FBBC04', '#34A853', '#4285F4'],
      pointBorderColor: ['#EA4335', '#FBBC04', '#34A853', '#4285F4'],
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ];

  if (secondScores) {
    datasets.push({
      label: secondLabel || 'B',
      data: [secondScores.D, secondScores.I, secondScores.S, secondScores.C],
      backgroundColor: 'rgba(234, 67, 53, 0.08)',
      borderColor: 'rgba(234, 67, 53, 0.5)',
      borderWidth: 2,
      pointBackgroundColor: ['#EA4335', '#FBBC04', '#34A853', '#4285F4'],
      pointBorderColor: ['#EA4335', '#FBBC04', '#34A853', '#4285F4'],
      pointRadius: 5,
      pointHoverRadius: 7,
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true, max: 100, min: 0,
        ticks: { stepSize: 25, display: true, color: '#9AA0A6', backdropColor: 'transparent', font: { family: "'DM Sans', sans-serif" } },
        grid: { color: 'rgba(218, 220, 224, 0.4)' },
        angleLines: { color: 'rgba(218, 220, 224, 0.4)' },
        pointLabels: { font: { size: 14, weight: '600' as const, family: "'Outfit', sans-serif" }, color: ['#C5221F', '#E37400', '#1E8E3E', '#1A73E8'] },
      },
    },
    plugins: { tooltip: { callbacks: { label: (ctx: { raw: unknown }) => `${ctx.raw}%` } }, legend: { display: !!secondScores } },
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Radar data={{ labels, datasets }} options={options} />
    </div>
  );
}
