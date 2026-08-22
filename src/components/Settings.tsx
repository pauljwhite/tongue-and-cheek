import type { AccentChoice, Preferences, ThemeChoice } from '../lib/preferences'
import { accents, hexToAccent } from '../lib/preferences'
import { Icon } from './Icon'

export function Settings({ preferences, onChange, onClose, onInstall }: {
  preferences: Preferences
  onChange: (value: Preferences) => void
  onClose: () => void
  onInstall: () => void
}) {
  const setTheme = (theme: ThemeChoice) => onChange({ ...preferences, theme })
  const setAccent = (accent: AccentChoice) => onChange({ ...preferences, accent })

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="settings-panel glass-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="panel-heading">
          <div><p className="eyebrow">Make it yours</p><h2 id="settings-title">Appearance</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>

        <fieldset>
          <legend>Theme</legend>
          <div className="segmented">
            {(['system', 'dark', 'light'] as ThemeChoice[]).map((theme) => (
              <button key={theme} className={preferences.theme === theme ? 'is-active' : ''} onClick={() => setTheme(theme)}>{theme}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Accent colour</legend>
          <div className="swatches">
            {accents.map((accent) => (
              <button
                key={accent.name}
                className={`swatch ${preferences.accent.name === accent.name ? 'is-active' : ''}`}
                style={{ '--swatch': `hsl(${accent.h} ${accent.s}% ${accent.l}%)` } as React.CSSProperties}
                onClick={() => setAccent(accent)}
                aria-label={accent.name}
                title={accent.name}
              />
            ))}
            <label className={`swatch swatch--custom ${preferences.accent.name === 'Custom' ? 'is-active' : ''}`} title="Custom colour">
              <input type="color" value={preferences.accent.hex ?? '#eb708f'} onChange={(event) => setAccent(hexToAccent(event.target.value))} aria-label="Custom accent colour" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <div className="range-label"><legend>Glass effect</legend><span>{preferences.glass}%</span></div>
          <input type="range" min="0" max="100" value={preferences.glass} onChange={(event) => onChange({ ...preferences, glass: Number(event.target.value) })} />
          <div className="range-ends"><span>Solid</span><span>Glassiest</span></div>
        </fieldset>

        <button className="secondary-button settings-panel__install" onClick={onInstall}><Icon name="phone" /> Add to iPhone Home Screen</button>
      </section>
    </div>
  )
}
