# Word Bots — Plan

A reading, comprehension and spelling game for a 7-year-old (UK Year 3), played on an Android tablet. The player battles robots; each robot fires challenges at him. Right answers damage the robot, wrong answers cost the player hearts.

Approach: agile. Ship a small MVP, put it in front of him, iterate.

## MVP scope (v1)

### Platform
- Installable PWA (works offline, add-to-home-screen on Android). TypeScript, light framework.
- Landscape layout, Andika font (child-friendly letterforms), big touch/drag targets.
- Public GitHub repo `word-bots`, hosted on GitHub Pages. **No personal info in the repo** — the player's name, if used, is entered on-device and stored locally only.
- Progress stored locally (localStorage / IndexedDB). No backend, no accounts.

### Battle
- One enemy: a cross robot (chess-bot style opponent), SVG art animated in code.
- Robot has 8 HP (8 correct answers to win). Player has 5 hearts (lose one per wrong answer).
- Lose → instant retry, no penalty, robot taunts a bit. Win → victory screen → next battle.
- No story for MVP — just battle after battle.
- Simple sound effects generated in code (Web Audio): zap on correct, clunk on wrong, victory jingle. Mute button.

### Challenge types
Mixed randomly, roughly ⅓ each, no repeats within a battle.

1. **Spelling** — a short clue sentence describing a word, plus slots showing the word's length. Player drags letter tiles into the slots, then taps "check".
   - Wrong: correctly-placed letters turn green, one retry, then lose a heart and show the correct spelling.
   - v1: all letters provided (tiles = exactly the word's letters, shuffled).
2. **Facts** — a question or true/false statement; pick one correct answer from 3–4 options (true/false = 2 big buttons). Topics: Pokémon, animals, the natural world, space, maths facts (e.g. zeros in a googol), world records.
3. **Sums** — + and − within 20; × and ÷ from the 2, 5 and 10 times tables. Pick one of 4 options.

### Read-aloud
- "Hear it" button reads the **clue/question sentence** (never the answer word in spelling).
- Budget: 3 uses per battle.
- v1 uses the device's speech synthesis (prefer an `en-GB` voice).

### Progress (local)
- Battles won.
- Missed words/facts are recorded and weighted to reappear more often until answered correctly.

## Content rules
- **British spelling everywhere** — UI text, clues, facts, answers (colour, favourite, metre, grey, etc.).
- Spelling words: Year 3 National Curriculum (England) words, starting easy and progressing. ~30 words for v1.
- Facts: ~30 for v1, spread across topics. Every fact stored with a `source` URL. Parent reviews each batch before it ships.
- Trusted sources:
  - Space: NASA, ESA, Royal Museums Greenwich
  - Animals/nature: Natural History Museum, BBC Earth / Bitesize, National Geographic Kids, Britannica
  - World records: Guinness World Records (official site)
  - Pokémon: official Pokédex (pokemon.com), cross-checked with Bulbapedia
  - Sums: generated and checked by code
- Original art only — no Pokémon or other copyrighted imagery; Pokémon appear only as fact subjects in text.

## Later (not v1)
- Gemini TTS: pre-generate audio files offline on the PC with the parent's API key, ship them as static assets. **Never** put the API key in the app. Fall back to device voice for anything not pre-recorded.
- Harder spelling levels: only some letters given, then none (length always shown).
- Harder sums (3/4/8 tables, within 100/1000), number-pad entry.
- More enemies, difficulty progression, maybe a story, better art (possibly AI-generated images supplied by the parent), parent view.
