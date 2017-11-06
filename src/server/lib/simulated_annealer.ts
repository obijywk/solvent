import {
  CostFunction,
  ISolutionCostSolverOptions,
  Result,
  SolutionCostSolver,
} from "./solution_cost_solver";

interface ISimulatedAnnealerOptions<S> extends ISolutionCostSolverOptions<S> {
  alpha: number;
  iterationsPerTemperature: number;
  minTemperature: number;
}

export class SimulatedAnnealer<S> extends SolutionCostSolver<S> {
  private simulatedAnnealerOptions: ISimulatedAnnealerOptions<S>;

  constructor(
      initialSolution: S,
      costFunction: CostFunction<S>,
      private neighborFunction: (solution: S) => S,
      options: Partial<ISimulatedAnnealerOptions<S>> = {}) {
    super(initialSolution, costFunction, options);
    this.simulatedAnnealerOptions = {
      alpha: 0.9,
      iterationsPerTemperature: 200,
      minTemperature: 0.0001,
      ...this.options,
    };
  }

  public run(): Promise<Array<Result<S>>> {
    let temperature: number = 1.0;
    let iteration: number = 0;

    let solution: S = this.initialSolution;
    let solutionCost: number = this.costFunction(solution);

    return new Promise((resolve, reject) => {
      const stepFunction = () => {
        const neighbor = this.neighborFunction(solution);
        const neighborCost = this.costFunction(neighbor);
        const acceptanceProbability = Math.exp((solutionCost - neighborCost) / temperature);
        if (acceptanceProbability > Math.random()) {
          solution = neighbor;
          solutionCost = neighborCost;
          this.addResult(solution, solutionCost);
        }

        iteration++;
        if (iteration >= this.simulatedAnnealerOptions.iterationsPerTemperature) {
          temperature = temperature * this.simulatedAnnealerOptions.alpha;
          iteration = 0;
        }
        if (temperature <= this.simulatedAnnealerOptions.minTemperature) {
          resolve(this.getResults());
          return;
        }

        setImmediate(stepFunction);
      };
      setImmediate(stepFunction);
    });
  }
}
