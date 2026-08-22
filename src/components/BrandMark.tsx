export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <defs>
          <radialGradient id="bubble" cx="30%" cy="18%" r="82%">
            <stop offset="0" stopColor="hsl(var(--accent-h) var(--accent-s) 86%)" />
            <stop offset="0.42" stopColor="hsl(var(--accent-h) var(--accent-s) var(--accent-l))" />
            <stop offset="1" stopColor="hsl(var(--accent-h) var(--accent-s) 42%)" />
          </radialGradient>
        </defs>
        <path fill="url(#bubble)" d="M10 9h44a7 7 0 0 1 7 7v25a7 7 0 0 1-7 7H35L22 58l2-10H10a7 7 0 0 1-7-7V16a7 7 0 0 1 7-7Z" />
        <path d="M17 29c4.5 9 25.5 9 30 0" fill="none" stroke="rgba(20,15,26,.74)" strokeWidth="4" strokeLinecap="round" />
        <path d="M27 35c1 8 10 8 11-1" fill="rgba(255,180,190,.86)" stroke="rgba(20,15,26,.32)" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="20" cy="18" rx="8" ry="4" fill="rgba(255,255,255,.28)" transform="rotate(-16 20 18)" />
      </svg>
    </div>
  )
}
