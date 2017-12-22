export class SearchNutrimaticRequest {
  public pattern: string;
  public maxResults: number;
  public maxSeconds: number;
}

export class SearchNutrimaticResult {
  public score: number;
  public text: string;
}

export class SearchNutrimaticResponse {
  public results: SearchNutrimaticResult[];
}

export const SEARCH_NUTRIMATIC_URL = "/api/search_nutrimatic";
