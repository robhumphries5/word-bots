// Spelling words from the statutory Years 3 and 4 word list,
// National Curriculum in England, English Appendix 1 (p.17).
// Level 1 = shortest/easiest; higher levels unlock as battles are won.
// Clues must never contain the word itself (checked by tests).

export const WORD_LIST_SOURCE =
  'https://assets.publishing.service.gov.uk/media/5a7ccc06ed915d63cc65ce61/English_Appendix_1_-_Spelling.pdf';

export interface SpellingWord {
  id: string;
  word: string;
  clue: string;
  level: 1 | 2 | 3;
  source: string;
}

const w = (word: string, level: 1 | 2 | 3, clue: string): SpellingWord => ({
  id: 'word:' + word,
  word,
  clue,
  level,
  source: WORD_LIST_SOURCE,
});

export const WORDS: SpellingWord[] = [
  w('heart', 1, 'It pumps blood all around your body.'),
  w('early', 1, 'The opposite of late.'),
  w('earth', 1, 'The planet we all live on.'),
  w('eight', 1, 'The number that comes after seven.'),
  w('fruit', 1, 'Apples, bananas and pears are all kinds of this.'),
  w('group', 1, 'Some people or things together: a ___ of friends.'),
  w('guard', 1, 'A person whose job is to keep a place safe.'),
  w('guide', 1, 'Someone who shows you the way.'),
  w('heard', 1, 'Yesterday I ___ a bird sing.'),
  w('learn', 1, 'At school you ___ new things every day.'),
  w('often', 1, 'If you do something lots of times, you do it ___.'),
  w('island', 2, 'A piece of land with water all around it.'),
  w('circle', 2, 'A round shape, like a hoop.'),
  w('centre', 2, 'The middle of something.'),
  w('minute', 2, 'There are sixty seconds in one of these.'),
  w('notice', 2, "To spot something: did you ___ the robot's red eyes?"),
  w('answer', 2, 'What you give when someone asks you a question.'),
  w('length', 2, 'How long something is.'),
  w('height', 2, 'How tall something is.'),
  w('weight', 2, 'How heavy something is.'),
  w('enough', 2, 'As much as you need: have you had ___ to eat?'),
  w('famous', 2, 'Known by lots and lots of people.'),
  w('strange', 3, 'Odd or unusual; not normal.'),
  w('special', 3, 'Not ordinary; extra important, like a birthday.'),
  w('promise', 3, 'When you say you will really, truly do something.'),
  w('quarter', 3, 'One of four equal parts of something.'),
  w('believe', 3, 'To think that something is true.'),
  w('surprise', 3, 'Something you did not expect, like a secret party.'),
  w('library', 3, 'A place where you can borrow books.'),
  w('favourite', 3, 'The one you like best of all.'),
];
