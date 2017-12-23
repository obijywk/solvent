export class Clue {
  public constructor(
    public id: number,
    public source: "nytimes",
    public date: Date,
    public clueNumber: number,
    public direction: "A" | "D",
    public question: string,
    public answer: string) {
  }
}
