import * as debugCreator from "debug";
import * as express from "express";
import * as http from "http";
import * as https from "https";
import * as url from "url";

import * as clueDatabase from "./lib/clue_database";
import * as collectiveJl from "./lib/collective_jl";
import * as fitnessStats from "./lib/fitness_stats";
import * as nutrimatic from "./lib/nutrimatic";

import { badRequest, internalServerError } from "./api/error_response";

import * as analyzeWithCollectiveJl from "./api/analyze_with_collective_jl";
import * as runWebDetection from "./api/run_web_detection";
import * as scoreEnglish from "./api/score_english";
import * as searchClues from "./api/search_clues";
import * as searchNutrimatic from "./api/search_nutrimatic";
import * as solveCipher from "./api/solve_cipher";
import * as unweave from "./api/unweave";

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
unweave.install(app);

app.get("/api/http_fetch/:base64url*", (req, res) => {
  let getUrl: url.Url;
  try {
    getUrl = url.parse(Buffer.from(req.params.base64url, "base64").toString());
  } catch (err) {
    badRequest(res, err.message);
    return;
  }

  function handleIncomingMessage(getResponse: http.IncomingMessage) {
    if (getResponse.statusCode !== 200) {
      internalServerError(res, "HTTP fetch failed: " + getResponse.statusMessage);
      return;
    }
    getResponse.on("data", (chunk) => res.write(chunk));
    getResponse.on("end", () => res.end());
  }

  const getRequest = {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    hostname: getUrl.hostname,
    path: getUrl.path,
    port: getUrl.port,
    protocol: getUrl.protocol,
  };

  if (getUrl.protocol === "https:") {
    https.get(getRequest, handleIncomingMessage).on("error", (err) => {
      internalServerError(res, "HTTP fetch failed: " + err.message);
    });
  } else if (getUrl.protocol === "http:") {
    http.get(getRequest, handleIncomingMessage).on("error", (err) => {
      internalServerError(res, "HTTP fetch failed: " + err.message);
    });
  } else {
    badRequest(res, "URL did not start with http: or https:");
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  internalServerError(res, err.toString());
  next(err);
});

debug("Waiting for initialization");
Promise.all([
  clueDatabase.initialized,
  fitnessStats.initialized,
  nutrimatic.initialized,
]).then(() => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    debug(`Listening on port ${port}`);
    collectiveJl.initialize();
  });
});
