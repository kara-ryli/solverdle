import { Availability } from "./dictionary";

export const GuessResult = {
  UNKNOWN: "unknown",
  BLACK: "black",
  YELLOW: "yellow",
  GREEN: "green",
} as const;

export type GuessResultValue = typeof GuessResult[keyof typeof GuessResult];

export interface GuessedLetter {
  letter: string;
  result: GuessResultValue;
}

export type Guess = (guess: string) => void;
export type Words = string[];
export type GuessedLetters = GuessedLetter[][];

export function availabilityFactory(): Availability {
  return {
    eliminated: new Map(),
    exact: new Map(),
    potential: new Map(),
  };
}

export function availabilityFromGuessedLetters(
  guessed: GuessedLetters
): Availability {
  const result = availabilityFactory();
  const { eliminated, exact, potential } = result;
  for (const guess of guessed) {
    const letterCount = new Map<string, number>();
    for (let i = 0, l = guess.length; i < l; i += 1) {
      const { letter, result } = guess[i];
      const count = (letterCount.get(letter) || 0) + 1;
      letterCount.set(letter, count);
      switch (result) {
        case GuessResult.BLACK:
          if (!eliminated.has(letter)) {
            eliminated.set(letter, count - 1);
          }
          break;
        case GuessResult.YELLOW:
          const potentialList = potential.get(letter) || new Set();
          potentialList.add(i);
          potential.set(letter, potentialList);
          break;
        case GuessResult.GREEN:
          const exactList = exact.get(letter) || new Set();
          exactList.add(i);
          exact.set(letter, exactList);
          break;
      }
    }
  }
  console.info("availability", result);
  return result;
}
