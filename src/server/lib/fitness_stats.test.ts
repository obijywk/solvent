import { expect } from "chai";
import "mocha";

import * as fitnessStats from "./fitness_stats";

/* tslint:disable:no-unused-expression */

describe("fitness_stats", () => {
  before(() => fitnessStats.initialized);

  describe("quadgramScore function", () => {
    it("should score English higher than non-English", () => {
      const englishScore = fitnessStats.quadgramScore("ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT NINE");
      const nonEnglishScore = fitnessStats.quadgramScore("ZXK OJR QRMBV PTLF DPEL APW FJCMS RRKDC EPSL");
      expect(englishScore).to.be.greaterThan(nonEnglishScore);
    });

    it("should ignore capitalization and non-alphabetic characters", () => {
      const unstrippedScore = fitnessStats.quadgramScore("aB!cD@ eF#");
      const strippedScore = fitnessStats.quadgramScore("ABCDEF");
      expect(unstrippedScore).to.equal(strippedScore);
    });
  });

  describe("isWord function", () => {
    it("returns true for a word", () => {
      expect(fitnessStats.isWord("test")).to.be.true;
    });
    it("returns false for a non-word", () => {
      expect(fitnessStats.isWord("zxcvbnm")).to.be.false;
    });
  });

  describe("wordScore function", () => {
    it("should score English higher than non-English", () => {
      const englishScore = fitnessStats.wordScore("ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT NINE");
      const nonEnglishScore = fitnessStats.wordScore("ZXK OJR QRMBV PTLF DPEL APW FJCMS RRKDC EPSL");
      expect(englishScore).to.be.greaterThan(nonEnglishScore);
    });

    it("should ignore capitalization and non-alphabetic characters", () => {
      const unstrippedScore = fitnessStats.wordScore("oN!e tW@o tH#ree");
      const strippedScore = fitnessStats.wordScore("ONE TWO THREE");
      expect(unstrippedScore).to.equal(strippedScore);
    });
  });
});
