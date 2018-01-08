import { expect } from "chai";
import "mocha";

import * as fitnessStats from "./fitness_stats";
import * as unweaver from "./unweaver";

describe("unweaver", () => {
  before(() => fitnessStats.initialized);

  describe("unweave function", () => {
    it("correctly unweaves a 4-word phrase", () => {
      const weavedText = "TFMTHUREUOSDRISNDDDAAAYAYYY";
      return unweaver.unweave(weavedText, 4).then((results) => {
        expect(results.length).to.equal(1);
        expect(results[0].words).to.eql(["THURSDAY", "FRIDAY", "MONDAY", "TUESDAY"]);
      });
    });
    it("correctly unweaves another 4-word phrase", () => {
      const weavedText = "MRIPITIHDNUDMNKLEBGY";
      return unweaver.unweave(weavedText, 4).then((results) => {
        expect(results[0].words).to.eql(["MIDDLE", "RING", "PINKY", "THUMB"]);
      });
    });
    it("correctly unweaves a 6-word phrase", () => {
      const weavedText = "AINNATERSRCTATHENYIDENOETDORYALONCALTBLRANYD";
      return unweaver.unweave(weavedText, 6).then((results) => {
        expect(results[0].words).to.eql(["ANARCHY", "INTERSTATE", "NINETY", "DEODORANT", "LOCALLY", "BRAND"]);
      });
    }).timeout(5000);
  });
});
