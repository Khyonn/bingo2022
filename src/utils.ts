export function shuffleArray<T>(array: T[]): T[] {
  let curId = array.length;
  // There remain elements to shuffle
  while (0 !== curId) {
    // Pick a remaining element
    let randId = Math.floor(Math.random() * curId);
    curId -= 1;
    // Swap it with the current element.
    let tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }
  return array;
}

function* range(first, last) {
  while (first <= last) {
    yield first++;
  }
}

export class LineColumnGetter<T> {
  constructor(
    private array: T[],
    private dimensions: { width: number; height: number }
  ) {}
  getLine(lineIndex: number) {
    const start = lineIndex * this.dimensions.width;
    return this.array.slice(start, start + this.dimensions.width);
  }
  getColumn(columnIndex: number) {
    return Array.from(range(0, this.dimensions.height - 1)).map(
      (nb) => this.array[nb * this.dimensions.width + columnIndex]
    );
  }
}
