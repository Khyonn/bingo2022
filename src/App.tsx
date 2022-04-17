import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import dictionnary from "./dictionary";
import styles from "./styles.module.scss";
import { LineColumnGetter, shuffleArray } from "./utils";
import Word from "./Word";

const dimensions = {
  width: 4,
  height: 4,
};
const getWords = (wordsNb: number) =>
  shuffleArray([...dictionnary]).slice(0, wordsNb);

const App: Component = () => {
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

  let dialog: HTMLElement;
  createEffect(() => {
    if (isFinished()) {
      (dialog as any).showModal();
    }
  });

  const handleSubmitRestart = () => {
    setWords(getWords(dimensions.width * dimensions.height));
    setSelectedWords([]);
  };

  return (
    <>
      <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-700 via-white to-red-700">
        <div
          class={
            "py-4 px-2 m-2 sm:px-4 shadow-sm shadow-black max-w-3xl rounded-md relative space-y-4 " +
            styles.bg
          }
        >
          <h1 class="text-2xl font-bold text-orange-500">Bingo 2022</h1>
          <div class="grid gap-2 sm:gap-4 grid-cols-4 grid-rows-4">
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
          <span class="flex justify-end">Faites un don à Pécresse, la pauvre ...</span>
        </div>
      </div>
      <dialog ref={dialog} class={`${styles.dialog} bg-transparent`}>
        <form method="dialog" onSubmit={handleSubmitRestart}>
          <button
            class="bg-gradient-to-r from-blue-700 via-white to-red-700 border-none p-4 rounded-lg font-bold"
            type="submit"
          >
            Recommencer
          </button>
        </form>
      </dialog>
    </>
  );
};

export default App;
