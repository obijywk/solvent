import * as express from "express";

import { ErrorResponse } from "../../api/error_response";

export function badRequest(res: express.Response, detail: string) {
  const errorResponse: ErrorResponse = {
    errors: [
      {
        detail,
        status: "400",
        title: "Bad Request",
      },
    ],
  };
  res.status(400).send(errorResponse);
}

export function internalServerError(res: express.Response, detail: string) {
  const errorResponse: ErrorResponse = {
    errors: [
      {
        detail,
        status: "500",
        title: "Internal Server Error",
      },
    ],
  };
  res.status(500).send(errorResponse);
}
