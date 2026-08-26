import { useEffect, useState } from 'react'
import type { Britishism } from '../types'
import { kindLabels } from '../lib/terms'
import { Icon } from './Icon'

export function EntryDetail({ entry, onClose }: { entry: Britishism; onClose: () => void }) {
  const [shared, setShared] = useState(false)

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])

  const speak = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(entry.term)
    utterance.lang = 'en-GB'
    utterance.rate = 0.82
    window.speechSynthesis.speak(utterance)
  }

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#entry/${entry.id}`
    const text = `${entry.term}: ${entry.meaning}`
    try {
      if (navigator.share) await navigator.share({ title: `${entry.term} — Tongue & Cheek`, text, url })
      else await navigator.clipboard.writeText(`${text} ${url}`)
      setShared(true)
      window.setTimeout(() => setShared(false), 1600)
    } catch {
      // The native share sheet can be deliberately dismissed.
    }
  }

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="detail-panel glass-card" role="dialog" aria-modal="true" aria-labelledby="entry-title">
        <button className="icon-button detail-panel__close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <div className="entry-badges">
          <span className={`kind kind--${entry.kind}`}>{kindLabels[entry.kind]}</span>
          {entry.explicit && <span className="explicit-badge">18+</span>}
        </div>
        <h2 id="entry-title">{entry.term}</h2>
        <div className="pronunciation-line">
          <button className="listen-button" onClick={speak}><Icon name="volume" /> Listen</button>
          <span>{entry.pronunciation.respelling}</span>
          {entry.pronunciation.ipa && <span className="ipa">{entry.pronunciation.ipa}</span>}
        </div>

        <dl className="definition-list">
          <div><dt>What it means</dt><dd>{entry.meaning}</dd></div>
          <div><dt>In American</dt><dd>{entry.americanEquivalent || 'There is no neat one-to-one translation.'}</dd></div>
          <div><dt>In the wild</dt><dd className="example">“{entry.example}”</dd></div>
        </dl>

        <div className="meta-row">
          {entry.regions.map((region) => <span key={region}>{region}</span>)}
          <span>{entry.tone}</span>
        </div>
        <button className="primary-button detail-panel__share" onClick={share}>
          <Icon name={shared ? 'check' : 'share'} /> {shared ? 'Copied' : 'Send to a Yank'}
        </button>
      </article>
    </div>
  )
}
