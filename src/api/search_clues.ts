export class SearchCluesRequest {
  public query: string;
  public minAnswerLength: number;
  public maxAnswerLength: number;
  public knownAnswerLetters: { [index: number]: string };
  public maxResults: number;
}

export class SearchCluesResult {
  public source: string;
  public puzzleDate: Date;
  public clueLabel: string;
  public question: string;
  public answer: string;
}

export class SearchCluesResponse {
  public results: SearchCluesResult[];
}

export const SEARCH_CLUES_URL = "/api/search_clues";
