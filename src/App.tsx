import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import basicDictionnary from "./dictionary";
import styles from "./styles.module.scss";
import { LineColumnGetter, shuffleArray } from "./utils";
import Word from "./Word";

const dimensions = {
  width: 4,
  height: 4,
};

const App: Component = () => {
  const [dictionnary, setDictionnary] = createSignal<string[]>([
    ...basicDictionnary,
  ]);
  const getWords = (wordsNb: number) =>
    shuffleArray([...dictionnary()]).slice(0, wordsNb);

  const [words, setWords] = createSignal<string[]>(
    getWords(dimensions.width * dimensions.height)
  );
  const [selectedWords, setSelectedWords] = createSignal<string[]>([]);
  const lineColumnGetter = createMemo(
    () => new LineColumnGetter(words(), dimensions)
  );

  const toggleWord = (word) => {
    if (selectedWords().includes(word)) {
      setSelectedWords((old) => old.filter((w) => w !== word));
    } else {
      setSelectedWords((old) => [...old, word]);
    }
  };

  const isFinished = () => {
    for (let i = 0; i < dimensions.height; i++) {
      if (
        lineColumnGetter()
          .getLine(i)
          .every((word) => selectedWords().includes(word))
      ) {
        return true;
      }
    }
    for (let i = 0; i < dimensions.width; i++) {
      if (
        lineColumnGetter()
          .getColumn(i)
          .every((word) => selectedWords().includes(word))
      ) {
        return true;
      }
    }
    return false;
  };

  let restartDialog: HTMLElement;
  createEffect(() => {
    if (isFinished()) {
      (restartDialog as any).showModal();
    }
  });

  const handleSubmitRestart = () => {
    setWords(getWords(dimensions.width * dimensions.height));
    setSelectedWords([]);
  };

  let goalDialog: HTMLElement;
  let dictionaryDialog: HTMLElement;
  let dictionaryElement: HTMLTextAreaElement;
  const handleClickGoal = () => {
    (goalDialog as any).showModal();
  };
  const handleClickRules = () => {
    (dictionaryDialog as any).showModal();
  };
  const handleSubmitDictionnary = () => {
    const newDictionnary = Array.from(
      new Set(dictionaryElement.value.split(",").map((words) => words.trim()))
    );
    if (newDictionnary.length >= dimensions.height * dimensions.width) {
      setDictionnary(newDictionnary);
    }
  };

  return (
    <>
      <div class="h-full w-full flex justify-center bg-gradient-to-r from-blue-700 via-white to-red-700">
        <div
          class={
            "py-4 px-2 m-2 sm:px-4 shadow-sm shadow-black max-w-3xl rounded-md relative space-y-4 " +
            styles.bg
          }
        >
          <h1 class="text-2xl font-bold text-orange-500">Bingo débat 2022</h1>
          <menu class="overflow-hidden inline-flex">
            <button
              class="bg-slate-700 text-slate-200 py-2 px-2 border border-slate-400 hover:bg-slate-800 transition-transform active:scale-95 rounded-l-lg"
              onClick={handleSubmitRestart}
            >
              Relancer
            </button>
            <button
              class="bg-slate-700 text-slate-200 py-2 px-2 border border-l-0 border-slate-400 hover:bg-slate-800 transition-transform active:scale-95"
              onClick={handleClickGoal}
            >
              But du jeu
            </button>
            <button
              class="bg-slate-700 text-slate-200 py-2 px-2 border border-l-0 border-slate-400 hover:bg-slate-800 transition-transform active:scale-95 rounded-r-lg"
              onClick={handleClickRules}
            >
              Editer le dictionnaire
            </button>
          </menu>
          <div class="grid gap-2 sm:gap-4 grid-cols-4">
            <For each={words()}>
              {(word) => (
                <Word
                  word={word}
                  isSelected={selectedWords().includes(word)}
                  onClick={() => toggleWord(word)}
                />
              )}
            </For>
          </div>
          <span class="flex justify-end">
            Faites un don à Pécresse, la pauvre ...
          </span>
        </div>
      </div>

      <dialog ref={restartDialog} class={`${styles.dialog} bg-transparent`}>
        <form method="dialog" onSubmit={handleSubmitRestart}>
          <button
            class="bg-gradient-to-r from-blue-700 via-white to-red-700 border-none p-4 rounded-lg font-bold"
            type="submit"
          >
            Recommencer
          </button>
        </form>
      </dialog>

      <dialog ref={goalDialog} class={styles.dialog}>
        <p>
          Durant le débat présidentiel, cliquez sur les mots, expressions,
          thèmes qui sont employés par les candidats. <br />
          Si vous avez complété une ligne ou une colonne, BINGO, vous gagnez.
          Gagner quoi ? Jouez y entre amis, vous pourrez leur donner un gage par
          exemple. <br />
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
      </dialog>

      <dialog ref={dictionaryDialog} class={styles.dialog}>
        <form
          method="dialog"
          class="flex flex-col"
          onSubmit={handleSubmitDictionnary}
        >
          <p class="pb-4">
            Renseignez des mots, expressions, et thèmes séparés par une virgule.
            Si le nombre de mots renseignés est inférieur au nombre de cases,
            alors votre dictionnaire ne sera pas pris en compte. <br />
            Une fois votre dictionnaire validé, cliquez sur "Relancer" pour
            utilisez vos mots sur la grille
          </p>
          <textarea
            ref={dictionaryElement}
            class="border border-black rounded-lg p-4 mb-2"
            value={basicDictionnary.join(", ")}
            cols="50"
            rows="10"
          ></textarea>
          <menu class="inline-flex justify-end">
            <button
              type="button"
              class="bg-slate-700 text-slate-200 py-2 px-2 border border-slate-400 hover:bg-slate-800 transition-transform active:scale-95 rounded-l-lg"
              onClick={() => (dictionaryDialog as any).close()}
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
      </dialog>
    </>
  );
};

export default App;
