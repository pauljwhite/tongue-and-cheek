export type EntryKind = 'slang' | 'proverb' | 'colloquialism' | 'pronunciation'

export interface Britishism {
  id: string
  term: string
  kind: EntryKind
  meaning: string
  americanEquivalent: string
  example: string
  pronunciation: {
    ipa: string
    respelling: string
  }
  regions: string[]
  tone: string
  tags: string[]
  dailyEligible: boolean
  explicit?: boolean
}

export type AppSection = 'today' | 'browse' | 'add'
