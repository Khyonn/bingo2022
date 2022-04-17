import { Component, createEffect, createMemo, createSignal, For, onMount } from "solid-js";
import dictionnary from "./dictionary";
import styles from "./styles.module.scss";
import { LineColumnGetter, shuffleArray } from "./utils";

const dimensions = {
  width: 4,
  height: 4,
};
const getWords = () => shuffleArray([...dictionnary]).slice(0, dimensions.width * dimensions.height);

const App: Component = () => {
  const [words, setWords] = createSignal<string[]>(getWords());
  const [selectedWord, setSelectedWords] = createSignal<string[]>([]);
  const lineColumnGetter = createMemo(() => new LineColumnGetter(words(), dimensions))

  const toggleWord = (word) => {
    if (selectedWord().includes(word)) {
      setSelectedWords((old) => old.filter((w) => w !== word));
    } else {
      setSelectedWords((old) => [...old, word]);
    }
  };

  const isFinished = () => {
    for (let i = 0; i < dimensions.height; i++) {
      if (lineColumnGetter().getLine(i).every((word) => selectedWord().includes(word))) {
        return true;
      }
    }
    for (let i = 0; i < dimensions.width; i++) {
      if (lineColumnGetter().getColumn(i).every((word) => selectedWord().includes(word))) {
        return true;
      }
    }
    return false;
  };

  let modal: HTMLElement;
  createEffect(() => {
    if (isFinished()) {
      (modal as any).showModal();
    }
  });

  const handleSubmitRestart = () => {
    setWords(getWords())
    setSelectedWords([])
  }

  return (
    <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-700 via-white to-red-700">
      <dialog ref={modal} class={`${styles.dialog} bg-transparent`}>
        <form method="dialog" onSubmit={() => {
          handleSubmitRestart();
        }}>
          <button class="bg-gradient-to-r from-blue-700 via-white to-red-700 border-none p-4 rounded-lg font-bold" type="submit">Recommencer</button>
        </form>
      </dialog>
      <div
        class="grid gap-4 grid-cols-4 grid-rows-4 m-auto"
        style="width: min(80vw, 80vh); height: min(80vw, 80vh)"
      >
        <For each={words()}>
          {(word) => (
            <button
              class="font-bold text-orange-500 bg-orange-200 border-orange-400 p-4 rounded-full border-8 shadow shadow-black transition-all"
              className={
                selectedWord().includes(word)
                  ? "text-green-500 bg-green-200 border-green-400 scale-90"
                  : "hover:scale-105 focus:scale-105 active:scale-90 active:bg-green-200 active:border-green-400"
              }
              onClick={() => toggleWord(word)}
            >
              {word}
            </button>
          )}
        </For>
      </div>
    </div>
  );
};

export default App;
