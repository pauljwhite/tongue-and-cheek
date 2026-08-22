import { Icon } from './Icon'
import { kindLabels } from '../lib/terms'
import type { Britishism } from '../types'

export function EntryCard({ entry, onOpen, featured = false }: { entry: Britishism; onOpen: () => void; featured?: boolean }) {
  return (
    <button className={`entry-card glass-card ${featured ? 'entry-card--featured' : ''}`} onClick={onOpen}>
      <span className="entry-card__topline">
        <span className={`kind kind--${entry.kind}`}>{kindLabels[entry.kind]}</span>
        <span className="tone">{entry.tone}</span>
      </span>
      <strong>{entry.term}</strong>
      <span className="respelling">{entry.pronunciation.respelling}</span>
      <span className="entry-card__meaning">{entry.meaning}</span>
      <span className="entry-card__more">Translate it <Icon name="chevron" /></span>
    </button>
  )
}
