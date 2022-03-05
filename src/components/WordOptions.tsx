import { FC, HTMLAttributes } from "react";
import cx from "classnames";

import { Dictionary } from "../lib/dictionary";
import { Guess, Words } from "../lib/state";
import WordOption from "./WordOption";
import styles from "./WordOptions.module.css";

export interface WordOptionsProps extends HTMLAttributes<HTMLDivElement> {
  onGuess: Guess;
  words: Words;
}

const WordOptions: FC<WordOptionsProps> = ({
  onGuess,
  words,
  className,
  ...props
}) => {
  // create a dictionary from the provided words and sort them
  const dictionary = new Dictionary(words);
  // get a sorted list of words from the dictionary
  const ranked = dictionary.rankWords();
  const percentages = Dictionary.scorePercentages(ranked);
  return (
    <div className={cx(className, styles.root)} {...props}>
      <ol reversed className={styles.list}>
        {percentages.map(([word, score], i) => (
          <WordOption key={i} word={word} score={score} onGuess={onGuess} />
        ))}
      </ol>
    </div>
  );
};

export default WordOptions;
