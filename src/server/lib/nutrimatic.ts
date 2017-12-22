// tslint:disable:no-var-requires
const nutrimatic = require("../../../build/Release/nutrimatic");
// tslint:enable:no-var-requires

export interface ISearchResult {
  text: string;
  score: number;
}

export const initialized = new Promise((resolve) => {
  nutrimatic.initialize();
  resolve();
});

export function searchIterator(pattern: string): Iterator<ISearchResult> {
  return new nutrimatic.SearchIterator(pattern);
}

export function search(pattern: string): Promise<ISearchResult[]> {
  return new Promise((resolve) => {
    const it = searchIterator(pattern);
    const results: ISearchResult[] = [];
    const step = () => {
      const item = it.next();
      if (item.done) {
        resolve(results);
        return;
      }
      results.push(item.value);
      setImmediate(step);
    };
    setImmediate(step);
  });
}
