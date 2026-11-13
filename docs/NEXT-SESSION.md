# Notes for the next session

Last updated: 2026-11-13.

## Where things are
- **v1 is live:** https://robhumphries5.github.io/word-bots/ (public repo `robhumphries5/word-bots`, branch `main`).
- **Deploys:** every push to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages.
- **Commit email:** commits use the GitHub no-reply email, set in this repo's local git config, so the public history doesn't show a personal address.
- **Toolchain:** pinned to Vite 7 / Vitest 3 / TypeScript 5. Vitest 5 failed here with "Cannot read properties of undefined (reading 'config')". `npm audit` warnings are in dev/test dependencies only.
- **Plan:** see [PLAN.md](PLAN.md). Project rules are in `CLAUDE.md`.

## Open requests (GitHub issues)
1. [#1 Option to clear saved data](https://github.com/robhumphries5/word-bots/issues/1): a parent reset with confirmation.
2. [#2 Questions feel like they come in the same order](https://github.com/robhumphries5/word-bots/issues/2): this couldn't be reproduced on fresh browsers. The likely causes are the fixed spelling/fact/sum rhythm, the small level-1 word pool, and no memory of the last battle. The issue has a fix list and a question for the parent.

## Content size today
| Kind | Count |
|---|---|
| Spelling words | 30 (level 1: 11, level 2: 11, level 3: 8) |
| Facts | 32 (space 9, animals 9, nature 2, maths 3, records 4, Pokémon 5) |
| Sums (generated) | 461 possible: 190 additions, 190 subtractions, 51 multiplications, 30 divisions |

## Still to do from v1
- Parent review of the facts in `src/content/facts.ts`. The Pokémon facts were checked against pokemon.com only, because Bulbapedia blocked automated fetches.
- "Jonathan is the oldest living land animal" will go out of date one day.
- Nobody has tested it on the real tablet yet: touch dragging, the en-GB speech voice and the install prompt.

## Handy
- Headless play-testing worked with `puppeteer-core` driving the installed Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`) against `npx vite preview`. Edge failed to launch headless.
- Icons are regenerated with `node scripts/make-icons.mjs`.
