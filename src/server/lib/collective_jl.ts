import * as fs from "fs";
import * as _ from "lodash";
import * as readline from "readline";
import * as zlib from "zlib";

// tslint:disable:no-var-requires
require("../../../build/Release/julia_loader");
const collectiveJl = require("../../../build/Release/collective_jl");
// tslint:enable:no-var-requires

interface IAnalyzeOptions {
  allowedMisses: number;
  maxResults: number;
}

export interface IFeatureResult {
  description: string;
  probability: number;
  satisfied: string[];
}

const buildCorpus: (words: string[]) => void = collectiveJl.buildCorpus;

export const initialized = new Promise((resolve, reject) => {
  const input = fs.createReadStream("data/english_words_50k.txt.gz").pipe(zlib.createGunzip());
  const lineReader = readline.createInterface({ input });

  const words: string[] = [];
  lineReader.on("line", (line) => {
    const parts = line.split(" ");
    const word = parts[0].toLowerCase().replace(/[^a-z]/g, "");
    if (word.length > 0) {
      words.push(word);
    }
  });

  lineReader.on("close", () => {
    buildCorpus(words);
    resolve();
  });
});

export function analyze(words: string[], options: Partial<IAnalyzeOptions> = {}): IFeatureResult[] {
  const fullOptions = {
    allowedMisses: 0,
    maxResults: 10,
    ...options,
  };
  const results: IFeatureResult[] = collectiveJl.analyze(words, fullOptions.allowedMisses);
  const sortedResults = _.sortBy(results, "probability");
  return _.take(sortedResults, fullOptions.maxResults);
}
