import type { JSX } from "solid-js";
import Dialog from "./Dialog";

const GoalDialog = (props: JSX.DialogHtmlAttributes<HTMLElement>) => (
  <Dialog ref={props.ref}>
    <p>
      Durant le débat présidentiel, cliquez sur les mots, expressions, thèmes
      qui sont employés par les candidats. <br />
      Si vous avez complété une ligne ou une colonne, BINGO, vous gagnez. Gagner
      quoi ? Jouez y entre amis, vous pourrez leur donner un gage par exemple.{" "}
      <br />
      Ce site est codé avec le cul, mais avec une stack sympa (SolidJS,
      Tailwind, Sass),{" "}
      <a
        class="underline"
        href="http://www.github.com/khyonn/bingo2022"
        target="_blank"
      >
        vous pouvez aller jeter un coup d'oeil au code
      </a>
    </p>
    <form method="dialog" class="flex justify-end">
      <button class="bg-slate-700 text-slate-200 py-2 px-4 border border-slate-400 hover:bg-slate-800 transition-transform active:scale-95 rounded-lg">
        OK
      </button>
    </form>
  </Dialog>
);

export default GoalDialog;
