import { describe, expect, it } from 'vitest'
import type { Britishism } from '../types'
import { dailyEntry, filterExplicitEntries, filterExplicitOnlyEntries, refreshedDailyEntry, searchEntries, slugify, validateEntry } from './terms'

const entry = (id: string, term = id): Britishism => ({
  id, term, kind: 'slang', meaning: `Meaning of ${term}`, americanEquivalent: 'Equivalent', example: 'Example',
  pronunciation: { ipa: '', respelling: term }, regions: ['UK-wide'], tone: 'informal', tags: ['tag'], dailyEligible: true,
})

describe('dailyEntry', () => {
  it('is stable for the same local date', () => {
    const entries = [entry('a'), entry('b'), entry('c')]
    expect(dailyEntry(entries, new Date('2026-08-22T01:00:00'))).toEqual(dailyEntry(entries, new Date('2026-08-22T23:00:00')))
  })

  it('skips entries excluded from the rotation', () => {
    const excluded = { ...entry('excluded'), dailyEligible: false }
    expect(dailyEntry([excluded], new Date())).toBeUndefined()
  })

  it('refreshes to another eligible entry without immediately repeating', () => {
    const entries = [entry('a'), entry('b'), entry('c')]
    expect(refreshedDailyEntry(entries, 'a', () => 0)?.id).toBe('b')
  })

  it('falls back safely when only one entry is eligible', () => {
    expect(refreshedDailyEntry([entry('only')], 'only')?.id).toBe('only')
  })
})

describe('searchEntries', () => {
  it('searches American equivalents and tags', () => {
    const entries = [{ ...entry('knackered'), americanEquivalent: 'Exhausted' }, entry('chuffed')]
    expect(searchEntries(entries, 'exhausted', 'all').map(({ id }) => id)).toEqual(['knackered'])
  })
})

describe('explicit content filter', () => {
  const clean = entry('clean')
  const explicit = { ...entry('explicit'), explicit: true }

  it('hides explicit terms by default', () => expect(filterExplicitEntries([clean, explicit], false)).toEqual([clean]))
  it('includes explicit terms when enabled', () => expect(filterExplicitEntries([clean, explicit], true)).toEqual([clean, explicit]))
  it('can narrow an enabled collection to explicit terms only', () => expect(filterExplicitOnlyEntries([clean, explicit], true)).toEqual([explicit]))
})

describe('editor helpers', () => {
  it('creates repository-safe slugs', () => expect(slugify('Bob’s Your Uncle!')).toBe('bobs-your-uncle'))
  it('catches duplicates', () => expect(validateEntry(entry('bob', 'Bob'), [entry('existing', 'Bob')])).toContain('That term is already in the word store.'))
})
