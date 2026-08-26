import { Icon } from './Icon'
import { kindLabels } from '../lib/terms'
import type { Britishism } from '../types'

interface EntryCardProps {
  entry: Britishism
  onOpen: () => void
  featured?: boolean
  onRefresh?: () => void
}

function CardContent({ entry, featured }: { entry: Britishism; featured: boolean }) {
  return (
    <>
      {featured && <span className="entry-card__daily-label">Today’s Britishism</span>}
      <span className="entry-card__topline">
        <span className={`kind kind--${entry.kind}`}>{kindLabels[entry.kind]}</span>
        <span className="tone">{entry.tone}</span>
      </span>
      <strong>{entry.term}</strong>
      <span className="respelling">{entry.pronunciation.respelling}</span>
      <span className="entry-card__meaning">{entry.meaning}</span>
      <span className="entry-card__more">Translate it <Icon name="chevron" /></span>
    </>
  )
}

export function EntryCard({ entry, onOpen, featured = false, onRefresh }: EntryCardProps) {
  if (featured) {
    return (
      <article className="entry-card entry-card--featured glass-card">
        <button className="entry-card__body" onClick={onOpen} aria-label={`Open ${entry.term}`}>
          <CardContent entry={entry} featured />
        </button>
        {onRefresh && (
          <button className="daily-refresh" onClick={onRefresh} aria-label="Show me a different Britishism">
            <Icon name="refresh" />
            <span>Another, please</span>
          </button>
        )}
      </article>
    )
  }

  return (
    <button className="entry-card glass-card" onClick={onOpen}>
      <CardContent entry={entry} featured={false} />
    </button>
  )
}
