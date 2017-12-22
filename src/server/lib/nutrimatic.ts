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

interface ISearchIterator extends Iterator<ISearchResult> {
  end(): void;
}

export const initialized = new Promise((resolve) => {
  nutrimatic.initialize();
  resolve();
});

export function searchIterator(pattern: string): ISearchIterator {
  return new nutrimatic.SearchIterator(pattern);
}

export function search(pattern: string, options: Partial<ISearchOptions> = {}): Promise<ISearchResult[]> {
  const fullOptions = {
    maxResults: 50,
    maxSeconds: 2,
    ...options,
  };
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const it = searchIterator(pattern);
    const results: ISearchResult[] = [];
    const step = () => {
      if (Date.now() - startTime > fullOptions.maxSeconds * 1000) {
        it.end();
        resolve(results);
        return;
      }

      try {
        const item = it.next();
        if (item.done) {
          it.end();
          resolve(results);
          return;
        }
        results.push(item.value);
        if (results.length === fullOptions.maxResults) {
          it.end();
          resolve(results);
          return;
        }
      } catch (err) {
        reject(err);
      }

      setImmediate(step);
    };
    setImmediate(step);
  });
}
