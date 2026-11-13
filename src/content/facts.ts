// Every fact was checked against its source page on 2026-11-13
// (second batch also checked 2026-11-13).
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
const NASA_JUPITER = 'https://science.nasa.gov/jupiter/jupiter-facts/';
const NASA_NEPTUNE = 'https://science.nasa.gov/neptune/neptune-facts/';
const NGK = 'https://www.natgeokids.com/uk/discover/';
const NGK_TIGER = NGK + 'animals/general-animals/10-tiger-facts/';
const NGK_AMAZON = NGK + 'geography/physical-geography/amazon-facts/';
const NGK_OCEAN = NGK + 'geography/general-geography/ocean-facts/';
const NGK_VOLCANO = NGK + 'geography/physical-geography/volcano-facts/';
const NHM_DINO = 'https://www.nhm.ac.uk/discover/dino-directory/';
const LEAP_YEAR = 'https://spaceplace.nasa.gov/leap-year/en/';

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

  mc('great-red-spot', 'space', 'Jupiter has a giant storm called the Great Red Spot. How big is it?', 'Bigger than Earth', ['As big as a house', 'As big as London', 'As big as the Moon'], NASA_JUPITER),
  mc('jupiter-day', 'space', 'About how long is one day on Jupiter?', 'About 10 hours', ['About 24 hours', 'About 1 week', 'About 1 year'], NASA_JUPITER),
  mc('uranus-side', 'space', 'Which planet spins on its side as it goes round the Sun?', 'Uranus', ['Mars', 'Earth', 'Mercury'], 'https://science.nasa.gov/uranus/facts/'),
  mc('sun-earths', 'space', 'About how many Earths could fit inside the Sun?', 'About 1.3 million', ['About 10', 'About 100', 'About 1,000'], 'https://science.nasa.gov/sun/facts/'),
  mc('farthest', 'space', 'Which planet is farthest from the Sun?', 'Neptune', ['Jupiter', 'Saturn', 'Mars'], NASA_NEPTUNE),
  tf('windiest', 'space', 'Neptune is the windiest planet in our Solar System.', true, NASA_NEPTUNE),
  tf('moon-visit', 'space', 'The Moon is the only place beyond Earth that people have visited.', true, 'https://science.nasa.gov/moon/facts/'),
  mc('olympus-mons', 'space', 'The biggest volcano in the Solar System is on which planet?', 'Mars', ['Earth', 'Jupiter', 'Mercury'], NGK_VOLCANO),

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

  mc('elephant', 'animals', 'What is the largest land animal in the world?', 'Elephant', ['Hippo', 'Giraffe', 'Rhino'], NGK + 'animals/general-animals/elephant-facts/'),
  mc('tiger-big', 'animals', 'What is the largest wild cat in the world?', 'Tiger', ['Lion', 'Cheetah', 'Leopard'], NGK_TIGER),
  tf('tiger-stripes', 'animals', 'No two tigers have the same stripes.', true, NGK_TIGER),
  tf('tiger-water', 'animals', 'Tigers hate water and never swim.', false, NGK_TIGER),
  mc('panda', 'animals', 'What do giant pandas mostly eat?', 'Bamboo', ['Fish', 'Honey', 'Carrots'], NGK + 'animals/general-animals/ten-panda-facts/'),
  mc('polar-skin', 'animals', "What colour is a polar bear's skin, under its fur?", 'Black', ['White', 'Pink', 'Yellow'], NGK + 'animals/general-animals/polar-bear-facts/'),
  mc('caterpillar', 'animals', "What hatches out of a butterfly's egg?", 'A caterpillar', ['A tadpole', 'A chick', 'A worm'], NGK + 'animals/insects/butterfly-life-cycle/'),
  mc('orca-pod', 'animals', 'What is a family group of killer whales called?', 'A pod', ['A herd', 'A pack', 'A flock'], NGK + 'animals/sea-life/killer-whale-facts/'),
  mc('giraffe-tongue', 'animals', "About how long can a giraffe's tongue grow?", 'About 50 cm', ['About 5 cm', 'About 1 cm', 'About 5 metres'], NGK + 'animals/general-animals/ten-giraffe-facts/'),

  // Natural world
  mc('everest', 'nature', 'What is the highest mountain in the world?', 'Mount Everest', ['Ben Nevis', 'Mont Blanc', 'Kilimanjaro'], 'https://kids.nationalgeographic.com/geography/countries/article/nepal'),
  mc('pacific', 'nature', 'Which is the largest ocean on Earth?', 'Pacific Ocean', ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], 'https://www.nationalgeographic.com/environment/article/pacific-ocean'),

  mc('amazon', 'nature', 'What is the largest tropical rainforest in the world?', 'The Amazon', ['Sherwood Forest', 'The Sahara', 'The New Forest'], NGK_AMAZON),
  mc('amazon-where', 'nature', 'The Amazon rainforest is on which continent?', 'South America', ['Africa', 'Europe', 'Australia'], NGK_AMAZON),
  tf('nile', 'nature', 'The Nile in Africa is usually called the longest river in the world.', true, NGK + 'geography/physical-geography/nile-river-facts/'),
  tf('ocean-cover', 'nature', "Most of the Earth's surface is covered by ocean.", true, NGK_OCEAN),
  mc('mariana', 'nature', 'What is the deepest place in the ocean called?', 'The Mariana Trench', ['The English Channel', 'The Grand Canyon', 'Loch Ness'], NGK_OCEAN),
  mc('inner-core', 'nature', 'Which is the hottest layer of the Earth?', 'The inner core', ['The crust', 'The mantle', 'The sea bed'], NGK + 'geography/physical-geography/structure-of-the-earth/'),
  mc('magma', 'nature', 'What is hot, melted rock called while it is still underground?', 'Magma', ['Lava', 'Ice', 'Sand'], NGK_VOLCANO),
  tf('thames-froze', 'nature', 'In 1684 it was so cold that the River Thames froze solid for two months.', true, NGK + 'geography/physical-geography/30-freaky-facts-about-weather/'),
  tf('t-rex', 'nature', 'Tyrannosaurus rex was a meat-eater.', true, NHM_DINO + 'tyrannosaurus.html'),
  mc('triceratops', 'nature', 'How many horns did Triceratops have?', '3', ['1', '2', '5'], NHM_DINO + 'triceratops.html'),
  mc('stegosaurus', 'nature', 'Stegosaurus was huge, but its brain was only about the size of a…', 'Plum', ['Football', 'Car', 'Watermelon'], NHM_DINO + 'stegosaurus.html'),

  // Maths facts
  mc('googol', 'maths', 'How many zeros are there in a googol?', '100', ['10', '1,000', '1 million'], BRIT_GOOGOL),
  tf('google-name', 'maths', 'The name Google comes from the number called a googol.', true, BRIT_GOOGOL),
  mc('hexagon', 'maths', 'How many sides does a hexagon have?', '6', ['5', '7', '8'], 'https://www.britannica.com/science/hexagon'),

  mc('leap-days', 'maths', 'How many days are there in a leap year?', '366', ['365', '360', '400'], LEAP_YEAR),
  tf('year-days', 'maths', 'A normal year has 365 days.', true, LEAP_YEAR),
  mc('leap-month', 'maths', 'Which month gets an extra day in a leap year?', 'February', ['January', 'June', 'December'], LEAP_YEAR),
  mc('leap-often', 'maths', 'About how often is there a leap year?', 'Every 4 years', ['Every year', 'Every 10 years', 'Every 100 years'], LEAP_YEAR),

  // World records
  mc('tallest-man', 'records', 'About how tall was the tallest man ever?', 'About 2.7 metres', ['About 1.5 metres', 'About 5 metres', 'About 10 metres'], 'https://www.guinnessworldrecords.com/world-records/tallest-man-ever'),
  mc('fastest-100m', 'records', 'Who has run 100 metres faster than anyone else?', 'Usain Bolt', ['Mo Farah', 'Lionel Messi', 'Serena Williams'], 'https://www.guinnessworldrecords.com/world-records/fastest-run-100-metres-(male)'),
  mc('jonathan', 'records', 'Jonathan is the oldest living land animal. What kind of animal is he?', 'A tortoise', ['An elephant', 'A parrot', 'A horse'], 'https://www.guinnessworldrecords.com/world-records/511806-oldest-living-land-animal'),
  mc('tallest-animal', 'records', 'What is the tallest living animal?', 'Giraffe', ['Elephant', 'Ostrich', 'Polar bear'], 'https://www.guinnessworldrecords.com/world-records/542207-tallest-living-animal'),

  mc('tallest-building', 'records', 'What is the tallest building in the world?', 'Burj Khalifa', ['Big Ben', 'The Shard', 'Empire State Building'], 'https://www.guinnessworldrecords.com/world-records/tallest-building'),

  // Pokémon (text only, no imagery)
  mc('pikachu-type', 'pokemon', 'What type of Pokémon is Pikachu?', 'Electric', ['Fire', 'Water', 'Grass'], POKEDEX + 'pikachu'),
  tf('charmander-fire', 'pokemon', 'Charmander is a Fire-type Pokémon.', true, POKEDEX + 'charmander'),
  mc('squirtle-type', 'pokemon', 'What type of Pokémon is Squirtle?', 'Water', ['Fire', 'Electric', 'Psychic'], POKEDEX + 'squirtle'),
  mc('dex-1', 'pokemon', 'Which Pokémon is number 1 in the Pokédex?', 'Bulbasaur', ['Pikachu', 'Charmander', 'Squirtle'], POKEDEX + 'bulbasaur'),
  mc('charmander-evolves', 'pokemon', 'What does Charmander evolve into?', 'Charmeleon', ['Wartortle', 'Ivysaur', 'Raichu'], POKEDEX + 'charmander'),
  tf('charizard-type', 'pokemon', 'Charizard is a Fire and Flying type Pokémon.', true, POKEDEX + 'charmander'),
  mc('squirtle-evolves', 'pokemon', 'What does Squirtle evolve into?', 'Wartortle', ['Charmeleon', 'Ivysaur', 'Raichu'], POKEDEX + 'squirtle'),
  mc('jigglypuff-type', 'pokemon', 'What types is Jigglypuff?', 'Normal and Fairy', ['Fire and Flying', 'Water and Ice', 'Grass and Poison'], POKEDEX + 'jigglypuff'),
  tf('bulbasaur-type', 'pokemon', 'Bulbasaur is a Grass and Poison type Pokémon.', true, POKEDEX + 'bulbasaur'),
  mc('pikachu-number', 'pokemon', 'What number is Pikachu in the Pokédex?', '25', ['1', '7', '100'], POKEDEX + 'pikachu'),
  mc('pichu', 'pokemon', 'Which Pokémon evolves into Pikachu?', 'Pichu', ['Raichu', 'Jigglypuff', 'Squirtle'], POKEDEX + 'pikachu'),
  mc('pikachu-evolves', 'pokemon', 'What does Pikachu evolve into?', 'Raichu', ['Charizard', 'Blastoise', 'Ivysaur'], POKEDEX + 'pikachu'),
];

export const TRUSTED_DOMAINS = [
  'nasa.gov', 'esa.int', 'rmg.co.uk',
  'nhm.ac.uk', 'bbc.co.uk', 'bbcearth.com', 'natgeokids.com', 'nationalgeographic.com', 'britannica.com',
  'guinnessworldrecords.com',
  'pokemon.com', 'bulbagarden.net',
  'gov.uk',
];
