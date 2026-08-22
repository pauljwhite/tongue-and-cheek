import { describe, expect, it } from 'vitest'
import { glassValues, hexToAccent } from './preferences'

describe('glass preferences', () => {
  it('makes the right-hand end clearer and less blurred', () => {
    expect(glassValues(0)).toEqual({ alpha: 0.72, blur: 30 })
    expect(glassValues(100).alpha).toBeCloseTo(0.04)
    expect(glassValues(100).blur).toBe(6)
  })

  it('converts custom colours into the shared HSL system', () => {
    expect(hexToAccent('#ff0000')).toMatchObject({ name: 'Custom', h: 0, s: 100, l: 50 })
  })
})
