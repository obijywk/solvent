export class RunWebDetectionRequest {
  public imageContent: string;
}

export class RunWebDetectionResult {
  public score: number;
  public description: string;
}

export class RunWebDetectionResponse {
  public results: RunWebDetectionResult[];
}

export const RUN_WEB_DETECTION_URL = "/api/run_web_detection";
