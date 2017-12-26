import { expect } from "chai";
import "mocha";

import * as nutrimatic from "./nutrimatic";

/* tslint:disable:no-unused-expression */

describe("nutrimatic", () => {
  before(() => nutrimatic.initialized);

  it("search returns correct results", () => {
    return nutrimatic.search("\"(one|two|three)\"").then((results) => {
      expect(results).to.have.length(3);
      expect(results[0].text).to.equal("one");
      expect(results[1].text).to.equal("two");
      expect(results[2].text).to.equal("three");
      expect(results[0].score).to.be.greaterThan(results[1].score);
      expect(results[1].score).to.be.greaterThan(results[2].score);
    });
  });

  it("search respects max results", () => {
    return nutrimatic.search("AAA", {maxResults: 2}).then((results) => {
      expect(results).to.have.length(2);
    });
  });

  it("search fails with unparseable pattern", () => {
    expect(() => nutrimatic.searchIterator("(")).to.throw();
  });

  it("multiple parallel searches work", () => {
    const search1 = nutrimatic.searchIterator("\"(one|three)\"");
    const search2 = nutrimatic.searchIterator("\"(two|four)\"");
    expect(search1.next().value.text).to.equal("one");
    expect(search2.next().value.text).to.equal("two");
    expect(search1.next().value.text).to.equal("three");
    expect(search2.next().value.text).to.equal("four");
    expect(search1.next().done).to.be.true;
    expect(search2.next().done).to.be.true;
  });
});
