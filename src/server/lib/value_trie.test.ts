import { expect } from "chai";
import "mocha";

import { ValueTrieNode } from "./value_trie";

/* tslint:disable:no-unused-expression */

describe("value_trie", () => {
  it("insert and get work correctly", () => {
    const trie = new ValueTrieNode<number>();
    trie.insert("A", 1);
    trie.insert("AB", 2);
    trie.insert("AC", 3);
    trie.insert("BC", 4);

    expect(trie.get("A")).to.equal(1);
    expect(trie.get("AB")).to.equal(2);
    expect(trie.get("AC")).to.equal(3);
    expect(trie.get("BC")).to.equal(4);
    expect(trie.get("")).to.be.null;
    expect(trie.get("B")).to.be.null;
    expect(trie.get("C")).to.be.null;
  });
});
