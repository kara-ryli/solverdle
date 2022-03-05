import {
  FC,
  FormEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  useCallback,
} from "react";
import cx from "classnames";

import { Guess } from "../lib/state";
import styles from "./ManualGuess.module.css";

export interface ManualGuessProps extends HTMLAttributes<HTMLFormElement> {
  onGuess: Guess;
  guessLength: number;
}

const ManualGuess: FC<ManualGuessProps> = ({
  className,
  onGuess,
  guessLength,
  ...props
}) => {
  const submitHandler = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const input = form.querySelector<HTMLInputElement>("input[name=guess]");
      if (!input) {
        return;
      }
      const formatted = input.value
        .replace(/[^a-z]/gi, "")
        .toLowerCase()
        .substring(0, guessLength);
      input.value = "";
      console.info("formatted", formatted);
      if (formatted.length === guessLength) {
        onGuess(formatted);
      }
    },
    [onGuess, guessLength]
  );
  const keyUpHandler = useCallback<KeyboardEventHandler>((e) => {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-z]/gi, "").toLowerCase();
  }, []);
  return (
    <form
      className={cx(styles.root, className)}
      onSubmit={submitHandler}
      {...props}
    >
      <input
        className={styles.input}
        name="guess"
        type="text"
        maxLength={guessLength}
        onKeyUp={keyUpHandler}
      />
      <button type="submit">Guess!</button>
    </form>
  );
};

export default ManualGuess;
