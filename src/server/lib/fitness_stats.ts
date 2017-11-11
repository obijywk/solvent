import * as fs from "fs";
import * as readline from "readline";
import * as zlib from "zlib";

const quadgramLogProbs: { [key: string]: number } = {};
const quadgramLogProbTrie: number[][][][] = [];
let quadgramFloorLogProb: number;

const wordLogProbs: { [key: string]: number } = {};
let wordFloorLogProb: number;

function loadData(): Promise<void> {
  const quadgramsPromise = new Promise((resolve, reject) => {
    const input = fs.createReadStream("data/english_quadgrams.txt.gz").pipe(zlib.createGunzip());
    const lineReader = readline.createInterface({ input });

    const quadgramFrequencies: Array<{quadgram: string, frequency: number}> = [];
    let n: number = 0;
    lineReader.on("line", (line) => {
      const parts = line.split(" ");
      const quadgramFrequency = {quadgram: parts[0], frequency: parseInt(parts[1], 10)};
      quadgramFrequencies.push(quadgramFrequency);
      n += quadgramFrequency.frequency;
    });

    lineReader.on("close", () => {
      for (const quadgramFrequency of quadgramFrequencies) {
        quadgramLogProbs[quadgramFrequency.quadgram] = Math.log(quadgramFrequency.frequency / n);
      }
      quadgramFloorLogProb = Math.log(0.01 / n);

      for (let a = 0; a < 26; a++) {
        const l1: number[][][] = [];
        for (let b = 0; b < 26; b++) {
          const l2: number[][] = [];
          for (let c = 0; c < 26; c++) {
            const l3: number[] = [];
            for (let d = 0; d < 26; d++) {
              const quadgram =
                String.fromCharCode(a + 65) +
                String.fromCharCode(b + 65) +
                String.fromCharCode(c + 65) +
                String.fromCharCode(d + 65);
              let logProb = quadgramLogProbs[quadgram];
              if (logProb === undefined) {
                logProb = quadgramFloorLogProb;
              }
              l3.push(logProb);
            }
            l2.push(l3);
          }
          l1.push(l2);
        }
        quadgramLogProbTrie.push(l1);
      }

      resolve();
    });
  });

  const wordsPromise = new Promise((resolve, reject) => {
    const input = fs.createReadStream("data/english_words_50k.txt.gz").pipe(zlib.createGunzip());
    const lineReader = readline.createInterface({ input });

    const wordFrequencies: Array<{word: string, frequency: number}> = [];
    let n: number = 0;
    lineReader.on("line", (line) => {
      const parts = line.split(" ");
      const wordFrequency = {word: parts[0], frequency: parseInt(parts[1], 10)};
      wordFrequencies.push(wordFrequency);
      n += wordFrequency.frequency;
    });

    lineReader.on("close", () => {
      for (const wordFrequency of wordFrequencies) {
        wordLogProbs[wordFrequency.word] = Math.log(wordFrequency.frequency / n);
      }
      wordFloorLogProb = Math.log(0.01 / n);
      resolve();
    });
  });

  return Promise.all([quadgramsPromise, wordsPromise]).then(() => undefined);
}

export const initialized = loadData();

export function quadgramScore(text: string): number {
  const strippedText = text.toUpperCase().replace(/[^A-Z]/g, "");
  let textScore: number = 0;
  for (let i = 0; i <= strippedText.length - 4; i++) {
    const l1 = quadgramLogProbTrie[strippedText.charCodeAt(i) - 65];
    const l2 = l1[strippedText.charCodeAt(i + 1) - 65];
    const l3 = l2[strippedText.charCodeAt(i + 2) - 65];
    const quadgramLogProb = l3[strippedText.charCodeAt(i + 3) - 65];
    textScore += quadgramLogProb;
  }
  return textScore;
}

export function isWord(inputWord: string): boolean {
  const word = inputWord.toUpperCase();
  return wordLogProbs[word] !== undefined;
}

export function wordScore(text: string): number {
  return wordScoreClean(text.toUpperCase().replace(/[^A-Z ]/g, ""));
}

export function wordScoreClean(text: string): number {
  const words = text.split(" ");
  let textScore: number = 0;
  for (const word of words) {
    if (word.length === 0) {
      continue;
    }
    const wordLogProb = wordLogProbs[word];
    if (wordLogProb !== undefined) {
      textScore += wordLogProb;
    } else {
      textScore += wordFloorLogProb;
    }
  }
  return textScore;
}
