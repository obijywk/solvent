import { expect } from "chai";
import "mocha";

import * as clueDatabase from "./clue_database";

/* tslint:disable:no-unused-expression */

describe("clue database", () => {
  before(() => clueDatabase.initialized);

  it("simple question text search returns reasonable results", () => {
    return clueDatabase.search({
      matchQuery: "question: snow",
      maxResults: 5,
    }).then((clues) => {
      expect(clues).has.length(5);
      for (const clue of clues) {
        expect(clue.question.toLowerCase()).to.have.string("snow");
      }
    });
  });

  it("answer length restrictions work", () => {
    return clueDatabase.search({
      matchQuery: "question: blue",
      maxAnswerLength: 9,
      maxResults: 5,
      minAnswerLength: 8,
    }).then((clues) => {
      expect(clues).has.length(5);
      for (const clue of clues) {
        expect(clue.answer.length).to.be.gte(8);
        expect(clue.answer.length).to.be.lte(9);
      }
    });
  });

  it("known letter restrictions work", () => {
    return clueDatabase.search({
      knownAnswerLetters: {0: "T", 1: "A"},
      matchQuery: "question: story",
      maxResults: 3,
    }).then((clues) => {
      expect(clues).has.length(3);
      for (const clue of clues) {
        expect(clue.answer[0]).to.equal("T");
        expect(clue.answer[1]).to.equal("A");
      }
    });
  });
});
