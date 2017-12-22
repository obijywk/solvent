import { expect } from "chai";
import "mocha";

import * as nutrimatic from "./nutrimatic";

describe("nutrimatic", () => {
  it("test", () => {
    expect(nutrimatic.test()).to.equal("Hello");
  });
});
