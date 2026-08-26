import { readFile } from 'node:fs/promises'

const entries = JSON.parse(await readFile('public/terms.json', 'utf8'))
const kinds = new Set(['slang', 'proverb', 'colloquialism', 'pronunciation'])
const ids = new Set()
const terms = new Set()
const requiredText = ['id', 'term', 'meaning', 'americanEquivalent', 'example', 'tone']
const errors = []

if (!Array.isArray(entries)) errors.push('The word store must be a JSON array.')

for (const [index, entry] of entries.entries()) {
  const label = entry?.id || entry?.term || `entry ${index + 1}`

  for (const key of requiredText) {
    if (typeof entry?.[key] !== 'string' || !entry[key].trim()) errors.push(`${label}: ${key} is required.`)
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry?.id ?? '')) errors.push(`${label}: id must be a lowercase URL-safe slug.`)
  if (ids.has(entry?.id)) errors.push(`${label}: duplicate id.`)
  ids.add(entry?.id)

  const normalisedTerm = entry?.term?.trim().toLocaleLowerCase('en-GB')
  if (terms.has(normalisedTerm)) errors.push(`${label}: duplicate term.`)
  terms.add(normalisedTerm)

  if (!kinds.has(entry?.kind)) errors.push(`${label}: unknown kind “${entry?.kind}”.`)
  if (typeof entry?.pronunciation?.respelling !== 'string' || !entry.pronunciation.respelling.trim()) errors.push(`${label}: pronunciation respelling is required.`)
  if (typeof entry?.pronunciation?.ipa !== 'string') errors.push(`${label}: pronunciation.ipa must be a string, even when empty.`)
  if (!Array.isArray(entry?.regions) || entry.regions.length === 0) errors.push(`${label}: include at least one region.`)
  if (!Array.isArray(entry?.tags) || entry.tags.length === 0) errors.push(`${label}: include at least one search tag.`)
  if (typeof entry?.dailyEligible !== 'boolean') errors.push(`${label}: dailyEligible must be true or false.`)
  if (entry?.explicit !== undefined && typeof entry.explicit !== 'boolean') errors.push(`${label}: explicit must be true or false when supplied.`)
}

if (errors.length) {
  console.error(`Word-store validation failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

console.log(`Word-store validation passed: ${entries.length} unique entries.`)
