// Line-art product illustrations in a single style, standing in for photography.
const INK = '#151515';

function Tart({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const scallops = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return <circle key={i} cx={cx + Math.cos(a) * r * 0.93} cy={cy + Math.sin(a) * r * 0.93} r={r * 0.17} fill="#E6A04F" />;
  });
  return (
    <g>
      {scallops}
      <circle cx={cx} cy={cy} r={r * 0.95} fill="#E6A04F" stroke={INK} strokeWidth="2.2" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="#F8D263" stroke={INK} strokeWidth="1.6" />
      <ellipse cx={cx - r * 0.22} cy={cy - r * 0.18} rx={r * 0.2} ry={r * 0.14} fill="#8A4512" opacity=".85" />
      <ellipse cx={cx + r * 0.28} cy={cy + r * 0.22} rx={r * 0.13} ry={r * 0.1} fill="#8A4512" opacity=".7" />
      <circle cx={cx + r * 0.22} cy={cy - r * 0.3} r={r * 0.07} fill="#8A4512" opacity=".6" />
    </g>
  );
}

function Cup({ fill, top, layers }: { fill: string; top?: string; layers?: string[] }) {
  // Tall takeaway cup with dome lid and straw.
  return (
    <g>
      <path d="M68 10 60 34" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M36 34h48l-6 72a6 6 0 0 1-6 5.5H48a6 6 0 0 1-6-5.5Z" fill={fill} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      {layers?.map((c, i) => (
        <path key={i} d={`M${39 + i * 0.4} ${70 + i * 18}h${42 - i * 0.8}l-${1.4 + i} 18H${41 + i}Z`} fill={c} />
      ))}
      {top && <path d="M38 34h44l-.8 10H38.8Z" fill={top} />}
      <path d="M36 34h48l-6 72a6 6 0 0 1-6 5.5H48a6 6 0 0 1-6-5.5Z" fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M32 34h56a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4H34a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2Z" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <rect x="54" y="62" width="12" height="12" rx="3" fill="#fff" opacity=".55" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

const ART: Record<string, React.ReactNode> = {
  nata: <Tart cx={60} cy={60} r={40} />,
  'box-2': (
    <g>
      <rect x="14" y="34" width="92" height="56" rx="8" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <Tart cx={40} cy={62} r={19} />
      <Tart cx={80} cy={62} r={19} />
      <path d="M14 42h92" stroke={INK} strokeWidth="1.4" opacity=".3" />
    </g>
  ),
  'box-6': (
    <g>
      <rect x="10" y="24" width="100" height="74" rx="8" fill="#fff" stroke={INK} strokeWidth="2.4" />
      {[0, 1, 2].flatMap((c) =>
        [0, 1].map((r) => <Tart key={`${c}${r}`} cx={30 + c * 30} cy={46 + r * 30} r={13} />),
      )}
    </g>
  ),
  bica: (
    <g>
      <ellipse cx="60" cy="92" rx="40" ry="9" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <path d="M34 52h46v18a20 20 0 0 1-20 20h-6a20 20 0 0 1-20-20Z" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <path d="M80 58h4a8 8 0 0 1 0 16h-6" fill="none" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="57" cy="52" rx="23" ry="5" fill="#5A341A" stroke={INK} strokeWidth="2.4" />
      <path d="M50 40c-3-5 3-8 0-14M62 40c-3-5 3-8 0-14" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".5" />
    </g>
  ),
  galao: (
    <g>
      <path d="M40 18h40l-4 92H44Z" fill="#F4E9D8" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M41.4 50h37.2l-1.6 34H43Z" fill="#B9834F" />
      <path d="M41.4 50h37.2" stroke={INK} strokeWidth="1" opacity=".3" />
      <path d="M40 18h40l-4 92H44Z" fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="60" cy="18" rx="20" ry="4" fill="#fff" stroke={INK} strokeWidth="2.4" />
    </g>
  ),
  'chai-cold-brew': <Cup fill="#A8693A" top="#F1E2CC" layers={['#C48A57']} />,
  'matcha-lemonade': <Cup fill="#F7E58A" top="#8DBB5A" layers={[]} />,
  seasonal: (
    <g>
      <Cup fill="#D9733B" top="#F4E3CF" />
      <path d="M86 20c10-2 16 4 14 14-10 2-16-4-14-14Zm0 0 14 14" fill="#E3A23B" stroke={INK} strokeWidth="2" />
    </g>
  ),
  'lisboa-combo': (
    <g transform="translate(0 6)">
      <g transform="translate(46 4) scale(.62)">
        <path d="M34 52h46v18a20 20 0 0 1-20 20h-6a20 20 0 0 1-20-20Z" fill="#fff" stroke={INK} strokeWidth="3.4" />
        <path d="M80 58h4a8 8 0 0 1 0 16h-6" fill="none" stroke={INK} strokeWidth="3.4" />
        <ellipse cx="57" cy="52" rx="23" ry="5" fill="#5A341A" stroke={INK} strokeWidth="3.4" />
      </g>
      <Tart cx={36} cy={72} r={22} />
      <Tart cx={78} cy={84} r={18} />
    </g>
  ),
};

export default function ProductArt({ id, size = 72 }: { id: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true" className="product-art">
      {ART[id] ?? <Tart cx={60} cy={60} r={40} />}
    </svg>
  );
}
