import type { Britishism, EntryKind } from '../types'

export const kindLabels: Record<EntryKind, string> = {
  slang: 'Slang',
  proverb: 'Proverbs',
  colloquialism: 'Sayings',
  pronunciation: 'Pronunciation',
}

export function dayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
}

export function dailyEntry(entries: Britishism[], date = new Date()): Britishism | undefined {
  const eligible = entries.filter((entry) => entry.dailyEligible)
  if (!eligible.length) return undefined
  return eligible[dayNumber(date) % eligible.length]
}

export function searchEntries(entries: Britishism[], query: string, kind: EntryKind | 'all'): Britishism[] {
  const needle = query.trim().toLocaleLowerCase('en-GB')
  return entries
    .filter((entry) => kind === 'all' || entry.kind === kind)
    .filter((entry) => {
      if (!needle) return true
      const haystack = [
        entry.term,
        entry.meaning,
        entry.americanEquivalent,
        entry.example,
        entry.tone,
        ...entry.regions,
        ...entry.tags,
      ]
        .join(' ')
        .toLocaleLowerCase('en-GB')
      return haystack.includes(needle)
    })
    .sort((a, b) => a.term.localeCompare(b.term, 'en-GB'))
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function validateEntry(entry: Britishism, existing: Britishism[]): string[] {
  const errors: string[] = []
  if (!entry.term.trim()) errors.push('Add a term or phrase.')
  if (!entry.meaning.trim()) errors.push('Add a plain-English meaning.')
  if (!entry.example.trim()) errors.push('Add an example in context.')
  if (!entry.pronunciation.respelling.trim()) errors.push('Add the friendly phonetic spelling.')
  if (existing.some((item) => item.id === entry.id || item.term.toLowerCase() === entry.term.toLowerCase())) {
    errors.push('That term is already in the word store.')
  }
  return errors
}
