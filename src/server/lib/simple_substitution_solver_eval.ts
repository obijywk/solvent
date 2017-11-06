import * as _ from "lodash";
import * as seedrandom from "seedrandom";

import * as fitnessStats from "./fitness_stats";
import * as simpleSubstitutionSolver from "./simple_substitution_solver";

const PLAINTEXTS = [
  "ANIMALS THAT LAY EGGS DONT HAVE BELLY BUTTONS",
  "MOSQUITOES ARE ATTRACTED TO PEOPLE WHO JUST ATE BANANAS",
  "ALASKA HAS THE HIGHEST PERCENTAGE OF PEOPLE WHO WALK TO WORK",
  "THE SAN FRANCISCO CABLE CARS ARE THE ONLY MOBILE NATIONAL MONUMENT",
  "TERMITES EAT THROUGH WOOD TWO TIMES FASTER WHEN LISTENING TO ROCK MUSIC",
  "IF YOU KEEP A GOLDFISH IN A DARK ROOM IT WILL EVENTUALLY TURN WHITE",
  "NO PIECE OF PAPER CAN BE FOLDED MORE THAN SEVEN TIMES",
  "STRAWBERRIES ARE THE ONLY FRUITS WHOSE SEEDS GROW ON THE OUTSIDE",
  "PANAMA IS THE ONLY PLACE IN THE WORLD WHERE YOU CAN SEE THE SUN RISE ON THE PACIFIC AND SET ON THE ATLANTIC",
  "BEFORE MERCURY BRANDY WAS USED TO FILL THERMOMETERS",
];

seedrandom("seed", {global: true});
const lodash = _.runInContext();

function encrypt(plaintext: string): string {
  const key = lodash.join(lodash.shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "");
  let ciphertext: string = "";
  for (let i = 0; i < plaintext.length; i++) {
    const charCode = plaintext.charCodeAt(i);
    if (charCode === 32) {
      ciphertext += " ";
      continue;
    }
    ciphertext += key[charCode - 65];
  }
  return ciphertext;
}

function computeErrorRatio(a: string, b: string): number {
  let errorCount = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      errorCount++;
    }
  }
  return errorCount / a.length;
}

fitnessStats.initialized.then(async () => {
  let errorRatioSum = 0;
  let elapsedTimeSum = 0;
  for (const plaintext of PLAINTEXTS) {
    process.stdout.write(".");
    const ciphertext = encrypt(plaintext);
    const startTime = Date.now();
    const solver = new simpleSubstitutionSolver.SimpleSubstitutionSolver({
      lodash,
      numIterations: 1000,
    });
    const results = await solver.solve(ciphertext);
    const endTime = Date.now();
    const errorRatio = computeErrorRatio(plaintext, results[0].plaintext);
    if (errorRatio > 0) {
      process.stdout.write(`${errorRatio} ${results[0].plaintext}\n`);
    }
    errorRatioSum += errorRatio;
    elapsedTimeSum += endTime - startTime;
  }
  process.stdout.write("\n");
  process.stdout.write(`Average error ratio: ${errorRatioSum / PLAINTEXTS.length}\n`);
  process.stdout.write(`Average solve time: ${elapsedTimeSum / PLAINTEXTS.length / 1000}s\n`);
});
