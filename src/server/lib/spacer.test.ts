import { expect } from "chai";
import "mocha";

import * as fitnessStats from "./fitness_stats";
import * as spacer from "./spacer";

describe("spacer", () => {
  before(() => fitnessStats.initialized);

  describe("addSpaces function", () => {
    it("correctly adds spaces for simple phrase", () => {
      const unspacedText = "WILDGOOSECHASE";
      const spacedText = spacer.addSpaces(unspacedText);
      expect(spacedText).to.equal("WILD GOOSE CHASE");
    });
    it("correctly adds spaces for phrase with splittable words", () => {
      const unspacedText = "INSTRUMENTALIGNMENT";
      const spacedText = spacer.addSpaces(unspacedText);
      expect(spacedText).to.equal("INSTRUMENT ALIGNMENT");
    });
    it("returns the spacing with the best English fitness", () => {
      const unspacedText = "COLORTHATSBROWNISHANDYELLOWASSOCIATEDWITHTHEMILITARY";
      const spacedText = spacer.addSpaces(unspacedText);
      expect(spacedText).to.equal("COLOR THATS BROWNISH AND YELLOW ASSOCIATED WITH THE MILITARY");
    });
  });
});
