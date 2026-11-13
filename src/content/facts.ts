// Every fact was checked against its source page on 2026-11-13.
// Parent review needed before each new batch ships.

export type Topic = 'space' | 'animals' | 'nature' | 'maths' | 'records' | 'pokemon';

export interface Fact {
  id: string;
  topic: Topic;
  /** 'tf' = true/false statement; 'mc' = multiple choice question. */
  kind: 'mc' | 'tf';
  question: string;
  /** For 'tf' facts this is ['True', 'False']. */
  options: string[];
  answer: string;
  source: string;
}

const mc = (id: string, topic: Topic, question: string, answer: string, wrong: string[], source: string): Fact => ({
  id: 'fact:' + id, topic, kind: 'mc', question, options: [answer, ...wrong], answer, source,
});
const tf = (id: string, topic: Topic, statement: string, answer: boolean, source: string): Fact => ({
  id: 'fact:' + id, topic, kind: 'tf', question: statement, options: ['True', 'False'],
  answer: answer ? 'True' : 'False', source,
});

const NASA_PLANETS = 'https://science.nasa.gov/solar-system/planets/';
const NASA_MARS = 'https://science.nasa.gov/mars/facts/';
const POKEDEX = 'https://www.pokemon.com/uk/pokedex/';
const BRIT_SPIDER = 'https://www.britannica.com/animal/spider-arachnid';
const BRIT_GOOGOL = 'https://www.britannica.com/science/googol';

export const FACTS: Fact[] = [
  // Space
  mc('planets', 'space', 'How many planets are in our Solar System?', '8', ['7', '9', '10'], NASA_PLANETS),
  mc('mercury', 'space', 'Which planet is closest to the Sun?', 'Mercury', ['Venus', 'Mars', 'Earth'], NASA_PLANETS),
  mc('jupiter', 'space', 'Which is the biggest planet in our Solar System?', 'Jupiter', ['Saturn', 'Earth', 'Neptune'], NASA_PLANETS),
  tf('sun-star', 'space', 'The Sun is a star.', true, 'https://spaceplace.nasa.gov/sun-compare/en/'),
  mc('red-planet', 'space', 'Which planet is called the Red Planet?', 'Mars', ['Venus', 'Jupiter', 'Uranus'], NASA_MARS),
  mc('mars-moons', 'space', 'How many moons does Mars have?', '2', ['0', '1', '3'], NASA_MARS),
  mc('saturn-rings', 'space', "What are Saturn's rings made of?", 'Chunks of ice and rock', ['Gold and silver', 'Fire', 'Candyfloss'], 'https://science.nasa.gov/saturn/facts/'),
  tf('hottest', 'space', 'Mercury is the hottest planet in our Solar System.', false, 'https://science.nasa.gov/venus/venus-facts/'),
  mc('moon-orbit', 'space', 'About how long does the Moon take to go once round the Earth?', 'About 27 days', ['About 1 day', 'About 7 days', 'About 365 days'], 'https://science.nasa.gov/moon/facts/'),

  // Animals
  mc('blue-whale', 'animals', 'Which is the largest animal ever to have lived on Earth?', 'Blue whale', ['T. rex', 'African elephant', 'Giraffe'], 'https://www.nhm.ac.uk/bluewhale/ocean/record-breaker/'),
  mc('spider-legs', 'animals', 'How many legs does a spider have?', '8', ['4', '6', '10'], BRIT_SPIDER),
  tf('spider-insect', 'animals', 'Spiders are insects.', false, BRIT_SPIDER),
  mc('octopus-arms', 'animals', 'How many arms does an octopus have?', '8', ['6', '10', '12'], 'https://www.natgeokids.com/uk/discover/animals/general-animals/octopus-facts/'),
  mc('cheetah', 'animals', 'What is the fastest land animal?', 'Cheetah', ['Lion', 'Horse', 'Ostrich'], 'https://www.natgeokids.com/uk/discover/animals/general-animals/cheetah-facts/'),
  mc('joey', 'animals', 'What is a baby kangaroo called?', 'A joey', ['A cub', 'A kit', 'A calf'], 'https://www.natgeokids.com/uk/discover/animals/general-animals/kangaroo-facts/'),
  tf('bats', 'animals', 'Bats are mammals.', true, 'https://www.natgeokids.com/uk/discover/animals/general-animals/bat-facts/'),
  tf('penguins', 'animals', 'Penguins can fly.', false, 'https://www.britannica.com/animal/penguin'),
  mc('honey', 'animals', 'What do bees make honey from?', 'Nectar from flowers', ['Leaves', 'Milk', 'Rainwater'], 'https://www.britannica.com/science/How-Is-Honey-Made'),

  // Natural world
  mc('everest', 'nature', 'What is the highest mountain in the world?', 'Mount Everest', ['Ben Nevis', 'Mont Blanc', 'Kilimanjaro'], 'https://kids.nationalgeographic.com/geography/countries/article/nepal'),
  mc('pacific', 'nature', 'Which is the largest ocean on Earth?', 'Pacific Ocean', ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], 'https://www.nationalgeographic.com/environment/article/pacific-ocean'),

  // Maths facts
  mc('googol', 'maths', 'How many zeros are there in a googol?', '100', ['10', '1,000', '1 million'], BRIT_GOOGOL),
  tf('google-name', 'maths', 'The name Google comes from the number called a googol.', true, BRIT_GOOGOL),
  mc('hexagon', 'maths', 'How many sides does a hexagon have?', '6', ['5', '7', '8'], 'https://www.britannica.com/science/hexagon'),

  // World records
  mc('tallest-man', 'records', 'About how tall was the tallest man ever?', 'About 2.7 metres', ['About 1.5 metres', 'About 5 metres', 'About 10 metres'], 'https://www.guinnessworldrecords.com/world-records/tallest-man-ever'),
  mc('fastest-100m', 'records', 'Who has run 100 metres faster than anyone else?', 'Usain Bolt', ['Mo Farah', 'Lionel Messi', 'Serena Williams'], 'https://www.guinnessworldrecords.com/world-records/fastest-run-100-metres-(male)'),
  mc('jonathan', 'records', 'Jonathan is the oldest living land animal. What kind of animal is he?', 'A tortoise', ['An elephant', 'A parrot', 'A horse'], 'https://www.guinnessworldrecords.com/world-records/511806-oldest-living-land-animal'),
  mc('tallest-animal', 'records', 'What is the tallest living animal?', 'Giraffe', ['Elephant', 'Ostrich', 'Polar bear'], 'https://www.guinnessworldrecords.com/world-records/542207-tallest-living-animal'),

  // Pokémon (text only, no imagery)
  mc('pikachu-type', 'pokemon', 'What type of Pokémon is Pikachu?', 'Electric', ['Fire', 'Water', 'Grass'], POKEDEX + 'pikachu'),
  tf('charmander-fire', 'pokemon', 'Charmander is a Fire-type Pokémon.', true, POKEDEX + 'charmander'),
  mc('squirtle-type', 'pokemon', 'What type of Pokémon is Squirtle?', 'Water', ['Fire', 'Electric', 'Psychic'], POKEDEX + 'squirtle'),
  mc('dex-1', 'pokemon', 'Which Pokémon is number 1 in the Pokédex?', 'Bulbasaur', ['Pikachu', 'Charmander', 'Squirtle'], POKEDEX + 'bulbasaur'),
  mc('pikachu-evolves', 'pokemon', 'What does Pikachu evolve into?', 'Raichu', ['Charizard', 'Blastoise', 'Ivysaur'], POKEDEX + 'pikachu'),
];

export const TRUSTED_DOMAINS = [
  'nasa.gov', 'esa.int', 'rmg.co.uk',
  'nhm.ac.uk', 'bbc.co.uk', 'bbcearth.com', 'natgeokids.com', 'nationalgeographic.com', 'britannica.com',
  'guinnessworldrecords.com',
  'pokemon.com', 'bulbagarden.net',
  'gov.uk',
];
