// Levels and the robot you face at each one. Pure logic, so it can be tested.

/** Robots beaten to go up one level (also unlocks harder spelling words). */
export const BATTLES_PER_LEVEL = 3;

export type HeadShape = 'castle' | 'dome' | 'antenna' | 'horns' | 'box' | 'crown';

export interface RobotDesign {
  name: string;
  head: HeadShape;
  /** Light and dark body colours, panel colour, and eye colour. */
  light: string;
  dark: string;
  panel: string;
  eye: string;
  /** Energy pips: how many right answers it takes to win. */
  hp: number;
  greetings: string[];
  taunts: string[];
}

export const ROBOTS: RobotDesign[] = [
  {
    name: 'Rook-Bot', head: 'castle', light: '#b9c3e3', dark: '#7f8bb0', panel: '#2a3158', eye: '#ff5a5a', hp: 8,
    greetings: ['Grrr! Answer my questions if you dare!', 'Beep! Ready to battle?', 'Rook-Bot is here! Prepare yourself!'],
    taunts: ['Beep boop! Rook-Bot wins! Want another go?', 'Ha! My circuits are too clever! Try again!'],
  },
  {
    name: 'Sparky', head: 'antenna', light: '#ffd36b', dark: '#e08a1e', panel: '#5a2e0b', eye: '#3fd0ff', hp: 8,
    greetings: ['Fizz! Sparky is fully charged!', 'Zap zap! Let us battle!', 'My batteries are full. Are yours?'],
    taunts: ['Fizz! Sparky wins! Recharge and try again!', 'Bzzzt! Too quick for you!'],
  },
  {
    name: 'Dome-Tron', head: 'dome', light: '#9ee6b0', dark: '#3fa565', panel: '#123d27', eye: '#ffe14d', hp: 9,
    greetings: ['Dome-Tron has a very big brain!', 'Whirr! My dome is full of questions!', 'Think you can beat Dome-Tron?'],
    taunts: ['Whirr! Dome-Tron wins! Have another think!', 'My big brain wins this time!'],
  },
  {
    name: 'Clank-a-Tron', head: 'horns', light: '#ff9d8f', dark: '#c4433a', panel: '#3e0f12', eye: '#fff07a', hp: 9,
    greetings: ['CLANK! Nobody beats Clank-a-Tron!', 'Stomp stomp! Here I come!', 'Clank clank! Battle time!'],
    taunts: ['Clank clank! Come back and fight me!', 'CLANK! Is that all you have got?'],
  },
  {
    name: 'Professor Cog', head: 'box', light: '#c9b3f5', dark: '#7d5bc4', panel: '#24124a', eye: '#7dffcf', hp: 10,
    greetings: ['Ahem! Professor Cog will test you now.', 'Tick tock! Class is in session!', 'Let us see how clever you are!'],
    taunts: ['Ahem! Professor Cog wins. More practice, please!', 'Tick tock! Try again!'],
  },
  {
    name: 'Mega-Byte', head: 'crown', light: '#8a93bd', dark: '#454d7a', panel: '#0d1024', eye: '#ffcf3f', hp: 10,
    greetings: ['I am Mega-Byte, king of the robots!', 'Bow down to Mega-Byte!', 'Only the cleverest can beat me!'],
    taunts: ['Mega-Byte rules! Try again, brave one!', 'Ha! The king of robots wins!'],
  },
];

/** Player level: starts at 1 and goes up every few robots beaten. It never stops. */
export const levelFor = (battlesWon: number) => 1 + Math.floor(battlesWon / BATTLES_PER_LEVEL);

/** Robots beaten so far on this level, out of BATTLES_PER_LEVEL. */
export const beatenThisLevel = (battlesWon: number) => battlesWon % BATTLES_PER_LEVEL;

/** One robot per level. After the last one they come round again. */
export const robotFor = (battlesWon: number): RobotDesign => ROBOTS[(levelFor(battlesWon) - 1) % ROBOTS.length];

/** True if winning this battle (going from battlesWon to battlesWon + 1) reaches a new level. */
export const levelsUpAfterWin = (battlesWon: number) => levelFor(battlesWon + 1) > levelFor(battlesWon);
