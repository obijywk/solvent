import { expect } from "chai";
import "mocha";

import * as collectiveJl from "./collective_jl";

/* tslint:disable:no-unused-expression */

const corpus = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

describe("collective_jl", () => {
  it("analyze", () => {
    collectiveJl.buildCorpus(corpus);
    const results = collectiveJl.analyze(["one", "two"]);
    const processedResults = collectiveJl.sortAndFilter(results, 10);
    expect(processedResults).to.have.length(10);
  }).timeout(10000);
});
