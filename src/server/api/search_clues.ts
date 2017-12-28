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

    const options: Partial<clueDatabase.ISearchOptions> = {};
    if (searchCluesRequest.query && searchCluesRequest.query.length > 0) {
      options.matchQuery = searchCluesRequest.query;
    }
    if (searchCluesRequest.answerPattern && searchCluesRequest.answerPattern.length > 0) {
      options.answerPattern = searchCluesRequest.answerPattern;
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
