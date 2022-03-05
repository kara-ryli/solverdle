import { FC, HTMLAttributes, MouseEventHandler, useCallback } from "react";
import cx from "classnames";

import styles from "./WordOption.module.css";
import { Guess } from "../lib/state";

export interface WordOptionProps extends HTMLAttributes<HTMLLIElement> {
  word: string;
  score: number;
  onGuess: Guess;
}

const WordOption: FC<WordOptionProps> = ({
  className,
  word,
  score,
  onGuess,
  ...props
}) => {
  const clickHandler = useCallback<MouseEventHandler>(
    () => onGuess(word),
    [word, onGuess]
  );
  return (
    <li
      className={cx(className, styles.root)}
      onClick={clickHandler}
      {...props}
    >
      <span className={styles.word}>{word}</span> ({score.toFixed(2)}%)
    </li>
  );
};

export default WordOption;
