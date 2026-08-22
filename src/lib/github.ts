import type { Britishism } from '../types'

export interface GitHubSettings {
  owner: string
  repo: string
  branch: string
  token: string
}

const SETTINGS_KEY = 'tongue-cheek-github'

export const defaultGitHubSettings: GitHubSettings = {
  owner: 'pauljwhite',
  repo: 'tongue-and-cheek',
  branch: 'main',
  token: '',
}

export function loadGitHubSettings(): GitHubSettings {
  try {
    return { ...defaultGitHubSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') }
  } catch {
    return defaultGitHubSettings
  }
}

export function storeGitHubSettings(settings: GitHubSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

function decodeBase64(value: string): string {
  const bytes = Uint8Array.from(atob(value.replace(/\n/g, '')), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary)
}

export async function commitEntry(settings: GitHubSettings, entry: Britishism): Promise<void> {
  const path = 'public/terms.json'
  const endpoint = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${path}`
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${settings.token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const currentResponse = await fetch(`${endpoint}?ref=${encodeURIComponent(settings.branch)}`, { headers })
  if (!currentResponse.ok) {
    throw new Error(currentResponse.status === 401 || currentResponse.status === 403
      ? 'GitHub rejected that token. Check its repository access and Contents permission.'
      : `Could not read the word store from GitHub (${currentResponse.status}).`)
  }
  const current = (await currentResponse.json()) as { content: string; sha: string }
  const entries = JSON.parse(decodeBase64(current.content)) as Britishism[]
  if (entries.some((item) => item.id === entry.id || item.term.toLowerCase() === entry.term.toLowerCase())) {
    throw new Error('That term is already in the live word store.')
  }
  entries.push(entry)
  entries.sort((a, b) => a.term.localeCompare(b.term, 'en-GB'))

  const updateResponse = await fetch(endpoint, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Add “${entry.term}”`,
      content: encodeBase64(`${JSON.stringify(entries, null, 2)}\n`),
      sha: current.sha,
      branch: settings.branch,
    }),
  })
  if (!updateResponse.ok) {
    throw new Error(`GitHub could not save the entry (${updateResponse.status}).`)
  }
}
