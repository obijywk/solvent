export class ScoreEnglishRequest {
  public texts: string[];
}

export class ScoreEnglishResponse {
  public scores: number[];
}

export const SCORE_ENGLISH_URL = "/api/score_english";
