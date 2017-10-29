import { Express } from "express";

import * as quadgramStats from "../lib/quadgram_stats";

import { badRequest } from "./error_response";

class ScoreEnglishRequest {
  public texts: string[];
}

class ScoreEnglishResponse {
  public scores: number[];
}

export function install(app: Express) {
  app.post("/rpc/score_english", (req, res) => {
    const scoreEnglishRequest = req.body as ScoreEnglishRequest;

    if (!(scoreEnglishRequest.texts instanceof Array)) {
      badRequest(res, "missing or malformed property 'texts'");
      return;
    }

    const scoreEnglishResponse = new ScoreEnglishResponse();
    scoreEnglishResponse.scores = scoreEnglishRequest.texts.map(quadgramStats.score);
    res.send(scoreEnglishResponse);
  });
}
