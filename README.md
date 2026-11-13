# Word Bots

A reading, spelling and maths battle game for young children (UK Year 3). Battle a robot: right answers zap it, wrong answers cost you a heart. Built as an offline Progressive Web App for an Android tablet.

See [docs/PLAN.md](docs/PLAN.md) for the plan.

## Play

- Hosted on GitHub Pages (deployed by `.github/workflows/deploy.yml` on every push to `main`).
- On Android, open it in Chrome and choose **Add to Home screen**. After the first visit it works offline.

## Develop

```sh
npm install
npm run dev      # local dev server
npm test         # content + game logic tests
npm run build    # production build in dist/
```

Regenerate the PNG icons after changing the icon design: `node scripts/make-icons.mjs`.

## Content

- Spelling words: [src/content/words.ts](src/content/words.ts), from the statutory Years 3 and 4 word list (National Curriculum in England).
- Facts: [src/content/facts.ts](src/content/facts.ts). Each fact has a `source` URL from a trusted site.
- Sums are generated and checked by code ([src/game/sums.ts](src/game/sums.ts)).
- British English throughout. The tests check for common American spellings, missing or untrusted sources, and spelling clues that give the answer away.

Progress (robots beaten, missed questions, optional name) is stored only on the device.
