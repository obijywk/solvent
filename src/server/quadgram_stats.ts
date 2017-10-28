import * as fs from "fs";
import * as readline from "readline";
import * as zlib from "zlib";

const quadgramLogProbs: { [key: string]: number } = {};
let floorLogProb: number;

function loadQuadgrams(): Promise<void> {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream("data/english_quadgrams.txt.gz").pipe(zlib.createGunzip());
    const lineReader = readline.createInterface({ input });

    const quadgramFrequencies: {quadgram: string, frequency: number}[] = [];
    let n: number = 0;
    lineReader.on("line", line => {
      const parts = line.split(" ");
      const quadgramFrequency = {quadgram: parts[0], frequency: parseInt(parts[1])};
      quadgramFrequencies.push(quadgramFrequency);
      n += quadgramFrequency.frequency;
    });

    lineReader.on("close", () => {
      for (const quadgramFrequency of quadgramFrequencies) {
        quadgramLogProbs[quadgramFrequency.quadgram] = Math.log(quadgramFrequency.frequency / n);
      }
      floorLogProb = Math.log(0.01 / n);
      resolve();
    });
  });
}

export const initialized = loadQuadgrams();

export function score(text: string): number {
  const strippedText = text.toUpperCase().replace(/[^A-Z]/g, "");
  let score: number = 0;
  for (let i = 0; i <= strippedText.length - 4; i++) {
    const quadgram = strippedText.substring(i, i + 4);
    const quadgramLogProb = quadgramLogProbs[quadgram];
    if (quadgramLogProb !== undefined) {
      score += quadgramLogProb;
    } else {
      score += floorLogProb;
    }
  }
  return score;
}
