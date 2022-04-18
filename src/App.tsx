import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import basicDictionnary from "./dictionary";
import DictionaryDialog from "./components/DictionaryDialog";
import GoalDialog from "./components/GoalDialog";
import RestartDialog from "./components/RestartDialog";
import Word from "./components/Word";
import styles from "./styles.module.scss";
import { LineColumnGetter, shuffleArray } from "./utils";

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
    () => new LineColumnGetter(words())
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
  const handleClickGoal = () => {
    (goalDialog as any).showModal();
  };
  const handleClickRules = () => {
    (dictionaryDialog as any).showModal();
  };

  const handleSubmitDictionnary = (words: string[]) => {
    if (words.length >= dimensions.height * dimensions.width) {
      setDictionnary(words);
    }
  };

  return (
    <>
      <div class="absolute h-full w-full overflow-auto flex items-start justify-center bg-gradient-to-r from-blue-700 via-white to-red-700">
        <div
          class={
            "py-4 px-2 m-2 sm:px-4 shadow-sm shadow-black max-w-3xl rounded-md relative space-y-4 " +
            styles.bg
          }
        >
          <h1 class="text-2xl font-bold text-slate-700">Bingo débat 2022</h1>
          <menu class="overflow-hidden inline-flex text-xs sm:text-base">
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
          <span class="flex justify-end text-xs sm:text-base">
            Faites un don à Pécresse, la pauvre ...
          </span>
        </div>
      </div>
      <RestartDialog ref={restartDialog} onRestart={handleSubmitRestart} />
      <GoalDialog ref={goalDialog} />
      <DictionaryDialog
        ref={dictionaryDialog}
        onSubmitDictionary={handleSubmitDictionnary}
      />
    </>
  );
};

export default App;
