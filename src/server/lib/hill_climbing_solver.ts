import * as _ from "lodash";

import {
  CostFunction,
  ISolutionCostSolverOptions,
  Result,
  SolutionCostSolver,
} from "./solution_cost_solver";

interface IHillClimbingSolverOptions<S> extends ISolutionCostSolverOptions<S> {
  iterations: number;
}

export class HillClimbingSolver<S> extends SolutionCostSolver<S> {
  private hillClimbingOptions: IHillClimbingSolverOptions<S>;

  constructor(
      initialSolution: S,
      costFunction: CostFunction<S>,
      private neighborsFunction: (solution: S) => S[],
      private randomJumpFunction: (solution: S) => S,
      options: Partial<IHillClimbingSolverOptions<S>> = {}) {
    super(initialSolution, costFunction, options);
    this.hillClimbingOptions = {
      iterations: 1000,
      ...this.options,
    };
  }

  public run(): Promise<Array<Result<S>>> {
    return new Promise((resolve) => {
      let iteration = 0;

      let current: S = this.results[0].solution;
      let currentCost: number = this.results[0].cost;

      const step = () => {
        let best: S = current;
        let bestCost: number = currentCost;

        const neighbors = this.neighborsFunction(current);
        for (const neighbor of neighbors) {
          const neighborCost = this.costFunction(neighbor);
          if (neighborCost < bestCost) {
            best = neighbor;
            bestCost = neighborCost;
          }
        }

        this.addResult(best, bestCost);

        if (bestCost === currentCost) {
          current = this.randomJumpFunction(this.results[0].solution);
          currentCost = this.costFunction(current);
        } else {
          current = best;
          currentCost = bestCost;
        }

        iteration++;
        if (iteration === this.hillClimbingOptions.iterations) {
          resolve(this.getResults());
          return;
        }
        setImmediate(step);
      };
      setImmediate(step);
    });
  }
}
