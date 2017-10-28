import { expect } from "chai";
import "mocha";

import * as quadgram_stats from "./quadgram_stats";

describe("quadgram_stats", () => {
  before(() => quadgram_stats.initialized);
  describe("score function", () => {
    it("should score English higher than non-English", () => {
      const englishScore = quadgram_stats.score("ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT NINE");
      const nonEnglishScore = quadgram_stats.score("ZXK OJR QRMBV PTLF DPEL APW FJCMS RRKDC EPSL");
      expect(englishScore).to.be.greaterThan(nonEnglishScore);
    });
    it("should ignore capitalization and non-alphabetic characters", () => {
      const unstrippedScore = quadgram_stats.score("aB!cD@ eF#");
      const strippedScore = quadgram_stats.score("ABCDEF");
      expect(unstrippedScore).to.equal(strippedScore);
    });
  });
});
