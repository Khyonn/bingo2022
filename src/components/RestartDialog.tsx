import type { JSX } from "solid-js";
import Dialog from "./Dialog";

const RestartDialog = (
  props: JSX.DialogHtmlAttributes<HTMLElement> & { onRestart: () => void }
) => (
  <Dialog ref={props.ref} class="bg-transparent">
    <form method="dialog" onSubmit={props.onRestart}>
      <button class="bg-slate-700 text-slate-200 py-2 px-4 border border-slate-400 hover:bg-slate-800 transition-transform active:scale-95 rounded-lg">
        Recommencer
      </button>
    </form>
  </Dialog>
);

export default RestartDialog;
