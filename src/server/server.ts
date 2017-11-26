import * as debugCreator from "debug";
import * as express from "express";
import * as http from "http";

import * as collectiveJl from "./lib/collective_jl";
import * as fitnessStats from "./lib/fitness_stats";

import { internalServerError } from "./api/error_response";

import * as analyzeWithCollectiveJl from "./api/analyze_with_collective_jl";
import * as scoreEnglish from "./api/score_english";
import * as solveCipher from "./api/solve_cipher";

const debug = debugCreator("solvent");

const app = express();
app.use(express.json());

app.use(express.static("./public"));
app.use("/dist", express.static("./dist"));

analyzeWithCollectiveJl.install(app);
scoreEnglish.install(app);
solveCipher.install(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  internalServerError(res, err.toString());
  next(err);
});

Promise.all([
  collectiveJl.initialized,
  fitnessStats.initialized,
]).then(() => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    debug(`Listening on port ${port}`);
  });
});
