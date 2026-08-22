import { useEffect, useMemo, useState } from 'react'
import { BrandMark } from './components/BrandMark'
import { Editor } from './components/Editor'
import { EntryCard } from './components/EntryCard'
import { EntryDetail } from './components/EntryDetail'
import { Icon } from './components/Icon'
import { InstallGuide } from './components/InstallGuide'
import { Settings } from './components/Settings'
import { applyPreferences, loadPreferences, type Preferences } from './lib/preferences'
import { dailyEntry, kindLabels, refreshedDailyEntry, searchEntries } from './lib/terms'
import type { AppSection, Britishism, EntryKind } from './types'
import './styles.css'

const navItems: { section: AppSection; label: string; icon: 'calendar' | 'book' | 'plus' }[] = [
  { section: 'today', label: 'Today', icon: 'calendar' },
  { section: 'browse', label: 'Browse', icon: 'book' },
  { section: 'add', label: 'Add', icon: 'plus' },
]

const RESULTS_PAGE_SIZE = 48

function App() {
  const [entries, setEntries] = useState<Britishism[]>([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState<AppSection>('today')
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<EntryKind | 'all'>('all')
  const [selected, setSelected] = useState<Britishism>()
  const [showSettings, setShowSettings] = useState(false)
  const [showInstall, setShowInstall] = useState(false)
  const [visibleCount, setVisibleCount] = useState(RESULTS_PAGE_SIZE)
  const [refreshedToday, setRefreshedToday] = useState<Britishism>()
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences)
  const scheduledToday = useMemo(() => dailyEntry(entries), [entries])
  const today = refreshedToday ?? scheduledToday
  const results = useMemo(() => searchEntries(entries, query, kind), [entries, query, kind])
  const visibleResults = results.slice(0, visibleCount)

  useEffect(() => {
    applyPreferences(preferences)
  }, [preferences])

  useEffect(() => {
    const listener = () => applyPreferences(preferences)
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [preferences])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}terms.json`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load the word store.')
        return response.json() as Promise<Britishism[]>
      })
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const openFromHash = () => {
      const match = window.location.hash.match(/^#entry\/(.+)$/)
      setSelected(match ? entries.find((entry) => entry.id === decodeURIComponent(match[1])) : undefined)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [entries])

  const openEntry = (entry: Britishism) => {
    setSelected(entry)
    window.history.pushState(null, '', `#entry/${entry.id}`)
  }

  const closeEntry = () => {
    setSelected(undefined)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }

  const switchSection = (next: AppSection) => {
    setSection(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true"><span /><span /><span /></div>
      <header className="topbar">
        <div className="topbar__inner">
          <button className="brand" onClick={() => switchSection('today')} aria-label="Tongue and Cheek home">
            <BrandMark compact />
            <span><strong>Tongue <i>&amp;</i> Cheek</strong><small>British, translated.</small></span>
          </button>
          <nav className="desktop-nav" aria-label="Primary">
            {navItems.map((item) => <button key={item.section} className={section === item.section ? 'is-active' : ''} onClick={() => switchSection(item.section)}><Icon name={item.icon} />{item.label}</button>)}
          </nav>
          <button className="icon-button topbar__settings" onClick={() => setShowSettings(true)} aria-label="Appearance settings"><Icon name="settings" /></button>
        </div>
      </header>

      <main>
        {section === 'today' && (
          <section className="today-layout">
            <div className="hero-copy">
              <p className="eyebrow">Today’s Britishism</p>
              <h1>A little less<br /><span>lost in translation.</span></h1>
              <p>One gloriously British expression a day, decoded for American ears.</p>
            </div>
            {loading ? <div className="entry-card entry-card--featured glass-card skeleton" aria-label="Loading today’s term" /> : today && <div className="featured-entry" aria-live="polite"><EntryCard key={today.id} entry={today} onOpen={() => openEntry(today)} featured /><button className="daily-refresh glass-card" onClick={() => setRefreshedToday(refreshedDailyEntry(entries, today.id))}><Icon name="refresh" /><span><strong>Another, please</strong><small>Show me a different Britishism</small></span></button></div>}

            <div className="quick-actions">
              <button className="glass-card" onClick={() => switchSection('browse')}><span className="action-orb"><Icon name="search" /></span><span><strong>Find a Britishism</strong><small>Search all {entries.length} translations</small></span><Icon name="chevron" /></button>
              {!isStandalone && <button className="glass-card" onClick={() => setShowInstall(true)}><span className="action-orb action-orb--phone"><Icon name="phone" /></span><span><strong>Keep it on your iPhone</strong><small>Add it to your Home Screen</small></span><Icon name="chevron" /></button>}
            </div>

            <section className="taste-section">
              <div className="section-heading"><div><p className="eyebrow">More splendid nonsense</p><h2>Worth knowing</h2></div><button onClick={() => switchSection('browse')}>See all <Icon name="chevron" /></button></div>
              <div className="entry-grid entry-grid--preview">
                {entries.filter((entry) => entry.id !== today?.id).slice(0, 6).map((entry) => <EntryCard key={entry.id} entry={entry} onOpen={() => openEntry(entry)} />)}
              </div>
            </section>
          </section>
        )}

        {section === 'browse' && (
          <section className="browse-layout">
            <div className="section-intro"><p className="eyebrow">The whole caboodle</p><h1>British, from A to Zed.</h1><p>Search by phrase, meaning, American equivalent, region, or general level of cheek.</p></div>
            <div className="search-panel glass-card">
              <label className="search-box"><Icon name="search" /><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(RESULTS_PAGE_SIZE) }} placeholder="Try ‘exhausted’ or ‘dodgy’" aria-label="Search Britishisms" />{query && <button onClick={() => { setQuery(''); setVisibleCount(RESULTS_PAGE_SIZE) }} aria-label="Clear search"><Icon name="close" /></button>}</label>
              <div className="filter-row" aria-label="Filter by type">
                <button className={kind === 'all' ? 'is-active' : ''} onClick={() => { setKind('all'); setVisibleCount(RESULTS_PAGE_SIZE) }}>Everything</button>
                {(Object.keys(kindLabels) as EntryKind[]).map((key) => <button key={key} className={kind === key ? 'is-active' : ''} onClick={() => { setKind(key); setVisibleCount(RESULTS_PAGE_SIZE) }}>{kindLabels[key]}</button>)}
              </div>
            </div>
            <div className="results-heading"><strong>{results.length}</strong> {results.length === 1 ? 'translation' : 'translations'}</div>
            {results.length ? <><div className="entry-grid">{visibleResults.map((entry) => <EntryCard key={entry.id} entry={entry} onOpen={() => openEntry(entry)} />)}</div>{visibleCount < results.length && <div className="load-more"><button className="secondary-button" onClick={() => setVisibleCount((count) => count + RESULTS_PAGE_SIZE)}>Show 48 more <span>{results.length - visibleCount} left</span></button></div>}</> : <div className="empty-state glass-card"><BrandMark /><h2>Not a sausage.</h2><p>Nothing matched that search. Try another word—or add the phrase yourself.</p><button className="primary-button" onClick={() => switchSection('add')}><Icon name="plus" /> Add it</button></div>}
          </section>
        )}

        {section === 'add' && <Editor entries={entries} onSaved={(entry) => setEntries((current) => [...current, entry])} />}
      </main>

      <footer><BrandMark compact /><p><strong>Tongue &amp; Cheek</strong><span>Made in Britain. Decoded everywhere.</span></p><button onClick={() => setShowInstall(true)}>iPhone install guide</button></footer>

      <nav className="mobile-nav" aria-label="Primary">
        {navItems.map((item) => <button key={item.section} className={section === item.section ? 'is-active' : ''} onClick={() => switchSection(item.section)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
        <button onClick={() => setShowSettings(true)}><Icon name="settings" /><span>More</span></button>
      </nav>

      {selected && <EntryDetail entry={selected} onClose={closeEntry} />}
      {showSettings && <Settings preferences={preferences} onChange={setPreferences} onClose={() => setShowSettings(false)} onInstall={() => { setShowSettings(false); setShowInstall(true) }} />}
      {showInstall && <InstallGuide onClose={() => setShowInstall(false)} />}
    </div>
  )
}

export default App
