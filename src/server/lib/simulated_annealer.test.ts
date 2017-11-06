import { expect } from "chai";
import "mocha";

import * as _ from "lodash";
import * as seedrandom from "seedrandom";

import { SimulatedAnnealer } from "./simulated_annealer";

describe("simulated_annealer", () => {
  it("solves a simple sorting problem", () => {
    seedrandom("seed", {global: true});
    const lodash = _.runInContext();

    const initialSolution = lodash.shuffle(_.range(10));

    const neighborFunction = (solution: number[]) => {
      const neighbor = _.clone(solution);

      const aIndex = lodash.random(solution.length - 1);
      const bIndex = lodash.random(solution.length - 1);
      const temp = neighbor[aIndex];
      neighbor[aIndex] = neighbor[bIndex];
      neighbor[bIndex] = temp;

      return neighbor;
    };

    const costFunction = (solution: number[]) => {
      let cost: number = 0;
      for (let i = 0; i < solution.length - 1; i++) {
        cost += Math.abs(solution[i + 1] - solution[i] - 1);
      }
      return cost;
    };

    const simulatedAnnealer = new SimulatedAnnealer(
      initialSolution,
      costFunction,
      neighborFunction);

    return simulatedAnnealer.run().then((results) => {
      expect(results[0].solution).to.eql(_.range(10));
      expect(results[0].cost).to.eql(0);
      expect(results[1].cost).to.be.greaterThan(0);
    });
  });
});
