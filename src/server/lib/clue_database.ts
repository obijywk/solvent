import * as sqlite3 from "sqlite3";

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

const databasePath = "data/clues.db";
let db: sqlite3.Database;

export const initialized = new Promise<void>((resolve) => {
  db = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY);
  resolve();
});
