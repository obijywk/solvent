export class AnalyzeWithCollectiveJlRequest {
  public words: string[];
  public allowedMisses: number;
}

export class AnalyzeWithCollectiveJlResult {
  public description: string;
  public probability: number;
  public satisfied: string[];
}

export class AnalyzeWithCollectiveJlResponse {
  public results: AnalyzeWithCollectiveJlResult[];
}

export const ANALYZE_WITH_COLLECTIVE_JL_URL = "/api/analyze_with_collective_jl";
