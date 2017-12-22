import { Express } from "express";

import * as nutrimatic from "../lib/nutrimatic";

import { badRequest, internalServerError } from "./error_response";

import {
  SEARCH_NUTRIMATIC_URL,
  SearchNutrimaticRequest,
  SearchNutrimaticResponse,
  SearchNutrimaticResult,
} from "../../api/search_nutrimatic";

export function install(app: Express) {
  app.post(SEARCH_NUTRIMATIC_URL, (req, res) => {
    const searchNutrimaticRequest = req.body as SearchNutrimaticRequest;

    if (!searchNutrimaticRequest.pattern || searchNutrimaticRequest.pattern.length === 0) {
      badRequest(res, "pattern must be provided");
      return;
    }

    const options: Partial<nutrimatic.ISearchOptions> = {};
    if (searchNutrimaticRequest.maxResults) {
      options.maxResults = searchNutrimaticRequest.maxResults;
    }
    if (searchNutrimaticRequest.maxSeconds) {
      options.maxSeconds = searchNutrimaticRequest.maxSeconds;
    }

    try {
      nutrimatic.search(searchNutrimaticRequest.pattern, options).then((results) => {
        const searchNutrimaticResponse = new SearchNutrimaticResponse();
        searchNutrimaticResponse.results = [];
        for (const result of results) {
          searchNutrimaticResponse.results.push(result as SearchNutrimaticResult);
        }
        res.send(searchNutrimaticResponse);
      });
    } catch (err) {
      internalServerError(res, err.toString());
    }
  });
}
