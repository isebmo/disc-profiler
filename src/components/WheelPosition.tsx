import type { WheelType } from '../lib/scoring';
import type { Dimension } from '../data/questions';
import { profiles } from '../data/profiles';
import { wheelTypeLabels } from '../data/report-content';
import { useI18n } from '../i18n/context';

interface Props {
  wheelType: WheelType;
  wheelPosition: number;
  dominant: Dimension;
  secondary: Dimension | null;
}

const WHEEL_CONFIG: { type: WheelType; angle: number; color: string; dim: Dimension }[] = [
  { type: 'DIRECTIF',    angle: 0,   color: '#EA4335', dim: 'D' },
  { type: 'PROMOUVANT',  angle: 45,  color: '#F09C38', dim: 'D' },
  { type: 'EXPANSIF',    angle: 90,  color: '#FBBC04', dim: 'I' },
  { type: 'FACILITANT',  angle: 135, color: '#92C94A', dim: 'I' },
  { type: 'COOPERATIF',  angle: 180, color: '#34A853', dim: 'S' },
  { type: 'COORDONNANT', angle: 225, color: '#3D96A8', dim: 'S' },
  { type: 'NORMATIF',    angle: 270, color: '#4285F4', dim: 'C' },
  { type: 'ORGANISANT',  angle: 315, color: '#9B59B6', dim: 'C' },
];

export default function WheelPosition({ wheelType, dominant, secondary }: Props) {
  const { locale } = useI18n();
  const dominantProfile = profiles[dominant];
  const label = wheelTypeLabels[wheelType][locale];

  const cx = 150;
  const cy = 150;
  const outerR = 120;
  const innerR = 55;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 300 300" className="w-64 h-64 sm:w-72 sm:h-72">
        {/* Wheel segments */}
        {WHEEL_CONFIG.map((seg, i) => {
          const startAngle = ((seg.angle - 22.5) * Math.PI) / 180;
          const endAngle = ((seg.angle + 22.5) * Math.PI) / 180;
          const isActive = seg.type === wheelType;

          const x1Outer = cx + outerR * Math.cos(startAngle);
          const y1Outer = cy + outerR * Math.sin(startAngle);
          const x2Outer = cx + outerR * Math.cos(endAngle);
          const y2Outer = cy + outerR * Math.sin(endAngle);
          const x1Inner = cx + innerR * Math.cos(endAngle);
          const y1Inner = cy + innerR * Math.sin(endAngle);
          const x2Inner = cx + innerR * Math.cos(startAngle);
          const y2Inner = cy + innerR * Math.sin(startAngle);

          const path = [
            `M ${x1Outer} ${y1Outer}`,
            `A ${outerR} ${outerR} 0 0 1 ${x2Outer} ${y2Outer}`,
            `L ${x1Inner} ${y1Inner}`,
            `A ${innerR} ${innerR} 0 0 0 ${x2Inner} ${y2Inner}`,
            'Z',
          ].join(' ');

          // Label position
          const midAngle = (seg.angle * Math.PI) / 180;
          const labelR = (outerR + innerR) / 2;
          const lx = cx + labelR * Math.cos(midAngle);
          const ly = cy + labelR * Math.sin(midAngle);

          return (
            <g key={i}>
              <path
                d={path}
                fill={seg.color}
                opacity={isActive ? 1 : 0.25}
                stroke="white"
                strokeWidth="2"
              />
              {isActive && (
                <path
                  d={path}
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                />
              )}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight={isActive ? '700' : '500'}
                fill={isActive ? 'white' : '#5F6368'}
                className="font-display"
              >
                {wheelTypeLabels[seg.type][locale]}
              </text>
            </g>
          );
        })}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={innerR - 4} fill="white" className="dark:fill-[#303134]" />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fill="#5F6368"
          className="font-display dark:fill-[#9AA0A6]"
        >
          DISC
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fill="#9AA0A6"
          className="font-display dark:fill-[#5F6368]"
        >
          {dominant}{secondary ? `+${secondary}` : ''}
        </text>
      </svg>

      {/* Type badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-display font-bold text-lg"
        style={{
          background: dominantProfile.colorLight,
          color: dominantProfile.colorDark,
        }}
      >
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: dominantProfile.color }}
        />
        {label}
      </div>
    </div>
  );
}
