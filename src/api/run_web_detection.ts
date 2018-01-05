export class RunWebDetectionRequest {
  public imageContent: string;
}

export class EntityResult {
  public score: number;
  public description: string;
}

export class RunWebDetectionResponse {
  public entityResults: EntityResult[];
  public pageResults: string[];
}

export const RUN_WEB_DETECTION_URL = "/api/run_web_detection";
