import type { Dimension } from '../data/questions';
import { profiles } from '../data/profiles';

interface Props {
  items: string[];
  dominant: Dimension;
  icon?: 'star' | 'heart' | 'arrow' | 'leaf' | 'check';
}

const icons: Record<string, string> = {
  star: '\u2605',
  heart: '\u2665',
  arrow: '\u279C',
  leaf: '\u2618',
  check: '\u2713',
};

export default function TalentsList({ items, dominant, icon = 'star' }: Props) {
  const p = profiles[dominant];
  const iconChar = icons[icon];

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-[#3C4043] dark:text-[#BDC1C6]"
        >
          <span
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5"
            style={{ background: p.colorLight, color: p.colorDark }}
          >
            {iconChar}
          </span>
          <span className="text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
