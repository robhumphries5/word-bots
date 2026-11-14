// Reading comprehension: a short passage (1-3 sentences) and a question about it.
// Passages are original, written for this game (not copied from tests or books).
// Each question practises one comprehension skill from the National Curriculum
// in England (Years 3 and 4 programme of study, or the KS2 reading test framework);
// `source` links to that document.
// `clues` are words or phrases in the passage that give the answer away; they
// are highlighted after answering, to show how to justify the answer.
// New questions start with `active: false` and only appear in battles once a
// grown-up has checked them in "All questions" and they're switched on here.

export type ReadingSkill = 'retrieve' | 'infer' | 'vocab' | 'feelings' | 'predict';

export interface ReadingQuestion {
  id: string;
  skill: ReadingSkill;
  passage: string;
  question: string;
  /** The right answer comes first here; the game shuffles them. */
  options: string[];
  answer: string;
  clues: string[];
  source: string;
  active: boolean;
}

const ENGLISH_POS =
  'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study';
const KS2_READING_FRAMEWORK =
  'https://www.gov.uk/government/publications/key-stage-2-english-reading-test-framework';

export const SKILLS: Record<ReadingSkill, { name: string; practises: string; source: string }> = {
  retrieve: {
    name: 'Find it',
    practises: 'Retrieve and record information / identify key details from fiction and non-fiction (KS2 reading content domain 2b).',
    source: KS2_READING_FRAMEWORK,
  },
  infer: {
    name: 'Work it out',
    practises: 'Drawing inferences … and justifying inferences with evidence (Years 3 and 4).',
    source: ENGLISH_POS,
  },
  vocab: {
    name: 'Word meaning',
    practises: 'Explaining the meaning of words in context (Years 3 and 4).',
    source: ENGLISH_POS,
  },
  feelings: {
    name: 'Feelings',
    practises: 'Inferring characters’ feelings, thoughts and motives from their actions (Years 3 and 4).',
    source: ENGLISH_POS,
  },
  predict: {
    name: 'What next?',
    practises: 'Predicting what might happen from details stated and implied (Years 3 and 4).',
    source: ENGLISH_POS,
  },
};

const r = (
  id: string, skill: ReadingSkill, passage: string, question: string,
  answer: string, wrong: string[], clues: string[], active = false,
): ReadingQuestion => ({
  id: 'read:' + id, skill, passage, question, options: [answer, ...wrong], answer, clues,
  source: SKILLS[skill].source, active,
});

export const READING: ReadingQuestion[] = [
  // --- Work it out (inference) ---
  r('night', 'infer',
    'It was dark all around. The moon shone brightly in the sky and owls hooted.',
    'What time of day is it?', 'Night-time', ['Morning', 'Afternoon'],
    ['dark', 'moon', 'owls hooted']),
  r('beach', 'infer',
    'Ella built a sandcastle and dug a moat around it. Then a wave rushed in and filled the moat with water.',
    'Where is Ella?', 'At the beach', ['In the park', 'At school'],
    ['sandcastle', 'wave']),
  r('cold', 'infer',
    'Tom pulled on his gloves and wrapped his scarf round his neck. Outside, his breath made little clouds in the air.',
    'What is the weather like?', 'Cold', ['Hot', 'Warm'],
    ['gloves', 'scarf', 'breath made little clouds']),

  // --- Find it (retrieval) ---
  r('kite', 'retrieve',
    'Sam has a red kite with a long yellow tail. He flies it on the hill behind his house.',
    'What colour is the kite’s tail?', 'Yellow', ['Red', 'Blue'],
    ['long yellow tail']),
  r('library', 'retrieve',
    'On Saturday, Gran took Priya to the library. Priya chose three books about sharks.',
    'How many books did Priya choose?', 'Three', ['Two', 'Five'],
    ['three books']),
  r('bone', 'retrieve',
    'Max the puppy dug a hole in the garden. He dropped his favourite bone into it and covered it with soil.',
    'Where did Max hide his bone?', 'In a hole in the garden', ['Under his bed', 'In his bowl'],
    ['dug a hole in the garden']),

  // --- Word meaning (vocabulary in context) ---
  r('exhausted', 'vocab',
    'After the long walk up the mountain, Dad was exhausted. He sat down on a rock and closed his eyes.',
    'What does “exhausted” mean?', 'Very tired', ['Very happy', 'Very hungry'],
    ['long walk', 'sat down', 'closed his eyes']),
  r('tiny', 'vocab',
    'The kitten was tiny. It was small enough to fit in Leo’s hand.',
    'What does “tiny” mean?', 'Very small', ['Very fluffy', 'Very fast'],
    ['small enough to fit in Leo’s hand']),
  r('crept', 'vocab',
    'Ruby crept down the stairs very slowly so that nobody would hear her.',
    'What does “crept” mean?', 'Moved quietly', ['Ran fast', 'Jumped'],
    ['very slowly', 'nobody would hear her']),

  // --- Feelings ---
  r('vase', 'feelings',
    'Mia’s lip wobbled as she looked at the broken vase on the floor. A tear rolled down her cheek.',
    'How does Mia feel?', 'Sad', ['Excited', 'Sleepy'],
    ['lip wobbled', 'A tear rolled down her cheek']),
  r('bike', 'feelings',
    'When Jack opened the box and saw the new bike, he jumped up and down and shouted, “Yes!”',
    'How does Jack feel?', 'Excited', ['Scared', 'Bored'],
    ['jumped up and down', 'shouted']),
  r('dog', 'feelings',
    'Aisha hid behind her mum’s legs when the big dog barked. She held on tightly and shut her eyes.',
    'How does Aisha feel?', 'Scared', ['Proud', 'Sleepy'],
    ['hid behind', 'held on tightly', 'shut her eyes']),

  // --- What next? (prediction) ---
  r('clouds', 'predict',
    'Dark clouds filled the sky. Dad picked up his umbrella and opened the front door.',
    'What will probably happen next?', 'It will start to rain', ['The sun will come out', 'Dad will go to bed'],
    ['Dark clouds', 'umbrella']),
  r('tower', 'predict',
    'Ben’s tower of blocks was very tall, and it wobbled. Then the cat jumped onto the table next to it.',
    'What will probably happen next?', 'The tower will fall down', ['The tower will grow taller', 'The cat will build a tower'],
    ['wobbled', 'the cat jumped onto the table']),
  r('cake', 'predict',
    'Lily mixed the flour, eggs and sugar in a bowl. She poured the mixture into a tin and opened the oven door.',
    'What will Lily do next?', 'Put the tin in the oven', ['Wash her hair', 'Go to sleep'],
    ['poured the mixture into a tin', 'opened the oven door']),
];
