import { expect } from "chai";
import "mocha";

import * as nutrimatic from "./nutrimatic";

describe("nutrimatic", () => {
  before(() => nutrimatic.initialized);

  it("search returns correct results", () => {
    const results = nutrimatic.search("\"(one|two|three)\"");
    expect(results).to.have.length(3);
    expect(results[0].text).to.equal("one");
    expect(results[1].text).to.equal("two");
    expect(results[2].text).to.equal("three");
    expect(results[0].score).to.be.greaterThan(results[1].score);
    expect(results[1].score).to.be.greaterThan(results[2].score);
  });

  it("search fails with unparseable pattern", () => {
    expect(() => nutrimatic.search("(")).to.throw();
  });
});
