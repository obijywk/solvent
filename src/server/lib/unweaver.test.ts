import { expect } from "chai";
import "mocha";

import * as fitnessStats from "./fitness_stats";
import * as unweaver from "./unweaver";

describe("unweaver", () => {
  before(() => fitnessStats.initialized);

  describe("unweave function", () => {
    it("correctly unweaves for simple phrase", () => {
      const weavedText = "ONTEWO";
      return unweaver.unweave(weavedText).then((results) => {
        expect(results[0].words).to.eql(["ONE", "TWO"]);
      });
    });
    it("correctly unweaves with word count constraint", () => {
      const weavedText = "OTNWTHOREEE";
      return unweaver.unweave(weavedText, 4).then((results) => {
        expect(results[0].words).to.eql(["ON", "THREE", "WE", "TO"]);
      });
    });
  });
});
