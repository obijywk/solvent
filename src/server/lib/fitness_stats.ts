import * as fs from "fs";
import * as readline from "readline";
import * as zlib from "zlib";

const quadgramLogProbs: { [key: string]: number } = {};
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
    const quadgram = strippedText.substring(i, i + 4);
    const quadgramLogProb = quadgramLogProbs[quadgram];
    if (quadgramLogProb !== undefined) {
      textScore += quadgramLogProb;
    } else {
      textScore += quadgramFloorLogProb;
    }
  }
  return textScore;
}

export function wordScore(text: string): number {
  const strippedText = text.toUpperCase().replace(/[^A-Z ]/g, "");
  const words = strippedText.split(" ");
  let textScore: number = 0;
  for (const word of words) {
    const wordLogProb = wordLogProbs[word];
    if (wordLogProb !== undefined) {
      textScore += wordLogProb;
    } else {
      textScore += wordFloorLogProb;
    }
  }
  return textScore;
}
