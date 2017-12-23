import * as csvParse from "csv-parse";
import * as debugCreator from "debug";
import * as fs from "fs";
import * as sqlite3 from "sqlite3";

import { Clue } from "./clue_database";

const debug = debugCreator("solvent");

const databasePath = "data/clues.db";
if (fs.existsSync(databasePath)) {
  fs.unlinkSync(databasePath);
}
sqlite3.verbose();
const db = new sqlite3.Database(databasePath);
// db.on("trace", (q) => debug(q));

function runStatement(statement: sqlite3.Statement): Promise<void> {
  return new Promise((resolve, reject) => {
    statement.run((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

class FinishedFlag {
  public finished: boolean;
}

function readClues(csvParser: csvParse.Parser, finished: FinishedFlag): Promise<Clue[]> {
  return new Promise((resolve, reject) => {
    const clues: Clue[] = [];
    const tryRead = () => {
      try {
        const rawDoc = csvParser.read();
        if (!rawDoc) {
          if (finished.finished) {
            resolve(clues);
            return;
          }
          setImmediate(tryRead);
          return;
        }
        clues.push(new Clue(
          parseInt(rawDoc.id, 10),
          rawDoc.source,
          new Date(rawDoc.date),
          parseInt(rawDoc.number, 10),
          rawDoc.direction,
          rawDoc.question,
          rawDoc.answer));
        if (clues.length >= 1000) {
          resolve(clues);
          return;
        }
        setImmediate(tryRead);
      } catch (err) {
        reject(err);
        return;
      }
    };
    setImmediate(tryRead);
  });
}

function writeClues(clues: Clue[]): Promise<void> {
  const cluesInsertStatement = db.prepare(`
  INSERT INTO clues (id, source, date, number, direction, question, answer)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const clueftsInsertStatement = db.prepare(`
  INSERT INTO cluefts (docid, question, answer)
  VALUES (?, ?, ?)
  `);

  return runStatement(db.prepare("BEGIN TRANSACTION"))
  .then(() => {
    const promises: Array<Promise<void>> = [];
    for (const clue of clues) {
      cluesInsertStatement.bind(
        clue.id,
        clue.source,
        clue.date,
        clue.clueNumber,
        clue.direction,
        clue.question,
        clue.answer);
      promises.push(runStatement(cluesInsertStatement));

      clueftsInsertStatement.bind(
        clue.id,
        clue.question,
        clue.answer);
      promises.push(runStatement(clueftsInsertStatement));
    }
    return Promise.all(promises);
  }).then(() => runStatement(db.prepare("COMMIT TRANSACTION")));
}

async function buildDatabase() {
  await runStatement(
    db.prepare(`
    CREATE TABLE clues (
      id INTEGER,
      source TEXT,
      date DATE,
      number INTEGER,
      direction TEXT,
      question TEXT,
      answer TEXT
    )`));
  await runStatement(
    db.prepare(`
    CREATE VIRTUAL TABLE cluefts USING fts4 (
      question,
      answer,
      tokenize=porter
    )`));

  const csvParser = new csvParse.Parser({
    columns: true,
  });
  fs.createReadStream("/home/ubuntu/nyt-crossword/clues.csv").pipe(csvParser);

  const finished = new FinishedFlag();
  csvParser.on("finish", () => {
    debug("Finished reading clues");
    finished.finished = true;
  });

  let count = 0;
  while (!finished.finished) {
    const clueBatch = await readClues(csvParser, finished);
    await writeClues(clueBatch);
    count += clueBatch.length;
    debug(`Processed ${count} clues`);
  }
}

buildDatabase().then(() => {
  debug("Finished building database");
});
