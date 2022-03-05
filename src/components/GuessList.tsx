import { FC, HTMLAttributes } from "react";
import { GuessedLetters } from "../lib/state";
import cx from "classnames";
import styles from "./GuessList.module.css";
import GuessListGuess, { ToggleLetterCallback } from "./GuessListGuess";

export interface CancelGuessCallback {
  (): void;
}

export interface GuessListProps extends HTMLAttributes<HTMLDivElement> {
  guesses: GuessedLetters;
  onLetterResult: ToggleLetterCallback;
  onCancelLastGuess: CancelGuessCallback;
  maxGuesses: number;
  guessLength: number;
}

const GuessList: FC<GuessListProps> = ({
  className,
  guesses,
  onLetterResult,
  onCancelLastGuess,
  maxGuesses,
  guessLength,
  ...props
}) => {
  const renderedGuesses = new Array(maxGuesses);
  for (let i = 0; i < maxGuesses; i += 1) {
    const renderedGuessLetters = new Array(guessLength);
    for (let j = 0; j < guessLength; j += 1) {
      const guess = guesses[i]?.[j];
      renderedGuessLetters[j] = (
        <GuessListGuess
          key={j}
          guess={guess}
          guessIndex={i}
          letterIndex={j}
          handleClick={onLetterResult}
        />
      );
    }
    renderedGuesses[i] = (
      <div className={styles.guess} key={i}>
        {renderedGuessLetters}
        {i === guesses.length - 1 && (
          <button
            className={styles.cancel}
            onClick={onCancelLastGuess}
            aria-label="close"
          >
            ×
          </button>
        )}
      </div>
    );
  }
  return (
    <div className={cx(styles.root, className)} {...props}>
      {renderedGuesses}
    </div>
  );
};

export default GuessList;
