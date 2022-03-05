export type EliminatedList = Map<string, number>;
export type MatchSet = Map<string, Set<number>>;

export const SCORE_POSITION_WEIGHT = 3;
export const SCORE_TOTAL_WEIGHT = 1;

//
// Eliminated is a map of letters we know contain no more instances, e.g.
// eliminated [[ "a", 0], ["b", 1]] means that we know the word has zero
// instances of "a", and only one instance of "b".
//
export interface Availability {
  eliminated: EliminatedList;
  exact: MatchSet;
  potential: MatchSet;
}

export type ScoreList = Map<string, number[]>;

export type Scores = Map<string, number>;

export class Dictionary {
  readonly wordLength: number;
  readonly wordList: string[];

  constructor(wordList: string[]) {
    this.wordList = [...wordList];
    this.wordLength = (wordList[0] || "").length;
  }

  //
  // Returns a list of available words based on the eliminated (grey), exact
  // (green) and potential (yellow) letters.
  //
  getAvailableWords(availability: Availability): Dictionary {
    const filteredList = this.wordList.filter((word) =>
      this.testWord(word, availability)
    );
    return new Dictionary(filteredList);
  }

  ensureEliminated(word: string, letter: string, max: number): boolean {
    const { wordLength } = this;
    let count = 0;
    for (let i = 0; i < wordLength; i += 1) {
      if (word.charAt(i) === letter) {
        count += 1;
      }
      if (count > max) {
        return false;
      }
    }
    return true;
  }

  ensureExact(word: string, letter: string, positions: Set<number>): boolean {
    for (const position of positions) {
      if (word.charAt(position) !== letter) {
        return false;
      }
    }
    return true;
  }

  ensurePotentional(
    word: string,
    letter: string,
    notPositions: Set<number>
  ): boolean {
    const { wordLength } = this;
    for (let i = 0; i < wordLength; i += 1) {
      if (notPositions.has(i)) {
        // We don't bail here to support doubles
        continue;
      }
      if (word.charAt(i) === letter) {
        return true;
      }
    }
    return false;
  }

  testWord(
    word: string,
    { eliminated, exact, potential }: Availability
  ): boolean {
    const isEliminated = Array.from(eliminated).every(([letter, max]) =>
      this.ensureEliminated(word, letter, max)
    );
    const isExact = Array.from(exact).every(([letter, positions]) =>
      this.ensureExact(word, letter, positions)
    );
    const isPotential = Array.from(potential).every(([letter, notPositions]) =>
      this.ensurePotentional(word, letter, notPositions)
    );
    // console.info(
    //   `${word}: eliminated: ${isEliminated}, exact: ${isExact}, potential: ${isPotential}`
    // );
    return isEliminated && isExact && isPotential;
  }

  getScoreList(scoreMap: ScoreList, letter: string): number[] {
    const { wordLength } = this;
    let result = scoreMap.get(letter);
    if (!result) {
      result = new Array(wordLength * 2);
      for (let i = 0; i < wordLength * 2; i += 1) {
        result[i] = 0;
      }
      scoreMap.set(letter, result);
    }
    return result;
  }

  hasDouble(word: string, letter: string): boolean {
    return word.indexOf(letter) !== word.lastIndexOf(letter);
  }

  isFirstDouble(word: string, letter: string, index: number): boolean {
    return this.hasDouble(word, letter) && word.indexOf(letter) === index;
  }

  count(word: string, letter: string): number {
    let count = 0;
    for (let i = 0, l = word.length; i < l; i += 1) {
      if (word.charAt(i) === letter) {
        count += 1;
      }
    }
    return count;
  }

  genLetterCounts(): ScoreList {
    const { wordLength, wordList } = this;
    const result: ScoreList = new Map();
    for (const word of wordList) {
      for (let i = 0; i < wordLength; i += 1) {
        const letter = word.charAt(i);
        const scoreList = this.getScoreList(result, letter);
        scoreList[i] = scoreList[i] + 1;
        // for the first letter of a double, increment the multiples scores
        if (this.isFirstDouble(word, letter, i)) {
          const count = this.count(word, letter);
          for (let j = 0; j < count; j += 1) {
            scoreList[wordLength + j] = scoreList[wordLength + j] + 1;
          }
        }
      }
    }
    return result;
  }

  calculateScore(
    scores: ScoreList,
    word: string,
    letter: string,
    position: number
  ): number {
    const { wordLength } = this;
    // score is equal to sum total of the count of the letter plus the
    // value at that position, each weighted individually
    const scoreList = this.getScoreList(scores, letter);
    // If we're a character of a double, use the double position instead
    // the current position
    let positionToScore = position;
    if (this.hasDouble(word, letter)) {
      positionToScore = wordLength + this.count(word, letter) - 1;
    }
    const positionScore = scoreList[positionToScore] * SCORE_POSITION_WEIGHT;
    const totalScore =
      scoreList.reduce((init, value) => init + value, 0) * SCORE_TOTAL_WEIGHT;
    return positionScore * totalScore;
  }

  // For each word in the list, generate a scoring rubric based on the
  rankWords(): Scores {
    const { wordLength, wordList } = this;
    // Generate a data structure to count letter occurrences by position
    // {
    //   "a": [10, 45, 11, 28, 5],
    // }
    const scoresByLetterPosition = this.genLetterCounts();
    const result: Scores = new Map();
    for (const word of wordList) {
      let score = 0;
      for (let i = 0; i < wordLength; i += 1) {
        score += this.calculateScore(
          scoresByLetterPosition,
          word,
          word.charAt(i),
          i
        );
      }
      result.set(word, score);
    }
    return result;
  }

  static scorePercentages(scores: Scores): Array<[string, number]> {
    const ranked: Scores = new Map();
    let totalScore = 0;
    for (const [, score] of scores) {
      totalScore += score;
    }
    for (const [word, score] of scores) {
      ranked.set(word, (score / totalScore) * 100);
    }
    const result = Array.from(ranked);
    result.sort(([, a], [, b]) => (a > b ? -1 : b > a ? 1 : 0));
    return result;
  }
}
