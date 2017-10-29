export class Error {
  public status: string;
  public title: string;
  public detail: string;
}

export class ErrorResponse {
  public errors: Error[];
}
