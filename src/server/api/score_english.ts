import { Express } from "express";

import * as fitnessStats from "../lib/fitness_stats";

import { badRequest } from "./error_response";

import { SCORE_ENGLISH_URL, ScoreEnglishRequest, ScoreEnglishResponse } from "../../api/score_english";

export function install(app: Express) {
  app.post(SCORE_ENGLISH_URL, (req, res) => {
    const scoreEnglishRequest = req.body as ScoreEnglishRequest;

    if (!(scoreEnglishRequest.texts instanceof Array)) {
      badRequest(res, "missing or malformed property 'texts'");
      return;
    }

    const scoreEnglishResponse = new ScoreEnglishResponse();
    scoreEnglishResponse.scores = scoreEnglishRequest.texts.map(fitnessStats.quadgramScore);
    res.send(scoreEnglishResponse);
  });
}
