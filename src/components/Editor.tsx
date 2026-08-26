import { useMemo, useState } from 'react'
import { commitEntry, loadGitHubSettings, storeGitHubSettings, type GitHubSettings } from '../lib/github'
import { slugify, validateEntry } from '../lib/terms'
import type { Britishism, EntryKind } from '../types'
import { Icon } from './Icon'

const blank = (): Britishism => ({
  id: '',
  term: '',
  kind: 'slang',
  meaning: '',
  americanEquivalent: '',
  example: '',
  pronunciation: { ipa: '', respelling: '' },
  regions: ['UK-wide'],
  tone: 'informal',
  tags: [],
  dailyEligible: true,
  explicit: false,
})

export function Editor({ entries, onSaved }: { entries: Britishism[]; onSaved: (entry: Britishism) => void }) {
  const [settings, setSettings] = useState<GitHubSettings>(loadGitHubSettings)
  const [entry, setEntry] = useState<Britishism>(blank)
  const [showConnection, setShowConnection] = useState(!settings.token)
  const [status, setStatus] = useState<{ type: 'idle' | 'saving' | 'success' | 'error'; message?: string }>({ type: 'idle' })
  const errors = useMemo(() => validateEntry({ ...entry, id: slugify(entry.term) }, entries), [entry, entries])

  const update = <K extends keyof Britishism>(key: K, value: Britishism[K]) => setEntry((current) => ({ ...current, [key]: value }))

  const saveConnection = () => {
    storeGitHubSettings(settings)
    setShowConnection(false)
  }

  const save = async () => {
    const complete = { ...entry, id: slugify(entry.term) }
    const validation = validateEntry(complete, entries)
    if (validation.length) {
      setStatus({ type: 'error', message: validation[0] })
      return
    }
    if (!settings.token) {
      setShowConnection(true)
      setStatus({ type: 'error', message: 'Connect GitHub before saving.' })
      return
    }
    setStatus({ type: 'saving' })
    try {
      storeGitHubSettings(settings)
      await commitEntry(settings, complete)
      onSaved(complete)
      setEntry(blank())
      setStatus({ type: 'success', message: `“${complete.term}” was committed. The live site will update after GitHub Pages rebuilds.` })
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Something went wrong.' })
    }
  }

  return (
    <section className="editor-layout">
      <div className="section-intro">
        <p className="eyebrow">Your word store</p>
        <h1>Add a Britishism</h1>
        <p>Write it once here. GitHub keeps the history and publishes it for everyone.</p>
      </div>

      <div className="editor-card glass-card">
        <button className="connection-toggle" onClick={() => setShowConnection(!showConnection)}>
          <span><Icon name="lock" /> GitHub editor</span>
          <span className={settings.token ? 'connection-state is-connected' : 'connection-state'}>{settings.token ? 'Connected' : 'Connect'}</span>
        </button>

        {showConnection && (
          <div className="connection-panel">
            <p>A fine-grained token stays only in this browser. Give it access to this repository with <strong>Contents: Read and write</strong>.</p>
            <div className="form-grid form-grid--connection">
              <label>Owner<input value={settings.owner} onChange={(event) => setSettings({ ...settings, owner: event.target.value })} /></label>
              <label>Repository<input value={settings.repo} onChange={(event) => setSettings({ ...settings, repo: event.target.value })} /></label>
              <label>Branch<input value={settings.branch} onChange={(event) => setSettings({ ...settings, branch: event.target.value })} /></label>
              <label className="form-span">Fine-grained token<input type="password" autoComplete="off" placeholder="github_pat_…" value={settings.token} onChange={(event) => setSettings({ ...settings, token: event.target.value })} /></label>
            </div>
            <div className="connection-actions">
              <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">Create token <Icon name="external" /></a>
              <button className="secondary-button" onClick={saveConnection}>Save connection</button>
            </div>
          </div>
        )}

        <div className="form-grid">
          <label className="form-span">Term or phrase<input value={entry.term} onChange={(event) => update('term', event.target.value)} placeholder="e.g. Spend a penny" /></label>
          <label>Type<select value={entry.kind} onChange={(event) => update('kind', event.target.value as EntryKind)}><option value="slang">Slang</option><option value="proverb">Proverb</option><option value="colloquialism">Saying</option><option value="pronunciation">Pronunciation</option></select></label>
          <label>Tone<input value={entry.tone} onChange={(event) => update('tone', event.target.value)} placeholder="informal" /></label>
          <label className="form-span">Plain-English meaning<textarea value={entry.meaning} onChange={(event) => update('meaning', event.target.value)} placeholder="What does it actually mean?" /></label>
          <label className="form-span">American equivalent<input value={entry.americanEquivalent} onChange={(event) => update('americanEquivalent', event.target.value)} placeholder="Closest American translation" /></label>
          <label className="form-span">Example in the wild<textarea value={entry.example} onChange={(event) => update('example', event.target.value)} placeholder="Use it in a natural sentence" /></label>
          <label>Friendly pronunciation<input value={entry.pronunciation.respelling} onChange={(event) => update('pronunciation', { ...entry.pronunciation, respelling: event.target.value })} placeholder="SPEN-duh-PEN-ee" /></label>
          <label>IPA (optional)<input value={entry.pronunciation.ipa} onChange={(event) => update('pronunciation', { ...entry.pronunciation, ipa: event.target.value })} placeholder="/ˌspend ə ˈpen.i/" /></label>
          <label>Region<input value={entry.regions.join(', ')} onChange={(event) => update('regions', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} placeholder="UK-wide" /></label>
          <label>Tags<input value={entry.tags.join(', ')} onChange={(event) => update('tags', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} placeholder="money, euphemism" /></label>
          <label className="check-label form-span"><input type="checkbox" checked={entry.dailyEligible} onChange={(event) => update('dailyEligible', event.target.checked)} /> Include in Today’s Britishism</label>
          <label className="check-label form-span"><input type="checkbox" checked={entry.explicit ?? false} onChange={(event) => update('explicit', event.target.checked)} /> Mark as 18+ explicit</label>
        </div>

        {status.message && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}
        <button className="primary-button editor-save" disabled={status.type === 'saving' || (!entry.term && errors.length > 0)} onClick={save}>
          <Icon name={status.type === 'success' ? 'check' : 'plus'} /> {status.type === 'saving' ? 'Committing…' : 'Add to word store'}
        </button>
      </div>
    </section>
  )
}
