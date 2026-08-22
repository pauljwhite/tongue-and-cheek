# Tongue & Cheek

British slang, proverbs, colloquialisms, and pronunciation—translated for American ears.

## Local development

```bash
npm install
npm run dev
```

Run `npm test`, `npm run lint`, and `npm run build` before publishing.

## Adding entries

The in-app editor writes to `public/terms.json` through GitHub's Contents API. Create a fine-grained personal access token scoped only to this repository with **Contents: Read and write**, then enter it in **Add → GitHub editor**. The token stays in that browser's local storage and is never included in the published app.

Every saved term becomes a Git commit and triggers the GitHub Pages deployment workflow.

## iPhone Home Screen

1. Open the live site in Safari.
2. Tap Safari's Share button.
3. Choose **Add to Home Screen**.
4. Tap **Add**.

The manifest and service worker provide a standalone, installable experience with offline access to previously loaded content.
