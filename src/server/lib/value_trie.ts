export class ValueTrieNode<V extends number> {
  public constructor(
    public value: V | null = null,
    public minDescendantValue: V | null = null,
    public children: { [key: string]: ValueTrieNode<V> } = {}) {
  }

  public insert(path: string, value: V) {
    if (this.minDescendantValue === null || this.minDescendantValue > value) {
      this.minDescendantValue = value;
    }
    if (path.length === 0) {
      if (this.value !== null) {
        throw new Error("Duplicate ValueTrieNode insertion");
      }
      this.value = value;
      return;
    }
    const key = path[0];
    let child = this.children[key];
    if (child === undefined) {
      child = new ValueTrieNode<V>();
      this.children[key] = child;
    }
    child.insert(path.substr(1), value);
  }

  public get(path: string): V | null {
    if (path.length === 0) {
      return this.value;
    }
    const child = this.children[path[0]];
    if (child === undefined) {
      return null;
    }
    return child.get(path.substr(1));
  }
}
