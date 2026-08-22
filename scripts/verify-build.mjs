import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const assets = await readdir('dist/assets')
const cssName = assets.find((name) => name.endsWith('.css'))
if (!cssName) throw new Error('Production build contains no CSS asset')

const css = await readFile(join('dist/assets', cssName), 'utf8')
for (const required of ['backdrop-filter:', '-webkit-backdrop-filter:', 'safe-area-inset-bottom', '--glass-a']) {
  if (!css.includes(required)) throw new Error(`Built CSS is missing ${required}`)
}

for (const requiredFile of ['manifest.webmanifest', 'sw.js', 'terms.json', 'apple-touch-icon.png']) {
  await readFile(join('dist', requiredFile))
}

console.log('Production asset checks passed.')
