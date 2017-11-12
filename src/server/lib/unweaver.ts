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

class Word {
  constructor(
    public letters: Letter[] = [],
    public cost: number | null = null) {
  }
}

function wordString(word: Word) {
  return _.map(word.letters, "letter").join("");
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
    const initialSolution = initialLetters.map(
      (letter) => new Word([letter], -fitnessStats.wordScore(letter.letter)));
    const solver = new SolutionCostSolver<Word[]>(
      initialSolution,
      (words) => _.sumBy(words, "cost"));

    const stepQueue: Step[] = [new Step(new Word(), fitnessStats.wordLogProbsTrie, initialLetters, 0, [])];
    function runStep() {
      if (stepQueue.length === 0) {
        resolve(solver.getResults().map((result) => new Result(
          result.solution.map(wordString),
          result.cost)));
        return;
      }

      const step = stepQueue.pop() as Step;

      const wordsCost = _.sumBy(step.words, "cost");
      const results = solver.getResults();
      if (wordsCost > results[results.length - 1].cost) {
        setImmediate(runStep);
        return;
      }

      let lettersIndexLimit = step.letters.length;
      if (step.prefix.letters.length === 0) {
        if (step.letters.length === 0) {
          const solution = _.sortBy(step.words, (word) => word.letters[0].position);
          solver.addResult(solution);
        } else {
          lettersIndexLimit = step.lettersStart + 1;
        }
      }

      for (let lettersIndex = step.lettersStart; lettersIndex < lettersIndexLimit; lettersIndex++) {
        const letter = step.letters[lettersIndex];
        const childNode = step.prefixTrieNode.children[letter.letter];
        if (childNode !== undefined) {
          const word = new Word(step.prefix.letters.concat([letter]));
          const nextLetters = _.clone(step.letters);
          nextLetters.splice(lettersIndex, 1);
          if (childNode.value !== null) {
            word.cost = -childNode.value;
            const nextWords = step.words.concat([word]);
            const nextWordStep = new Step(new Word(), fitnessStats.wordLogProbsTrie, nextLetters, 0, nextWords);
            stepQueue.push(nextWordStep);
          }
          const nextStep = new Step(word, childNode, nextLetters, lettersIndex, step.words);
          stepQueue.push(nextStep);
        }
      }

      setImmediate(runStep);
    }
    setImmediate(runStep);
  });
}
