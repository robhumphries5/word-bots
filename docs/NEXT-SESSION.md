# Notes for the next session

Last updated: 2026-11-13 (third session).

## Where things are
- **v1 is live:** https://robhumphries5.github.io/word-bots/ (public repo `robhumphries5/word-bots`, branch `main`).
- **Deploys:** every push to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages.
- **Commit email:** commits use the GitHub no-reply email, set in this repo's local git config, so the public history doesn't show a personal address.
- **Toolchain:** pinned to Vite 7 / Vitest 3 / TypeScript 5. Vitest 5 failed here with "Cannot read properties of undefined (reading 'config')". `npm audit` warnings are in dev/test dependencies only.
- **Plan:** see [PLAN.md](PLAN.md). Project rules are in `CLAUDE.md`.

## Open requests (GitHub issues)
1. [#1 Option to clear saved data](https://github.com/robhumphries5/word-bots/issues/1): **done.** There's a ⚙️ Grown-ups panel on the title screen with an in-app confirm. It keeps the mute setting.
2. [#2 Questions feel like they come in the same order](https://github.com/robhumphries5/word-bots/issues/2): **done in code.** Question types are now picked at random (never 3 of a kind in a row). Ids from the last 2 battles are down-weighted to 0.1 (`progress.recent`). Words from the next spelling level come in at ¼ weight. More content (#3) will help further.
3. [#3 More questions, new enemies, visible level](https://github.com/robhumphries5/word-bots/issues/3): **enemies and level are done.** There are 6 robots in `src/game/levels.ts`, with a new robot and level every 3 wins, and the robots cycle round after Level 6. The level badge and progress bar are on the title screen, a level chip is in the battle bar, and there's a "Level up!" victory screen. **More questions added (third session):** 113 words and 72 facts, so #3 can be closed once they've had a parent check.

## Spelling hints (added 2026-11-13)
- The 💡 Hint button puts one right letter in its slot, choosing a consonant first, and shows it in blue. A word gets 1 hint up to 4 letters, 2 for 5–6 letters and 3 for longer words (`hintsFor` / `pickHint` in `src/game/spelling.ts`).
- Using a hint doesn't count against the player, but it costs the double hit: a word spelt right first time with no hints knocks 2 pips off the robot ("Perfect! Double hit!"). Any other right answer knocks off 1.
- Also fixed: locked (green) letters could be dragged out of their slots.

## Content size today
| Kind | Count |
|---|---|
| Spelling words | 113: 65 sound-it-out words (level 0) + 48 tricky words (levels 1, 2, 3: 16 each) |
| Facts | 72 (space 17, animals 18, nature 13, maths 7, records 5, Pokémon 12) |

## Sound-it-out words (added in the third session)
- The player found spelling the hardest, so level 0 words come from the Year 1/2 example words in English Appendix 1: ff/ll/ss/zz/ck, nk, tch, ch/sh/th, magic e, ai/ay/oi/oy, ee/ea, ar/or/ir/ur, oo/oa/ow/ou, igh, -le and compound words.
- `easyShare` in `src/game/challenges.ts` sets how often one comes up: 60% of spelling questions on Level 1, 40% after that. Tricky words keep unlocking as before.
- Britannica and BBC Bitesize block automated fetches now, so the new facts use NASA, Nat Geo Kids, NHM, Guinness and pokemon.com.
| Sums (generated) | 461 possible: 190 additions, 190 subtractions, 51 multiplications, 30 divisions |

## Still to do from v1
- Parent review of the facts in `src/content/facts.ts`. The Pokémon facts were checked against pokemon.com only, because Bulbapedia blocked automated fetches.
- "Jonathan is the oldest living land animal" will go out of date one day.
- Tested on the real tablet (2026-11-13): working well and the boys love it.

## Handy
- Headless play-testing worked with `puppeteer-core` driving the installed Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`) against `npx vite preview`. Edge failed to launch headless.
- Icons are regenerated with `node scripts/make-icons.mjs`.

## Active questions and approval (added 2026-11-14)
- Every word, fact and reading question has an `active` flag. Battles only use active ones (`ChallengeDealer` filters them). Sums are always active.
- **New content goes in with `active: false`.** It shows in Grown-ups > All questions with a "Waiting for approval" badge, and the parent approves it there. To approve, set `active: true` on the item (for reading questions, pass `true` as the last argument to `r(...)`).
- **Reading comprehension** (`src/content/reading.ts`): 15 original passages, 3 each for Find it, Work it out, Word meaning, Feelings and What next?. Each skill links to the curriculum statement it practises. All are inactive until approved. The "Read it!" card only appears in battles once at least one is active. After answering, the `clues` phrases are highlighted in the passage.
