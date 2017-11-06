import * as _ from "lodash";

import * as fitnessStats from "./fitness_stats";
import { HillClimbingSolver } from "./hill_climbing_solver";
import { SimulatedAnnealer } from "./simulated_annealer";

export class Result {
  constructor(
    public key: string,
    public plaintext: string,
    public cost: number) { }
}

interface ISimpleSubstitutionSolverOptions {
  maxResults: number;
  numIterations: number;
  lodash: any;
}

export class SimpleSubstitutionSolver {
  private options: ISimpleSubstitutionSolverOptions;
  private lodash = _;

  private hasSpaces: boolean = true;

  constructor(
      options: Partial<ISimpleSubstitutionSolverOptions> = {}) {
    this.options = {
      lodash: _,
      maxResults: 10,
      numIterations: 2000,
      ...options,
    };
    if (this.options.lodash) {
      this.lodash = this.options.lodash;
    }
  }

  public solve(unstrippedCiphertext: string): Promise<Result[]> {
    const ciphertext = unstrippedCiphertext.toUpperCase().replace(/[^A-Z ]/g, "");
    this.hasSpaces = ciphertext.indexOf(" ") !== -1;

    const initialKey: string = _.join(this.lodash.shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "");

    const costFunction = (key: string) => {
      const plaintext = decipher(ciphertext, key);
      return this.computeCost(plaintext);
    };

    const neighborsFunction = (key: string) => {
      const neighbors: string[] = [];
      for (let aIndex = 0; aIndex < key.length - 1; aIndex++) {
        for (let bIndex = aIndex + 1; bIndex < key.length; bIndex++) {
          neighbors.push(swapKey(key, aIndex, bIndex));
        }
      }
      return neighbors;
    };

    const solver = new HillClimbingSolver(
      initialKey,
      costFunction,
      neighborsFunction,
      (key) => this.randomlyJumpKey(key),
      {
        equivalenceKeyFunction: (key) => decipher(ciphertext, key),
        iterations: this.options.numIterations,
        maxResults: this.options.maxResults,
      },
    );

    return solver.run().then((results) => {
      return results.map((result) => new Result(
        result.solution,
        decipher(ciphertext, result.solution),
        result.cost));
    });
  }

  public solveWithSimulatedAnnealing(unstrippedCiphertext: string): Promise<Result[]> {
    const ciphertext = unstrippedCiphertext.toUpperCase().replace(/[^A-Z ]/g, "");
    this.hasSpaces = ciphertext.indexOf(" ") !== -1;

    const initialKey: string = _.join(this.lodash.shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "");

    const costFunction = (key: string) => {
      const plaintext = decipher(ciphertext, key);
      return this.computeCost(plaintext);
    };

    const simulatedAnnealer = new SimulatedAnnealer(
      initialKey,
      costFunction,
      (key) => this.randomlyJumpKey(key),
      {
        alpha: 0.9,
        iterationsPerTemperature: this.options.numIterations / 100,
        minTemperature: 0.00001,
      });

    return simulatedAnnealer.run().then((results) => {
      return results.map((result) => new Result(
        result.solution,
        decipher(ciphertext, result.solution),
        result.cost));
    });
  }

  private randomlyJumpKey(key: string): string {
    for (let i = 0; i < this.lodash.random(3, 13); i++) {
      key = this.randomlySwapKey(key);
    }
    return key;
  }

  private randomlySwapKey(key: string): string {
    const aIndex = this.lodash.random(0, 24);
    const bIndex = this.lodash.random(aIndex + 1, 25);
    return swapKey(key, aIndex, bIndex);
  }

  private computeCost(text: string) {
    if (this.hasSpaces) {
      return -(fitnessStats.wordScore(text) + fitnessStats.quadgramScore(text));
    } else {
      return -fitnessStats.quadgramScore(text);
    }
  }
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
