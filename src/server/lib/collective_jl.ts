import * as debugCreator from "debug";
import * as fs from "fs";
import * as _ from "lodash";
import * as readline from "readline";
import * as zlib from "zlib";

const debug = debugCreator("solvent");

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

const buildCorpus: (words: string[], callback: (err: string | null) => void) => void = collectiveJl.buildCorpus;

let resolveInitialize: () => void;
let rejectInitialize: (err: Error) => void;

export const initialized = new Promise((resolve, reject) => {
  resolveInitialize = resolve;
  rejectInitialize = reject;
});

export function initialize() {
  debug("Collective.jl initialization: reading English words");
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
    debug("Collective.jl initialization: building corpus");
    buildCorpus(words, (err) => {
      if (err) {
        rejectInitialize(new Error(err));
        return;
      }
      debug("Collective.jl initialization: corpus built");
      if (resolveInitialize !== undefined) {
        resolveInitialize();
      }
    });
  });
}

export function analyze(words: string[], options: Partial<IAnalyzeOptions> = {}): Promise<IFeatureResult[]> {
  return new Promise((resolve, reject) => {
    initialized.then(() => {
      const fullOptions = {
        allowedMisses: 0,
        maxResults: 10,
        ...options,
      };
      try {
        const results: IFeatureResult[] = collectiveJl.analyze(words, fullOptions.allowedMisses);
        const sortedResults = _.sortBy(results, "probability");
        resolve(_.take(sortedResults, fullOptions.maxResults));
      } catch (err) {
        reject(err);
      }
    });
  });
}
