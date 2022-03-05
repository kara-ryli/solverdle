import { FC, HTMLAttributes, MouseEventHandler, useCallback } from "react";
import cx from "classnames";

import { GuessedLetter, GuessResult, GuessResultValue } from "../lib/state";
import styles from "./GuessListGuess.module.css";

export interface ToggleLetterCallback {
  (guessIndex: number, letterIndex: number, result: GuessResultValue): void;
}

interface GuessListGuessProps extends HTMLAttributes<HTMLSpanElement> {
  guess?: GuessedLetter;
  guessIndex: number;
  letterIndex: number;
  handleClick: ToggleLetterCallback;
}

export function classNameFromResult(input: GuessResultValue): string {
  switch (input) {
    case GuessResult.UNKNOWN:
      return styles.option;
    case GuessResult.BLACK:
      return styles.eliminated;
    case GuessResult.YELLOW:
      return styles.potential;
    case GuessResult.GREEN:
      return styles.exact;
  }
}

export function iterateResult(input: GuessResultValue): GuessResultValue {
  switch (input) {
    case GuessResult.UNKNOWN:
      return GuessResult.BLACK;
    case GuessResult.BLACK:
      return GuessResult.YELLOW;
    case GuessResult.YELLOW:
      return GuessResult.GREEN;
    case GuessResult.GREEN:
      return GuessResult.UNKNOWN;
  }
}

const GuessListGuess: FC<GuessListGuessProps> = ({
  guess,
  guessIndex,
  letterIndex,
  handleClick,
  ...props
}) => {
  const clickHandler = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      if (guess) {
        handleClick(guessIndex, letterIndex, iterateResult(guess.result));
      }
    },
    [guess, guessIndex, letterIndex, handleClick]
  );
  return (
    <span
      className={cx(styles.root, guess && classNameFromResult(guess.result))}
      onClick={clickHandler}
      {...props}
    >
      {guess && guess.letter}
    </span>
  );
};

export default GuessListGuess;
