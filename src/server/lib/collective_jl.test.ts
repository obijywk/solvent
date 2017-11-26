import { expect } from "chai";
import "mocha";

import * as collectiveJl from "./collective_jl";

/* tslint:disable:no-unused-expression */

describe("collective_jl", () => {
  before(function() {
    this.timeout(10000);
    return collectiveJl.initialized;
  });

  it("analyze returns correct results", () => {
    const puzzle = [
      "questionable",
      "businesswoman",
      "exhaustion",
      "discouraged",
      "communicated",
      "hallucinogen",
      "sequoia",
    ];

    const results = collectiveJl.analyze(puzzle, {
      allowedMisses: 2,
      maxResults: 2,
    });

    expect(results).to.have.length(2);

    expect(results[0].description).to.equal("has 5 unique vowels");
    expect(results[0].satisfied).to.eql(puzzle);

    expect(results[1].description).to.equal("has 10 unique letters");
    expect(results[1].satisfied).to.eql([
      "businesswoman",
      "exhaustion",
      "discouraged",
      "communicated",
      "hallucinogen",
    ]);
  });
});
