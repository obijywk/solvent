import * as _ from "lodash";

import * as fitnessStats from "./fitness_stats";
import { SolutionCostSolver } from "./solution_cost_solver";
import { ValueTrieNode } from "./value_trie";

export class Result {
  constructor(
    public words: string[],
    public cost: number) { }
}

class Letter {
  constructor(
    public position: number,
    public letter: string) {
  }
}

type Word = Letter[];

function wordString(word: Word) {
  return _.map(word, "letter").join("");
}

class Step {
  constructor(
    public prefix: Word,
    public prefixTrieNode: ValueTrieNode<number>,
    public letters: Letter[],
    public lettersStart: number,
    public words: Word[]) {
  }
}

export function unweave(text: string): Promise<Result[]> {
  return new Promise((resolve) => {
    const initialLetters = [];
    for (let i = 0; i < text.length; i++) {
      initialLetters.push(new Letter(i, text[i]));
    }
    const initialSolution = initialLetters.map((letter) => [letter]);
    const solver = new SolutionCostSolver<Word[]>(
      initialSolution,
      (words) => -fitnessStats.wordListScore(words.map(wordString)));

    const stepQueue: Step[] = [new Step([], fitnessStats.wordLogProbsTrie, initialLetters, 0, [])];
    function runStep() {
      if (stepQueue.length === 0) {
        resolve(solver.getResults().map((result) => new Result(
          result.solution.map(wordString),
          result.cost)));
        return;
      }
      const step = stepQueue.pop() as Step;
      if (step.prefix.length === 0 && step.letters.length === 0) {
        solver.addResult(_.sortBy(step.words, (word) => word[0].position));
      }
      for (let lettersIndex = step.lettersStart; lettersIndex < step.letters.length; lettersIndex++) {
        const letter = step.letters[lettersIndex];
        const childNode = step.prefixTrieNode.children[letter.letter];
        if (childNode !== undefined) {
          const word = step.prefix.concat([letter]);
          const nextLetters = _.clone(step.letters);
          nextLetters.splice(lettersIndex, 1);
          if (childNode.value !== null) {
            stepQueue.push(new Step([], fitnessStats.wordLogProbsTrie, nextLetters, 0, step.words.concat([word])));
          }
          stepQueue.push(new Step(word, childNode, nextLetters, lettersIndex, step.words));
        }
      }
      setImmediate(runStep);
    }
    setImmediate(runStep);
  });
}
