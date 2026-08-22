import { BrandMark } from './BrandMark'
import { Icon } from './Icon'

export function InstallGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="install-panel glass-card" role="dialog" aria-modal="true" aria-labelledby="install-title">
        <button className="icon-button install-panel__close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <BrandMark />
        <p className="eyebrow">Keep Britain handy</p>
        <h2 id="install-title">Add to your iPhone</h2>
        <p className="install-intro">Tongue & Cheek works like an app from your Home Screen—without the App Store.</p>
        <ol className="install-steps">
          <li><span>1</span><div><strong>Open this page in Safari</strong><p>Apple only offers Add to Home Screen from Safari.</p></div></li>
          <li><span>2</span><div><strong>Tap the Share button</strong><p>It’s the square with an upward arrow in Safari’s toolbar.</p></div></li>
          <li><span>3</span><div><strong>Choose Add to Home Screen</strong><p>Scroll down the share sheet if it isn’t immediately visible.</p></div></li>
          <li><span>4</span><div><strong>Tap Add</strong><p>The Tongue & Cheek icon will appear on your Home Screen.</p></div></li>
        </ol>
        <button className="primary-button" onClick={onClose}><Icon name="check" /> Got it</button>
      </section>
    </div>
  )
}
