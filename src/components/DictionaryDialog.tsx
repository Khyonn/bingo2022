import Dialog from "./Dialog";
import dictionnary from "../dictionary";
import { createSignal, JSX } from "solid-js";

const DictionaryDialog = (
  props: Omit<JSX.DialogHtmlAttributes<HTMLElement>, "onChange"> & {
    onSubmitDictionary: (value: string[]) => void;
  }
) => {
  const [dialog, setDialog] = createSignal<HTMLElement>();
  let dico: HTMLTextAreaElement;

  return (
    <Dialog
      ref={(_dialog) => {
        setDialog(_dialog);
        if (typeof props.ref !== "function") {
          props.ref = _dialog;
        } else {
          props.ref(_dialog);
        }
      }}
    >
      <form
        method="dialog"
        class="flex flex-col"
        onSubmit={() => {
          props.onSubmitDictionary(
            Array.from(
              new Set(dico.value.split(",").map((word) => word.trim()))
            )
          );
        }}
      >
        <p class="pb-4">
          Renseignez des mots, expressions, et thèmes séparés par une virgule.
          Si le nombre de mots renseignés est inférieur au nombre de cases,
          alors votre dictionnaire ne sera pas pris en compte. <br />
          Une fois votre dictionnaire validé, cliquez sur "Relancer" pour
          utilisez vos mots sur la grille
        </p>
        <textarea
          ref={dico}
          class="border border-black rounded-lg p-4 mb-2"
          value={dictionnary.join(", ")}
          cols="50"
          rows="10"
        ></textarea>
        <menu class="inline-flex justify-end">
          <button
            type="button"
            class="bg-slate-700 text-slate-200 py-2 px-2 border border-slate-400 hover:bg-slate-800 transition-transform active:scale-95 rounded-l-lg"
            onClick={() => (dialog() as any).close()}
          >
            Annuler
          </button>
          <button
            type="submit"
            class="bg-slate-700 text-slate-200 py-2 px-2 border border-l-0 border-slate-400 hover:bg-slate-800 transition-transform active:scale-95 rounded-r-lg"
          >
            Valider
          </button>
        </menu>
      </form>
    </Dialog>
  );
};
export default DictionaryDialog;
