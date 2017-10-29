import { expect } from "chai";
import "mocha";

import * as quadgramStats from "./quadgram_stats";

describe("quadgram_stats", () => {
  before(() => quadgramStats.initialized);
  describe("score function", () => {
    it("should score English higher than non-English", () => {
      const englishScore = quadgramStats.score("ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT NINE");
      const nonEnglishScore = quadgramStats.score("ZXK OJR QRMBV PTLF DPEL APW FJCMS RRKDC EPSL");
      expect(englishScore).to.be.greaterThan(nonEnglishScore);
    });
    it("should ignore capitalization and non-alphabetic characters", () => {
      const unstrippedScore = quadgramStats.score("aB!cD@ eF#");
      const strippedScore = quadgramStats.score("ABCDEF");
      expect(unstrippedScore).to.equal(strippedScore);
    });
  });
});
