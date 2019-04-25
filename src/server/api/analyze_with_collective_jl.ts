import { Express } from "express";

import * as collectiveJl from "../lib/collective_jl";

import { badRequest, internalServerError } from "./error_response";

import {
  ANALYZE_WITH_COLLECTIVE_JL_URL,
  AnalyzeWithCollectiveJlRequest,
  AnalyzeWithCollectiveJlResponse,
  AnalyzeWithCollectiveJlResult,
} from "../../api/analyze_with_collective_jl";

export function install(app: Express) {
  app.post(ANALYZE_WITH_COLLECTIVE_JL_URL, (req, res) => {
    const analyzeWithCollectiveJlRequest = req.body as AnalyzeWithCollectiveJlRequest;

    if (!analyzeWithCollectiveJlRequest.words || analyzeWithCollectiveJlRequest.words.length === 0) {
      badRequest(res, "words must be provided");
      return;
    }

    if (analyzeWithCollectiveJlRequest.allowedMisses === undefined) {
      analyzeWithCollectiveJlRequest.allowedMisses = 0;
    }

    collectiveJl.analyze(
      analyzeWithCollectiveJlRequest.words,
      {
        allowedMisses: analyzeWithCollectiveJlRequest.allowedMisses,
      },
    ).then((results) => {
      const analyzeWithCollectiveJlResponse = new AnalyzeWithCollectiveJlResponse();
      analyzeWithCollectiveJlResponse.results = [];
      for (const result of results) {
        analyzeWithCollectiveJlResponse.results.push(result as AnalyzeWithCollectiveJlResult);
      }
      res.send(analyzeWithCollectiveJlResponse);
    }).catch((err) => internalServerError(res, err.toString()));
  });
}
