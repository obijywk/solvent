import * as _ from "lodash";

import { setImmediate } from "timers";

import * as fitnessStats from "./fitness_stats";
import { ValueTrieNode } from "./value_trie";

export class Result {
  constructor(
    public words: string[],
    public cost: number) { }
}

interface IUnweaverOptions {
  maxResults: number;
  stateSpaceLimit: number;
}

class TrieMarker {
  public node: ValueTrieNode<number>;
  public word: string;

  constructor(node: ValueTrieNode<number>) {
    this.node = node;
    this.word = "";
  }

  public tryAdvance(c: string): TrieMarker | null {
    const childNode = this.node.children[c];
    if (!childNode) {
      return null;
    }
    const newTrieMarker = new TrieMarker(childNode);
    newTrieMarker.word = this.word + c;
    return newTrieMarker;
  }
}

type Branch = TrieMarker[];

function branchCost(branch: Branch): number {
  let cost: number = 0;
  for (const trieMarker of branch) {
    if (trieMarker.node.minDescendantValue !== null) {
      cost += trieMarker.node.minDescendantValue;
    }
  }
  return cost;
}

function isBranchComplete(branch: Branch, numWords: number): boolean {
  if (branch.length < numWords) {
    return false;
  }
  for (const trieMarker of branch) {
    if (trieMarker.node.value === null) {
      return false;
    }
  }
  return true;
}

function branchKey(branch: Branch): string {
  return _.map(branch, "word").sort().join(",");
}

class BranchSet {
  public branchList: Branch[] = [];
  public branchKeys: {[key: string]: boolean} = {};

  public add(branch: Branch) {
    const key = branchKey(branch);
    if (!_.has(this.branchKeys, key)) {
      this.branchList.push(branch);
      this.branchKeys[key] = true;
    }
  }

  public prune(maxSize: number) {
    if (this.branchList.length > maxSize) {
      this.branchList = _.sortBy(this.branchList, (branch) => -branchCost(branch));
      this.branchList.splice(maxSize);
      this.branchKeys = {};
      for (const branch of this.branchList) {
        this.branchKeys[branchKey(branch)] = true;
      }
    }
  }
}

export function unweave(
    text: string,
    numWords: number,
    options: Partial<IUnweaverOptions> = {}): Promise<Result[]> {
  text = text.toUpperCase().replace(/[^A-Z]/g, "");
  const fullOptions: IUnweaverOptions = {
    maxResults: 100,
    stateSpaceLimit: 10000,
    ...options,
  };
  return new Promise((resolve) => {
    let branches = new BranchSet();
    branches.add([]);

    let textIndex: number = 0;

    function runStep() {
      const c = text[textIndex];

      const newBranches = new BranchSet();
      for (const branch of branches.branchList) {
        for (let i = 0; i < branch.length; i++) {
          const trieMarker = branch[i];
          const nextTrieMarker = trieMarker.tryAdvance(c);
          if (nextTrieMarker) {
            const newBranch = branch.slice();
            newBranch[i] = nextTrieMarker;
            newBranches.add(newBranch);
          }
        }
        if (branch.length < numWords) {
          const trieMarker = new TrieMarker(fitnessStats.wordLogProbsTrie).tryAdvance(c);
          if (trieMarker) {
            branch.push(trieMarker);
            newBranches.add(branch);
          }
        }
      }
      branches = newBranches;
      branches.prune(fullOptions.stateSpaceLimit);

      textIndex++;
      if (textIndex === text.length) {
        let results: Result[] = [];
        for (const branch of branches.branchList) {
          if (!isBranchComplete(branch, numWords)) {
            continue;
          }
          const words = _.map(branch, "word");
          const cost = branchCost(branch);
          results.push(new Result(words, cost));
        }
        results = _.sortBy(results, (result) => result.cost);
        results.splice(fullOptions.maxResults);
        resolve(results);
      } else if (branches.branchList.length === 0) {
        resolve([]);
      } else {
        setImmediate(runStep);
      }
    }
    setImmediate(runStep);
  });
}
