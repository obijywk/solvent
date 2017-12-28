import { Express } from "express";

import * as simpleSubstitutionSolver from "../lib/simple_substitution_solver";

import { badRequest, internalServerError } from "./error_response";

import { SOLVE_CIPHER_URL, SolveCipherRequest, SolveCipherResponse, SolveCipherResult } from "../../api/solve_cipher";

export function install(app: Express) {
  app.post(SOLVE_CIPHER_URL, (req, res) => {
    const solveCipherRequest = req.body as SolveCipherRequest;

    if (!solveCipherRequest.ciphertext) {
      badRequest(res, "Ciphertext must be provided.");
      return;
    }

    if (solveCipherRequest.iterations > 5000) {
      badRequest(res, "Iterations must be 5000 or less.");
      return;
    }

    if (!solveCipherRequest.iterations) {
      solveCipherRequest.iterations = 1500;
    }

    const solver = new simpleSubstitutionSolver.SimpleSubstitutionSolver({
      numIterations: solveCipherRequest.iterations,
    });

    solver
      .solve(solveCipherRequest.ciphertext)
      .then((results) => {
        const solveCipherResponse = new SolveCipherResponse();
        solveCipherResponse.results = [];
        for (const result of results) {
          solveCipherResponse.results.push(result as SolveCipherResult);
        }
        res.send(solveCipherResponse);
      })
      .catch((err) => {
        internalServerError(res, err.toString());
      });
  });
}
