import { program } from "commander";

import {
  Availability,
  Dictionary,
  EliminatedList,
  MatchSet,
} from "./dictionary";
import wordList from "./word-list";

export function parseEliminatedList(input: string): EliminatedList {
  const result: EliminatedList = new Map();
  try {
    for (const pair of input.split(":")) {
      const [letter, max] = pair.split("=");
      result.set(letter, parseInt(max, 10));
    }
  } catch (e) {
    console.error(`Couldn't parse argument "${input}".`);
  }
  return result;
}

export function parseMatchSet(input: string): MatchSet {
  const result: MatchSet = new Map();
  try {
    for (const pair of input.split(":")) {
      const [letter, list] = pair.split("=");
      let values = new Set<number>();
      for (const value of list.split(",")) {
        values.add(parseInt(value, 10));
      }
      result.set(letter, values);
    }
  } catch (e) {
    console.error(`Couldn't parse argument "${input}".`);
  }
  return result;
}

export default function cli(): void {
  const dictionary = new Dictionary(wordList);

  program
    .option("-g, --exact <matches>", "", parseMatchSet, new Map())
    .option("-b, --eliminated <eliminated>", "", parseEliminatedList, new Map())
    .option("-y, --potential <potential>", "", parseMatchSet, new Map());

  program.parse();

  const availability = program.opts<Availability>();

  // const result = dictionary.rankWords();
  const result = dictionary.getAvailableWords(availability).rankWords();
  const resultPercentages = Dictionary.scorePercentages(result);

  for (const [word, score] of resultPercentages) {
    console.info(`${word} (${score.toFixed(2)}%)`);
  }
}
