import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Welcome } from './Welcome'

describe('Welcome', () => {
  it('shows live database counts and the approved copy', () => {
    render(<Welcome totalCount={344} explicitCount={22} includeExplicit={false} onExplicitChange={vi.fn()} onComplete={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: 'Welcome to the proper side of English.' })).toHaveTextContent('344 glorious British terms')
    expect(screen.getByRole('dialog')).toHaveTextContent('22 gloriously rude entries')
    expect(screen.getByText('Come in, the kettle’s on')).toBeInTheDocument()
  })

  it('lets the visitor opt into explicit terms and complete the welcome', () => {
    const onExplicitChange = vi.fn()
    const onComplete = vi.fn()
    render(<Welcome totalCount={344} explicitCount={22} includeExplicit={false} onExplicitChange={onExplicitChange} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('checkbox', { name: /Include explicit terms/i }))
    expect(onExplicitChange).toHaveBeenCalledWith(true)

    fireEvent.click(screen.getByRole('button', { name: 'Right then, let’s have a butcher’s' }))
    expect(onComplete).toHaveBeenCalledOnce()
  })
})
