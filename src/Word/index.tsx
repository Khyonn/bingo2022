import type { JSX } from "solid-js";
import styles from "./styles.module.scss";

const Word = (props: {
  word: string;
  isSelected: boolean;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}) => {
  return (
    <>
      <input
        type="checkbox"
        class={styles.checkbox}
        name="word"
        id={props.word}
        onClick={props.onClick}
        checked={props.isSelected}
      />
      <label for={props.word}>{props.word}</label>
    </>
  );
};

export default Word;
