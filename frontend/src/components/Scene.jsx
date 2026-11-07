import { useId } from 'react'

/**
 * Illustrated ASAL landscape (acacias, dunes, sun). Used as hero background and as
 * the placeholder for any image that has not been uploaded yet – so the site never
 * shows a broken image, and real photos can replace these at any time from /admin.
 */
const PALETTES = {
  dawn: { sky: ['#f7d68f', '#f2b36d', '#e48b52'], sun: '#fff3c9', far: '#d79a63', mid: '#b97a49', near: '#8a5a33', tree: '#3a2917' },
  noon: { sky: ['#a6d4d8', '#dcecd8', '#f6ecc8'], sun: '#fffbe0', far: '#d8bb82', mid: '#c19a5d', near: '#94733f', tree: '#2e3a1d' },
  dusk: { sky: ['#6a4468', '#c8642f', '#f2b45a'], sun: '#ffe2a8', far: '#a2563a', mid: '#7c3f2c', near: '#4e2a20', tree: '#241410' },
  green: { sky: ['#bfe0d0', '#e6f0d2', '#f6ecc8'], sun: '#fffbe0', far: '#a3b872', mid: '#729a47', near: '#3f6b2f', tree: '#1c3a20' },
  water: { sky: ['#aad7e6', '#dcecee', '#f3ebcf'], sun: '#fffbe0', far: '#d6bd8a', mid: '#5aa3b6', near: '#9a7a46', tree: '#2c3a1e' },
}
export const VARIANTS = Object.keys(PALETTES)

export const variantFor = (key = '') => {
  let h = 0
  for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return VARIANTS[h % VARIANTS.length]
}

function Acacia({ x, y, s = 1, color }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <path d="M-3 0 C-2 -30 -4 -50 -16 -72 L-11 -75 C-4 -62 0 -54 2 -46 C4 -58 8 -68 17 -78 L21 -74 C11 -63 6 -52 4 -40 L3 0Z" />
      <ellipse cx="0" cy="-84" rx="48" ry="11" />
      <ellipse cx="-28" cy="-77" rx="28" ry="8" />
      <ellipse cx="30" cy="-79" rx="28" ry="8" />
      <ellipse cx="4" cy="-93" rx="30" ry="6" />
    </g>
  )
}

export default function Scene({ variant = 'dawn', className = '', animated = false, trees = true }) {
  const id = useId().replace(/:/g, '')
  const p = PALETTES[variant] || PALETTES.dawn
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" role="presentation">
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} /><stop offset=".55" stopColor={p.sky[1]} /><stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <radialGradient id={`g${id}`}>
          <stop offset="0" stopColor={p.sun} stopOpacity="1" /><stop offset="1" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill={`url(#s${id})`} />
      <circle cx="570" cy="215" r="190" fill={`url(#g${id})`} opacity=".7" />
      <g className={animated ? 'animate-spinslow' : ''} style={{ transformOrigin: '570px 215px' }} opacity=".35" stroke={p.sun} strokeWidth="6" strokeLinecap="round">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1="570" y1="95" x2="570" y2="62" transform={`rotate(${i * 22.5} 570 215)`} />
        ))}
      </g>
      <circle cx="570" cy="215" r="52" fill={p.sun} />
      <g className={animated ? 'animate-drift' : ''} fill="#fff" opacity=".55">
        <ellipse cx="160" cy="95" rx="60" ry="11" /><ellipse cx="205" cy="86" rx="38" ry="9" />
        <ellipse cx="420" cy="140" rx="48" ry="8" />
      </g>
      <path d="M0 300 C120 255 230 290 340 270 C470 245 600 290 800 255 L800 500 L0 500Z" fill={p.far} />
      <path d="M0 345 C140 305 260 350 400 325 C540 300 660 345 800 315 L800 500 L0 500Z" fill={p.mid} />
      {trees && <>
        <Acacia x={120} y={352} s={0.55} color={p.tree} />
        <Acacia x={690} y={338} s={0.42} color={p.tree} />
      </>}
      <path d="M0 410 C130 380 270 420 420 398 C560 376 690 418 800 392 L800 500 L0 500Z" fill={p.near} />
      {trees && <>
        <Acacia x={265} y={448} s={1.15} color={p.tree} />
        <Acacia x={560} y={462} s={0.8} color={p.tree} />
      </>}
      <g fill="none" stroke={p.tree} strokeOpacity=".18" strokeWidth="2">
        <path d="M30 470 l30 -8 l22 10 M90 485 l26 -6 M640 480 l28 -9 l24 8 M730 470 l22 -6" />
      </g>
    </svg>
  )
}
