// tslint:disable:no-var-requires
const nutrimatic = require("../../../build/Release/nutrimatic");
// tslint:enable:no-var-requires

export interface ISearchResult {
  text: string;
  score: number;
}

export const initialized = new Promise((resolve, reject) => {
  nutrimatic.initialize();
  resolve();
});

export function search(pattern: string): ISearchResult[] {
  return nutrimatic.search(pattern);
}
