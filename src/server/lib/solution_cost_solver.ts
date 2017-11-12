import * as _ from "lodash";

export type CostFunction<S> = (solution: S) => number;
export type EquivalenceKeyFunction<S> = (solution: S) => string;

export interface ISolutionCostSolverOptions<S> {
  maxResults: number;
  equivalenceKeyFunction?: EquivalenceKeyFunction<S>;
}

export class Result<S> {
  constructor(
    public solution: S,
    public cost: number,
    public equivalenceKey?: string) {
  }
}

export class SolutionCostSolver<S> {
  protected options: ISolutionCostSolverOptions<S>;
  protected results: Array<Result<S>> = [];

  public constructor(
      protected initialSolution: S,
      protected costFunction: CostFunction<S>,
      options: Partial<ISolutionCostSolverOptions<S>> = {}) {
    this.options = {
      maxResults: 10,
      ...options,
    };
    this.addResult(initialSolution, this.costFunction(initialSolution));
  }

  public addResult(solution: S, cost: number = this.costFunction(solution)): boolean {
    const result = new Result(
      solution,
      cost,
      this.options.equivalenceKeyFunction ? this.options.equivalenceKeyFunction(solution) : undefined);

    const insertionIndex = _.sortedIndexBy(this.results, result, (r) => r.cost);
    if (insertionIndex < this.results.length) {
      if (result.equivalenceKey &&
          this.results[insertionIndex].equivalenceKey &&
          this.results[insertionIndex].equivalenceKey === result.equivalenceKey) {
        return false;
      } else if (result.cost === this.results[insertionIndex].cost) {
        return false;
      }
    }

    if (insertionIndex === this.options.maxResults) {
      return false;
    }

    this.results.splice(
      insertionIndex,
      0,
      result);

    if (this.results.length > this.options.maxResults) {
      this.results.splice(this.options.maxResults, 1);
    }

    return true;
  }

  public getResults(): Array<Result<S>> {
    return this.results;
  }
}
