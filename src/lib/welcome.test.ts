import { beforeEach, describe, expect, it } from 'vitest'
import { hasSeenWelcome, markWelcomeSeen } from './welcome'

describe('welcome state', () => {
  beforeEach(() => localStorage.clear())

  it('shows the welcome to a first-time visitor', () => {
    expect(hasSeenWelcome()).toBe(false)
  })

  it('remembers a completed welcome', () => {
    markWelcomeSeen()
    expect(hasSeenWelcome()).toBe(true)
  })
})
