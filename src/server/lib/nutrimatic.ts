// tslint:disable:no-var-requires
const nutrimatic = require("../../../build/Release/nutrimatic");
// tslint:enable:no-var-requires

export interface ISearchOptions {
  maxResults: number;
  maxSeconds: number;
}

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

export function search(pattern: string, options: Partial<ISearchOptions> = {}): Promise<ISearchResult[]> {
  const fullOptions = {
    maxResults: 50,
    maxSeconds: 2,
    ...options,
  };
  const startTime = Date.now();
  return new Promise((resolve) => {
    const it = searchIterator(pattern);
    const results: ISearchResult[] = [];
    const step = () => {
      if (Date.now() - startTime > fullOptions.maxSeconds * 1000) {
        resolve(results);
        return;
      }

      const item = it.next();
      if (item.done) {
        resolve(results);
        return;
      }

      results.push(item.value);
      if (results.length === fullOptions.maxResults) {
        resolve(results);
        return;
      }

      setImmediate(step);
    };
    setImmediate(step);
  });
}
