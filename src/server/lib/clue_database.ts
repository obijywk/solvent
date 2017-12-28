import * as sqlite3 from "sqlite3";

export class Clue {
  public static fromRow(row: any): Clue {
    return new Clue(
      row.id,
      row.source,
      new Date(row.puzzledate * 1000),
      row.cluelabel,
      row.question,
      row.answer);
  }

  public constructor(
    public id: number,
    public source: string,
    public puzzleDate: Date,
    public clueLabel: string,
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

export interface ISearchOptions {
  matchQuery: string;
  answerPattern: string;
  maxResults: number;
}

export function search(options: Partial<ISearchOptions>): Promise<Clue[]> {
  const whereExpressions: string[] = [
    "LENGTH(cluefts.question) > 0",
  ];
  const params: { [param: string]: string | number } = {};

  if (options.matchQuery) {
    whereExpressions.push("cluefts MATCH $matchQuery");
    params.$matchQuery = options.matchQuery;
  }

  if (options.answerPattern) {
    whereExpressions.push("cluefts.answer LIKE $answerPattern");
    params.$answerPattern = options.answerPattern;
  }

  const whereClause = "WHERE " + whereExpressions.join(" AND ");
  const maxResults = options.maxResults ? options.maxResults : 100;
  const searchStatement = db.prepare(`
  SELECT
    clues.id,
    clues.source,
    clues.puzzledate,
    clues.cluelabel,
    clues.question,
    clues.answer
  FROM cluefts
  LEFT JOIN clues ON cluefts.rowid = clues.id
  ${whereClause}
  ORDER BY rank
  LIMIT ${maxResults}
  `);

  return new Promise<Clue[]>((resolve, reject) => {
    searchStatement.all(params, (err, rows) => {
      searchStatement.finalize();
      if (err) {
        reject(err);
        return;
      }
      const clues: Clue[] = [];
      for (const row of rows) {
        clues.push(Clue.fromRow(row));
      }
      resolve(clues);
    });
  });
}
