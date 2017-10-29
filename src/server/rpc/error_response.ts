import * as express from "express";

export class Error {
  public status: string;
  public title: string;
  public detail: string;
}

export class ErrorResponse {
  public errors: Error[];
}

export function badRequest(res: express.Response, detail: string) {
  res.status(400).send({
    errors: [
      {
        detail,
        status: "400",
        title: "Bad Request",
      },
    ],
  });
}

export function internalServerError(res: express.Response, detail: string) {
  res.status(500).send({
    errors: [
      {
        detail,
        status: "500",
        title: "Internal Server Error",
      },
    ],
  });
}
