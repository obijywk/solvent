import { Express } from "express";

import * as unweaver from "../lib/unweaver";

import { badRequest, internalServerError } from "./error_response";

import { UNWEAVE_URL, UnweaveRequest, UnweaveResponse, UnweaveResult } from "../../api/unweave";

export function install(app: Express) {
  app.post(UNWEAVE_URL, (req, res) => {
    const unweaveRequest = req.body as UnweaveRequest;

    if (!unweaveRequest.text) {
      badRequest(res, "Text must be provided.");
      return;
    }

    if (!unweaveRequest.numWords) {
      badRequest(res, "Number of words must be provided.");
      return;
    }

    if (unweaveRequest.stateSpaceLimit > 100000) {
      badRequest(res, "State space limit must be 100000 or less.");
      return;
    }

    if (!unweaveRequest.stateSpaceLimit) {
      unweaveRequest.stateSpaceLimit = 10000;
    }

    if (!unweaveRequest.maxResults) {
      unweaveRequest.maxResults = 100;
    }

    unweaver.unweave(unweaveRequest.text, unweaveRequest.numWords, {
      maxResults: unweaveRequest.maxResults,
      stateSpaceLimit: unweaveRequest.stateSpaceLimit,
    }).then((results) => {
      const unweaveResponse = new UnweaveResponse();
      unweaveResponse.results = [];
      for (const result of results) {
        unweaveResponse.results.push(result as UnweaveResult);
      }
      res.send(unweaveResponse);
    }).catch((err) => {
      internalServerError(res, err.toString());
    });
  });
}
