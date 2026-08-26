# Tongue & Cheek

British slang, proverbs, colloquialisms, and pronunciation—translated for American ears.

## Local development

```bash
npm install
npm run dev
```

Run `npm test`, `npm run lint`, and `npm run build` before publishing.

The test command validates every entry's required fields, URL-safe ID, type, pronunciation, regions, tags, daily eligibility, and optional explicit-content marker. It also blocks duplicate IDs and terms.

## Adding entries

The in-app editor writes to `public/terms.json` through GitHub's Contents API. Create a fine-grained personal access token scoped only to this repository with **Contents: Read and write**, then enter it in **Add → GitHub editor**. The token stays in that browser's local storage and is never included in the published app.

Every saved term becomes a Git commit and triggers the GitHub Pages deployment workflow.

## Editorial approach and sources

The store uses concise original definitions written for an American reader. Regional expressions are labelled rather than presented as universal, and pronunciations use friendly respellings alongside IPA where useful. Slang is living language: meaning, tone, and offensiveness can change, so entries should be reviewed over time.

The expansion was cross-checked against:

- [Cambridge Dictionary's guide to British slang](https://dictionary.cambridge.org/grammar/british-grammar/slang)
- Cambridge Dictionary definitions for [bellend](https://dictionary.cambridge.org/dictionary/english/bellend), [twat](https://dictionary.cambridge.org/dictionary/english/twat), [minge](https://dictionary.cambridge.org/dictionary/english/minge), [arse](https://dictionary.cambridge.org/dictionary/english/arse), [scrubber](https://dictionary.cambridge.org/dictionary/english/scrubber), and [bloody hell](https://dictionary.cambridge.org/dictionary/english/bloody-hell)
- Collins Dictionary definitions for [knobhead](https://www.collinsdictionary.com/dictionary/english/knobhead) and [baps](https://www.collinsdictionary.com/dictionary/english/baps)
- [British Council's starter guide to UK slang](https://www.britishcouncil.org/voices-magazine/youre-having-giraffe-starter-guide-uk-slang) and [idioms collection](https://learnenglish.britishcouncil.org/learning-hub/topics/idioms-expressions)
- [Dictionaries of the Scots Language](https://dsl.ac.uk/our-publications/scots-english/)
- [Newcastle University's Geordie guide](https://belong.ncl.ac.uk/blog/geordie-dictionary-guide)
- [Ulster-Scots Agency dictionary](https://www.ulsterscotsagency.com/weans/activities/dictionary/index.html)
- [Museum Wales language resources](https://museum.wales/blog/1222/English-in-Wales/)
- [London Museum's guide to Cockneys and rhyming slang](https://www.londonmuseum.org.uk/collections/london-stories/cockneys/)
- [The Open University's explanation of Cockney rhyming slang](https://www.open.edu/openlearn/mod/oucontent/view.php?id=48215&section=3.2.1)
- [British Council pronunciation practice](https://premierskillsenglish.britishcouncil.org/sites/default/files/learning/4701/downloads/perfectpronunciation-consonantsounds-worksheet.pdf) and [Jason Anderson's place-name guide](https://www.jasonanderson.org.uk/downloads/how-to-pronounce-english-place-names.pdf)

## iPhone Home Screen

1. Open the live site in Safari.
2. Tap Safari's Share button.
3. Choose **Add to Home Screen**.
4. Tap **Add**.

The manifest and service worker provide a standalone, installable experience with offline access to previously loaded content.
