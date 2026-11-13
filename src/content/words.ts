// Spelling words from the National Curriculum in England, English Appendix 1.
// Level 0 = "sound it out" words: example words from the Year 1 and Year 2
//   phonics sections (ff/ll/ss/zz/ck, ch/sh/th, tch, magic e, ai/ee/oa/igh...).
//   These stay in the mix at every level so not every word is a hard one.
// Levels 1-3 = tricky words from the statutory Years 3 and 4 word list (p.17).
//   Level 1 = shortest/easiest; higher levels unlock as battles are won.
// Clues must never contain the word itself (checked by tests).

export const WORD_LIST_SOURCE =
  'https://assets.publishing.service.gov.uk/media/5a7ccc06ed915d63cc65ce61/English_Appendix_1_-_Spelling.pdf';

export type WordLevel = 0 | 1 | 2 | 3;

export interface SpellingWord {
  id: string;
  word: string;
  clue: string;
  level: WordLevel;
  source: string;
}

const w = (word: string, level: WordLevel, clue: string): SpellingWord => ({
  id: 'word:' + word,
  word,
  clue,
  level,
  source: WORD_LIST_SOURCE,
});

export const WORDS: SpellingWord[] = [
  // Sound-it-out words (Years 1 and 2 phonics patterns)
  w('off', 0, 'The opposite of on.'),
  w('well', 0, 'Get ___ soon! (what you say to someone who is poorly)'),
  w('miss', 0, 'If the ball does not hit the target, you ___ it.'),
  w('buzz', 0, 'The sound a bee makes.'),
  w('back', 0, 'The opposite of front.'),
  w('bank', 0, 'A place that keeps money safe.'),
  w('think', 0, 'You do this with your brain.'),
  w('catch', 0, 'Throw me the ball and I will ___ it.'),
  w('fetch', 0, 'A dog runs to ___ the stick.'),
  w('hutch', 0, 'A little wooden house for a pet rabbit.'),
  w('kitchen', 0, 'The room where food is cooked.'),
  w('chair', 0, 'Something you sit on, with four legs and a back.'),
  w('mouth', 0, 'You eat, talk and smile with this.'),
  w('thief', 0, 'Someone who steals things.'),
  w('shirt', 0, 'A top with buttons and a collar.'),
  w('short', 0, 'The opposite of tall.'),
  w('first', 0, 'The winner of a race comes ___.'),
  w('third', 0, 'After first and second comes ___.'),
  w('bird', 0, 'An animal with feathers and wings.'),
  w('made', 0, 'Yesterday I ___ a cake.'),
  w('take', 0, 'Please ___ one sweet from the jar.'),
  w('safe', 0, 'Not in any danger.'),
  w('five', 0, 'The number after four.'),
  w('like', 0, 'I ___ ice cream. Yum!'),
  w('time', 0, 'A clock tells you the ___.'),
  w('ride', 0, 'You do this on a bike or a pony.'),
  w('home', 0, 'The place where you live.'),
  w('hope', 0, 'I ___ it is sunny tomorrow.'),
  w('hole', 0, 'A rabbit digs a ___ in the ground.'),
  w('rule', 0, 'Something you must do, like "walk, don’t run".'),
  w('tube', 0, 'Toothpaste comes in one of these.'),
  w('rain', 0, 'Water that falls from the clouds.'),
  w('train', 0, 'It runs along rails and stops at stations.'),
  w('play', 0, 'What you do with your toys.'),
  w('toy', 0, 'A teddy or a doll is one of these.'),
  w('coin', 0, 'A round piece of money, like a pound.'),
  w('tree', 0, 'It has a trunk, branches and leaves.'),
  w('green', 0, 'The colour of grass.'),
  w('week', 0, 'Seven days make one ___.'),
  w('dream', 0, 'Pictures in your head while you are asleep.'),
  w('park', 0, 'A green place with swings and slides.'),
  w('start', 0, 'The opposite of finish.'),
  w('turn', 0, 'Wait for your ___ in the game.'),
  w('horse', 0, 'A big animal you can ride. It says neigh!'),
  w('summer', 0, 'The hottest season of the year.'),
  w('moon', 0, 'It shines in the sky at night.'),
  w('zoo', 0, 'A place where you can visit lions, tigers and penguins.'),
  w('food', 0, 'Something you eat.'),
  w('book', 0, 'You read this. It has pages and a cover.'),
  w('foot', 0, 'You wear a sock and a shoe on this.'),
  w('boat', 0, 'It floats on water and can carry people.'),
  w('road', 0, 'Cars and buses drive along this.'),
  w('snow', 0, 'Cold, white flakes that fall in winter.'),
  w('night', 0, 'When it is dark and you go to bed.'),
  w('light', 0, 'The opposite of dark.'),
  w('blue', 0, 'The colour of the sky on a sunny day.'),
  w('sound', 0, 'Anything you can hear.'),
  w('apple', 0, 'A crunchy fruit that can be red or green.'),
  w('little', 0, 'Very small.'),
  w('rabbit', 0, 'A furry animal with long ears that hops.'),
  w('thunder', 0, 'The loud boom you hear in a storm.'),
  w('sunset', 0, 'When the sun goes down in the evening.'),
  w('ball', 0, 'Something round that you kick or throw.'),
  w('football', 0, 'A game where two teams kick a ball into a goal.'),
  w('walk', 0, 'To move on your feet, slower than running.'),

  // Tricky words (Years 3 and 4 statutory list)
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
  w('build', 1, 'To make something by putting parts together, like a den.'),
  w('busy', 1, 'When you have lots and lots to do.'),
  w('woman', 1, 'A grown-up girl.'),
  w('breath', 1, 'Air you take in: hold your ___ under water!'),
  w('caught', 1, 'Yesterday I ___ the ball.'),
  w('appear', 2, 'To come into sight: a rainbow can ___ after rain.'),
  w('arrive', 2, 'To get to a place: the train will ___ at ten.'),
  w('decide', 2, 'To make up your mind.'),
  w('recent', 2, 'Happening not long ago.'),
  w('perhaps', 2, 'Maybe.'),
  w('calendar', 3, 'It shows all the days, weeks and months of the year.'),
  w('different', 3, 'Not the same.'),
  w('exercise', 3, 'Running, jumping and swimming are all kinds of this.'),
  w('important', 3, 'Something that matters a lot.'),
  w('imagine', 3, 'To make a picture of something in your mind.'),
  w('remember', 3, 'The opposite of forget.'),
  w('question', 3, 'Something you ask.'),
  w('potatoes', 3, 'Chips and mash are made from these.'),
];
