import { useEffect, useRef } from 'react'
import { BrandMark } from './BrandMark'

export function Welcome({ totalCount, explicitCount, includeExplicit, onExplicitChange, onComplete }: {
  totalCount: number
  explicitCount: number
  includeExplicit: boolean
  onExplicitChange: (value: boolean) => void
  onComplete: () => void
}) {
  const continueButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    continueButton.current?.focus()
  }, [])

  return (
    <div className="modal-layer welcome-layer" role="presentation">
      <section className="welcome-panel glass-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-intro">
        <div className="welcome-panel__mark"><BrandMark /></div>
        <p className="eyebrow">Come in, the kettle’s on</p>
        <h2 id="welcome-title">Welcome to the proper side of English.</h2>
        <div className="welcome-copy">
          <p id="welcome-intro">You’ve stumbled into <strong>{totalCount}</strong> glorious British terms, sayings and linguistic oddities, all lovingly translated for American ears.</p>
          <p>Have a butcher’s, learn a belter, and finally work out whether being called a muppet was affectionate.</p>
        </div>

        <div className="welcome-explicit">
          <div className="welcome-explicit__heading"><span className="explicit-badge">18+</span><strong>Mind the naughty bits</strong></div>
          <p>We’ve also tucked away <strong>{explicitCount}</strong> gloriously rude entries for grown-ups who don’t clutch their pearls at the word “bollocks.”</p>
          <label className="settings-toggle welcome-toggle">
            <span><strong>18+ Include explicit terms</strong><small>Show strong language and adult slang</small></span>
            <input type="checkbox" checked={includeExplicit} onChange={(event) => onExplicitChange(event.target.checked)} />
            <span className="toggle-track" aria-hidden="true"><span /></span>
          </label>
          <small className="welcome-explicit__helper">Feeling brave? Switch them on. You can turn them off again any time in Settings. We won’t tell your mum.</small>
        </div>

        <button ref={continueButton} className="primary-button welcome-panel__continue" onClick={onComplete}>Right then, let’s have a butcher’s</button>
      </section>
    </div>
  )
}
