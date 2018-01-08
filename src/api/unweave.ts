export class UnweaveRequest {
  public text: string;
  public numWords: number;
  public maxResults: number;
  public stateSpaceLimit: number;
}

export class UnweaveResult {
  public words: string[];
  public cost: number;
}

export class UnweaveResponse {
  public results: UnweaveResult[];
}

export const UNWEAVE_URL = "/api/unweave";
