# Notes for the next session

Last updated: 2026-11-13 (second session).

## Where things are
- **v1 is live:** https://robhumphries5.github.io/word-bots/ (public repo `robhumphries5/word-bots`, branch `main`).
- **Deploys:** every push to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages.
- **Commit email:** commits use the GitHub no-reply email, set in this repo's local git config, so the public history doesn't show a personal address.
- **Toolchain:** pinned to Vite 7 / Vitest 3 / TypeScript 5. Vitest 5 failed here with "Cannot read properties of undefined (reading 'config')". `npm audit` warnings are in dev/test dependencies only.
- **Plan:** see [PLAN.md](PLAN.md). Project rules are in `CLAUDE.md`.

## Open requests (GitHub issues)
1. [#1 Option to clear saved data](https://github.com/robhumphries5/word-bots/issues/1): **done.** There's a ⚙️ Grown-ups panel on the title screen with an in-app confirm. It keeps the mute setting.
2. [#2 Questions feel like they come in the same order](https://github.com/robhumphries5/word-bots/issues/2): **done in code.** Question types are now picked at random (never 3 of a kind in a row). Ids from the last 2 battles are down-weighted to 0.1 (`progress.recent`). Words from the next spelling level come in at ¼ weight. More content (#3) will help further.
3. [#3 More questions, new enemies, visible level](https://github.com/robhumphries5/word-bots/issues/3): **enemies and level are done.** There are 6 robots in `src/game/levels.ts`, with a new robot and level every 3 wins, and the robots cycle round after Level 6. The level badge and progress bar are on the title screen, a level chip is in the battle bar, and there's a "Level up!" victory screen. **Still to do: more questions** (about 60 words and 60+ facts, each with a verified trusted source).

## Spelling hints (added 2026-11-13)
- The 💡 Hint button puts one right letter in its slot, choosing a consonant first, and shows it in blue. A word gets 1 hint up to 4 letters, 2 for 5–6 letters and 3 for longer words (`hintsFor` / `pickHint` in `src/game/spelling.ts`).
- Using a hint doesn't count against the player.
- Also fixed: locked (green) letters could be dragged out of their slots.

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
