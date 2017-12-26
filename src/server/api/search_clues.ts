import { Express } from "express";
import * as _ from "lodash";

import * as clueDatabase from "../lib/clue_database";

import { badRequest, internalServerError } from "./error_response";

import {
  SEARCH_CLUES_URL,
  SearchCluesRequest,
  SearchCluesResponse,
  SearchCluesResult,
} from "../../api/search_clues";

export function install(app: Express) {
  app.post(SEARCH_CLUES_URL, (req, res) => {
    const searchCluesRequest = req.body as SearchCluesRequest;

    if (!searchCluesRequest.query || searchCluesRequest.query.length === 0) {
      badRequest(res, "query must be provided");
      return;
    }

    const options: Partial<clueDatabase.ISearchOptions> = {
      matchQuery: searchCluesRequest.query,
    };
    if (searchCluesRequest.minAnswerLength) {
      options.minAnswerLength = searchCluesRequest.minAnswerLength;
    }
    if (searchCluesRequest.maxAnswerLength) {
      options.maxAnswerLength = searchCluesRequest.maxAnswerLength;
    }
    if (searchCluesRequest.knownAnswerLetters) {
      options.knownAnswerLetters = searchCluesRequest.knownAnswerLetters;
    }
    if (searchCluesRequest.maxResults) {
      options.maxResults = searchCluesRequest.maxResults;
    }

    try {
      clueDatabase.search(options).then((results) => {
        const searchCluesResponse = new SearchCluesResponse();
        searchCluesResponse.results = [];
        for (const result of results) {
          searchCluesResponse.results.push(_.omit(result, "id") as SearchCluesResult);
        }
        res.send(searchCluesResponse);
      }).catch((err) => {
        internalServerError(res, err.toString());
      });
    } catch (err) {
      internalServerError(res, err.toString());
    }
  });
}
