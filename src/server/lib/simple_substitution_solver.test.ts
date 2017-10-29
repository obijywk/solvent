import { expect } from "chai";
import "mocha";
import rewire = require("rewire");

import * as fitnessStats from "./fitness_stats";
const simpleSubstitutionSolver = rewire("./simple_substitution_solver");

describe("simple_substitution_solver", () => {
  before(() => fitnessStats.initialized);

  describe("swapKey function", () => {
    const swapKey = simpleSubstitutionSolver.__get__("swapKey");
    it("correctly swaps letters", () => {
      const key = swapKey("ABCD", 1, 2);
      expect(key).to.equal("ACBD");
    });
  });

  describe("decipher function", () => {
    const decipher = simpleSubstitutionSolver.__get__("decipher");
    it("correctly deciphers using a key", () => {
      const ciphertext = "AB C";
      const key = "DEFABCGHIJKLMNOPQRSTUVWXYZ";
      const plaintext = decipher(ciphertext, key);
      expect(plaintext).to.equal("DE F");
    });
  });

  describe("solve function", () => {
    it("returns sane results", () => {
      const ciphertext = "AB CDEFE BG CHCEI FHA JE GBKLEL MBIE NOHA PEQEA NDMEP";
      const results = simpleSubstitutionSolver.solve(ciphertext, 20);
      expect(results.length).to.be.at.most(simpleSubstitutionSolver.__get__("MAX_RESULTS"));
      for (const result of results) {
        expect(result.key).to.have.length(26);
        expect(result.plaintext).to.have.length(ciphertext.length);
        expect(result.plaintext.indexOf(" ")).to.equal(ciphertext.indexOf(" "));
      }
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).to.be.greaterThan(results[i + 1].score);
      }
    });
  });
});
