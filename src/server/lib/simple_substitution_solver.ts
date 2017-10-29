import * as _ from "lodash";

import * as fitnessStats from "./fitness_stats";

export class Result {
  constructor(
    public key: string,
    public plaintext: string,
    public score: number) {}
}

const MAX_RESULTS = 10;

class ResultSet {
  public results: Result[] = [];

  public add(result: Result) {
    const insertionIndex = _.sortedIndexBy(this.results, result, (r) => -r.score);
    if (insertionIndex < this.results.length && this.results[insertionIndex].plaintext === result.plaintext) {
      return;
    }
    this.results.splice(
      insertionIndex,
      0,
      result);
    if (this.results.length > MAX_RESULTS) {
      this.results.splice(10, 1);
    }
  }
}

export function solve(ciphertext: string, numIterations: number): Result[] {
  const strippedCiphertext = ciphertext.toUpperCase().replace(/[^A-Z ]/g, "");
  const initialKey: string = _.join(_.shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "");
  const initialPlaintext: string = decipher(strippedCiphertext, initialKey);

  let lastResult = new Result(
    initialKey,
    initialPlaintext,
    scorePlaintext(initialPlaintext));

  const resultSet = new ResultSet();
  resultSet.add(lastResult);

  for (let i = 0; i < numIterations; i++) {
    const result = _.clone(lastResult);
    for (let aIndex = 0; aIndex < initialKey.length - 1; aIndex++) {
      for (let bIndex = aIndex + 1; bIndex < initialKey.length; bIndex++) {
        const key = swapKey(lastResult.key, aIndex, bIndex);
        const plaintext = decipher(strippedCiphertext, key);
        const score = scorePlaintext(plaintext);
        if (score > result.score) {
          result.key = key;
          result.plaintext = plaintext;
          result.score = score;
        }
      }
    }
    if (result.score === lastResult.score) {
      result.key = randomlyAdjustKey(result.key);
      result.plaintext = decipher(strippedCiphertext, result.key);
      result.score = scorePlaintext(result.plaintext);
    }
    resultSet.add(result);
    lastResult = result;
  }

  return resultSet.results;
}

function randomlyAdjustKey(key: string): string {
  for (let i = 0; i < _.random(1, 13); i++) {
    const aIndex = _.random(0, 24);
    const bIndex = _.random(aIndex + 1, 25);
    key = swapKey(key, aIndex, bIndex);
  }
  return key;
}

function swapKey(key: string, aIndex: number, bIndex: number): string {
  return (
    key.slice(0, aIndex) +
    key[bIndex] +
    key.slice(aIndex + 1, bIndex) +
    key[aIndex] +
    key.slice(bIndex + 1, key.length));
}

function decipher(ciphertext: string, key: string) {
  let output: string = "";
  for (let i = 0; i < ciphertext.length; i++) {
    const charCode = ciphertext.charCodeAt(i);
    if (charCode === 32) {
      output += " ";
      continue;
    }
    output += key[charCode - 65];
  }
  return output;
}

function scorePlaintext(plaintext: string) {
  if (plaintext.indexOf(" ") !== -1) {
    return fitnessStats.wordScore(plaintext) + fitnessStats.quadgramScore(plaintext);
  } else {
    return fitnessStats.quadgramScore(plaintext);
  }
}
