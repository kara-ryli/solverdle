import React, { useCallback, useEffect, useState } from "react";

import WordOptions from "./WordOptions";

import styles from "./App.module.css";
import {
  Guess,
  Words,
  availabilityFromGuessedLetters,
  GuessedLetters,
  GuessedLetter,
  GuessResult,
} from "../lib/state";
import { Dictionary } from "../lib/dictionary";
import GuessList, { CancelGuessCallback } from "./GuessList";
import ManualGuess from "./ManualGuess";

export interface AppProps {
  words: Words;
  maxGuesses: number;
}

const App: React.FC<AppProps> = ({ words, maxGuesses }) => {
  const [currentWords, setCurrentWords] = useState<Words>(words);
  const [guesses, setGuesses] = useState<GuessedLetters>(() => []);
  const guessWord = useCallback<Guess>(
    (guess) => {
      const guessLength = guess.length;
      const guessedLetters: GuessedLetter[] = new Array(guessLength);
      for (let i = 0; i < guessLength; i += 1) {
        guessedLetters[i] = {
          letter: guess.charAt(i),
          result: GuessResult.UNKNOWN,
        };
      }
      setGuesses([...guesses, guessedLetters]);
    },
    [guesses]
  );
  const onLetterResult = useCallback(
    (guess, letter, result) => {
      const mutatedLetter = guesses[guess]?.[letter];
      if (mutatedLetter) {
        mutatedLetter.result = result;
      }
      setGuesses([...guesses]);
    },
    [guesses]
  );
  const onCancelLastGuess = useCallback<CancelGuessCallback>(() => {
    setGuesses(guesses.slice(0, -1));
  }, [guesses]);
  const guessLength = words.length ? words[0].length : 0;
  useEffect(() => {
    const availability = availabilityFromGuessedLetters(guesses);
    const dictionary = new Dictionary(words).getAvailableWords(availability);
    setCurrentWords(dictionary.wordList);
  }, [guesses, words]);
  return (
    <div className={styles.root}>
      <header className={styles.heading}>
        <h1>Solverdle</h1>
        <p>
          Guess a word by typing or clicking to the right. Then click the
          letters to switch between grey, yellow and green.
        </p>
      </header>
      <div className={styles.app}>
        <div className={styles.guesses}>
          <GuessList
            guesses={guesses}
            onLetterResult={onLetterResult}
            onCancelLastGuess={onCancelLastGuess}
            maxGuesses={maxGuesses}
            guessLength={guessLength}
          />
          <ManualGuess
            className={styles.form}
            onGuess={guessWord}
            guessLength={guessLength}
          />
        </div>
        <WordOptions
          className={styles.options}
          words={currentWords}
          onGuess={guessWord}
        />
      </div>
    </div>
  );
};

export default App;
