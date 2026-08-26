const WELCOME_KEY = 'tongue-cheek-welcome-v1'

export function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(WELCOME_KEY) === 'seen'
  } catch {
    return false
  }
}

export function markWelcomeSeen(): void {
  try {
    localStorage.setItem(WELCOME_KEY, 'seen')
  } catch {
    // The welcome can still be dismissed when storage is unavailable.
  }
}
