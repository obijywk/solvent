import * as _ from "lodash";

import * as fitnessStats from "./fitness_stats";

class Candidate {
  public score: number;
  constructor(public words: string[]) {
    this.score = fitnessStats.wordScore(words.join(" "));
  }
}

const MAX_CANDIDATES = 3;

class CandidateSet {
  public candidates: Candidate[];

  constructor() {
    this.candidates = [];
  }

  public add(candidate: Candidate) {
    const insertionIndex = _.sortedIndexBy(this.candidates, candidate, (c) => -c.score);
    this.candidates.splice(
      insertionIndex,
      0,
      candidate);
    if (this.candidates.length > MAX_CANDIDATES) {
      this.candidates.splice(MAX_CANDIDATES, 1);
    }
  }

  public empty(): boolean {
    return this.candidates.length === 0;
  }
}

export function addSpaces(text: string): string {
  const memo: { [key: number]: CandidateSet } = {};

  function search(startIndex: number): CandidateSet {
    if (startIndex === text.length) {
      const initialCandidateSet = new CandidateSet();
      initialCandidateSet.add(new Candidate([]));
      return initialCandidateSet;
    }

    const memoValue = memo[startIndex];
    if (memoValue !== undefined) {
      return memoValue;
    }

    const candidateSet = new CandidateSet();
    for (let endIndex = text.length; endIndex >= startIndex; endIndex--) {
      const word = text.substring(startIndex, endIndex);
      if (fitnessStats.isWord(word)) {
        const followingCandidateSet = search(startIndex + word.length);
        for (const followingCandidate of followingCandidateSet.candidates) {
          candidateSet.add(new Candidate([word].concat(followingCandidate.words)));
        }
      }
    }

    memo[startIndex] = candidateSet;
    return candidateSet;
  }

  const finalCandidateSet = search(0);
  if (finalCandidateSet.empty()) {
    return text;
  }
  return finalCandidateSet.candidates[0].words.join(" ");
}
