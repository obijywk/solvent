import * as debugCreator from "debug";
import * as express from "express";
import * as http from "http";

import * as clueDatabase from "./lib/clue_database";
import * as collectiveJl from "./lib/collective_jl";
import * as fitnessStats from "./lib/fitness_stats";
import * as nutrimatic from "./lib/nutrimatic";

import { internalServerError } from "./api/error_response";

import * as analyzeWithCollectiveJl from "./api/analyze_with_collective_jl";
import * as runWebDetection from "./api/run_web_detection";
import * as scoreEnglish from "./api/score_english";
import * as searchClues from "./api/search_clues";
import * as searchNutrimatic from "./api/search_nutrimatic";
import * as solveCipher from "./api/solve_cipher";

const debug = debugCreator("solvent");

const app = express();
app.use(express.json({
  limit: 4194304,
}));

app.use(express.static("./public"));
app.use("/dist", express.static("./dist"));

analyzeWithCollectiveJl.install(app);
runWebDetection.install(app);
scoreEnglish.install(app);
searchClues.install(app);
searchNutrimatic.install(app);
solveCipher.install(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  internalServerError(res, err.toString());
  next(err);
});

Promise.all([
  clueDatabase.initialized,
  collectiveJl.initialized,
  fitnessStats.initialized,
  nutrimatic.initialized,
]).then(() => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    debug(`Listening on port ${port}`);
  });
});
