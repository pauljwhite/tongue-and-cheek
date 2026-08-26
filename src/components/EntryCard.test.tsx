import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EntryCard } from './EntryCard'
import type { Britishism } from '../types'

const entry: Britishism = {
  id: 'test-britishism',
  term: 'Test Britishism',
  kind: 'slang',
  meaning: 'A term used to test the featured card.',
  americanEquivalent: 'Test term',
  example: 'That is a test Britishism.',
  pronunciation: { ipa: '', respelling: 'TEST-BRIT-ish-um' },
  regions: ['UK-wide'],
  tone: 'informal',
  tags: ['test'],
  dailyEligible: true,
}

describe('featured EntryCard', () => {
  it('keeps the refresh action inside the daily card without opening its details', () => {
    const onOpen = vi.fn()
    const onRefresh = vi.fn()

    render(<EntryCard entry={entry} onOpen={onOpen} onRefresh={onRefresh} featured />)

    const refresh = screen.getByRole('button', { name: 'Show me a different Britishism' })
    expect(refresh.closest('.entry-card--featured')).not.toBeNull()

    fireEvent.click(refresh)
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(onOpen).not.toHaveBeenCalled()
  })
})
