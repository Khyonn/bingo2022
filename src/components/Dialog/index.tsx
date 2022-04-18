import type { JSX } from "solid-js";
import styles from "./styles.module.scss";

const Dialog = (props: JSX.DialogHtmlAttributes<HTMLElement>) => (
  <dialog ref={props.ref} class={`${styles.dialog} ${props.class}`}>
      {props.children}
  </dialog>
);

export default Dialog