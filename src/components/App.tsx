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
      <h1 className={styles.heading}>Solverdle</h1>
      <GuessList
        className={styles.guesses}
        guesses={guesses}
        onLetterResult={onLetterResult}
        onCancelLastGuess={onCancelLastGuess}
        maxGuesses={maxGuesses}
        guessLength={guessLength}
      />
      <WordOptions
        className={styles.options}
        words={currentWords}
        onGuess={guessWord}
      />
      <ManualGuess
        className={styles.form}
        onGuess={guessWord}
        guessLength={guessLength}
      />
    </div>
  );
};

export default App;
